var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Opening Settings', function() {
    var driver, base, user, timeout;

    test.before(function() {
        driver = new webdriver.Builder()
            .withCapabilities(config.selenium.capabilities)
            .build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().setSize(1366, 768);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('/Login.aspx', function() {
        driver.get(base + '/AccountPreferences.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Settings > Account Preferences'), timeout);
    });

    test.it('/Account.aspx', function() {
        driver.get(base + '/Account.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Account > My Account');
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "usrStorageUsed" and contains(., "of 5.00 GB (~0%)")]'));
        }, timeout);
        driver.isElementPresent(By.xpath('//td[. = "Permissions"]/..//span[. = "Admin (account owner)"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Subscription', function() {
        driver.get(base + '/Subscription');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Account > Subscription');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//input[@id = "btnAddBillingPerson"]'));
        }, timeout);
        driver.isElementPresent(By.xpath('//div[@id = "p-plan-basic"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "p-plan-plus"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "p-plan-pro"]')).then(function(found) {
            assert(found);
        });
        driver.findElement(By.xpath('//div[@id = "p-plan-pro"]//button[@class = "p-plan-year"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(!displayed);
            });
        });

        driver.findElement(By.xpath('//div[@id = "p-plan-pro"]//div[@class = "p-plan-ctl"]')).then(function(element) {
            driver.actions().mouseMove(element).perform();
        });
        driver.findElement(By.xpath('//div[@id = "p-plan-pro"]//button[@class = "p-plan-year"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "p-plan-pro"]//button[@class = "p-plan-year"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//input[@id = "btnApplyCoupon" and @value = "Apply Coupon"]'));
        }, timeout);
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//input[@id = "btnPay" and @value = "Pay $1000.00/year"]'));
        }, timeout);
    });

    test.it('/AccountPreferences.aspx', function() {
        driver.get(base + '/AccountPreferences.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Settings > Account Preferences');
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "selectedLandingPagePath" and . = "Dashboard Tab"]'));
        }, timeout);
        driver.findElement(By.xpath('//div[@id = "optDashOverview"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optCurrencyFormat"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optNumericFormat"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optDateFormat"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optTimeZone"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optWorkingDay"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optAudit"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optStatReport"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optAllowNonAdminsCreateFiltersViews"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optTimeTracking"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
        driver.findElement(By.xpath('//div[@id = "optExternalID"]')).then(function(element) {
            element.isDisplayed().then(function(displayed) {
                assert(displayed);
            });
        });
    });

    test.it('/ProjectPreferences.aspx', function() {
        driver.get(base + '/ProjectPreferences.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Settings > Project Preferences');
        });
        driver.findElements(By.xpath('//div[@class = "settings-block"]')).then(function(elements) {
            assert.equal(elements.length, 5);
        });
        driver.isElementPresent(By.xpath('//input[@id = "rbPctCmpltAuto" and @checked = "checked"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[. = "Sample Project Template"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/ResourcePreferences.aspx', function() {
        driver.get(base + '/ResourcePreferences.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Settings > Resource Preferences');
        });
        driver.isElementPresent(By.xpath('//div[. = "Resource groups"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/WorkItemPreferences.aspx', function() {
        driver.get(base + '/WorkItemPreferences.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Settings > Work Item Preferences');
        });
        driver.isElementPresent(By.xpath('//a[. = "Add Work Item Attribute"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Integration.aspx', function() {
        driver.get(base + '/Integration.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Settings > Basecamp Integration');
        });
        driver.isElementPresent(By.xpath('//input[@id = "radFullSync" and @checked = "checked"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//input[@id = "radDoNotSyncETA" and @checked = "checked"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//input[@id = "radAssigntETAtoRespPartyOnly" and @checked = "checked"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/ThirdPartyConnections.aspx', function() {
        driver.get(base + '/ThirdPartyConnections.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Settings > Third Party Conections');
        });
        driver.isElementPresent(By.xpath('//span[@id = "apiKeyMode" and contains(., "abled")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//a[@id = "aEnableAPI" and contains(., "able API")]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/FileImport.aspx', function() {
        driver.get(base + '/FileImport.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Import From Excel / CSV');
        });
        driver.isElementPresent(By.xpath('//input[@id = "projectsUploader"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//input[@id = "timeEntriesUploader"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//input[@id = "resourcesUploader"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//input[@id = "rolesUploader"]')).then(function(found) {
            assert(found);
        });
    });

});
