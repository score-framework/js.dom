var conf = require('./conf.js');

var loaderCache = {};

module.exports = {

    expect: require('expect.js'),

    loadScore: function loadScore(modules, callback) {
        var fs = require('fs'),
            request = require('sync-request'),
            vm = require('vm');
        if (typeof modules === 'function') {
            callback = modules;
            modules = [];
        } else if (!modules) {
            modules = [];
        }
        var loaded = {};
        var customRequire = function(module) {
            if (loaded[module]) {
                return loaded[module];
            }
            var script, url, name = module.substring('score.'.length);
            if (conf[name] === 'local') {
                script = fs.readFileSync(__dirname + '/../' + name.replace('.', '/') + '.js', {encoding: 'UTF-8'});
            } else if (conf[name]) {
                url = 'https://rawgit.com/score-framework/js.' + name + '/' + conf[name] + '/' + name + '.js';
            } else {
                url = 'https://rawgit.com/score-framework/js.' + name + '/master/' + name + '.js';
            }
            if (url) {
                if (!loaderCache[url]) {
                    loaderCache[url] = request('GET', url).getBody('utf8');
                }
                script = loaderCache[url];
            }
            var sandbox = vm.createContext({require: customRequire, module: {exports: {}}});
            vm.runInContext(script, sandbox, module + '.js');
            loaded[module] = sandbox.module.exports;
            return loaded[module];
        };
        var score = customRequire('score.init');
        for (var i = 0; i < modules.length; i++) {
            customRequire('score.' + modules[i]);
        }
        callback(score);
    }

};
