import deepExtend from 'deep-extend';

const defaultThresholds = {
  global: {
    statement: 0,
    branch: 0,
    function: 0,
    line: 0
  },
  local: {
    statement: 0,
    branch: 0,
    function: 0,
    line: 0
  }
};

export default function determineThresholds(config = {}) {
  const userThresholds = config.thresholds || {};
  return deepExtend({}, defaultThresholds, userThresholds);
}
