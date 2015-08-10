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
        driver.manage().timeouts().implicitlyWait(config.selenium.implicitlyWait);
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().setSize(1366, 768);
        uniqueID = new Date().getTime();
    });
    
    test.after(function() {
        driver.quit();
    });

    test.it('/Login.aspx', function() {
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'));
    });
    
    test.it('Should be possible to create user access groups', function() {
        driver.get(base + '/UserGroups.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Resources > User Access Groups');
        });
        driver.findElement(By.xpath('//a[contains(., "Add User Access Group")]')).click();
        
        driver.wait(until.titleIs('Roadmap > Resources > Add Group'));
        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('Simple ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();
        
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element));
        });
        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('Can Create Projects ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//input[@id = "chkAllowCreateProjects"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();
        
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element));
        });
        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('Can See All Projects ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//input[@id = "chkHybridGroup"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();
        
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element));
        });
        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('To Be Edited ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//a[. = "Save and add another"]')).click();
        
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element));
        });
        driver.findElement(By.xpath('//input[@id = "txtUserAccessGroupName"]')).sendKeys('To Be Deleted ' + uniqueID);
        driver.findElement(By.xpath('//div[@class = "tblProjects-project-name" and . = "Sample Project A"]/../..//input[@type = "checkbox"]')).click();
        driver.findElement(By.xpath('//div[@class = "user-access-group-button-panel"]/input[@value = "Save"]')).click();

        driver.wait(until.titleIs('Roadmap > Resources > User Access Groups'));        
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[contains(., "Simple")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[contains(., "Can Create Projects")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[contains(., "Can See All Projects")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[contains(., "To Be Edited")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//a[contains(., "To Be Deleted")]')).then(function(found) {
            assert(found);
        });
    });
    
    test.it('Should be possible to edit user access groups', function() {
        assert(false);
    });
    
    test.it('Should be possible to delete user access groups', function() {
        assert(false);
    });
    
});
