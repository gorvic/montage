/**
 * @module ui/users.reel
 */
var Component = require("montage/ui/component").Component;
var $ = require("jquery");
/**
 * @class Users
 * @extends Component
 */
exports.Users = Component.specialize(/** @lends Users# */ {

    error: {value: null},

    success: {value: null},

    users: {
        value: [
            //{email: "HTML", isAdmin: "/r/html5"},
            //{email: "Programming", isAdmin: "/r/programming"},
            //{email: "Coding", isAdmin: "/r/coding"},
            //{email: "Comp Sci", isAdmin: "/r/compsci"},
            //{email: "Web Dev", isAdmin: "/r/webdev"},
            //{email: "Startups", isAdmin: "/r/startups"}
        ]
    },
    constructor: {
        value: function Users() {
            this.super();
        }
    },

    updateRouteInMainTemplate: {
        value: function (path) {
            this._parentComponent._parentComponent.templateObjects.router.updatePath(path);
        }
    },

    handleButtonHomeAction: {

        value: function (ev) {
            this.updateRouteInMainTemplate('home');
        }
    },

    templateDidLoad: {
        value: function () {
            var _this = this;
            _this.showUsers();
        }
    },

    showUsers: {

        value: function (ev) {

            var _this = this,
                appConfig = this.application.config,
                name = "/users";

            var apiFullPath = appConfig.RESTAPI_HOST + '/' + appConfig.RESTAPI_PATH + name;

            var token = window.localStorage.getItem('token');
            if (!token) {
                return this.error = "No token. Log in";
            }

            $.ajax({
                    type: "GET",
                    url: apiFullPath,
                    crossDomain: true,
                    headers: {
                        "x-access-token": token //chrome doesn't send this header without command-line param --disable-web-security
                    },
                    data: {token: token}, //TODO with header
                    dataType: 'json'
                })
                .done(function (response) {
                    console.log('Success:' + response);
                    _this.success = 'We\'ve got ' + response.length + ' users';
                    //if get token  - then store it
                    //this.templateObjects.AuthToken.setToken(response.token);
                    _this.error = null;
                    _this.users = JSON.parse(JSON.stringify(response));
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    //console.log(xhr.responseText.message);
                    var errorMsgParsed ="";
                    if (xhr.responseText) {
                        errorMsgParsed = $.parseJSON(xhr.responseText).message;
                    }
                    console.log(textStatus+ ' '+errorMsgParsed); //res.json?
                    _this.error = errorMsgParsed;
                    _this.success = null;
                });


        }
    }


});
