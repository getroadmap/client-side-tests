var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('User Access Groups', function() {
    var driver, base, user, timeout, uniqueID;

    test.before(function() {
        driver = new webdriver.Builder()
            .withCapabilities(config.selenium.capabilities)
            .build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().setSize(1366, 768);
        uniqueID = Math.floor(new Date().getTime() / 1000);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('/Login.aspx', function() {
        driver.get(base + '/UserGroups.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Resources > User Access Groups'), timeout);
    });

    test.it('Should be possible to create user access groups', function() {
        driver.get(base + '/UserGroupAdd.aspx');
        driver.wait(until.titleIs('Roadmap > Resources > Add Group'));

        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('Simple ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();

        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('Create ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//input[@id = "chkAllowCreateProjects"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();

        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('All ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//input[@id = "chkHybridGroup"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();

        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('Test ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//input[@value = "Save"]')).click();

        driver.wait(until.titleIs('Roadmap > Resources > User Access Groups'));
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[. = "Simple '+ uniqueID +'"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[. = "Create '+ uniqueID +'"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[. = "All '+ uniqueID +'"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[. = "Test '+ uniqueID +'"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('Should be possible to edit user access groups', function() {
        driver.findElement(By.xpath('//table[@id = "uaGroups"]//a[. = "Test '+ uniqueID +'"]')).click();
        driver.wait(until.titleIs('Roadmap > Resources > Edit Group'), timeout);

        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).then(function(element) {
            element.clear();
            element.sendKeys('Changed ' + uniqueID);
        });

        driver.findElement(By.xpath('//input[@value = "Save"]')).click();

        driver.wait(until.titleIs('Roadmap > Resources > User Access Groups'), timeout);
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[. = "Changed '+ uniqueID +'"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('Should be possible to delete user access groups', function() {
        driver.findElement(By.xpath('//a[. = "Changed '+ uniqueID +'"]/../..//div[. = "Delete"]')).click();
        driver.findElement(By.xpath('//span[. = "Delete"]')).click();

        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[. = "Changed '+ uniqueID +'"]')).then(function(found) {
                return !found;
            });
        }, timeout);
    });

});
