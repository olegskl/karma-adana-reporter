/**
 * Adana reporter module.
 * @module adana-reporter
 */

import fs from 'fs';
import path from 'path';
import Promise, {promisify} from 'bluebird';
import mkdirp from 'mkdirp';
import {stripColor} from 'chalk';
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
   * Report run start handler.
   * @param {Array} browsers - List of browsers where the tests will run.
   * @return {undefined} Nothing is returned.
   */
  this.onRunStart = function (browsers) {
    this.isMultiFolderReport = browsers.length !== 1;
  };

  /**
   * Browser complete event handler.
   * @param {Object} browser - Information about the browser.
   * @param {Object} result - Runner results.
   * @param {Object} result.coverage - Adana coverage object.
   * @returns {undefined} Nothing is returned.
   */
  this.onBrowserComplete = function (browser, {coverage}) {
    formatters.forEach(formatterConfig => {
      const formattedText = formatterConfig.formatter(coverage, {
        environment: browser,
        thresholds
      });

      if (formatterConfig.show) {
        // Dump formatted text to console,
        // and surround with single line margins:
        console.log(`\n${formattedText}\n`); // eslint-disable-line
      }

      if (formatterConfig.save) {
        const fullpath = this.isMultiFolderReport ?
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
