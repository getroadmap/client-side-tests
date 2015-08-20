/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Project Roles', function () {
    'use strict';
    var driver, base, user, timeout, uniqueID;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;
    });

    test.after(function () {
        driver.quit();
    });

    test.it('/Login.aspx', function () {
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'));
    });

    test.it('Should be possible to create project roles', function () {
        driver.get(base + '/Roles.aspx');
        driver.wait(until.titleIs('Roadmap > Resources > Project Roles'), timeout);

        driver.findElement(By.xpath('//a[contains(., "Add Project Role")]')).click();
        driver.wait(until.elementLocated(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]')), timeout);

        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]')).sendKeys('Project Role ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../input[2]')).sendKeys(10);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../..//span[. = "OK"]')).click();
        driver.wait(until.elementLocated(By.xpath('//table[@id = "tblRoles"]//div[. = "Project Role ' + uniqueID + '"]')), timeout);

        driver.findElement(By.xpath('//a[contains(., "Add Project Role")]')).click();
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]')).sendKeys('Test Role ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../input[2]')).sendKeys(10);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../..//span[. = "OK"]')).click();
        driver.wait(until.elementLocated(By.xpath('//table[@id = "tblRoles"]//div[. = "Test Role ' + uniqueID + '"]')), timeout);
    });

    test.it('Should be possible to edit project roles', function () {
        driver.findElement(By.xpath('//table[@id = "tblRoles"]//div[. = "Test Role ' + uniqueID + '"]')).click();
        driver.switchTo().activeElement().then(function (element) {
            element.clear();
            element.sendKeys('Changed Role ' + uniqueID);
        });
        driver.findElement(By.xpath('//div[@class = "dual-field-context-menu"]//a[. = "Save"]')).click();

        driver.wait(until.elementLocated(By.xpath('//table[@id = "tblRoles"]//div[. = "Changed Role ' + uniqueID + '"]')), timeout);
    });

    test.it('Should be possible to delete project roles', function () {
        driver.findElement(By.xpath('//div[. = "Changed Role ' + uniqueID + '"]/../..//div[. = "Delete"]')).click();
        driver.findElement(By.xpath('//div[@id = "DeleteRoleFormBody"]/..//span[. = "Delete"]')).click();
        driver.wait(function () {
            return driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Changed Role ' + uniqueID + '"]')).then(function (found) {
                return !found;
            });
        }, timeout);
    });

});
