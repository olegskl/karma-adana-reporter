import fs from 'fs';
import path from 'path';
import Promise, { promisify } from 'bluebird';
import mkdirp from 'mkdirp';
import { stripColor } from 'chalk';
import requireFormatter from './require-formatter';
import determineThresholds from './determine-thresholds';

const mkdir = promisify(mkdirp);
const writeFile = promisify(fs.writeFile);

export default function AdanaReporter(config) {
  /**
   * Asynchronous tasks (i.e. writing to filesystem).
   * @type {Array<Promise>}
   */
  const asyncTasks = [];

  const reporterConfig = config.adanaReporter;
  const thresholds = determineThresholds(reporterConfig);
  const formatters = (reporterConfig.formatters || [])
    .map(formatterConfig => {
      formatterConfig.formatter = requireFormatter(formatterConfig.type);
      return formatterConfig;
    });

  this.onBrowserComplete = function(browser, { coverage }) {
    formatters.forEach(formatterConfig => {
      const formattedText = formatterConfig.formatter(coverage, {
        environment: browser,
        thresholds,
      });

      if (formatterConfig.show) {
        // Dump formatted text to console,
        // and surround with single line margins:
        console.log(`\n${formattedText}\n`); // eslint-disable-line
      }

      if (formatterConfig.save) {
        const fullpath = path.join(
          reporterConfig.dir,
          browser.name,
          formatterConfig.save
        );
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
  this.onExit = function(done) {
    // Karma runner will complete before we finish writing
    // report files to the filesystem, so let's wait for
    // all those asynchronous tasks to finish before
    // declaring that we're done:
    Promise
      .all(asyncTasks)
      .finally(() => done());
  };
}

AdanaReporter.$inject = [ 'config' ];
