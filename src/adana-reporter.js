import fs from 'fs';
import path from 'path';
import { promisify } from 'bluebird';
import mkdirp from 'mkdirp';
import { stripColor } from 'chalk';
import requireFormatter from './require-formatter';
import determineThresholds from './determine-thresholds';

const mkdir = promisify(mkdirp);
const writeFile = promisify(fs.writeFile);

export default function AdanaReporter(config) {
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
        mkdir(path.dirname(fullpath))
          .then(() => writeFile(fullpath, stripColor(formattedText)));
      }
    });
  };

  // this.onExit = function (done) {
  //   this.all.finally(() => done());
  // };
}

AdanaReporter.$inject = [ 'config' ];
