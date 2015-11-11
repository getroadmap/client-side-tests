/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('BCC/X Integration', function () {
    'use strict';
    var driver, base, user, timeout, pause;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        pause = config.selenium.pause;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
    });

    test.after(function () {
        driver.quit();
    });

    test.it('/Login.aspx', function () {
        driver.get(base + '/Integration.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Connecting Applications > Basecamp'), timeout);
    });

    test.it('BCX Integration', function () {
        driver.findElement(By.xpath('//a[@id = "ctl00_ContentPlaceHolder1_ctrBCAccountInfo_lnkIntegrateBCNext"]')).click();
        driver.wait(function () {
            return driver.getTitle().then(function (title) {
                return title.match(/Basecamp Login|Authorize RoadMap/i);
            });
        }, timeout).then(function (title) {
            if (title[0].match(/Basecamp Login/i)) {
                driver.findElement(By.xpath('//input[@id = "username"]')).sendKeys(config.basecamp.bcx_name);
                driver.findElement(By.xpath('//input[@id = "password"]')).sendKeys(config.basecamp.bcx_password);
                driver.findElement(By.xpath('//input[@id = "remember_me"]')).then(function (element) {
                    element.isSelected().then(function (selected) {
                        if (selected) {
                            element.click();
                        }
                    });
                });
                driver.findElement(By.xpath('//div[@id = "signin_button"]/input')).click();
                driver.wait(until.titleMatches(/Authorize RoadMap/i), timeout);
            }
        });
        driver.findElement(By.xpath('//button[contains(., "Yes, I\'ll allow access")]')).click();
        driver.wait(until.titleIs('Roadmap > Connecting Applications > Basecamp'), timeout);
        driver.findElement(By.xpath('//select[@id = "ctl00_ContentPlaceHolder1_ctrBCAccountInfo_ddlAccounts"]/option[contains(., "Roadmap")]')).click();
    });

    test.it('BCC Integration', function () {
        driver.findElement(By.xpath('//input[@id = "txtSiteUrl"]')).then(function (element) {
            element.clear();
            element.sendKeys(config.basecamp.bcc_address);
        });
        driver.findElement(By.xpath('//input[@id = "txtAPIToken"]')).then(function (element) {
            element.clear();
            element.sendKeys(config.basecamp.bcc_token);
        });
        driver.findElement(By.xpath('//input[@id = "radSyncETA"]')).click();
        driver.findElement(By.xpath('//input[@id = "radDistributeETAEvenly"]')).click();
    });

    test.it('Saving Settings & Selecting Projects', function () {
        driver.findElement(By.xpath('//input[@id = "radFullSync"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });
        driver.findElement(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_btnBasecampCredentialsSave"]')).click();

        driver.wait(until.titleIs('Roadmap > Import from Basecamp'), timeout);
        driver.wait(until.elementLocated(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_ctrBasecampProjects_BasecampActiveProjects_radAll"]')), timeout).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });
        driver.findElement(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_ctrBasecampProjects_BasecampOnHoldProjects_radAll"]')).then(function (element) {
            element.click();
            driver.wait(until.elementIsSelected(element), timeout);
        });
        driver.findElement(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_ctrBasecampProjects_NewBasecampActiveProjects_radAll"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });
        driver.findElement(By.xpath('//a[. = "Save, but don\'t import now"]')).click();
        driver.wait(until.titleIs('Roadmap > Dashboard'), timeout);
        driver.sleep(pause);
    });

});
