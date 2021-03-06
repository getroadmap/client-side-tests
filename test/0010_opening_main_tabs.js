/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Opening Main Tabs', function () {
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
        driver.get(base);
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.isElementPresent(By.xpath('//td[contains(., "We were unable to find an account")]')).then(function (found) {
            if (found) {
                driver.get(base + '/AccountRegistration.aspx');
                driver.wait(until.titleIs('Signup for Roadmap - Intelligent Project Management, Scheduling, Time Tracking, and Resource Planning'), timeout);
                driver.findElement(By.xpath('//input[@id = "txtFullName"]')).then(function (element) {
                    element.clear();
                    element.sendKeys('Account Owner');
                });
                driver.findElement(By.xpath('//input[@id = "txtCompanyName"]')).then(function (element) {
                    element.clear();
                    element.sendKeys(config.roadmap.company);
                });
                driver.findElement(By.xpath('//input[@id = "txtEmail"]')).then(function (element) {
                    element.clear();
                    element.sendKeys(user);
                });
                driver.findElement(By.xpath('//input[@id = "txtPassword"]')).sendKeys('1234567');
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_btnRegisterCompany"]')).click();
                driver.wait(until.titleIs('Roadmap > Getting Started'), timeout);
            }
        });
    });

    test.it('/GettingStarted', function () {
        driver.get(base + '/GettingStarted');
        driver.wait(until.titleIs('Roadmap > Getting Started'), timeout);
        driver.isElementPresent(By.xpath('//h3[. = "Finish Up Your Account Profile"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//h3[. = "Customize Attributes"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//h3[. = "Import Existing Projects to Roadmap"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//h3[. = "Add Projects"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//h3[. = "Add People"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//h3[. = "We’re Here to Help"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Projects.aspx', function () {
        driver.get(base + '/Projects.aspx');
        driver.wait(until.titleIs('Roadmap > Projects'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//span[. = "Showing 1-3 from 3 Items"]'), timeout));

        driver.wait(until.elementLocated(By.xpath('//div[@class = "filterItemName" and contains(., "≠ Closed")]')), timeout);
        driver.isElementPresent(By.xpath('//span[@id = "user-name" and . = "Account Owner"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Default Grid View"]')).then(function (found) {
            assert(found);
        });
        driver.findElement(By.xpath('//input[@class = "btn-search"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@class = "search-form active"]')), timeout);
        driver.findElement(By.xpath('//input[@id = "txtSearch"]')).then(function (element) {
            driver.wait(until.elementIsEnabled(element));
            element.clear();
            element.sendKeys('Sample Project A');
        });
        driver.findElement(By.xpath('//input[@class = "btn-search"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//span[. = "Showing 1-1 from 1 Items"]'), timeout));
    });

    test.it('/BulkDeleteProjects.aspx', function () {
        driver.get(base + '/BulkDeleteProjects.aspx');
        driver.wait(until.titleIs('Roadmap > Bulk Delete Projects'), timeout);
        driver.isElementPresent(By.xpath('//table[@id = "tblPPMLiteProjects"]//label[contains(., "Sample Project A")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblPPMLiteProjects"]//label[contains(., "Sample Project B")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblPPMLiteProjects"]//label[contains(., "Sample Project C")]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/MSProjectImport.aspx', function () {
        driver.get(base + '/MSProjectImport.aspx');
        driver.wait(until.titleIs('Roadmap > Import from MS Project'), timeout);
        driver.isElementPresent(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_optFirstName" and @checked = "checked"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Gantt.aspx', function () {
        driver.get(base + '/Gantt.aspx');
        driver.wait(until.titleIs('Roadmap > Projects'), timeout);
        driver.wait(until.elementLocated(By.xpath('//span[@id = "spProjectNum" and . = "3"]')), timeout);

        driver.isElementPresent(By.xpath('//span[. = "Gantt Chart"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Display All"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//canvas[@id = "ganttCanvas"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Dashboard.aspx', function () {
        driver.get(base + '/Dashboard.aspx');
        driver.wait(until.titleIs('Roadmap > Dashboard'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Sample View Title"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Sample Sub-Title"]')).then(function (found) {
            assert(found);
        });
        driver.wait(function () {
            return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]')).then(function (elements) {
                return elements.length === 10;
            });
        }, timeout);
    });

    test.it('/WorkItems.aspx', function () {
        driver.get(base + '/WorkItems.aspx');
        driver.wait(until.titleIs('Roadmap > Work Items'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//span[. = "Showing 1-30 from 30 Items"]')), timeout);
        driver.wait(until.elementLocated(By.xpath('//div[@class = "filterItemName" and contains(., "= No")]')), timeout);
        driver.wait(until.elementLocated(By.xpath('//div[@class = "filterItemName" and contains(., "≠ Closed")]')), timeout);
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Resources.aspx', function () {
        driver.get(base + '/Resources.aspx');
        driver.wait(until.titleIs('Roadmap > Resources'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@class = "filterItemName" and contains(., "= Assignable")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Account Owner (You)"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Charlie Sample"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Mathias Sample"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Susan Sample"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Roles.aspx', function () {
        driver.get(base + '/Roles.aspx');
        driver.wait(until.titleIs('Roadmap > Resources > Project Roles'), timeout);
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Analyst"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Designer"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Developer"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Project Manager"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "UX"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/UserGroups.aspx', function () {
        driver.get(base + '/UserGroups.aspx');
        driver.wait(until.titleIs('Roadmap > Resources > User Access Groups'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element));
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Read-Write All")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Read-Only All")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Admin")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Individual Contributor")]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/BulkDeleteResources.aspx', function () {
        driver.get(base + '/BulkDeleteResources.aspx');
        driver.wait(until.titleIs('Roadmap > Bulk Delete Resources'), timeout);
        driver.isElementPresent(By.xpath('//table[@id = "tblResources"]//label[contains(., "Charlie Sample")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblResources"]//label[contains(., "Mathias Sample")]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblResources"]//label[contains(., "Susan Sample")]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Time.aspx', function () {
        driver.get(base + '/Time.aspx');
        driver.wait(until.titleIs('Roadmap > Time'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[. = "Timeframe:"]/../div[. = "This Week"]')).then(function (found) {
            assert(found);
        });
    });

    test.it('/Reports.aspx', function () {
        driver.get(base + '/Reports.aspx');
        driver.wait(until.titleIs('Roadmap > Reports'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function (element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(until.elementLocated(By.xpath('//img[@id = "ctl00_ContentPlaceHolder1_ctrStatusReport_ctrChart_Image"]')), timeout);
        driver.isElementPresent(By.xpath('//span[. = "Portfolio Health"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//td[. = "Projects"]/../td[. = "3"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//td[. = "Resources"]/../td[. = "3"]')).then(function (found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//td[. = "Avg Resource per Project"]/../td[. = "1"]')).then(function (found) {
            assert(found);
        });
    });

});
