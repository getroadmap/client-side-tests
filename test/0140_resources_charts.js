/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Resources Charts', function () {
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
        driver.get(base + '/Resources.aspx');
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Resources'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/Resources.aspx|Availability Calendar', function () {
        driver.findElement(By.xpath('//div[@class = "actionBarDropdown"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "viewSelect_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Availability Calendar"]')).click();
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/Resources.aspx|Availability Grid - By Date', function () {
        driver.findElement(By.xpath('//div[@class = "actionBarDropdown"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "viewSelect_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Availability Grid - By Date"]')).click();
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/Resources.aspx|Availability Grid - By Resource', function () {
        driver.findElement(By.xpath('//div[@class = "actionBarDropdown"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "viewSelect_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Availability Grid - By Resource"]')).click();
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/Resources.aspx|Team Calendar', function () {
        driver.findElement(By.xpath('//div[@class = "actionBarDropdown"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "viewSelect_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Team Calendar"]')).click();
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/Resources.aspx|Utilization Chart', function () {
        driver.findElement(By.xpath('//div[@class = "actionBarDropdown"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "viewSelect_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Utilization Chart"]')).click();
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/Resources.aspx|Default View', function () {
        driver.findElement(By.xpath('//div[@class = "actionBarDropdown"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "viewSelect_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Default View"]')).click();
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

});
