/*jslint unparam: true, node: true */
var test = require('selenium-webdriver/testing'),
    request = require('request'),
    Validator = require('jsonschema').Validator,
    assert = require('assert'),
    config = require('../config'),
    schemaArray = require('../schema_v1_1');

test.describe('Testing API v1.1', function () {
    'use strict';
    var base, user, api, options, uniqueID, v, validate,
        roleID, resourceID, healthID, projectID, milestoneID, eventID, todoListID,
        todoItemID, timeEntryID, projectResID, milestoneResID, itemResID, noteID, roadblockID,
        projectAttributes, resourceAttributes, workitemAttributes,
        startDate, dueDate, startRMDate, endRMDate, startDate2, dueDate2;

    test.before(function () {
        base = config.roadmap.base;
        api = config.roadmap.api;
        user = config.roadmap.owner;
        v = new Validator();

        schemaArray.forEach(function (element) {
            v.addSchema(element);
        });

        uniqueID = Math.floor(new Date().getTime() / 1000) - 1439560400;

        validate = function (error, response, body, id) {
            var result, er = false;
            if (error) {
                console.error(error);
                er = true;
            }
            if (id) {
                result = v.validate(body, v.getSchema(id));
                if (!result.valid) {
                    console.error(result);
                    er = true;
                }
            }
            if (response.statusCode !== 200 && response.statusCode !== 204) {
                console.error(response.statusCode);
                er = true;
            }
            assert(!er);
        };

        startDate = '2015-09-01';
        dueDate = '2016-09-01';
        startDate2 = '2015-10-01';
        dueDate2 = '2016-10-01';
        startRMDate = '20150901';
        endRMDate = '20150930';
    });

    test.it('Retrieving API token', function (done) {
        options = {
            url: base + '/secure/Login.aspx',
            jar: true
        };
        request.get(options, function (error, response, body) {
            if (error) {
                console.error(error);
            }
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

    test.it('POST v1.1/role/add', function (done) {
        options.url = api + '/v1.1/role/add';
        options.body = 'API_11_Role_' + uniqueID;
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleRole');
            roleID = body.ID;
            done();
        });
    });

    test.it('POST v1.1/resource/add', function (done) {
        options.url = api + '/v1.1/resource/add';
        options.body = {
            FirstName: 'API_11_Resource',
            LastName: uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'ResourceCustomCode_' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleResource');
            resourceID = body.ID;
            done();
        });
    });

    test.it('POST v1.1/resource/addCompany', function (done) {
        options.url = api + '/v1.1/resource/addCompany';
        options.body = {
            CompanyName: 'API_11_Company_' + uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'CompanyCustomeCode_' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleResource');
            done();
        });
    });

    test.it('POST v1.1/resource/addUser', function (done) {
        options.url = api + '/v1.1/resource/addUser';
        options.body = {
            FirstName: 'API_11_User',
            LastName: uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'UserCustomeCode_' + uniqueID,
            Email: 'api_11_user_' + uniqueID + '@null.null',
            Password: '1234567',
            Privilege: 'ReadWriteAll'
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleResource');
            done();
        });
    });

    test.it('GET v1.1/health', function (done) {
        options.url = api + '/v1.1/health';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/HealthArray');
            healthID = body[body.length - 3].ID;
            done();
        });
    });

    test.it('POST v1.1/project/add', function (done) {
        options.url = api + '/v1.1/project/add';
        options.body = {
            Name: 'Test API 11 Project ' + uniqueID,
            CustomCode: 'ProjectCustomCode_' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            Health: {
                ID: healthID
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleProject');
            projectID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/{projectId}', function (done) {
        options.url = api + '/v1.1/project/' + projectID;
        options.body = {
            ID: projectID,
            Name: 'Test API 11 Project ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/{projectId}/move', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/move';
        options.body = startDate2;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/{projectID}/updateHealth?healthId={healthId}', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/updateHealth?healthId=' + healthID;
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/{projectID}/updateStatus?status={status}', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/updateStatus?status=Future';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/milestone/add', function (done) {
        options.url = api + '/v1.1/project/milestone/add';
        options.body = {
            ProjectID: projectID,
            Name: 'Test API 11 Milestone ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleMilestone');
            milestoneID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/milestone/{milestoneId}', function (done) {
        options.url = api + '/v1.1/project/milestone/' + milestoneID;
        options.body = {
            ID: milestoneID,
            Name: 'completed API 11 Milestone ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/milestone/{milestoneId}/move', function (done) {
        options.url = api + '/v1.1/project/milestone/' + milestoneID + '/move';
        options.body = startDate2;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/milestone/{milestoneId}/complete', function (done) {
        options.url = api + '/v1.1/project/milestone/' + milestoneID + '/complete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/milestone/add', function (done) {
        options.url = api + '/v1.1/project/milestone/add';
        options.body = {
            ProjectID: projectID,
            Name: 'Test API 11 Milestone ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleMilestone');
            milestoneID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/milestone/{milestoneId}/complete', function (done) {
        options.url = api + '/v1.1/project/milestone/' + milestoneID + '/complete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/milestone/{milestoneId}/uncomplete', function (done) {
        options.url = api + '/v1.1/project/milestone/' + milestoneID + '/uncomplete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/event/add', function (done) {
        options.url = api + '/v1.1/project/event/add';
        options.body = {
            ProjectID: projectID,
            Name: 'Test API 11 Event ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleEvent');
            eventID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/event/{eventId}', function (done) {
        options.url = api + '/v1.1/project/event/' + eventID;
        options.body = {
            ID: eventID,
            Name: 'Test API 11 Event ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            EndTime: '00:00:00'
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/todolist/add', function (done) {
        options.url = api + '/v1.1/project/todolist/add';
        options.body = {
            ProjectID: projectID,
            MilestoneID: milestoneID,
            Name: 'Test API 11 To-Do List ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTodoList');
            todoListID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/todolist/{todoListId}', function (done) {
        options.url = api + '/v1.1/project/todolist/' + todoListID;
        options.body = {
            ID: todoListID,
            Name: 'Test API 11 To-Do List ' + uniqueID
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/item/add', function (done) {
        options.url = api + '/v1.1/project/item/add';
        options.body = {
            ProjectID: projectID,
            TodoListID: todoListID,
            Name: 'Test API 11 To-Do Item ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTodoItem');
            todoItemID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/item/{todoItemId}', function (done) {
        options.url = api + '/v1.1/project/item/' + todoItemID;
        options.body = {
            ID: todoItemID,
            Name: 'Completed API 11 To-Do Item ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/item/{todoItemId}/complete', function (done) {
        options.url = api + '/v1.1/project/item/' + todoItemID + '/complete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/item/add', function (done) {
        options.url = api + '/v1.1/project/item/add';
        options.body = {
            ProjectID: projectID,
            TodoListID: todoListID,
            Name: 'Test API 11 To-Do Item ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTodoItem');
            todoItemID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/item/{todoItemId}/complete', function (done) {
        options.url = api + '/v1.1/project/item/' + todoItemID + '/complete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.1/project/item/{todoItemId}/uncomplete', function (done) {
        options.url = api + '/v1.1/project/item/' + todoItemID + '/uncomplete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/timeentry/add (Project)', function (done) {
        options.url = api + '/v1.1/project/timeentry/add';
        options.body = {
            ProjectID: projectID,
            MilestoneID: null,
            TodoItemID: null,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 5.1,
            Description: 'Test API 11 Project\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTimeEntry');
            timeEntryID = body.ID;
            done();
        });
    });

    test.it('POST v1.1/project/timeentry/add (Milestone)', function (done) {
        options.url = api + '/v1.1/project/timeentry/add';
        options.body = {
            ProjectID: projectID,
            MilestoneID: milestoneID,
            TodoItemID: null,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 5.2,
            Description: 'Test API 11 Milestone\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTimeEntry');
            done();
        });
    });

    test.it('POST v1.1/project/timeentry/add (TodoItem)', function (done) {
        options.url = api + '/v1.1/project/timeentry/add';
        options.body = {
            ProjectID: projectID,
            MilestoneID: null,
            TodoItemID: todoItemID,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 5.3,
            Description: 'Test API 11 TodoItem\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTimeEntry');
            done();
        });
    });

    test.it('POST v1.1/project/{projectId}/resource/add', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 100,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleAssignedResource');
            projectResID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/resource/{projectResId}', function (done) {
        options.url = api + '/v1.1/project/resource/' + projectResID;
        options.body = {
            ID: projectResID,
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 100,
                Unit: 'Percent'
            }
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/{projectId}/milestone/{milestoneId}/resource/add', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/milestone/' + milestoneID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 100,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleAssignedResource');
            milestoneResID = body.ID;
            done();
        });
    });

    test.it('POST v1.1/project/{projectId}/todolist/{todoListId}/item/{todoItemId}/resource/add', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 100,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleAssignedResource');
            itemResID = body.ID;
            done();
        });
    });

    test.it('POST v1.1/project/{projectId}/note/add', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/note/add';
        options.body = 'Test API 11 Note ' + uniqueID;
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleNote');
            noteID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/note/{noteId}', function (done) {
        options.url = api + '/v1.1/project/note/' + noteID;
        options.body = 'Changed API 11 Note ' + uniqueID;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/{projectId}/roadblock/add', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/roadblock/add';
        options.body = {
            ProjectID: projectID,
            Subject: 'Resolved API 11 Roadblock ' + uniqueID,
            Description: 'Resolved API 11 Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleRoadblock');
            roadblockID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/roadblock/{roadblockId}/resolve?resolve={resolve}', function (done) {
        options.url = api + '/v1.1/project/roadblock/' + roadblockID + '/resolve?resolve=true';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.1/project/{projectId}/roadblock/add', function (done) {
        options.url = api + '/v1.1/project/' + projectID + '/roadblock/add';
        options.body = {
            ProjectID: projectID,
            Subject: 'Another API 11 Roadblock ' + uniqueID,
            Description: 'Another API 11 Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleRoadblock');
            roadblockID = body.ID;
            done();
        });
    });

    test.it('PUT v1.1/project/roadblock/{roadblockId}', function (done) {
        options.url = api + '/v1.1/project/roadblock/' + roadblockID;
        options.body = {
            ID: roadblockID,
            Subject: 'Test API 11 Roadblock ' + uniqueID,
            Description: 'Test API 11 Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

});
