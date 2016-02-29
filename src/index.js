/**
 * Adana reporter for Karma.
 * @module plugin
 */

import AdanaReporter from './adana-reporter';

/**
 * Main entry point exposing the reporter plugin.
 *
 * Note that Karma does not support ES6 module system,
 * so we have to use CommonJS here.
 *
 * @type {Object}
 * @property {String} reporter:adana - Karma-specific declaration.
 */
module.exports = {
  'reporter:adana': [ 'type', AdanaReporter ],
};
