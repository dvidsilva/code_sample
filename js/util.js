var Utils;
(function () {
    console.debug('initializing Utils');
    /* _base is the constructor that will hold utility functions and information
     * that will be used across the application */
    function _base() {}

    /* the requests function executes an xhr with a given url and set of options, it returns a function
     * that receives two arguments, if given, those functions will be executed upon success 
     * or failure of the request */
    _base.prototype.request = function (url, options) {
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
                        self.success(xhr.responseText);
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
    };

    Utils = new _base();
})();
