/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    request = require('request'),
    validate = require('jsonschema').validate,
    assert = require('assert'),
    config = require('../config'),
    schema = require('../schema_v1_2');

test.describe('Testing API v1.2', function () {
    'use strict';
    var driver, base, user, timeout, api, options, result, uniqueID,
        roleID, resourceID;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        api = config.roadmap.api;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;
        options = {
            auth: {
                sendImmediately: false
            },
            json: true
        };
    });

    test.after(function () {
        driver.quit();
    });

    test.it('Retrieving API token', function () {
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'), timeout);
        driver.findElement(By.xpath('//input[@id = "publicApiToken"]')).then(function (element) {
            element.getAttribute('value').then(function (value) {
                options.auth.user = value;
            });
        });
        driver.get(base + '/Logout.aspx');
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
    });

    test.it('Checking API Help public pages', function () {
        driver.get(api + '/Help');
        driver.wait(until.titleIs('Roadmap API Documentation (Method-Level)'), timeout);
        driver.isElementPresent(By.xpath('//p[. = "Select API version"]')).then(function (found) {
            assert(found);
        });
        driver.get(api + '/Help/Ver?ver=Ver1_0');
        driver.wait(until.elementLocated(By.xpath('//h2[@id = "ProjectV1_0"]')), timeout);
        driver.get(api + '/Help/Ver?ver=Ver1_1');
        driver.wait(until.elementLocated(By.xpath('//h2[@id = "ProjectV1_1"]')), timeout);
        driver.get(api + '/Help/Ver?ver=Ver1_2');
        driver.wait(until.elementLocated(By.xpath('//h2[@id = "ProjectV1_2"]')), timeout);
    });

    test.it('POST v1.2/role/add', function (done) {
        options.url = api + '/v1.2/role/add';
        options.body = 'API_Role_' + uniqueID;
        request.post(options, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                result = validate(body, schema['POST v1.2/role/add']);
                if (result.errors.length !== 0) {
                    console.log(result);
                }
                roleID = body.ID;
            }
            assert(!error && response.statusCode === 200 && result.errors.length === 0);
            done();
        });
    });

    test.it('POST v1.2/resource/add', function (done) {
        options.url = api + '/v1.2/resource/add';
        options.body = {
            FirstName: 'API_Resource',
            LastName: uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'CustomCode_' + uniqueID
        };
        request.post(options, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                result = validate(body, schema['POST v1.2/resource/add']);
                if (result.errors.length !== 0) {
                    console.log(result);
                }
                resourceID = body.ID;
            }
            assert(!error && response.statusCode === 200 && result.errors.length === 0);
            done();
        });
    });

    test.it('GET v1.2/resource/me', function (done) {
        options.url = api + '/v1.2/resource/me';
        request.get(options, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                result = validate(body, schema['GET v1.2/resource/me']);
                if (result.errors.length !== 0) {
                    console.log(result);
                }
            }
            assert(!error && response.statusCode === 200 && result.errors.length === 0);
            done();
        });
    });

});
