var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');

test.describe('Opening Individual Project', function() {
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

    test.it('/IndProject.aspx', function() {
        driver.get(base + '/Projects.aspx');
        driver.wait(until.titleIs('Roadmap > Projects'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project A"]')).then(function(element) {
            element.getAttribute('href').then(function(href) {
                driver.get(href);
            });
        });
        driver.wait(until.titleIs('Roadmap > Sample Project A'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.findElement(By.xpath('//a[@id = "pSettings"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "pSettingsPanel" and @expanded = "1"]'));
        }, timeout);
        driver.findElement(By.xpath('//div[@id = "pSettingsPanel"]//span[@class = "tabTitle" and . = "Project"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "pSettingsPanel"]//span[@class = "tabTitle" and . = "Project"]')).click();
        driver.findElement(By.xpath('//div[@id = "settingsTabs-1"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "pSettingsPanel"]//span[@class = "tabTitle" and . = "Budget"]')).click();
        driver.findElement(By.xpath('//div[@id = "settingsTabs-2"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "pSettingsPanel"]//span[@class = "tabTitle" and . = "Resources"]')).click();

        driver.findElement(By.xpath('//a[@id = "pSettings"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "pSettingsPanel" and @expanded = "0"]'));
        }, timeout);
    });

    test.it('/IndProject.aspx|WorkItems', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabWorkItems)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectWorkItemsTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectWorkItemsTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|Gantt', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabGantt)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectGanttTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectGanttTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|Notes', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabNotes)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectNotesTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectNotesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|Attachments', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabAttachments)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectAttachmentsTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectAttachmentsTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|Resources', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabResources)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectResourcesTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectResourcesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|Roadblocks', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabRoadblocks)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectIssuesTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectIssuesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|ScheduleAudit', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabScheduleAudit)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectScheduleAuditTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectScheduleAuditTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|TimeTracking', function() {
        driver.executeScript('projectView.showTab(projectTabs.tabTimeTracking)');
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectTimeTrackingTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectTimeTrackingTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

    test.it('/IndProject.aspx|RecentActivity', function() {
        driver.findElement(By.xpath('//span[. = "Recent Activity"]')).click();
        driver.wait(until.elementLocated(By.xpath('//div[@id = "projectRecentActivityTab"]'), timeout));
        driver.findElement(By.xpath('//div[@id = "projectRecentActivityTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
    });

});
