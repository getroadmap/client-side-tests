/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.xdescribe('Create Dashboard Views', function () {
    'use strict';
    var driver, base, user, timeout, uniqueID, view, views;

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
        driver.wait(until.titleIs('Roadmap > Dashboard'));
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
        driver.findElement(By.xpath('//ul[@id = "kendoListViews_listbox"]//span[contains(., "View A")]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
            element.click();
        });

        driver.wait(until.elementLocated(By.xpath('//h1[@class = "viewSettingsTitle" and . = "New View"]')), timeout);

        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;
        view = {};
        view.title = 'View ' + uniqueID;
        view.subtitle = 'Subtitle ' + uniqueID;
        driver.findElement(By.xpath('//input[@id = "title"]')).sendKeys(view.title);
        driver.findElement(By.xpath('//input[@id = "subtitle"]')).sendKeys(view.subtitle);
        driver.findElement(By.xpath('//input[@id = "isShareViewAll"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(!selected);
            });
            element.click();
        });
        driver.findElement(By.xpath('//input[@id = "shareUrl"]')).then(function (element) {
            element.getAttribute('value').then(function (value) {
                assert(value.match(/[0-9a-f]{16}$/));
                view.url = value;
                views.push(view);
            });
        });
        driver.findElement(By.xpath('//input[@id = "createView"]')).click();
        driver.wait(until.elementLocated(By.xpath('//span[@id = "listViews"]//span[. = "' + view.title + '"]')), timeout);
        driver.wait(until.elementLocated(By.xpath('//section[@class = "clientProject"]')), timeout);
    });

    test.it('Should be possible to access the created views with no login', function () {
        driver.findElement(By.xpath('//span[@id = "listViews"]//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "kendoListViews_listbox" and @aria-hidden = "false"]')), timeout);
        driver.findElement(By.xpath('//ul[@id = "kendoListViews_listbox"]//span[. = "Sample View Title"]')).click();
        driver.wait(function () {
            return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]')).then(function (elements) {
                return elements.length === 10;
            });
        }, timeout);

        driver.findElement(By.xpath('//ul[@id = "nav"]//span[@id = "user-name"]')).click();
        driver.findElement(By.xpath('//ul[@id = "nav"]//div[@class = "drop"]//a[. = "Sign Out"]')).click();
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        views.forEach(function (element) {
            driver.get(element.url);
            driver.wait(until.titleIs(config.roadmap.company + ' > ' + element.title + ' > ' + element.subtitle), timeout);
            driver.wait(until.elementLocated(By.xpath('//section[@class = "clientProject"]')), timeout);
        });
    });

});
