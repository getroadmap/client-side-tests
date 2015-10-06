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

});
