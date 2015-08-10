var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');
    
test.describe('Project Roles', function() {
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
    
    test.it('Should be possible to create project roles', function() {
        driver.get(base + '/Roles.aspx');
        driver.wait(until.titleIs('Roadmap > Resources > Project Roles'), timeout);

        driver.findElement(By.xpath('//a[contains(., "Add Project Role")]')).click();
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]')).sendKeys('Project Role ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../input[2]')).sendKeys(10);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../..//span[. = "OK"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[contains(., "Project Role")]'));
        }, timeout);
        
        driver.findElement(By.xpath('//a[contains(., "Add Project Role")]')).click();
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]')).sendKeys('Role To Edit ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../input[2]')).sendKeys(10);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../..//span[. = "OK"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[contains(., "Role To Edit")]'));
        }, timeout);
        
        driver.findElement(By.xpath('//a[contains(., "Add Project Role")]')).click();
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]')).sendKeys('Role To Delete ' + uniqueID);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../input[2]')).sendKeys(10);
        driver.findElement(By.xpath('//input[@id = "bhvAddOnTheFly_1field"]/../..//span[. = "OK"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[contains(., "Role To Delete")]'));
        }, timeout);
    });
    
    test.it('Should be possible to edit project roles', function() {
        assert(false);
    });
    
    test.it('Should be possible to delete project roles', function() {
        assert(false);
    });
    
});
