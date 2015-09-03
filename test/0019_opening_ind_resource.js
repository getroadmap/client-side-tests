/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Opening Individual Resource', function () {
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
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Resources'), timeout);
    });

    test.it('/IndResource.aspx', function () {
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Account Owner (You)"]')).then(function (element) {
            element.getAttribute('href').then(function (href) {
                driver.get(href);
            });
        });
        driver.wait(until.titleIs('Roadmap > Account Owner'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.wait(until.elementLocated(By.xpath('//div[@id = "pContentBody"]/div[contains(@style, "display: block")]')), timeout);

        driver.findElement(By.xpath('//a[@id = "rSubscriptions"]')).click();
        driver.wait(function () {
            return driver.isElementPresent(By.xpath('//div[@id = "rSubscriptionsPanel" and @expanded = "1"]'));
        }, timeout);

        driver.findElement(By.xpath('//a[@id = "rSettings"]')).click();
        driver.wait(function () {
            return driver.isElementPresent(By.xpath('//div[@id = "rSettingsPanel" and @expanded = "1"]'));
        }, timeout);

        driver.findElement(By.xpath('//a[@id = "rSettings"]')).click();
        driver.wait(function () {
            return driver.isElementPresent(By.xpath('//div[@id = "rSettingsPanel" and @expanded = "0"]'));
        }, timeout);
    });

    test.it('/IndResource.aspx|WorkItems', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabWorkItems)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectWorkItemsTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectWorkItemsTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndResource.aspx|Calendar', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabCalendar)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "resourceCalendarTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "resourceCalendarTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndResource.aspx|Availability', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabAvailability)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "resourceAvailabilityTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "resourceAvailabilityTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//div[@id = "resWICalendar"]')), timeout);
    });

    test.it('/IndResource.aspx|Issues', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabRoadblocks)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectIssuesTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectIssuesTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndResource.aspx|Notes', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabNotes)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectNotesTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectNotesTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndResource.aspx|Attachments', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabAttachments)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectAttachmentsTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectAttachmentsTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndResource.aspx|Times', function () {
        driver.executeScript('resourceView.showTab(resTabs.tabTimes)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "resourceTimesTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "resourceTimesTab"]')).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

});
