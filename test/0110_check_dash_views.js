/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Check Dashboard Views', function () {
    'use strict';
    var driver, base, user, timeout, pause, views, view;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        pause = config.selenium.pause;
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
        driver.sleep(pause);
    });

    test.it('Collecting Shared URL\'s', function () {
        driver.findElements(By.xpath('//ul[@id = "kendoListViews_listbox"]/li')).then(function (elements) {
            elements.forEach(function (element) {
                element.isElementPresent(By.xpath('./span[. = "Create View"]')).then(function (found) {
                    if (!found) {
                        driver.findElement(By.xpath('//span[@id = "listViews"]//span[. = "select"]')).click();
                        driver.sleep(pause);
                        element.click();
                        driver.sleep(pause);
                        driver.executeScript('showPagePreferences()');
                        driver.wait(until.elementLocated(By.xpath('//div[@id = "createViewForm"]/h1[. = "Update View"]')), timeout);
                        driver.findElement(By.xpath('//input[@id = "title"]')).then(function (element) {
                            element.getAttribute('value').then(function (value) {
                                view = {
                                    title: value
                                };
                            });
                        });
                        driver.findElement(By.xpath('//input[@id = "subtitle"]')).then(function (element) {
                            element.getAttribute('value').then(function (value) {
                                view.subtitle = value;
                            });
                        });
                        driver.findElement(By.xpath('//input[@id = "shareUrl"]')).then(function (element) {
                            element.getAttribute('value').then(function (value) {
                                view.shareUrl = value;
                                views.push(view);
                            });
                        });
                        driver.findElement(By.xpath('//a[@id = "cancelUpdateView"]')).click();
                    }
                });
            });
        });
    });

    test.it('Should be possible to access views with no login', function () {
        driver.findElement(By.xpath('//ul[@id = "nav"]//span[@id = "user-name"]')).click();
        driver.findElement(By.xpath('//ul[@id = "nav"]//div[@class = "drop"]//a[. = "Sign Out"]')).click();
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        views.forEach(function (view) {
            driver.get(view.shareUrl);
            driver.sleep(pause);
            driver.getTitle().then(function (title) {
                assert.equal(title, config.roadmap.company + ' > ' + view.title + ' > ' + view.subtitle);
            });
        });
    });

});
