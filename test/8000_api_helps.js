/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('API Help', function () {
    'use strict';
    var driver, timeout, api;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        api = config.roadmap.api;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
    });

    test.after(function () {
        driver.quit();
    });

    test.it('Help', function () {
        driver.get(api + '/Help');
        driver.wait(until.titleIs('Roadmap API Documentation (Method-Level)'), timeout);
        driver.isElementPresent(By.xpath('//p[. = "Select API version"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('Help 1.0', function () {
        driver.get(api + '/Help/Ver?ver=Ver1_0');
        driver.wait(until.elementLocated(By.xpath('//h2[@id = "ProjectV1_0"]')), timeout);
    });

    test.it('Help 1.1', function () {
        driver.get(api + '/Help/Ver?ver=Ver1_1');
        driver.wait(until.elementLocated(By.xpath('//h2[@id = "ProjectV1_1"]')), timeout);
    });

    test.it('Help 1.2', function () {
        driver.get(api + '/Help/Ver?ver=Ver1_2');
        driver.wait(until.elementLocated(By.xpath('//h2[@id = "ProjectV1_2"]')), timeout);
    });

});
