function loadScript(url, callback) {
    var maxTimeout, ieTimeout, iePoller, script = document.createElement('script');
    script.onload = function() {
        script.onload = function() {};
        script.parentNode.removeChild(script);
        window.clearTimeout(maxTimeout);
        window.clearTimeout(ieTimeout);
        callback();
    };
    script.src = url;
    document.body.appendChild(script);
    iePoller = function() {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onload();
        } else {
            ieTimeout = window.setTimeout(iePoller, 10);
        }
    };
    iePoller();
    maxTimeout = window.setTimeout(function() {
        throw new Error('Failed to load script: ' + url);
    }, 4000);
}

function loadScoreModule(module, callback) {
    var url;
    if (testConf[module] === 'local') {
        url = '../' + module + '.js';
    } else if (testConf[module]) {
        url = 'https://cdn.rawgit.com/score-framework/js.' + module + '/' + testConf[module] + '/' + module + '.js';
    } else {
        url = 'https://cdn.rawgit.com/score-framework/js.' + module + '/master/' + module + '.js';
    }
    loadScript(url + '?_=' + new Date().getTime(), callback);
}

function loadScoreModules(modules, callback) {
    if (!modules.length) {
        callback();
        return;
    }
    var collectedCount = 0;
    var collect = function() {
        if (++collectedCount >= modules.length) {
            callback();
        }
    };
    for (var i = 0; i < modules.length; i++) {
        loadScoreModule(modules[i], collect);
    }
}

function loadScore(modules, callback) {
    if (typeof modules === 'function') {
        callback = modules;
        modules = [];
    } else if (!modules) {
        modules = [];
    }
    loadScoreModule('init', function() {
        loadScoreModules(modules, function() {
            callback(score.noConflict());
        });
    });
}

function loadScoreWithRequireJs(modules, callback) {
    if (typeof modules === 'function') {
        callback = modules;
        modules = [];
    } else if (!modules) {
        modules = [];
    }
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.js', function() {
        modules.splice(0, 0, 'init');
        require.config({baseUrl: "../"});
        require(modules, function(score) {
            require = undefined;
            requirejs = undefined;
            define = undefined;
            callback(score);
        });
    });
}
