/*jslint node: true */
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    test = require('selenium-webdriver/testing'),
    request = require('request'),
    validate = require('jsonschema').validate,
    assert = require('assert'),
    config = require('../config'),
    schema = require('../schema_v1_2');

test.describe('Testing API v1.2', function () {
    'use strict';
    var driver, base, user, timeout, api, options, uniqueID, validateResponse,
        roleID, resourceID, healthID, projectID, milestoneID, eventID, todoListID, todoItemID, timeEntryID,
        startDate, dueDate;

    test.before(function () {
        driver = new webdriver.Builder().build();
        timeout = config.selenium.timeout;
        base = config.roadmap.base;
        api = config.roadmap.api;
        user = config.roadmap.owner;
        driver.manage().timeouts().pageLoadTimeout(timeout);
        driver.manage().window().maximize();

        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;

        options = {
            auth: {
                sendImmediately: false
            },
            json: true
        };

        validateResponse = function (error, response, body, schema) {
            var result;
            if (error) {
                console.log(error);
            } else {
                result = validate(body, schema);
                if (result.errors.length !== 0) {
                    console.log(result);
                }
            }
            assert(!error && response.statusCode === 200 && result.errors.length === 0);
        };

        startDate = '2015-09-01';
        dueDate = '2016-09-01';
    });

    test.it('Retrieving API token', function () {
        driver.get(base + '/Account.aspx');
        driver.findElement(By.xpath('//input[@id = "Login1_UserName"]')).sendKeys(user);
        driver.findElement(By.xpath('//input[@id = "Login1_Password"]')).sendKeys('1234567');
        driver.findElement(By.xpath('//input[@id = "Login1_LoginButton"]')).click();
        driver.wait(until.titleIs('Roadmap > Account > My Account'), timeout);
        driver.findElement(By.xpath('//input[@id = "publicApiToken"]')).then(function (element) {
            element.getAttribute('value').then(function (value) {
                options.auth.user = value;
            });
        });
        driver.get(base + '/Logout.aspx');
        driver.wait(until.titleIs('Roadmap > Login'), timeout);
        driver.quit();
    });

    test.it('POST v1.2/role/add', function (done) {
        options.url = api + '/v1.2/role/add';
        options.body = 'API_Role_' + uniqueID;
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/role/add']);
            roleID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/resource/add', function (done) {
        options.url = api + '/v1.2/resource/add';
        options.body = {
            FirstName: 'API_Resource',
            LastName: uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'ResourceCustomCode_' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/resource/add']);
            resourceID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/resource/addCompany', function (done) {
        options.url = api + '/v1.2/resource/addCompany';
        options.body = {
            CompanyName: 'API_Company_' + uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'CompanyCustomeCode_' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/resource/addCompany']);
            done();
        });
    });

    test.it('POST v1.2/resource/addUser', function (done) {
        options.url = api + '/v1.2/resource/addUser';
        options.body = {
            FirstName: 'API_User',
            LastName: uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'UserCustomeCode_' + uniqueID,
            Email: 'api_user_' + uniqueID + '@null.null',
            Password: '1234567',
            Privilege: 'ReadWriteAll'
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/resource/addUser']);
            done();
        });
    });

    test.it('GET v1.2/health', function (done) {
        options.url = api + '/v1.2/health';
        request.get(options, function (error, response, body) {
            validateResponse(error, response, body, schema['GET v1.2/health']);
            healthID = body[body.length - 2].ID;
            done();
        });
    });

    test.it('POST v1.2/project/add', function (done) {
        options.url = api + '/v1.2/project/add';
        options.body = {
            Name: 'Test API Project ' + uniqueID,
            CustomCode: 'ProjectCustomCode_' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            HealthID: healthID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/add']);
            projectID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/milestone/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/milestone/add';
        options.body = {
            Name: 'Test API Milestone ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/milestone/add']);
            milestoneID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/event/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/event/add';
        options.body = {
            Name: 'Test API Event ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/event/add']);
            eventID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/todolist/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/todolist/add';
        options.body = {
            MilestoneID: milestoneID,
            Name: 'Test API To-Do List Name ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/todolist/add']);
            todoListID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/todolist/{todoListId}/item/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/todolist/' + todoListID + '/item/add';
        options.body = {
            Name: 'Test API To-Do Item Name ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/todolist/{todoListId}/item/add']);
            todoItemID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/timeentry/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/timeentry/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 5.5,
            Description: 'Test API Project\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/timeentry/add']);
            timeEntryID = body.ID;
            done();
        });
    });

    test.it('GET v1.2/resource/me', function (done) {
        options.url = api + '/v1.2/resource/me';
        request.get(options, function (error, response, body) {
            validateResponse(error, response, body, schema['GET v1.2/resource/me']);
            done();
        });
    });

});
