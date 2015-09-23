/*jslint unparam: true, node: true */
var test = require('selenium-webdriver/testing'),
    request = require('request'),
    validate = require('jsonschema').validate,
    assert = require('assert'),
    config = require('../config'),
    schema = require('../schema_v1_2');

test.describe('Testing API v1.2', function () {
    'use strict';
    var base, user, api, options, uniqueID, validateResponse,
        roleID, resourceID, healthID, projectID, milestoneID, eventID, todoListID,
        todoItemID, timeEntryID, projectResID, milestoneResID, itemResID, noteID, roadblockID,
        startDate, dueDate;

    test.before(function () {
        base = config.roadmap.base;
        api = config.roadmap.api;
        user = config.roadmap.owner;

        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;

        validateResponse = function (error, response, body, schema) {
            var result;
            if (error) {
                console.error(error);
            } else {
                result = validate(body, schema);
                if (result.errors.length !== 0) {
                    console.error(result);
                }
            }
            assert(!error && response.statusCode === 200 && result.errors.length === 0);
        };

        startDate = '2015-09-01';
        dueDate = '2016-09-01';
    });

    test.it('Retrieving API token', function (done) {
        options = {
            url: base + '/Account.aspx',
            jar: true
        };
        request.get(options, function (error, response, body) {
            if (error) {
                console.error(error);
            }
            options.url = base + '/secure/Login.aspx';
            options.form = {
                '__VIEWSTATE': body.match(/id="__VIEWSTATE"[\w\W]+?value="([\w\W]+?)"/)[1],
                'Login1$UserName': user,
                'Login1$Password': '1234567',
                'Login1$LoginButton': 'Sign+In'
            };
            request.post(options, function (error, response, body) {
                if (error) {
                    console.error(error);
                }
                options.url = base + '/api/user/GetCurrent';
                options.json = true;
                request.get(options, function (error, response, body) {
                    if (error) {
                        console.error(error);
                    }
                    options = {
                        auth: {
                            user: body.PublicApiToken,
                            sendImmediately: false
                        },
                        jar: false,
                        json: true
                    };
                    done();
                });
            });
        });
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

    test.it('POST v1.2/project/{projectId}/timeentry/add (Project)', function (done) {
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

    test.it('POST v1.2/project/{projectId}/timeentry/add (Milestone)', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/timeentry/add';
        options.body = {
            MilestoneID: milestoneID,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 6.6,
            Description: 'Test API Milestone\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/timeentry/add']);
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/timeentry/add (TodoItem)', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/timeentry/add';
        options.body = {
            TodoItemID: todoItemID,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 7.7,
            Description: 'Test API TodoItem\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/timeentry/add']);
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/resource/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 50,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/resource/add']);
            projectResID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/milestone/{milestoneId}/resource/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/milestone/' + milestoneID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 60,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/resource/add']);
            milestoneResID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/todolist/{todoListId}/item/{todoItemId}/resource/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 70,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/resource/add']);
            itemResID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/note/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/note/add';
        options.body = 'Test API Note ' + uniqueID;
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/note/add']);
            noteID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/roadblock/add', function (done) {
        options.url = api + '/v1.2/project/' + projectID + '/roadblock/add';
        options.body = {
            Subject: 'Test API Roadblock ' + uniqueID,
            Description: 'Test API Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.post(options, function (error, response, body) {
            validateResponse(error, response, body, schema['POST v1.2/project/{projectId}/roadblock/add']);
            roadblockID = body.ID;
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
