var Component = require("montage/ui/component").Component;

var AuthToken = require("ui/auth-token"); //через template, как роутер

    //var reqwest = require("reqwest");

    //var axios = require("axios");
    //axios.defaults.baseUrl = this.application.config.RESTAPI_HOST + '/' + this.application.config.RESTAPI_PATH;
    //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //var querystring = require("querystring");

    //var request = require("request"); //depedencies error

var $ = require("jquery");

exports.Login = Component.specialize({

    email: {value: null},

    password: {value: null},

    error: {value: null},

    success: {value: null},

    signup: {value: true}, //signup flag

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

    handleButtonLoginAction: {

        value: function (ev) {

            var _this = this,
                appConfig = this.application.config,
                name = "/login";

            //simple validation
            if (!this.password || !this.email)
                return this.error = "You must enter an e-mail address and password";

            var apiFullPath = appConfig.RESTAPI_HOST+'/'+ appConfig.RESTAPI_PATH + name;

            //https://groups.google.com/forum/#!topic/montagejs/ufRnz_EOHVk
            //no error messages: https://github.com/montagejs/montage/issues
            //reqwest({
            //    url: apiFullPath
            //    , method: 'post'
            //    , contentType: 'application/x-www-form-urlencoded'
            //    , crossOrigin: true
            //    , data: [{name: 'email', value: this.email}, {name: 'password', value: this.password}]
            //    , success: function (resp) {
            //        console.log(resp.token);
            //    }
            //    , error: function (resp, message) {
            //        var err = {};
            //        console.log('Status:' + err.status +' Data: '+err.data);
            //    }
            //});


            //http://stackoverflow.com/questions/31756756/axios-http-client-how-to-construct-http-post-url-with-form-params
            //axios({
            //            url: apiFullPath,
            //            method: 'post',
            //            data: credentials,
            //            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            //            //headers: {'Content-Type': 'application/json'}
            //})
            //    .then(function (response) {
            //        console.log(response);
            //    })
            //    .catch(function (response) {
            //        if (response instanceof Error) {
            //            // Something happened in setting up the request that triggered an Error
            //            console.log('Error', response.message);
            //        } else {
            //            // The request was made, but the server responded with a status code
            //            // that falls out of the range of 2xx
            //            console.log(response.data);
            //            console.log(response.status);
            //            console.log(response.headers);
            //            console.log(response.config);
            //        }
            //    });

            credentials ={
                email: this.email,
                password: this.password
            };

            $.ajax({
                    type: "POST",
                    url: apiFullPath,
                    crossDomain: true,
                    data: credentials,
                    dataType: 'json'
                })
                .done(function (response) {
                    console.log('Success:' +response.message);

                    //if get token  - then store it
                    if (response.token) {
                        window.localStorage.setItem('token', response.token);
                        //TODO use any library like Angular satellizer to support defaul header (axios?)
                        //$.ajaxSetup(
                        //    {
                        //        headers: {
                        //            'x-access-token' : response.token
                        //        }
                        //    }
                        //);
                        _this.success = response.message;
                        _this.error = null;
                        _this.updateRouteInMainTemplate('users');
                    } else {
                        _this.success = null ;
                        _this.error = response.message;
                    }
                    //this.templateObjects.AuthToken.setToken(response.token);

                })
                .fail(function (xhr, textStatus, errorThrown) {
                    //console.log(xhr.responseText.message);
                    errorMsgParsed = $.parseJSON(xhr.responseText).message;
                    console.log(errorMsgParsed); //res.json?
                    _this.error = errorMsgParsed ;
                    _this.success = null;
                });
        }
    },

    handleButtonUsersAction: {

        value: function (ev) {
            //what is the way of component sharing? or best way of routing?
            this.updateRouteInMainTemplate('users');
        }
    }
});
