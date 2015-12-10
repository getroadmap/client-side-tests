/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('System Admin pages', function () {
    'use strict';
    var driver, base, user, owner, timeout;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.system_admin;
        owner = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();
    });

    test.after(function () {
        driver.quit();
    });

    test.it('/Login.aspx', function () {
        driver.get(base);
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1111111');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Notifications'), timeout);
    });

    test.it('Should be possible to Add New Notification', function () {
        driver.findElement(By.xpath('//div[@id = "btnNotificationsActionMenu"]')).click();
        driver.findElement(By.xpath('//div[. = "Add New Notification"]')).click();
        driver.findElement(By.xpath('//select[@id = "ctl00_ContentPlaceHolder1_selType"]/option[@value = "System"]')).click();
        driver.findElement(By.xpath('//select[@id = "ctl00_ContentPlaceHolder1_selUserGroup"]/option[@value = "All"]')).click();
        driver.findElement(By.xpath('//select[@id = "ctl00_ContentPlaceHolder1_selUserGroup"]/option[@value = "NonAdmin"]')).click();
        driver.findElement(By.xpath('//select[@id = "ctl00_ContentPlaceHolder1_selUserGroup"]/option[@value = "Admin"]')).click();
        driver.findElement(By.xpath('//select[@id = "ctl00_ContentPlaceHolder1_selUserGroup"]/option[@value = "AccountOwner"]')).click();
        driver.findElement(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_txtTitle"]')).sendKeys('Test Title');
        driver.findElement(By.xpath('//textarea[@id = "ctl00_ContentPlaceHolder1_txtDetails"]')).sendKeys('Test Details');
        driver.findElement(By.xpath('//div[@id = "notificationBody"]/..//span[. = "Cancel"]')).click();
    });

    test.it('Should be possible to manage Failed BC Imports', function () {
        driver.get(base + '/admin/FailedBCImport.aspx');
        driver.wait(until.titleIs('Roadmap'), timeout);
        driver.findElement(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_txtEmail"]')).sendKeys(owner);
    });

    test.it('Should be possible to manage MailChimp Exports', function () {
        driver.get(base + '/admin/MailChimpExport.aspx');
        driver.wait(until.titleIs('Roadmap > MailChimpExport'), timeout);
        driver.findElement(By.xpath('//a[contains(., "Logout")]')).click();
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
    });

});
