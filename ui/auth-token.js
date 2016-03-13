var Montage = require("montage").Montage;

exports.AuthToken = Montage.specialize({

    getToken: {
        value: function () {
            return window.localStorage.getItem('token');
        }
    },

    setToken: {
        value: function (token) {
            if (token)
                window.localStorage.setItem('token', token);
            else
                window.localStorage.removeItem('token');
        }
    }
});


