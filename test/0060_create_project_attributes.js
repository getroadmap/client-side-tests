/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Create Project Attributes', function () {
    'use strict';
    var driver, base, user, timeout, uniqueID, attrName, i;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;
    });

    test.after(function () {
        driver.quit();
    });

    test.it('/Login.aspx', function () {
        driver.get(base + '/ProjectPreferences.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Settings > Project Preferences'));
    });

    test.it('Should be possible to create Single-Selection', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Single-Selection ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbSelect"]')).click();
        for (i = 1; i < 21; i += 1) {
            driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtSelectionValue"]')).sendKeys('Single ' + (i < 10 ? '0' + i : i));
            driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "divBtnAdd"]')).click();
        }
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Multi-Selection', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Multi-Selection ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbSelect"]')).click();
        for (i = 1; i < 21; i += 1) {
            driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtSelectionValue"]')).sendKeys('Multi ' + (i < 10 ? '0' + i : i));
            driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "divBtnAdd"]')).click();
        }
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "chkPAAllowMultiple"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Text-Short', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Text-Short ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbSText"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Text-Long', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Text-Long ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbLText"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Number', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Number ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbNumber"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Percentage', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Percentage ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbPercentage"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Currency', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Currency ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbCurrency"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Date', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Date ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbDate"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });

    test.it('Should be possible to create Checkbox', function () {
        driver.findElement(By.xpath('//table[@id = "tblCustomAttributes"]//a[contains(., "Add Project Attribute")]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "customAttributesFormBody"]')), timeout);

        attrName = 'Project Checkbox ' + uniqueID;
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "txtProjAttrName"]')).sendKeys(attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//textarea[@id = "txtDescription"]')).sendKeys('Description for ' + attrName);
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]//input[@id = "rbCheckbox"]')).click();
        driver.findElement(By.xpath('//div[@id = "divChkBoxColorYes"]')).click();
        driver.findElement(By.xpath('//div[@id = "colorPicker"]//div[@id = "color4"]')).click();
        driver.findElement(By.xpath('//div[@id = "colorPicker"]/..//span[. = "OK"]')).click();
        driver.findElement(By.xpath('//div[@id = "divChkBoxColorNo"]')).click();
        driver.findElement(By.xpath('//div[@id = "colorPicker"]//div[@id = "color1"]')).click();
        driver.findElement(By.xpath('//div[@id = "colorPicker"]/..//span[. = "OK"]')).click();
        driver.findElement(By.xpath('//div[@id = "customAttributesFormBody"]/..//span[. = "Save"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[. = "' + attrName + '"]')), timeout);
    });
});
