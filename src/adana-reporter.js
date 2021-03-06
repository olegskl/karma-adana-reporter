/**
 * Adana reporter module.
 * @module adana-reporter
 */

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import Promise, {promisify} from 'bluebird';
import mkdirp from 'mkdirp';
import {red, stripColor} from 'chalk';
import requireFormatter from './require-formatter';
import determineThresholds from './determine-thresholds';

const mkdir = promisify(mkdirp);
const writeFile = promisify(fs.writeFile);

/**
 * AdanaReporter.
 * @constructor
 * @param {Object} config - Adana config from karma conf file.
 */
export default function AdanaReporter(config) {

  /**
   * Asynchronous tasks (i.e. writing to filesystem).
   * @type {[Promise]}
   */
  const asyncTasks = [];

  /**
   * Reporter configuration.
   * @type {Object}
   * @property {String} dir - relative path of output directory
   * @property {Array} formatters - list of adana formatters to use
   * @property {Object} thresholds - code coverage thresholds
   */
  const reporterConfig = config.adanaReporter;

  /**
   * Code coverage thresholds.
   * @type {Object}
   * @property {Object} global - Average across multiple files.
   * @property {Object} local - Local per-file coverage thresholds.
   */
  const thresholds = determineThresholds(reporterConfig.thresholds);

  /**
   * Adana coverage result formatters.
   * @type {[Object]}
   */
  const formatters = (reporterConfig.formatters || [])
    .map(formatterConfig => {
      formatterConfig.formatter = requireFormatter(formatterConfig.type);
      return formatterConfig;
    });

  /**
   * Browser complete event handler.
   * @param {Object} browser - Information about the browser.
   * @param {Object} result - Runner results.
   * @param {Object} result.coverage - Adana coverage object.
   * @returns {undefined} Nothing is returned.
   */
  this.onBrowserComplete = function (browser, {coverage}) {
    // If there's a syntax error, Adana will not be able to run
    // which results in `undefined` coverage object and there's
    // nothing we can do about it except aborting:
    if (!coverage) {
      console.log(red('\nAdana was unable to generate code coverage.\n'));
      return;
    }

    formatters.forEach(formatterConfig => {
      const formattedText = formatterConfig.formatter(coverage, {
        environment: browser,
        thresholds
      });

      if (formatterConfig.show) {
        // Dump formatted text to console,
        // and surround with single line margins:
        console.log(`\n${formattedText}\n`);
      }

      if (formatterConfig.save) {
        const fullpath = config.browsers.length > 1 ?
          path.join(reporterConfig.dir, browser.name, formatterConfig.save) :
          path.join(reporterConfig.dir, formatterConfig.save);

        asyncTasks.push(mkdir(path.dirname(fullpath)).then(() => {
          return writeFile(fullpath, stripColor(formattedText));
        }));
      }
    });
  };

  /**
   * Karma exit event handler.
   * @param {Function} done - Karma completion callback.
   * @returns {undefined} Nothing is returned.
   */
  this.onExit = function (done) {
    // Karma runner will complete before we finish writing
    // report files to the filesystem, so let's wait for
    // all those asynchronous tasks to finish before
    // declaring that we're done:
    Promise
      .all(asyncTasks)
      .finally(() => done());
  };
}

/**
 * Karma-specific dependency injection.
 * @type {[String]}
 */
AdanaReporter.$inject = ['config'];
