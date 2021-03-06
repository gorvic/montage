var Montage = require("montage").Montage;


exports.ApiConnector = Montage.specialize({

    constructor: {
        value: function ApiConnector () {
            this.addPathChangeListener("host", this, "_makeRequest");
            this.addPathChangeListener("path", this, "_makeRequest");
            //this.addPathChangeListener("categoryFilter", this, "_makeRequest");
        }
    },

    host: {
        value: null
    },

    path: {
        value: null
    },

    //categoryFilter: {
    //    value: null
    //},

    //posts: {
    //    value: null
    //},

    _latestRequest: {
        value: null
    },

    _makeRequest: {
        value: function() {

            if (!(this.host && this.path)) {
                return;
            }

            var url = "http://" + this.host + this.path,
                self = this,
                request,
                query;

            //if (this.categoryFilter) {
            //    query = {"filter[category_name]": this.categoryFilter};
            //    url += "&" + Reqwest.toQueryString(query);
            //}

            request = this._latestRequest = Reqwest({
                url: url,
                type: "jsonp",
                method: "get",
                jsonpCallback: "_jsonp",
                jsonpCallbackName: "cb"
            })
                .then(function (value) {
                    if (request === self._latestRequest) {
                        self.posts = value;
                    }
                });
        }
    },

}, /** @lends WordpressConnector. */ {

    blueprintModuleId:require("montage")._blueprintModuleIdDescriptor,

    blueprint:require("montage")._blueprintDescriptor

});
