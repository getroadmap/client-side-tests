/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.xdescribe('Testing API v1.2', function () {
    'use strict';
    var driver, base, user, timeout, token;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
    });

    test.after(function () {
        driver.quit();
    });

    test.it('Retrieve API token', function () {
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'), timeout);
        driver.findElement(By.xpath('//input[@id = "publicApiToken"]')).then(function (element) {
            element.getAttribute('value').then(function (value) {
                token = value;
            });
        });
        driver.get(base + '/Logout.aspx');
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
    });

    test.it('API token', function () {
        console.log(token);
    });

});
