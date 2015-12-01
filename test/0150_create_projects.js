/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Create Projects', function () {
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
        driver.get(base + '/Projects.aspx');
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Projects'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('Should be possible to create a new blank project', function () {
        driver.get(base + '/NewProject.aspx');
        driver.wait(until.elementLocated(By.xpath('//div[@class = "templatesListItemHeader ellipsis" and . = "Sample Project Template"]')), timeout);
        driver.findElement(By.xpath('//input[@id = "btnNew" and @value = "Create a New Blank Project"]')).click();
        driver.findElement(By.xpath('//input[@id = "txtProjectName"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
            element.sendKeys('Test RM Project (Blank) ' + uniqueID);
        });
        driver.findElement(By.xpath('//a[. = "Show optional fields"]')).click();
        driver.findElement(By.xpath('//input[@id = "btnSave" and @value = "Save project"]')).click();
        driver.wait(until.titleIs('Roadmap > Test RM Project (Blank) ' + uniqueID), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('Should be possible to create a new project from template', function () {
        driver.get(base + '/NewProject.aspx');
        driver.wait(until.elementLocated(By.xpath('//div[@class = "templatesListItemHeader ellipsis" and . = "Sample Project Template"]')), timeout);
        driver.findElement(By.xpath('//div[@class = "templatesListItemHeader ellipsis" and . = "Sample Project Template"]/../div[@class = "templatesListItemBody"]')).click();
        driver.findElement(By.xpath('//input[@id = "txtProjectName"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
            element.sendKeys('Test RM Project (from Template) ' + uniqueID);
        });
        driver.findElement(By.xpath('//a[. = "Show optional fields"]')).click();
        driver.findElement(By.xpath('//input[@id = "btnSave" and @value = "Save project"]')).click();
        driver.wait(until.titleIs('Roadmap > Test RM Project (from Template) ' + uniqueID), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

});
