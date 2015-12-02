/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Create Templates', function () {
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
        driver.get(base + '/ProjectTemplates.aspx');
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account Settings > Projects Templates'), timeout);
        driver.wait(until.elementLocated(By.xpath('//div[@class = "templatesListItemHeader ellipsis" and . = "Sample Project Template"]')), timeout);
    });

    test.it('Should be possible to create a new template', function () {
        driver.findElement(By.xpath('//input[@class = "createBtn" and @value = "Create a New Template"]')).click();
        driver.wait(until.elementLocated(By.xpath('//h1[. = "Create a New Template"]')), timeout);
        driver.findElement(By.xpath('//input[@id = "txtTemplateName"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element));
            element.sendKeys('Test Template ' + uniqueID);
        });
        driver.findElement(By.xpath('//input[@id = "txtTemplateDescription"]')).sendKeys('Description for Test Template ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "btnSave" and @value = "Save template"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@class = "templatesListItemHeader ellipsis" and . = "Test Template ' + uniqueID + '"]')), timeout);
    });

    test.it('Should be possible to create a new template from project', function () {
        driver.findElement(By.xpath('//input[@class = "createExistingBtn" and @value = "Create Template from Existing Project"]')).click();
        driver.wait(until.elementLocated(By.xpath('//input[@class = "existingProjectsDDL k-input" and @aria-expanded = "true"]')), timeout);
        driver.findElement(By.xpath('//li[. = "Sample Project A"]')).click();
        driver.findElement(By.xpath('//input[@class = "createFromExistingBtn" and @value = "Create"]')).click();
        driver.wait(until.elementLocated(By.xpath('//h1[. = "Sample Project A"]')), timeout);
        driver.findElement(By.xpath('//input[@id = "txtTemplateName"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element));
            element.sendKeys(' ' + uniqueID);
        });
        driver.findElement(By.xpath('//input[@id = "txtTemplateDescription"]')).sendKeys('Description for Template from Project ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "btnSave" and @value = "Save template"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@class = "templatesListItemHeader ellipsis" and contains(., "Sample Project A ' + uniqueID + '")]')), timeout);
    });

});
