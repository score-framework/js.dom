if (typeof loadScore === 'undefined') {

    var loadScore = function loadScore(modules, callback) {
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
            if (testConf[name] === 'local') {
                script = fs.readFileSync(__dirname + '/../' + name.replace('.', '/') + '.js', {encoding: 'UTF-8'});
            } else if (testConf[name]) {
                url = 'https://raw.githubusercontent.com/score-framework/js.' + name + '/' + testConf[name] + '/' + name + '.js';
            } else {
                url = 'https://raw.githubusercontent.com/score-framework/js.' + name + '/master/' + name + '.js';
            }
            if (url) {
                if (!loadScore.cache[url]) {
                    loadScore.cache[url] = request('GET', url).getBody('utf8');
                }
                script = loadScore.cache[url];
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
    };

    loadScore.cache = {};

    var expect = require('expect.js');
}

var testConf = {
    'dom': 'local'
};

describe('score.dom', function() {

    describe('module', function() {

        it('should add the score.dom function', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.dom).to.be(undefined);
                loadScore(['dom'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.dom).to.be.a('function');
                    done();
                });
            });
        });

    });

    describe('#empty', function() {

        it('should return true for an empty object', function(done) {
            loadScore(['dom'], function(score) {
                expect(score.dom().empty()).to.be(true);
                done();
            });
        });

        it("should return false when selecting '#fixture'", function(done) {
            loadScore(['dom'], function(score) {
                expect(score.dom('#fixture').empty()).to.be(false);
                done();
            });
        });

    });

    describe('#fromString', function() {

        it("should create a an empty score.dom object from empty string", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString();
                expect(div.length).to.be(0);
                done();
            });
        });

        it("should create a new score.dom object from string", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div>');
                expect(div.length).to.be(1);
                expect(div[0].nodeName).to.be('DIV');
                expect(div[0].className).to.be('foo');
                expect(div[0].children.length).to.be(0);
                expect(div.children().empty()).to.be(true);
                done();
            });
        });

        it("should be able to create multiple nodes", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div><div class="bar"></div>');
                expect(div.length).to.be(2);
                expect(div[0].nodeName).to.be('DIV');
                expect(div[0].className).to.be('foo');
                expect(div[0].children.length).to.be(0);
                expect(div.children().empty()).to.be(true);
                expect(div[1].nodeName).to.be('DIV');
                expect(div[1].className).to.be('bar');
                expect(div[1].children.length).to.be(0);
                done();
            });
        });

        it("should create detached nodes", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div>');
                expect(div[0].parentNode).to.be(null);
                done();
            });
        });

        it("should not attach the newly created nodes into the DOM at any time", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<script>alert("Test failed!");</script>');
                done();
            });
        });

    });

    describe('#append', function() {

        it("should append given node to *first* node", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div><div class="bar"></div>');
                expect(div.length).to.be(2);
                expect(div.children().length).to.be(0);
                var span = score.dom.fromString('<span class="bar"></div>');
                expect(span.length).to.be(1);
                expect(span.children().length).to.be(0);
                div.append(span);
                expect(div.children().length).to.be(1);
                expect(div.eq(0).length).to.be(1);
                expect(div.eq(0).children().length).to.be(1);
                expect(div.eq(1).children().length).to.be(0);
                done();
            });
        });

        it("should add *all* given nodes to the first node", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div>');
                expect(div.length).to.be(1);
                expect(div.children().length).to.be(0);
                for (var i = 0; i < 10; i++) {
                    var span = score.dom.fromString('<span class="bar_' + i + '"></div>');
                    expect(span.length).to.be(1);
                    expect(span.children().length).to.be(0);
                    div.append(span);
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(i + 1);
                    expect(div.children()[0].className).to.be('bar_0');
                    expect(div.children()[i].className).to.be('bar_' + i);
                }
                done();
            });
        });

        it("should add *after* existing nodes", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"><span class="bar_0"></span></div>');
                expect(div.length).to.be(1);
                expect(div.children().length).to.be(1);
                var span = score.dom.fromString('<span class="bar_1"></div>');
                div.append(span);
                expect(div.length).to.be(1);
                expect(div.children().length).to.be(2);
                expect(div.children()[0].className).to.be('bar_0');
                expect(div.children()[1].className).to.be('bar_1');
                done();
            });
        });

    });

    describe('#prepend', function() {

        it("should prepend given node to *first* node", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div><div class="bar"></div>');
                expect(div.length).to.be(2);
                expect(div.children().length).to.be(0);
                var span = score.dom.fromString('<span class="bar"></div>');
                expect(span.length).to.be(1);
                expect(span.children().length).to.be(0);
                div.prepend(span);
                expect(div.children().length).to.be(1);
                expect(div.eq(0).length).to.be(1);
                expect(div.eq(0).children().length).to.be(1);
                expect(div.eq(1).children().length).to.be(0);
                done();
            });
        });

        it("should add *all* given nodes to the first node", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"></div>');
                expect(div.length).to.be(1);
                expect(div.children().length).to.be(0);
                for (var i = 0; i < 10; i++) {
                    var span = score.dom.fromString('<span class="bar_' + i + '"></div>');
                    expect(span.length).to.be(1);
                    expect(span.children().length).to.be(0);
                    div.prepend(span);
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(i + 1);
                    expect(div.children()[0].className).to.be('bar_' + i);
                    expect(div.children()[i].className).to.be('bar_0');
                }
                done();
            });
        });

        it("should add *before* existing nodes", function(done) {
            loadScore(['dom'], function(score) {
                var div = score.dom.fromString('<div class="foo"><span class="bar_0"></span></div>');
                expect(div.length).to.be(1);
                expect(div.children().length).to.be(1);
                var span = score.dom.fromString('<span class="bar_1"></div>');
                div.prepend(span);
                expect(div.length).to.be(1);
                expect(div.children().length).to.be(2);
                expect(div.children()[0].className).to.be('bar_1');
                expect(div.children()[1].className).to.be('bar_0');
                done();
            });
        });

    });

    describe('class manipulation', function() {

        it('should detect that the "#fixture" tag has no `foo` class', function(done) {
            loadScore(['dom'], function(score) {
                var fixture = score.dom('#fixture');
                expect(fixture.hasClass('foo')).to.be(false);
                done();
            });
        });

        it('should be able to add and remove a class to the "#fixture" tag', function(done) {
            loadScore(['dom'], function(score) {
                var fixture = score.dom('#fixture');
                expect(fixture.hasClass('foo')).to.be(false);
                expect(fixture.addClass('foo')).to.be(fixture);
                expect(fixture.hasClass('foo')).to.be(true);
                expect(fixture.removeClass('foo')).to.be(fixture);
                expect(fixture.hasClass('foo')).to.be(false);
                done();
            });
        });

    });

});

