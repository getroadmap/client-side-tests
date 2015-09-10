/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Public API', function () {
    'use strict';
    var driver, base, user, timeout;

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

    test.it('/Login.aspx', function () {
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'), timeout);
    });

    test.it('Should be possible to enable user\'s API', function () {
        driver.get(base + '/ThirdPartyConnections.aspx');
        driver.getTitle().then(function (title) {
            assert.equal(title, 'Roadmap > Settings > Third Party Conections');
        });

        driver.isElementPresent(By.xpath('//span[@id = "apiKeyMode" and . = "enabled"]')).then(function (found) {
            if (found) {
                driver.findElement(By.xpath('//a[@id = "aEnableAPI"]')).click();
                driver.wait(until.elementLocated(By.xpath('//span[@id = "apiKeyMode" and . = "disabled"]')), timeout);
            }
        });

        driver.findElement(By.xpath('//a[@id = "aEnableAPI"]')).click();
        driver.wait(until.elementLocated(By.xpath('//span[@id = "apiKeyMode" and . = "enabled"]')), timeout);
    });

    test.it('Should be possible to generate API token', function () {
        driver.get(base + '/Account.aspx');
        driver.wait(until.titleIs('Roadmap > Account > My Account'), timeout);
        driver.isElementPresent(By.xpath('//div[@id = "lnkApiTokenGenerate"]/a')).then(function (found) {
            if (found) {
                driver.findElement(By.xpath('//div[@id = "lnkApiTokenGenerate"]/a')).click();
            }
        });

        driver.wait(function () {
            return driver.findElement(By.xpath('//input[@id = "publicApiToken"]')).then(function (element) {
                return element.getAttribute('value').then(function (value) {
                    return value.match(/^[0-9a-f]{64}$/i);
                });
            });
        }, timeout);
    });

});
