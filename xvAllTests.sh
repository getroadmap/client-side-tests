#!/bin/bash
SELENIUM_BROWSER=firefox xvfb-run --server-args="-screen 0, 1366x768x8" npm test 
