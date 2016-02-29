/**
 * Thresholds module.
 * @module determine-thresholds
 */

import deepExtend from 'deep-extend';

/**
 * Default code coverage thresholds.
 * @type {Object}
 * @property {Object} global - Average across multiple files.
 * @property {Object} local - Local per-file coverage thresholds.
 */
const defaultThresholds = {
  global: {
    statement: 0,
    branch: 0,
    function: 0,
    line: 0,
  },
  local: {
    statement: 0,
    branch: 0,
    function: 0,
    line: 0,
  },
};

/**
 * Extends the default thresholds with the ones provided by the user.
 * @param {Object} [userThresholds] - User-defined thresholds.
 * @returns {Object} Extended thresholds.
 */
export default function determineThresholds(userThresholds = {}) {
  return deepExtend({}, defaultThresholds, userThresholds);
}
