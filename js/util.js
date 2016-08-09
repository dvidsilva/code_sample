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
    var template_cache = {};
    _base.prototype.request = request;
    _base.prototype.transformResponse = transformResponse;
    _base.prototype.getTemplateString = getTemplateString;
    _base.prototype.parseTemplate = parseTemplate;
    _base.prototype.isArray = isArray;

    function request(url, options) {
        var result,
            xhr,
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
        xhr = new XMLHttpRequest();
        xhr.open((options.method || 'GET'), url, true);
        if (options.headers && isArray(options.headers)) {
            for (var i = 0; i < options.headers.length; i++) {
                xhr.setRequestHeader(options.headers[i].name, options.headers[i].val);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (typeof self.success === 'function') {
                        return self.success(transformResponse(xhr.responseText));
                    }
                } else if (typeof self.fail === 'function') {
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

    function getTemplateString(_id) {
        var elem, temp_str;
        if (template_cache[_id] !== undefined) {
            return template_cache[_id];
        }
        elem = document.getElementById(_id);
        temp_str = elem !== null ? elem.innerHTML: '';
        template_cache[_id] = temp_str;
        return temp_str;
    }

    function parseTemplate(_id, content, str) {
        var template_string = _id ? getTemplateString(_id) : (str ? str : '');
        template_string = template_string.replace(/{{(\w+)}}/g, function(_,k){
          return content[k];
        });
        return template_string;
    }

    function isArray(arr) {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(arr);
        }
        return '' + arr !== arr && {}.toString.call(arr) === '[object Array]';
    }

    if (!Array.prototype.reduce) {
      Array.prototype.reduce = function(callback) {
        'use strict';
        if (this == null) {
          throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
          throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length == 2) {
          value = arguments[1];
        } else {
          while (k < len && !(k in t)) {
            k++;
          }
          if (k >= len) {
            throw new TypeError('Reduce of empty array with no initial value');
          }
          value = t[k++];
        }
        for (; k < len; k++) {
          if (k in t) {
            value = callback(value, t[k], k, t);
          }
        }
        return value;
      };
    }

    if (!Array.prototype.filter) {
      Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';
        if (this === void 0 || this === null) {
          throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
          throw new TypeError();
        }
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
          if (i in t) {
            var val = t[i];
            if (fun.call(thisArg, val, i, t)) {
              res.push(val);
            }
          }
        }
        return res;
      };
    }

    Utils = new _base();
})();
