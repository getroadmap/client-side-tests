/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Create Dashboard View A', function () {
    'use strict';
    var driver, base, user, timeout, pause, uniqueID;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        pause = config.selenium.pause;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;
    });

    test.after(function () {
        driver.sleep(pause);
        driver.quit();
    });

    test.it('/Login.aspx', function () {
        driver.get(base + '/Dashboard.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Dashboard'), timeout);
        driver.sleep(pause);
    });

    test.it('Should be possible to create a new view', function () {
        driver.findElement(By.xpath('//span[@id = "listViews"]//span[. = "select"]')).click();
        driver.sleep(pause);
        driver.findElement(By.xpath('//ul[@id = "kendoListViews_listbox" and @aria-hidden = "false"]//span[. = "Create View"]')).click();
        driver.wait(until.elementLocated(By.xpath('//h1[@class = "viewSettingsTitle" and . = "New View"]')), timeout);

        driver.findElement(By.xpath('//input[@id = "title"]')).sendKeys('Title ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "subtitle"]')).sendKeys('Subtitle ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "isShareViewAll"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(!selected);
            });
            element.click();
        });
        driver.findElement(By.xpath('//input[@id = "shareUrl"]')).then(function (element) {
            element.getAttribute('value').then(function (value) {
                assert(value.match(/\/[0-9a-f]{16}$/i));
            });
        });
        driver.findElement(By.xpath('//input[@id = "createView"]')).click();
        driver.wait(until.elementLocated(By.xpath('//span[@id = "listViews"]//span[. = "Title ' + uniqueID + '"]')), timeout);
        driver.sleep(pause);
    });

    test.it('Should be possible to add Project Status Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "1" and @data-col = "2"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Project Status"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Project Status"]')), timeout);
        driver.sleep(pause);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@id = "showLabel"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "projectStatus"]')), timeout);
    });

    test.it('Should be possible to add Project Health Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "1" and @data-col = "3"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Project Health"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Project Health"]')), timeout);
        driver.sleep(pause);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@id = "showLabel"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "portfolioHealth"]')), timeout);
    });

    test.it('Should be possible to add Project Attributes Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "1" and @data-col = "4"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Project Attributes"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Project Attributes"]')), timeout);
        driver.sleep(pause);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@id = "nocTitle"]')).sendKeys('Project Attributes');
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//span[. = "select"]')).click();
        driver.sleep(pause);
        driver.findElement(By.xpath('//ul[@id = "nocAttr_listbox" and @aria-hidden = "false"]/li[. = "Client"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@id = "showLabel"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "numberOrCurrency"]')), timeout);
    });

    test.it('Should be possible to add Schedule Accuracy Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "1" and @data-col = "5"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Schedule Accuracy"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Schedule Accuracy"]')), timeout);
        driver.sleep(pause);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "portfolioSchedule"]')), timeout);
    });

    test.it('Should be possible to add Role Utilization Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "2" and @data-col = "1"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Role Utilization"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Role Utilization"]')), timeout);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//span[. = "Select Role"]/..//span[. = "select"]')).click();
        driver.sleep(pause);
        driver.findElement(By.xpath('//ul[@id = "resRole_listbox" and @aria-hidden = "false"]//span[. = "Analyst"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@id = "showLabel"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "roleAvailability"]//div[@id = "rolechart"]')), timeout);
    });

    test.it('Should be possible to add Role Availability Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "2" and @data-col = "2"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Role Availability"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Role Availability"]')), timeout);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//span[. = "Select Role"]/..//span[. = "select"]')).click();
        driver.sleep(pause);
        driver.findElement(By.xpath('//ul[@id = "resResource_listbox" and @aria-hidden = "false"]//span[. = "Analyst"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "resourceAvailability"]//div[@id = "roleAChart"]')), timeout);
    });

    test.it('Should be possible to add Resource Utilization Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "3" and @data-col = "1"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[contains(., "Resource Utilization")]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Resource Utilization"]')), timeout);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//span[. = "Select Resource"]/..//span[. = "select"]')).click();
        driver.sleep(pause);
        driver.findElement(By.xpath('//ul[@id = "resResource_listbox" and @aria-hidden = "false"]//span[. = "Charlie Sample"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@id = "showLabel"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "roleAvailability"]//div[@id = "resourceUChart"]')), timeout);
    });

    test.it('Should be possible to add Resource Availability Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "3" and @data-col = "2"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[contains(., "Resource Availability")]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Resource Availability"]')), timeout);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//span[. = "Select Resource"]/..//span[. = "select"]')).click();
        driver.sleep(pause);
        driver.findElement(By.xpath('//ul[@id = "resResource_listbox" and @aria-hidden = "false"]//span[. = "Charlie Sample"]')).click();
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@class = "resourceAvailability"]//div[@id = "chart"]')), timeout);
    });

    test.it('Should be possible to add Free Text Field 2x2 Widget', function () {
        driver.findElement(By.xpath('//div[@id = "dashboard"]//li[@data-row = "2" and @data-col = "4"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "addWidgetForm"]//div[. = "Free Text Field 2x2"]')), timeout).then(function (element) {
            element.click();
        });
        driver.wait(until.elementLocated(By.xpath('//section[@class = "previewHolder"]//span[. = "Add Free Text Field 2x2"]')), timeout);
        driver.findElement(By.xpath('//section[@class = "previewHolder"]//input[@class = "btn-addwidget"]')).click();
        driver.findElement(By.xpath('//div[@id = "addWidgetForm"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "textEditor")]')), timeout);
    });

});
