/*jslint unparam: true, node: true */
var test = require('selenium-webdriver/testing'),
    request = require('request'),
    Validator = require('jsonschema').Validator,
    assert = require('assert'),
    config = require('../config'),
    schemaArray = require('../schema_v1_2');

test.describe('Testing API v1.2', function () {
    'use strict';
    var base, user, api, options, uniqueID, v, validate,
        roleID, resourceID, healthID, projectID, milestoneID, eventID, todoListID,
        todoItemID, timeEntryID, projectResID, milestoneResID, itemResID, noteID, roadblockID,
        projectAttributes, resourceAttributes, workitemAttributes,
        startDate, dueDate, startRMDate, endRMDate, startDate2, dueDate2;

    test.before(function () {
        base = config.roadmap.base;
        api = config.roadmap.api + '/v1.2';
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

    test.it('POST v1.2/role/add', function (done) {
        options.url = api + '/role/add';
        options.body = 'API_Role_' + uniqueID;
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleRole');
            roleID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/resource/add', function (done) {
        options.url = api + '/resource/add';
        options.body = {
            FirstName: 'API_Resource',
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

    test.it('POST v1.2/resource/addCompany', function (done) {
        options.url = api + '/resource/addCompany';
        options.body = {
            CompanyName: 'API_Company_' + uniqueID,
            PrimaryRoleID: roleID,
            CustomCode: 'CompanyCustomeCode_' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleResource');
            done();
        });
    });

    test.it('POST v1.2/resource/addUser', function (done) {
        options.url = api + '/resource/addUser';
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
            validate(error, response, body, '/SingleResource');
            done();
        });
    });

    test.it('GET v1.2/health', function (done) {
        options.url = api + '/health';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/HealthArray');
            healthID = body[body.length - 2].ID;
            done();
        });
    });

    test.it('POST v1.2/project/add', function (done) {
        options.url = api + '/project/add';
        options.body = {
            Name: 'Test API Project ' + uniqueID,
            CustomCode: 'ProjectCustomCode_' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate,
            HealthID: healthID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleProject');
            projectID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/milestone/add', function (done) {
        options.url = api + '/project/' + projectID + '/milestone/add';
        options.body = {
            Name: 'Test API Milestone ' + uniqueID,
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

    test.it('POST v1.2/project/{projectId}/event/add', function (done) {
        options.url = api + '/project/' + projectID + '/event/add';
        options.body = {
            Name: 'Test API Event ' + uniqueID,
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

    test.it('PUT v1.2/project/{projectId}/event/{eventId}', function (done) {
        options.url = api + '/project/' + projectID + '/event/' + eventID;
        options.body = {
            Name: 'Changed API Event ' + uniqueID,
            StartDate: startDate2,
            DueDate: dueDate2,
            EndTime: '00:00:00'
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/todolist/add', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/add';
        options.body = {
            MilestoneID: milestoneID,
            Name: 'Test API To-Do List ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTodoList');
            todoListID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/todolist/{todoListId}/item/add', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item/add';
        options.body = {
            Name: 'Test API To-Do Item ' + uniqueID,
            StartDate: startDate,
            DueDate: dueDate
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleWorkItem');
            todoItemID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/timeentry/add (Project)', function (done) {
        options.url = api + '/project/' + projectID + '/timeentry/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 5.5,
            Description: 'Test API Project\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTimeEntry');
            timeEntryID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/timeentry/add (Milestone)', function (done) {
        options.url = api + '/project/' + projectID + '/timeentry/add';
        options.body = {
            MilestoneID: milestoneID,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 6.6,
            Description: 'Test API Milestone\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTimeEntry');
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/timeentry/add (TodoItem)', function (done) {
        options.url = api + '/project/' + projectID + '/timeentry/add';
        options.body = {
            TodoItemID: todoItemID,
            ResourceID: resourceID,
            RoleID: roleID,
            Date: startDate,
            Time: 7.7,
            Description: 'Test API TodoItem\'s time entry ' + uniqueID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleTimeEntry');
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/resource/add', function (done) {
        options.url = api + '/project/' + projectID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 50,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleAssignedResource');
            projectResID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/milestone/{milestoneId}/resource/add', function (done) {
        options.url = api + '/project/' + projectID + '/milestone/' + milestoneID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 60,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleAssignedResource');
            milestoneResID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/todolist/{todoListId}/item/{todoItemId}/resource/add', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID + '/resource/add';
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 70,
                Unit: 'Percent'
            }
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleAssignedResource');
            itemResID = body.ID;
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/note/add', function (done) {
        options.url = api + '/project/' + projectID + '/note/add';
        options.body = 'Test API Note ' + uniqueID;
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleNote');
            noteID = body.ID;
            done();
        });
    });

    test.it('PUT v1.2/project/note/{noteId}', function (done) {
        options.url = api + '/project/note/' + noteID;
        options.body = 'Changed API Note ' + uniqueID;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/roadblock/add', function (done) {
        options.url = api + '/project/' + projectID + '/roadblock/add';
        options.body = {
            Subject: 'Test API Roadblock ' + uniqueID,
            Description: 'Test API Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleRoadblock');
            roadblockID = body.ID;
            done();
        });
    });

    test.it('PUT v1.2/project/roadblock/{roadblockId}', function (done) {
        options.url = api + '/project/roadblock/' + roadblockID;
        options.body = {
            Subject: 'Changed API Roadblock ' + uniqueID,
            Description: 'Test API Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('POST v1.2/project/{projectId}/roadblock/add', function (done) {
        options.url = api + '/project/' + projectID + '/roadblock/add';
        options.body = {
            Subject: 'Another API Roadblock ' + uniqueID,
            Description: 'Another API Roadblock Description ' + uniqueID,
            ResponsibleResourceID: resourceID
        };
        request.post(options, function (error, response, body) {
            validate(error, response, body, '/SingleRoadblock');
            roadblockID = body.ID;
            done();
        });
    });

    test.it('PUT v1.2/project/roadblock/{roadblockId}/resolve?resolve={resolve}', function (done) {
        options.url = api + '/project/roadblock/' + roadblockID + '/resolve?resolve=true';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('GET v1.2/attr', function (done) {
        options.url = api + '/attr';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeArray');
            done();
        });
    });

    test.it('GET v1.2/attr/project', function (done) {
        options.url = api + '/attr/project';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeArray');
            projectAttributes = body;
            done();
        });
    });

    test.it('GET v1.2/attr/resource', function (done) {
        options.url = api + '/attr/resource';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeArray');
            resourceAttributes = body;
            done();
        });
    });

    test.it('GET v1.2/attr/work-item', function (done) {
        options.url = api + '/attr/work-item';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeArray');
            workitemAttributes = body;
            done();
        });
    });

    test.it('PUT v1.2/project/{projectId}/attr/{attrId}', function (done) {
        var counter = 0;
        projectAttributes.forEach(function (attribute, index) {
            options.url = api + '/project/' + projectID + '/attr/' + attribute.ID;
            switch (attribute.Type) {
            case 'Listbox':
                options.body = [attribute.Options[0].ID];
                break;
            case 'TextShort':
                options.body = 'Project Short Text';
                break;
            case 'TextLong':
                options.body = 'Project Long Text';
                break;
            case 'Number':
                options.body = 5.5;
                break;
            case 'Percentage':
                options.body = 6.6;
                break;
            case 'Currency':
                options.body = 7.7;
                break;
            case 'Date':
                options.body = startDate;
                break;
            case 'Checkbox':
                options.body = true;
                break;
            default:
                options.body = null;
            }
            request.put(options, function (error, response, body) {
                counter += 1;
                if (error) {
                    console.error(error);
                }
                assert(!error && response.statusCode === 204);
                if (counter === projectAttributes.length) {
                    done();
                }
            });
        });
    });

    test.it('PUT v1.2/resource/{resourceId}/attr/{attrId}', function (done) {
        var counter = 0;
        resourceAttributes.forEach(function (attribute, index) {
            options.url = api + '/resource/' + resourceID + '/attr/' + attribute.ID;
            switch (attribute.Type) {
            case 'Listbox':
                options.body = [attribute.Options[0].ID];
                break;
            case 'TextShort':
                options.body = 'Resource Short Text';
                break;
            case 'TextLong':
                options.body = 'Resource Long Text';
                break;
            case 'Number':
                options.body = 5.5;
                break;
            case 'Percentage':
                options.body = 6.6;
                break;
            case 'Currency':
                options.body = 7.7;
                break;
            case 'Date':
                options.body = startDate;
                break;
            case 'Checkbox':
                options.body = true;
                break;
            default:
                options.body = null;
            }
            request.put(options, function (error, response, body) {
                counter += 1;
                if (error) {
                    console.error(error);
                }
                assert(!error && response.statusCode === 204);
                if (counter === resourceAttributes.length) {
                    done();
                }
            });
        });
    });

    test.it('PUT v1.2/project/{projectId}/milestone/{milestoneId}/attr/{attrId}', function (done) {
        var counter = 0;
        workitemAttributes.forEach(function (attribute, index) {
            options.url = api + '/project/' + projectID + '/milestone/' + milestoneID + '/attr/' + attribute.ID;
            switch (attribute.Type) {
            case 'Listbox':
                options.body = [attribute.Options[0].ID];
                break;
            case 'TextShort':
                options.body = 'Milestone Short Text';
                break;
            case 'TextLong':
                options.body = 'Milestone Long Text';
                break;
            case 'Number':
                options.body = 5.5;
                break;
            case 'Percentage':
                options.body = 6.6;
                break;
            case 'Currency':
                options.body = 7.7;
                break;
            case 'Date':
                options.body = startDate;
                break;
            case 'Checkbox':
                options.body = true;
                break;
            default:
                options.body = null;
            }
            request.put(options, function (error, response, body) {
                counter += 1;
                if (error) {
                    console.error(error);
                }
                assert(!error && response.statusCode === 204);
                if (counter === workitemAttributes.length) {
                    done();
                }
            });
        });
    });

    test.it('PUT v1.2/project/{projectId}/todolist/{todoListId}/item/{todoItemID}/attr/{attrId}', function (done) {
        var counter = 0;
        workitemAttributes.forEach(function (attribute, index) {
            options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID + '/attr/' + attribute.ID;
            switch (attribute.Type) {
            case 'Listbox':
                options.body = [attribute.Options[0].ID];
                break;
            case 'TextShort':
                options.body = 'Item Short Text';
                break;
            case 'TextLong':
                options.body = 'Item Long Text';
                break;
            case 'Number':
                options.body = 5.5;
                break;
            case 'Percentage':
                options.body = 6.6;
                break;
            case 'Currency':
                options.body = 7.7;
                break;
            case 'Date':
                options.body = startDate;
                break;
            case 'Checkbox':
                options.body = true;
                break;
            default:
                options.body = null;
            }
            request.put(options, function (error, response, body) {
                counter += 1;
                if (error) {
                    console.error(error);
                }
                assert(!error && response.statusCode === 204);
                if (counter === workitemAttributes.length) {
                    done();
                }
            });
        });
    });

    test.it('GET v1.2/project/{projectId}/attr', function (done) {
        options.url = api + '/project/' + projectID + '/attr';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeValueArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/attr', function (done) {
        options.url = api + '/resource/' + resourceID + '/attr';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeValueArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/milestone/{milestoneId}/attr', function (done) {
        options.url = api + '/project/' + projectID + '/milestone/' + milestoneID + '/attr';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeValueArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/todolist/{todoListId}/item/{todoItemId}/attr', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID + '/attr';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AttributeValueArray');
            done();
        });
    });

    test.it('GET v1.2/role', function (done) {
        options.url = api + '/role';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/RoleArray');
            done();
        });
    });

    test.it('GET v1.2/resource', function (done) {
        options.url = api + '/resource';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/ResourceArray');
            done();
        });
    });

    test.it('GET v1.2/resource/me', function (done) {
        options.url = api + '/resource/me';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleResourceLong');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}', function (done) {
        options.url = api + '/resource/' + resourceID;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleResource');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/active-project', function (done) {
        options.url = api + '/resource/' + resourceID + '/active-project';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/ProjectArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/project', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/project';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/project?projectID={projectID}', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/project?projectID=' + projectID;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/milestone', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/milestone';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/todo', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/todo';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('PUT v1.2/project/{projectId}/updateStatus?status={status}', function (done) {
        options.url = api + '/project/' + projectID + '/updateStatus?status=Closed';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/project/completed', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/project/completed';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/project/completed?projectID={projectID}', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/project/completed?projectID=' + projectID;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('PUT v1.2/project/{projectId}/updateHealth?healthId={healthId}', function (done) {
        options.url = api + '/project/' + projectID + '/updateHealth?healthId=' + healthID;
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/milestone/{milestoneId}/complete', function (done) {
        options.url = api + '/project/milestone/' + milestoneID + '/complete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/milestone/completed', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/milestone/completed';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('PUT v1.2/project/milestone/{milestoneId}/uncomplete', function (done) {
        options.url = api + '/project/milestone/' + milestoneID + '/uncomplete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/item/{todoItemId}/complete', function (done) {
        options.url = api + '/project/item/' + todoItemID + '/complete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('GET v1.2/resource/{resourceId}/work-item/todo/completed', function (done) {
        options.url = api + '/resource/' + resourceID + '/work-item/todo/completed';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('PUT v1.2/project/item/{todoItemId}/uncomplete', function (done) {
        options.url = api + '/project/item/' + todoItemID + '/uncomplete';
        options.body = null;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/todolist/{todoListId}/item', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/todolist/{todoListId}/item/{todoItemId}/resource', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID + '/resource';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AssignedResourceArray');
            done();
        });
    });

    test.it('GET v1.2/project', function (done) {
        options.url = api + '/project';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/ProjectArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/resource', function (done) {
        options.url = api + '/project/' + projectID + '/resource';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AssignedResourceArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/resource-all', function (done) {
        options.url = api + '/project/' + projectID + '/resource-all';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AssignedResourceArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/roadblock', function (done) {
        options.url = api + '/project/' + projectID + '/roadblock';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/RoadblockArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/milestone', function (done) {
        options.url = api + '/project/' + projectID + '/milestone';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/milestone/{milestoneId}/resource', function (done) {
        options.url = api + '/project/' + projectID + '/milestone/' + milestoneID + '/resource';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/AssignedResourceArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/note', function (done) {
        options.url = api + '/project/' + projectID + '/note';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/NoteArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/event', function (done) {
        options.url = api + '/project/' + projectID + '/event';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/EventArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/event/{eventId}', function (done) {
        options.url = api + '/project/' + projectID + '/event/' + eventID;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleEvent');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/todolist', function (done) {
        options.url = api + '/project/' + projectID + '/todolist';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/TodoListArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/todolist/{todoListId}', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleTodoList');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/timeentry/{start}/{end}', function (done) {
        options.url = api + '/project/' + projectID + '/timeentry/' + startRMDate + '/' + endRMDate;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/TimeEntryArray');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/work-item', function (done) {
        options.url = api + '/project/' + projectID + '/work-item';
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/WorkItemArray');
            done();
        });
    });

    test.it('PUT v1.2/project/event/{eventId}', function (done) {
        options.url = api + '/project/event/' + eventID;
        options.body = {
            Name: 'Changed API Event ' + uniqueID,
            StartDate: startDate2,
            DueDate: dueDate2,
            EndTime: '00:00:00'
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/item/resource/{itemResId}', function (done) {
        options.url = api + '/project/item/resource/' + itemResID;
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 1.1,
                Unit: 'Hours'
            }
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/item/{todoItemId}', function (done) {
        options.url = api + '/project/item/' + todoItemID;
        options.body = {
            Name: 'Changed API To-Do Item ' + uniqueID,
            StartDate: startDate2,
            DueDate: dueDate2
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/milestone/{milestoneId}', function (done) {
        options.url = api + '/project/milestone/' + milestoneID;
        options.body = {
            Name: 'Changed API Milestone ' + uniqueID,
            StartDate: startDate2,
            DueDate: dueDate2
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/milestone/{milestoneId}/move', function (done) {
        options.url = api + '/project/milestone/' + milestoneID + '/move';
        options.body = startDate;
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/milestone/resource/{milestoneResId}', function (done) {
        options.url = api + '/project/milestone/resource/' + milestoneResID;
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 6.9,
                Unit: 'Hours'
            }
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/{projectId}', function (done) {
        options.url = api + '/project/' + projectID;
        options.body = {
            Name: 'Changed API Project ' + uniqueID,
            StartDate: startDate2,
            DueDate: dueDate2
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}', function (done) {
        options.url = api + '/project/' + projectID;
        options.body = null;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleProject');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/milestone/{milestoneId}', function (done) {
        options.url = api + '/project/' + projectID + '/milestone/' + milestoneID;
        options.body = null;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleMilestone');
            done();
        });
    });

    test.it('GET v1.2/project/{projectId}/todolist/{todoListId}/item/{todoItemId}', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID + '/item/' + todoItemID;
        request.get(options, function (error, response, body) {
            validate(error, response, body, '/SingleWorkItem');
            done();
        });
    });

    test.it('PUT v1.2/project/{projectId}/todolist/{todoListId}', function (done) {
        options.url = api + '/project/' + projectID + '/todolist/' + todoListID;
        options.body = {
            Name: 'Changed API To-Do List ' + uniqueID
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('PUT v1.2/project/resource/{projectResId}', function (done) {
        options.url = api + '/project/resource/' + projectResID;
        options.body = {
            ResourceID: resourceID,
            RoleID: roleID,
            Estimate: {
                Time: 6.7,
                Unit: 'Hours'
            }
        };
        request.put(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/event/{eventId}', function (done) {
        options.url = api + '/project/event/' + eventID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/item/resource/{itemResId}', function (done) {
        options.url = api + '/project/item/resource/' + itemResID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/item/{todoItemId}', function (done) {
        options.url = api + '/project/item/' + todoItemID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/todolist/{toDoListId}', function (done) {
        options.url = api + '/project/todolist/' + todoListID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/resource/{projectResId}', function (done) {
        options.url = api + '/project/resource/' + projectResID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/timeentry/{timeEntryId}', function (done) {
        options.url = api + '/project/timeentry/' + timeEntryID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/milestone/resource/{milestoneResId}', function (done) {
        options.url = api + '/project/milestone/resource/' + milestoneResID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/note/{noteId}', function (done) {
        options.url = api + '/project/note/' + noteID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/milestone/{milestoneId}', function (done) {
        options.url = api + '/project/milestone/' + milestoneID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/roadblock/{roadblockId}', function (done) {
        options.url = api + '/project/roadblock/' + roadblockID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

    test.it('DELETE v1.2/project/{projectId}', function (done) {
        options.url = api + '/project/' + projectID;
        options.body = null;
        request.del(options, function (error, response, body) {
            validate(error, response, body);
            done();
        });
    });

});
