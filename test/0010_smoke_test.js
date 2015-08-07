var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    assert = require('assert'),
    config = require('../config');
    
test.describe('Smoke Test', function() {
    var driver, base, user, timeout, indProject, indResource;
    
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
    });
    
    test.after(function() {
        driver.quit();
    });

    test.it('/Login.aspx', function() {
        driver.get(base + '/Subscription');
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
                driver.getTitle().then(function(title) {
                    assert.equal(title, 'Roadmap > Getting Started');
                });                
            }
            else {
                driver.getTitle().then(function(title) {
                    assert.equal(title, 'Roadmap > Account > Subscription');
                });
            }
        });
    });
    
    test.it('/GettingStarted.aspx', function() {
        driver.get(base + '/GettingStarted.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Getting Started');
        });
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
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[. = "Showing 1-3 from 3 Items"]'));
        }, timeout);
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
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[. = "Showing 1-3 from 3 Items"]'));
        }, timeout);
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
        driver.findElement(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Sample Project A"]')).then(function(element) {
            element.getAttribute('href').then(function(href) {
                indProject = href;
            });
        });
    });
    
    test.it('/IndProject.aspx', function() {
        driver.get(indProject);
        driver.wait(until.titleIs('Roadmap > Sample Project A'), timeout);
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabWorkItems)');
        driver.findElement(By.xpath('//div[@id = "projectWorkItemsTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabGantt)');
        driver.findElement(By.xpath('//div[@id = "projectGanttTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabNotes)');
        driver.findElement(By.xpath('//div[@id = "projectNotesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabAttachments)');
        driver.findElement(By.xpath('//div[@id = "projectAttachmentsTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.executeScript('projectView.showTab(projectTabs.tabResources)');
        driver.findElement(By.xpath('//div[@id = "projectResourcesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabRoadblocks)');
        driver.findElement(By.xpath('//div[@id = "projectIssuesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabScheduleAudit)');
        driver.findElement(By.xpath('//div[@id = "projectScheduleAuditTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.executeScript('projectView.showTab(projectTabs.tabTimeTracking)');
        driver.findElement(By.xpath('//div[@id = "projectTimeTrackingTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });

        driver.findElement(By.xpath('//span[. = "Recent Activity"]')).click();
        driver.findElement(By.xpath('//div[@id = "projectRecentActivityTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
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
    
    test.it('/Gantt.aspx', function() {
        driver.get(base + '/Gantt.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Projects');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "spProjectNum" and . = "3"]'));
        }, timeout);
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
        driver.wait(function() {
            return driver.findElements(By.xpath('//li[@class = "widgetHolder" and contains(@style, "display")]')).then(function(elements) {
                return elements.length === 10;
            });
        }, timeout);
        driver.isElementPresent(By.xpath('//span[. = "Sample View Title"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//span[. = "Sample Sub-Title"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//img[@src = "App_Themes/New/SampleLogo.png"]')).then(function(found) {
            assert(found);
        });
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
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[. = "Showing 1-4 from 4 Items"]'));
        }, timeout);
        driver.isElementPresent(By.xpath('//span[. = "Default View"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//div[@class = "filterItemName" and contains(., "= Assignable")]')).then(function(found) {
            assert(found);
        });
        driver.findElement(By.xpath('//div[@id = "tabViewGrid"]//a[. = "Account Owner (You)"]')).then(function(element) {
            element.getAttribute('href').then(function(href) {
                indResource = href;
            });
        });
    });
    
    test.it('/IndResource.aspx', function() {
        driver.get(indResource);
        driver.wait(until.titleIs('Roadmap > Account Owner'));
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabWorkItems"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "projectWorkItemsTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabCalendar"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "resourceCalendarTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabAvailability"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "resourceAvailabilityTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabIssues"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "projectIssuesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabNotes"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "projectNotesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabAttachments"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "projectAttachmentsTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "tabTimes"]')).click();
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.findElement(By.xpath('//div[@id = "resourceTimesTab"]')).then(function(element) {
            driver.wait(until.elementIsVisible(element), timeout);
        });
        
        driver.findElement(By.xpath('//a[@id = "rSubscriptions"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "rSubscriptionsPanel" and @expanded = "1"]'));
        }, timeout);
        
        driver.findElement(By.xpath('//a[@id = "rSettings"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "rSettingsPanel" and @expanded = "1"]'));
        }, timeout);

        driver.findElement(By.xpath('//a[@id = "rSettings"]')).click();
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//div[@id = "rSettingsPanel" and @expanded = "0"]'));
        }, timeout);
    });
    
    test.it('/Time.aspx', function() {
        driver.get(base + '/Time.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Time');
        });
        driver.findElement(By.xpath('//div[@id = "uiblocker"]')).then(function(element) {
            driver.wait(until.elementIsNotVisible(element), timeout);
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[. = "No items to display"]'));
        }, timeout);
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
    
    test.it('/Account.aspx', function() {
        driver.get(base + '/Account.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Account > My Account');
        });
        driver.wait(function() {
            return driver.isElementPresent(By.xpath('//span[@id = "usrStorageUsed" and . = "0 bytes of 5.00 GB (~0%)"]'));
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
        driver.isElementPresent(By.xpath('//span[@id = "apiKeyMode" and . = "disabled"]')).then(function(found) {
            assert(found);
        });
        driver.isElementPresent(By.xpath('//a[@id = "aEnableAPI" and . = "Enable API"]')).then(function(found) {
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
    
    test.it('/Roles.aspx', function() {
        driver.get(base + '/Roles.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Resources > Project Roles');
        });
        driver.findElements(By.xpath('//table[@id = "tblRoles"]//tr')).then(function(elements) {
            assert.equal(elements.length, 6);
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
    
    test.it('/UserGroupAdd.aspx', function() {
        driver.get(base + '/UserGroupAdd.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Resources > Add Group');
        });
        driver.findElements(By.xpath('//span[@id = "ctl00_ContentPlaceHolder1_ctrGroup_ctl03"]//tr')).then(function(elements) {
            assert.equal(elements.length, 4);
        });
    });
    
    test.it('/BulkDeleteResources.aspx', function() {
        driver.get(base + '/BulkDeleteResources.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Bulk Delete Resources');
        });
        driver.findElements(By.xpath('//table[@id = "tblResources"]//tr')).then(function(elements) {
            assert.equal(elements.length, 6);
        });
    });
    
    test.it('/BulkDeleteProjects.aspx', function() {
        driver.get(base + '/BulkDeleteProjects.aspx');
        driver.getTitle().then(function(title) {
            assert.equal(title, 'Roadmap > Bulk Delete Projects');
        });
        driver.findElements(By.xpath('//table[@id = "tblPPMLiteProjects"]//tr')).then(function(elements) {
            assert.equal(elements.length, 6);
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
    
});
