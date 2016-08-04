/*
* Utils holds a bunch of functions that will be used across the application to perform common tasks.
*
* _base is the constructor that will hold utility functions and information
* that will be used across the application
*
* Request: the requests function executes an xhr with a given url and set of options, it returns a function
* that receives two arguments, if given, those functions will be executed upon success
* or failure of the request with the responseText or full response acordingly */
var Utils;
(function () {
    console.debug('initializing Utils');
    function _base() {}
    _base.prototype.request = request;
    _base.prototype.transformResponse = transformResponse;

    function request(url, options) {
        var result,
            self = {};
        options = options || {};
        if (!url || typeof url !== 'string') {
            throw 'Tried making an xhr with no url';
        }
        result = {
            then: function (success, fail) {
                self.success = success;
                self.fail = fail;
            }
        };
        if (options.fake) {
            setTimeout(function () {
                if (typeof self.success === 'function') {
                    self.success(self.sample || {});
                }
            });
            return result;
        }
        var args = Array.prototype.slice.call(arguments);
        var xhr = new XMLHttpRequest();
        xhr.open((options.method || 'GET'), url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (typeof self.success === 'function') {
                        self.success(transformResponse(xhr.responseText));
                    }
                }
                if (typeof self.fail === 'function') {
                    self.fail(xhr);
                }
            } else {
                if (typeof self.fail === 'function') {
                    self.fail(xhr);
                }
            }
        };
        xhr.send();
        return result;
    }

    function transformResponse(responseText) {
        var result;
        if (typeof responseText === 'object') {
            return responseText;
        }
        if (typeof responseText === 'string') {
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return;
            }
        }
    }

    Utils = new _base();
})();

