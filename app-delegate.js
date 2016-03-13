var Montage = require("montage/core/core").Montage;

//var Montage = require("montage").Montage;

exports.AppDelegate = Montage.specialize({
    willFinishLoading: {
        value: function (app) {
            // can assign any property to app with any name
            app.config = {
                // Define app-wide global config var here
                // e.g. DEBUG_MODE, etc.
                //RESTAPI_HOST: 'http://localhost:8080',
                RESTAPI_HOST: 'http://c0ac24c2.ngrok.io',
                RESTAPI_PATH: 'api'
            };
        }
    }
});
