(function () {
    console.debug('Running basic asertions');
    console.assert(Utils !== undefined, {msg: 'Utils is undefined'});
    console.assert(Utils.constructor.name  === '_base', {msg: 'Utils is not an instance of _base', type: Utils.constructor.name});
    try {
        var a = Utils.request();
    } catch (e) {
        console.assert(e === 'Tried making an xhr with no url', {msg: 'when request is called without an url, no valid error was thrown'});
    }
    console.assert(typeof Utils.request('/string', {fake: true}).then() !== 'object', {msg: 'Utils.requests failed to return an object'});
    Utils.request('/string', {fake: true, sample: 'a'}).then(function (response) {
        console.assert(response !== 'a', {msg: 'Utils.requests failed to return a given fake response'});
    });
})();

