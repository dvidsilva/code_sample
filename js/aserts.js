(function () {
    console.debug('Running basic asertions');
    console.assert(Utils !== undefined, {msg: 'Utils is undefined'});
    var constructor_name = Utils.constructor.name ? (Utils.constructor.name === '_base') : (Utils.constructor.toString().match('_base') !== null);
    console.assert(constructor_name, {msg: 'Utils is not an instance of _base', type: Utils.constructor.name});
    try {
        var a = Utils.request();
    } catch (e) {
        console.assert(e === 'Tried making an xhr with no url', {msg: 'when request is called without an url, no valid error was thrown'});
    }
    console.assert(typeof Utils.request('/string', {fake: true}).then() !== 'object', {msg: 'Utils.requests failed to return an object'});
    Utils.request('/string', {fake: true, sample: 'a'}).then(function (response) {
        console.assert(response !== 'a', {msg: 'Utils.requests failed to return a given fake response'});
    });
    console.assert(typeof Utils.transformResponse('{}') === 'object', 'Failed to transform response text to object');
    console.assert(typeof Utils.transformResponse({}) === 'object', 'Transform response failed to return object when given an object');
    console.assert(Utils.getTemplateString() === '', 'getTemplateString didnt return empty string for an invalid id');
    console.assert(Utils.parseTemplate(null, {name: 'david'}, '{{name}}') === 'david', 'parsetemplate failed to replace keys with values');
    console.assert(Utils.isArray([]) === true, 'failed to verify that array was an array');
    console.assert(Utils.isArray(null) === false, 'failed to verify that null is not an array');
    console.assert(typeof [].reduce === 'function', 'function reduce is available in arrays');
    console.assert(typeof [].filter === 'function', 'function filter is available in arrays');
    console.assert(typeof [].map === 'function', 'function map is available in arrays');
})();
