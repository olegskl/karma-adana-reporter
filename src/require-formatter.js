export default function requireFormatter(name) {
  const module = require(`adana-format-${name}`);
  if (module.__esModule && module.default) {
    return module.default;
  }
  return module;
}
