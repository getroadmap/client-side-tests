var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Opening Main Tabs', function() {
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
        driver.isElementPresent(By.xpath('//td[@class = "loginfail" and contains(., "We were unable to find an account")]')).then(function(found) {
            if(found) {
                driver.get(base + '/AccountRegistration.aspx');
                driver.getTitle().then(function(title) {
                    assert.equal(title, 'Signup for Roadmap - Intelligent Project Management, Scheduling, Time Tracking, and Resource Planning');
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_txtFirstName"]')).then(function(element) {
                    element.clear();
                    element.sendKeys('Account');
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_txtLastName"]')).then(function(element) {
                    element.clear();
                    element.sendKeys('Owner');
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_txtCompanyName"]')).then(function(element) {
                    element.clear();
                    element.sendKeys(config.roadmap.company);
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_txtEmail"]')).then(function(element) {
                    element.clear();
                    element.sendKeys(user);
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_txtPassword"]')).then(function(element) {
                    element.sendKeys('1234567');
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_txtPassword2"]')).then(function(element) {
                    element.sendKeys('1234567');
                });
                driver.findElement(By.xpath('//input[@id = "ctl00_PublicContent_btnRegisterCompany"]')).click();

                driver.wait(until.titleIs('Roadmap > Getting Started'), timeout);
            }
            else {
                driver.getTitle().then(function(title) {
                    assert.equal(title, 'Roadmap > Settings > Account Preferences');
                });
            }
        });
    });

    test.it('/GettingStarted.aspx', function() {
        driver.get(base + '/GettingStarted.aspx');
        driver.wait(until.titleIs('Roadmap > Getting Started'), timeout);
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "stepCaption" and . = "Add Projects"]'));
        }, timeout);
        driver.findElements(By.xpath('//button[@class = "ui-datepicker-trigger"]')).then(function(elements) {
            assert.equal(elements.length, 10);
        });
        driver.findElement(By.xpath('//a[@id = "ctl00_ContentPlaceHolder1_btnBCIntegration"]')).then(function(element) {
            element.getAttribute('href').then(function(href) {
                driver.executeScript(href.substring(11));
            });
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//h1[. = "Basecamp Account(s) Integration"]'));
        }, timeout);
        driver.findElement(By.xpath('//input[@id = "btnNextTop"]')).click();

        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "stepCaption" and . = "Add Project Attributes"]'));
        }, timeout);
        driver.findElement(By.xpath('//input[@id = "btnNextBottom"]')).click();
        driver.wait(until.titleIs('Roadmap > Projects'), timeout);
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "sysAnnounce"]'));
        }, timeout);
        driver.get(base + '/GettingStarted.aspx');
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "stepCaption" and . = "Add Projects"]'));
        }, timeout);
        driver.findElement(By.xpath('//input[@id = "btnNextTop"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "stepCaption" and . = "Add Project Attributes"]'));
        }, timeout);
        driver.findElement(By.xpath('//input[@id = "btnNextBottom"]')).click();
        driver.wait(until.titleIs('Roadmap > Projects'), timeout);
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "sysAnnounce"]'));
        }, timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project A"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project B"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project C"]')).then(function(found) {
            assert(found);
        });
        driver.findElement(By.xpath('//div[@id = "sysAnnounce"]/a[@class = "btn-close"]')).then(function(element) {
            element.getAttribute('href').then(function(href) {
                driver.executeScript(href.substring(11));
            });
        });
        driver.isElementPresent(By.xpath('//div[@id = "sysAnnounce"]')).then(function(found) {
            assert(!found);
        });
    });

    test.it('/Projects.aspx', function() {
        driver.get(base + '/Projects.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Projects');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project A"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project B"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project C"]')).then(function(found) {
            assert(found);
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@class = "filterItemName" and contains(., "≠ Closed")]'));
        }, timeout);
        driver.isElementPresent(By.xpath('//span[@id = "user-name" and . = "Account Owner"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Default Grid View"]')).then(function(found) {
            assert(found);
        });
        driver.findElement(By.xpath('//input[@class = "btn-search"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@class = "search-form active"]'));
        }, timeout);
        driver.findElement(By.xpath('//input[@id = "txtSearch"]')).then(function(element) {
            driver.wait(until.elementIsEnabled(element));
            element.clear();
            element.sendKeys('Sample Project A');
        });
        driver.findElement(By.xpath('//input[@class = "btn-search"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[. = "Showing 1-1 from 1 Items"]'));
        }, timeout);
    });

    test.it('/BulkDeleteProjects.aspx', function() {
        driver.get(base + '/BulkDeleteProjects.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Bulk Delete Projects');
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblPPMLiteProjects"]//label[contains(., "Sample Project A")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblPPMLiteProjects"]//label[contains(., "Sample Project B")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblPPMLiteProjects"]//label[contains(., "Sample Project C")]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/MSProjectImport.aspx', function() {
        driver.get(base + '/MSProjectImport.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Import from MS Project');
        });
        driver.isElementPresent(By.xpath('//input[@id = "ctl00_ContentPlaceHolder1_optFirstName" and @checked = "checked"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Gantt.aspx', function() {
        driver.get(base + '/Gantt.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Projects');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Gantt Chart"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Display All"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//canvas[@id = "ganttCanvas"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Dashboard.aspx', function() {
        driver.get(base + '/Dashboard.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Dashboard');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Sample View Title"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Sample Sub-Title"]')).then(function(found) {
            assert(found);
        });
        driver.wait(function() {
            return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]')).then(function(elements) {
                return elements.length === 10;
            });
        }, timeout);
    });

    test.it('/WorkItems.aspx', function() {
        driver.get(base + '/WorkItems.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Work Items');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[. = "Showing 1-30 from 30 Items"]'));
        }, timeout);
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@class = "filterItemName" and contains(., "= No")]'));
        }, timeout);
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@class = "filterItemName" and contains(., "≠ Closed")]'));
        }, timeout);
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Resources.aspx', function() {
        driver.get(base + '/Resources.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Resources');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@class = "filterItemName" and contains(., "= Assignable")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Account Owner (You)"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Charlie Sample"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Mathias Sample"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Susan Sample"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Roles.aspx', function() {
        driver.get(base + '/Roles.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Resources > Project Roles');
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Analyst"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Designer"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Developer"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "Project Manager"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblRoles"]//div[. = "UX"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/UserGroups.aspx', function() {
        driver.get(base + '/UserGroups.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Resources > User Access Groups');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element));
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Read-Write All")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Read-Only All")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Admin")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "uaGroups"]//td[contains(., "Individual Contributor")]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/BulkDeleteResources.aspx', function() {
        driver.get(base + '/BulkDeleteResources.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Bulk Delete Resources');
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblResources"]//label[contains(., "Charlie Sample")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblResources"]//label[contains(., "Mathias Sample")]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//table[@id = "tblResources"]//label[contains(., "Susan Sample")]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Time.aspx', function() {
        driver.get(base + '/Time.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Time');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[. = "Timeframe:"]/../div[. = "This Week"]')).then(function(found) {
            assert(found);
        });
    });

    test.it('/Reports.aspx', function() {
        driver.get(base + '/Reports.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Reports');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//img[@id = "ctl00_ContentPlaceHolder1_ctrStatusReport_ctrChart_Image"]'));
        }, timeout);
        driver.isElementPresent(By.xpath('//span[. = "Portfolio Health"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//td[. = "Projects"]/../td[. = "3"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//td[. = "Resources"]/../td[. = "3"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//td[. = "Avg Resource per Project"]/../td[. = "1"]')).then(function(found) {
            assert(found);
        });
    });

});
