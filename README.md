# karma-adana-reporter

[![NPM version](http://img.shields.io/npm/v/karma-adana-reporter.svg)](https://www.npmjs.org/package/karma-adana-reporter)
[![Build Status](https://travis-ci.org/olegskl/karma-adana-reporter.svg?branch=master)](https://travis-ci.org/olegskl/karma-adana-reporter)

Unit test coverage reporter in [Karma](https://github.com/karma-runner/karma) using [Adana](https://github.com/adana-coverage/babel-plugin-transform-adana) for ES6+.

## Installation

```bash
npm install karma-adana-reporter --save-dev
```

In addition to karma-adana-reporter you will need [babel-plugin-transform-adana](https://github.com/adana-coverage/babel-plugin-transform-adana), a test framework like [karma-mocha](https://github.com/karma-runner/karma-mocha), and some adana result formatters, like [adana-format-text](https://github.com/olegskl/adana-format-text).

## Usage

In your [karma configuration file](https://karma-runner.github.io/0.13/config/configuration-file.html) declare the adana reporter.

```js
reporters: ['adana']
```

Then specify the adana reporter options. These options resemble the options of the [karma-coverage](https://github.com/karma-runner/karma-coverage) plugin.

```js
adanaReporter: {
  // Optional base directory of generated files:
  dir: 'reports/coverage',
  // List of formatters, where type indicates the
  // formatter you want to use, for example "text"
  // will attempt to require "adana-format-text"
  // which must be installed prior to running Karma:
  formatters: [
    {
      type: 'text', // indicates which formatter to use
      save: 'text/text.txt', // will write output to filesystem
      show: true // will dump the same output to console
    }
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
```

### Usage with [karma-browserify](https://github.com/nikku/karma-browserify)

Follow the installation steps provided on [karma-browserify usage](https://github.com/nikku/karma-browserify#usage) page, then add a [babelify](https://github.com/babel/babelify) transform with the following configuration. Change presets and plugins to match your needs, but try to keep the transform-adana plugin the first in the list of babel transforms.

```js
browserify: {
  transform: [
    ['babelify', {
      presets: ['es2015'],
      plugins: [
        ['transform-adana', {only: '**/*.js'}]
      ]
    }]
  ]
},
```

### Usage with [.babelrc](https://babeljs.io/docs/usage/babelrc/)

Configure your `.babelrc` file with [env options](https://babeljs.io/docs/usage/babelrc/#env-option)

```json
{
  "env": {
    "test": {
      "plugins": [
        ["transform-adana", {"only": "src/**/*.js"}]
      ]
    }
  }
}
```

Then set a `BABEL_ENV` option prior to running your tests.

```bash
BABEL_ENV=test YOUR_TEST_COMMAND_HERE
```

## License

[MIT License](http://opensource.org/licenses/MIT)
