var Component = require("montage/ui/component").Component;
var $ = require("jquery");

exports.Signup = Component.specialize({

    email: {value: null},

    password: {value: null},

    error: {value: null},

    success: {value: null},

    isAdmin: {value: false},

    updateRouteInMainTemplate: {
        value: function (path) {
            this._parentComponent._parentComponent._parentComponent.templateObjects.router.updatePath(path);
        }
    },

    handleButtonHomeAction: {

        value: function (ev) {
            this.updateRouteInMainTemplate('home');
        }
    },

    handleButtonSignupAction: {

        value: function (ev) {

            var _this = this;

            var appConfig = this.application.config;

            //simple validation
            if (!this.password || !this.email)
                return this.error = "You must enter an e-mail address and password";

            if (this.password !== this.templateObjects.inputRepeat.value)
                return this.error = "Passwords must be the same";

            var name = "/signup";
            var apiFullPath = appConfig.RESTAPI_HOST + '/' + appConfig.RESTAPI_PATH + name;

            credentials = {
                email: this.email,
                password: this.password,
                isAdmin: this.isAdmin
            };

            $.ajax({
                    type: "POST",
                    url: apiFullPath,
                    crossDomain: true,
                    data: credentials,
                    dataType: 'json'
                })
                .done(function (response) {
                    console.log('Success:' + response.message);
                    _this.success = response.message;
                    _this.error = null;
                    _this.updateRouteInMainTemplate('auth/login');
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    errorMsgParsed = $.parseJSON(xhr.responseText).message;
                    console.log(errorMsgParsed); //res.json?
                    _this.error = errorMsgParsed;
                    _this.success = null;
                });
        }
    }
});
