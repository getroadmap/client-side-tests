/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Create Users', function () {
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
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'), timeout);
    });

    test.it('Should be possible to create Admin user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('Admin');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('User');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.admin);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "Analyst")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Admin"]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).click();

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });

    test.it('Should be possible to create RW All user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('RW');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('All');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.rw_all);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "Designer")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Read-Write All"]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).then(function (element) {
            element.isEnabled().then(function (enabled) {
                assert(!enabled);
            });
        });

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });

    test.it('Should be possible to create RO All user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('RO');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('All');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.ro_all);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "Developer")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Read-Only All"]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).then(function (element) {
            element.isEnabled().then(function (enabled) {
                assert(!enabled);
            });
        });

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });

    test.it('Should be possible to create Individual Contributor user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('Individual');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('Contributor');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.ind_contr);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "Project Manager")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[. = "Individual Contributor"]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).then(function (element) {
            element.isEnabled().then(function (enabled) {
                assert(!enabled);
            });
        });

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });

    test.it('Should be possible to create UAG Simple user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('UAG');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('Simple');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.uag_simple);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "UX")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "Simple")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).then(function (element) {
            element.isEnabled().then(function (enabled) {
                assert(!enabled);
            });
        });

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });

    test.it('Should be possible to create UAG Create user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('UAG');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('Create');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.uag_create);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "UX")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "Create")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).then(function (element) {
            element.isEnabled().then(function (enabled) {
                assert(!enabled);
            });
        });

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });

    test.it('Should be possible to create UAG See All user', function () {
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]/a[. = "Add New"]')).click();
        driver.findElement(By.xpath('//div[@id = "btnNewProject"]//a[@id = "lnkNewUser" and . = "New User..."]')).click();

        driver.wait(until.elementLocated(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]')), timeout);

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateFirstName"]')).sendKeys('UAG');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateLastName"]')).sendKeys('See All');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreateEmail"]')).sendKeys(config.roadmap.uag_see_all);
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//input[@id = "txtUserCreatePassword2"]')).sendKeys('1234567');

        driver.findElement(By.xpath('//input[@id = "chkUserCreateAssignable"]')).then(function (element) {
            element.isSelected().then(function (selected) {
                assert(selected);
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "Primary Project Role"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[@id = "selUserCreateRole_listbox" and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "UX")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]//label[. = "User Access Group"]/..//span[. = "select"]')).click();
        driver.wait(until.elementLocated(By.xpath('//ul[contains(@id, "_selUserCreateUAG_ctrList_listbox") and @aria-hidden = "false"]')), timeout).then(function (element) {
            element.findElement(By.xpath('./li[contains(., "See All")]')).then(function (element) {
                driver.wait(until.elementIsVisible(element), timeout);
                element.click();
            });
        });

        driver.findElement(By.xpath('//input[@id = "chkUserCreateSuperuser"]')).then(function (element) {
            element.isEnabled().then(function (enabled) {
                assert(!enabled);
            });
        });

        driver.findElement(By.xpath('//span[. = "Save and add another"]/..')).click();

        driver.wait(until.elementLocated(By.xpath('//div[. = "The user account has been successfully created and invitation emailed."]')), timeout).then(function (element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });

        driver.findElement(By.xpath('//div[@id = "ctrUserCreatePopoutBody"]/..//span[. = "Close"]')).click();
    });
});
