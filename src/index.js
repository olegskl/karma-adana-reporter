// karma-coverage
// ==============
//
// Main entry point for the karma-coverage module.
// Exposes the reporter plugin.

import AdanaReporter from './adana-reporter';

module.exports = {
  'reporter:adana': ['type', AdanaReporter]
};
