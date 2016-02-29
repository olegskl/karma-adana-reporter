/**
 * Formatter function acquisition.
 * @module require-formatter
 */

/**
 * Requires an npm-installed formatter lib.
 * @param {String} nameSuffix - "json", "text", etc.
 * @returns {Function} The formatter function.
 */
export default function requireFormatter(nameSuffix) {
  // Assuming that the formatter has been previously installed:
  const formatter = require(`adana-format-${nameSuffix}`);
  // Interop require with Babel 6 default exports:
  if (formatter.__esModule && formatter.default) {
    return formatter.default;
  }
  return formatter;
}
