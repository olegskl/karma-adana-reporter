# karma-adana-reporter

Unit test coverage reporter in Karma using [Adana](https://github.com/adana-coverage/babel-plugin-transform-adana).  
This is a **work in progress**. Contributions are welcome.

## Usage

You will need babel-plugin-transform-adana, karma-browserify (or just add the plugin to .babelrc), a test framework like karma-mocha, karma-adana-reporter and some formatters, like adana-format-pretty or adana-format-text.

```js
{
  plugins: [
    'karma-browserify',
    'karma-mocha',
    'karma-adana-reporter'
  ],
  frameworks: [
    'browserify',
    'mocha'
  ],
  ['babelify', {
    presets: ['es2015'],
    plugins: [['transform-adana', {
      only: '**/*.js'
    }]]
  }],
  reporters: [
    'adana'
  ],
  // Although adana reporter configuration resembles
  // karma-coverage config, it quire different.
  // Place it here:
  adanaReporter: {
    // Optional base directory of generated files:
    dir: 'reports/coverage',
    // List of formatters, where type indicates the
    // formatter you want to use, for example "pretty"
    // will attempt to require "adana-format-pretty"
    // which has to be installed prior to running Karma:
    formatters: [
      {type: 'pretty', show: true, save: 'pretty/pretty.txt'},
      {type: 'text', show: true, save: 'text/text.txt'}
    ],
    // Your code coverage thresholds:
    thresholds: {
      // Overall code coverage thresholds:
      global: {
        statement: 95,
        branch: 95,
        function: 95,
        line: 95
      },
      // Local per-file coverage thresholds:
      local: {
        statement: 50,
        branch: 50,
        function: 50,
        line: 50
      }
    }
  }
  // Add other parameters needed for
}
```

## License

MIT
