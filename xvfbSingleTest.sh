#!/bin/bash
SELENIUM_BROWSER=firefox xvfb-run --server-args="-screen 0, 1366x768x8" mocha test/9999_page_test.js --timeout 60000
