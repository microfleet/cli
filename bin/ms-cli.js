#!/usr/bin/env node

try {
  require('babel-register');
  require('../src/index.js');
} catch (e) {
  require('../lib/index.js');
}
