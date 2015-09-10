/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Create Dashboard Views', function () {
    'use strict';
    var driver, base, user, timeout, views;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
        views = [];
    });

    test.after(function () {
        driver.quit();
    });

    test.it('/Login.aspx', function () {
        driver.get(base + '/Dashboard.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Dashboard'), timeout);
        driver.wait(function () {
            return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]')).then(function (holders) {
                return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]//div[contains(@class, "content")]')).then(function (widgets) {
                    return holders.length === widgets.length;
                });
            });
        }, timeout);
    });

    test.it('Collecting Shared URL\'s', function () {
        driver.findElement(By.xpath('//span[@id = "listViews"]//span[. = "select"]')).click();
        driver.findElements(By.xpath('//ul[@id = "kendoListViews_listbox"]//span[contains(., "View A")]/../span[2]')).then(function (elements) {
            elements.forEach(function (element) {
                element.getText().then(function (text) {
                    views.push({
                        title: 'View A',
                        code: text
                    });
                });
            });
        });
        driver.findElements(By.xpath('//ul[@id = "kendoListViews_listbox"]//span[contains(., "View B")]/../span[2]')).then(function (elements) {
            elements.forEach(function (element) {
                element.getText().then(function (text) {
                    views.push({
                        title: 'View B',
                        code: text
                    });
                });
            });
        });
        driver.findElements(By.xpath('//ul[@id = "kendoListViews_listbox"]//span[contains(., "View C")]/../span[2]')).then(function (elements) {
            elements.forEach(function (element) {
                element.getText().then(function (text) {
                    views.push({
                        title: 'View C',
                        code: text
                    });
                });
            });
        });
    });

    test.it('Should be possible to access views with no login', function () {
        driver.findElement(By.xpath('//ul[@id = "nav"]//span[@id = "user-name"]')).click();
        driver.findElement(By.xpath('//ul[@id = "nav"]//div[@class = "drop"]//a[. = "Sign Out"]')).click();
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        views.forEach(function (view) {
            driver.get(base + '/' + view.code);
            driver.wait(until.titleIs(config.roadmap.company + ' > ' + view.title + ' > ' + view.code), timeout);
            driver.wait(function () {
                return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]')).then(function (holders) {
                    return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]//div[contains(@class, "content")]')).then(function (widgets) {
                        return holders.length === widgets.length;
                    });
                });
            }, timeout);
        });
    });

});
