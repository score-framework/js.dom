/* global loadScore:true, expect:true, describe, it, before, after, HTMLDivElement */

if (typeof loadScore == 'undefined') {
    var tmp = require('./node.js');
    loadScore = tmp.loadScore;
    expect = tmp.expect;
}

describe('score.dom', function() {

    describe('module', function() {

        it('should add the score.dom function', function(done) {
            loadScore(function(score) {
                try {
                    expect(score).to.be.an('object');
                    expect(score.dom).to.be(undefined);
                    loadScore(['dom'], function(score) {
                        try {
                            expect(score).to.be.an('object');
                            expect(score.dom).to.be.a('function');
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('constructor', function() {

        it('should accept selector', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixtureDOMNode = document.getElementById('fixture');
                    var fixture = score.dom('#fixture');
                    expect(fixture.length).to.be(1);
                    expect(fixture[0]).to.be(fixtureDOMNode);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept DOMNodes', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixtureDOMNode = document.getElementById('fixture');
                    var fixture = score.dom(fixtureDOMNode);
                    expect(fixture.length).to.be(1);
                    expect(fixture[0]).to.be(fixtureDOMNode);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept Array', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var arr = Array.apply(null, document.querySelectorAll('#fixture')).slice();
                    expect(score.dom(arr).length).to.be(1);
                    expect(score.dom(arr)[0]).to.be(document.querySelectorAll('#fixture')[0]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should accept NodeList', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodelist = document.querySelectorAll('#fixture');
                    expect(score.dom(nodelist).length).to.be(1);
                    expect(score.dom(nodelist)[0]).to.be(document.querySelectorAll('#fixture')[0]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#toArray', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'lvl2';
                fixture.appendChild(div);
                for (var j = 0; j < 5; j++) {
                    var span = document.createElement('span');
                    span.className = 'lvl3';
                    div.appendChild(span);
                }
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it('should not return a score.dom object', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom('#fixture *');
                    expect(Object.getPrototypeOf(nodes.toArray())).not.to.be(score.dom.proto);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should return an Array', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom('#fixture *');
                    expect(Object.getPrototypeOf(nodes.toArray())).to.be(Array.prototype);
                    expect(Array.isArray(nodes.toArray())).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should not mutate content', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom('#fixture *');
                    var arr = nodes.toArray();
                    expect(nodes.length).to.be(arr.length);
                    arr.forEach(function(v, i) {
                        expect(v).to.be(nodes[i]);
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#concat', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'lvl2';
                fixture.appendChild(div);
                for (var j = 0; j < 5; j++) {
                    var span = document.createElement('span');
                    span.className = 'lvl3';
                    div.appendChild(span);
                }
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it('should return score.dom Objects', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var a = score.dom('.lvl2');
                    var b = score.dom('.lvl3');
                    var result = a.concat(b);
                    expect(Object.getPrototypeOf(result)).to.be(score.dom.proto);
                    expect(a.length + b.length).to.be(result.length);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should concat contents of two score.dom Objects', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var a = score.dom('.lvl2');
                    var b = score.dom('.lvl3');
                    var result = a.concat(b);
                    expect(a.length + b.length).to.be(result.length);
                    for (var i = 0; i < result.length; i++) {
                        if (i < a.length) {
                            expect(result[i]).to.be(a[i]);
                        } else {
                            expect(result[i]).to.be(b[i - a.length]);
                        }
                    }
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should concat score.dom Objects, Arrays, NodeLists, selectors', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    [
                        score.dom('.lvl3'),
                        score.dom('.lvl3').toArray(),
                        document.getElementsByClassName('lvl3'),
                        '.lvl3'
                    ].forEach(function(b) {
                        var a = score.dom('.lvl2');
                        var refB = score.dom('.lvl3');
                        var result = a.concat(b);
                        expect(a.length + refB.length).to.be(result.length);
                        for (var i = 0; i < result.length; i++) {
                            if (i < a.length) {
                                expect(result[i]).to.be(a[i]);
                            } else {
                                expect(result[i]).to.be(refB[i - a.length]);
                            }
                        }
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#eq', function() {

        it('should return a score.dom object', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom.create('span');
                    expect(nodes.length).to.be(1);
                    var node = nodes.eq(0);
                    expect(node).to.be.an('object');
                    expect(Object.getPrototypeOf(node)).to.be(score.dom.proto);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should throw an error if index is out of range', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom.fromString('<span class="foo"></span><span class="bar"></span>');
                    expect(nodes.length).to.be(2);
                    nodes.eq(0);  // should not throw
                    nodes.eq(1);  // should not throw
                    expect(function() { nodes.eq(2); }).to.throwError();
                    expect(function() { nodes.eq(3); }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should throw an error if index is negative', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom.fromString('<span class="foo"></span><span class="bar"></span>');
                    expect(nodes.length).to.be(2);
                    expect(function() { nodes.eq(-1); }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#DOMNode', function() {

        it("should return a DOM node", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"></div>');
                    expect(div.DOMNode).to.be.a(HTMLDivElement);
                    expect(div.DOMNode).to.be(div[0]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should be a single node operation", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var _ = null;
                    expect(function() { _ = score.dom().DOMNode; }).to.throwError();
                    expect(_).to.be(null);
                    var div = score.dom.fromString('<div class="foo"></div><div class="bar"></div>');
                    expect(function() { _ = div.DOMNode; }).to.throwError();
                    expect(_).to.be(null);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#uniq', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'lvl2';
                fixture.appendChild(div);
                for (var j = 0; j < 5; j++) {
                    var span = document.createElement('span');
                    span.className = 'lvl3';
                    div.appendChild(span);
                }
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it('should return a score.dom object', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var lvl3 = score.dom('#fixture').find('.lvl3');
                    expect(lvl3.uniq).to.be.a('function');
                    expect(lvl3.uniq()).to.be.an('object');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should keep non-duplicates intact and in order', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var lvl3 = score.dom('#fixture').find('.lvl3');
                    expect(lvl3.uniq).to.be.a('function');
                    var uniq = lvl3.uniq();
                    expect(uniq.length).to.be(lvl3.length);
                    for (var i = 0; i < lvl3.length; i++) {
                        expect(uniq[i]).to.be(lvl3[i]);
                    }
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should remove duplicate DOM nodes from list', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var lvl3 = score.dom('#fixture').find('.lvl3');
                    expect(lvl3.length).to.be(25);
                    var parents = lvl3.parent();
                    expect(parents.length).to.be(25);
                    expect(parents.uniq().length).to.be(5);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#parent', function() {

        it('should provide a node\'s parent', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var node = score.dom.create('div');
                    score.dom('#fixture').append(node);
                    var parents = node.parent();
                    expect(Object.getPrototypeOf(parents)).to.be(score.dom.proto);
                    expect(parents.length).to.be(1);
                    expect(parents[0]).to.be(document.getElementById('fixture'));
                    node.detach();
                    done();
                } catch (e) {
                    node.detach();
                    done(e);
                }
            });
        });

        it('should provide all nodes\' parents', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom('#fixture')
                        .append(score.dom.create('div'))
                        .append(score.dom.create('div'))
                        .children();
                    var parents = nodes.parent();
                    expect(Object.getPrototypeOf(parents)).to.be(score.dom.proto);
                    expect(parents.length).to.be(2);
                    expect(parents[0]).to.be(parents[1]);
                    nodes.detach();
                    done();
                } catch (e) {
                    nodes.detach();
                    done(e);
                }
            });
        });

        it('should throw an error on detached nodes', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var node = score.dom.create('div');
                    expect(function() { node.parent(); }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should throw an error even if one node is detached', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var node1 = score.dom.create('div');
                    var node2 = score.dom.create('div');
                    var nodes = score.dom([node1.DOMNode, node2.DOMNode]);
                    score.dom('#fixture').append(node1);
                    expect(function() { nodes.parent(); }).to.throwError();
                    score.dom('#fixture').append(node2);
                    nodes.parent();  // should not throw
                    node1.detach();
                    node2.detach();
                    done();
                } catch (e) {
                    if (node1.DOMNode.parentNode) {
                        node1.detach();
                    }
                    if (node2.DOMNode.parentNode) {
                        node2.detach();
                    }
                    done(e);
                }
            });
        });

    });

    describe('#empty', function() {

        it('should return true for an empty object', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    expect(score.dom().empty()).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should return false when selecting '#fixture'", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    expect(score.dom('#fixture').empty()).to.be(false);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should return true when selecting children of '#fixture'", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    expect(score.dom('#fixture').children().empty()).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#assertOne', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'div' + i;
                fixture.appendChild(div);
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it('should return a score.dom object', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div1 = score.dom('#fixture').find('.div1');
                    expect(div1.assertOne).to.be.a('function');
                    expect(div1.assertOne()).to.be.an('object');
                    expect(div1.assertOne()).to.be(div1);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should only return an object with a length of 1', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div1 = score.dom('#fixture').find('.div1');
                    expect(div1.assertOne().length).to.be(1);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should throw errors on multiple or no results', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var nodes = fixture.find('div');
                    var empty = fixture.find('.foobar');
                    expect(function() { nodes.assertOne(); }).to.throwError();
                    expect(empty.empty()).to.be(true);
                    expect(function() { empty.assertOne(); }).to.throwError();
                    expect(function() { fixture.findOne('div'); }).to.throwError();
                    expect(function() { fixture.findOne('.foobar'); }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#find', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'lvl2';
                fixture.appendChild(div);
                for (var j = 0; j < 5; j++) {
                    var span = document.createElement('span');
                    span.className = 'lvl3';
                    div.appendChild(span);
                }
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it('should operate on all nodes', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var lvl2 = score.dom('#fixture').find('.lvl2');
                    var lvl3 = score.dom('#fixture').find('.lvl3');
                    expect(lvl3.length).to.be(25);
                    expect(lvl2.find('.lvl3').length).to.be(lvl3.length);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#closest', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            var lvl2 = document.createElement('div');
            lvl2.id = 'lvl2';
            fixture.appendChild(lvl2);
            var lvl3 = document.createElement('div');
            lvl3.id = 'lvl3';
            lvl2.appendChild(lvl3);
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it('should operate on all nodes', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var lvl3 = score.dom('#lvl3');
                    var lvl2 = score.dom('#lvl2');
                    expect(lvl3.closest("div").DOMNode).to.be(lvl2.DOMNode);
                    expect(lvl2.closest("div").DOMNode).to.be(fixture.DOMNode);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should return empty score.dom object if selector does not match', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var lvl3 = score.dom('#lvl3');
                    expect(lvl3.closest("#NOTINDOM").empty()).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#fromString', function() {

        it("should create a an empty score.dom object from empty string", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString();
                    expect(div.length).to.be(0);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should create a new score.dom object from string", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"></div>');
                    expect(div.length).to.be(1);
                    expect(div[0].nodeName).to.be('DIV');
                    expect(div[0].className).to.be('foo');
                    expect(div[0].children.length).to.be(0);
                    expect(div.children().empty()).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should be able to create multiple nodes", function(done) {
            loadScore(['dom'], function(score) {
                try {
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
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should create detached nodes", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"></div>');
                    expect(div[0].parentNode).to.be(null);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should not attach the newly created nodes into the DOM at any time", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    score.dom.fromString('<script>alert("Test failed!");</script>');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#append', function() {

        it("should append given node to *first* node", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"></div><div class="bar"></div>');
                    expect(div.length).to.be(2);
                    expect(div.children().length).to.be(0);
                    var span = score.dom.fromString('<span class="bar"></div>');
                    expect(span.length).to.be(1);
                    expect(span.children().length).to.be(0);
                    div.first.append(span);
                    expect(div.children().length).to.be(1);
                    expect(div.eq(0).length).to.be(1);
                    expect(div.eq(0).children().length).to.be(1);
                    expect(div.eq(1).children().length).to.be(0);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should add *all* given nodes to the first node", function(done) {
            loadScore(['dom'], function(score) {
                try {
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
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should add *after* existing nodes", function(done) {
            loadScore(['dom'], function(score) {
                try {
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
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should bail on invalid pivot", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"><span class="bar_0"><span class="bar_0_0"></span></span></div>');
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(1);
                    expect(div.children().children().length).to.be(1);
                    var span = score.dom.fromString('<span class="bar_1"></div>');
                    expect(function() { div.append(span, div); }).to.throwError();
                    expect(function() { div.append(span, 1); }).to.throwError();
                    expect(function() { div.append(span, div.find('.bar_0_0')); }).to.throwError();
                    expect(function() { div.append(span, div.find('.doesnt-exist')); }).to.throwError();
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(1);
                    expect(div.children().children().length).to.be(1);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should insert at correct position when pivot is provided", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"><span class="bar_0"></span><span class="bar_2"></span></div>');
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(2);
                    var span = score.dom.fromString('<span class="bar_1"></div>');
                    div.append(span, div.children()[0]);
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(3);
                    expect(div.children()[1]).to.be(span[0]);
                    div.append(span, div.children()[2]);
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(3);
                    expect(div.children()[2]).to.be(span[0]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#forEach', function() {

        it("should return score.dom objects in callback", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo-0"></div><div class="foo-1"></div>');
                    expect(div.length).to.be(2);
                    div.forEach(function(node, index) {
                        expect(node).to.be(score.dom(node));
                        expect(node.attr('class')).to.be('foo-' + index);
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should loop score.dom child objects and keep a separate index on inner loops", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo-0"><div class="foo-0-0"></div></div><div class="foo-1"></div>');
                    expect(div.length).to.be(2);
                    div.forEach(function(node, index) {
                        node.children().forEach(function(childNode, childIndex) {
                            expect(childNode).to.be(score.dom(childNode));
                            expect(childNode.attr('class')).to.be('foo-' + index + '-' + childIndex);
                        });
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#filter', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'div' + i;
                fixture.appendChild(div);
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });


        it("should return score.dom objects in callback", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo-0"></div><div class="foo-1"></div>');
                    expect(div.length).to.be(2);
                    div.filter(function(node, index) {
                        expect(node).to.be(score.dom(node));
                        expect(node.attr('class')).to.be('foo-' + index);
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should filter as native function", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var nodes = fixture.find('div');
                    var filteredNodes = score.dom(Array.apply(null, nodes).filter(function(DOMNode) {
                        return DOMNode.className === 'div1' || 
                            DOMNode.className === 'div2';
                    }));
                    expect(nodes.filter(function(node) {
                        return node.DOMNode.className === 'div1' || 
                            node.DOMNode.className === 'div2';
                    })).to.be.eql(filteredNodes);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should accept selector instead of function", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var nodes = fixture.find('div');
                    var div1 = fixture.find('.div1');
                    expect(nodes.filter('.div1').DOMNode).to.be(div1.DOMNode);
                    expect(nodes.filter('.div1, .div2').length).to.be(2);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should apply selector properly", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var nodes = fixture.find('div');
                    expect(nodes.filter('.div1, .div2').matches('.div1, .div2')).to.be(true);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#map', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'div' + i;
                fixture.appendChild(div);
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });


        it("should return score.dom objects in callback", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo-0"></div><div class="foo-1"></div>');
                    expect(div.length).to.be(2);
                    div.map(function(node, index) {
                        expect(node).to.be(score.dom(node));
                        expect(node.attr('class')).to.be('foo-' + index);
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should map as native function", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var nodes = fixture.find('div');
                    var list = Array.apply(null, nodes).map(function(DOMNode) {
                        return DOMNode.className;
                    });
                    expect(nodes.map(function(node) {
                        return node.DOMNode.className;
                    })).to.be.eql(list);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#reduce', function() {

        before(function() {
            var fixture = document.getElementById('fixture');
            for (var i = 0; i < 5; i++) {
                var div = document.createElement('div');
                div.className = 'div' + i;
                fixture.appendChild(div);
            }
        });

        after(function() {
            var fixture = document.getElementById('fixture');
            while (fixture.children.length) {
                fixture.removeChild(fixture.children[0]);
            }
        });

        it("should return score.dom objects in callback", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo-0"></div><div class="foo-1"></div>');
                    expect(div.length).to.be(2);
                    div.reduce(function(nodeA, nodeB) {
                        expect(nodeA).to.be(score.dom(nodeA));
                        expect(nodeB).to.be(score.dom(nodeB));
                        return nodeA;
                    }, score.dom());
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should reduce as native function", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    var nodes = fixture.find('div');
                    var str = Array.apply(null, nodes).reduce(function(s, DOMNode) {
                        return s + DOMNode.className;
                    }, "");
                    expect(nodes.reduce(function(s, node) {
                        return s + node.DOMNode.className;
                    }, "")).to.be(str);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('#prepend', function() {

        it("should prepend given node to *first* node", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"></div><div class="bar"></div>');
                    expect(div.length).to.be(2);
                    expect(div.children().length).to.be(0);
                    var span = score.dom.fromString('<span class="bar"></div>');
                    expect(span.length).to.be(1);
                    expect(span.children().length).to.be(0);
                    div.first.prepend(span);
                    expect(div.children().length).to.be(1);
                    expect(div.eq(0).length).to.be(1);
                    expect(div.eq(0).children().length).to.be(1);
                    expect(div.eq(1).children().length).to.be(0);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should add *all* given nodes to the first node", function(done) {
            loadScore(['dom'], function(score) {
                try {
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
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should add *before* existing nodes", function(done) {
            loadScore(['dom'], function(score) {
                try {
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
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should bail on invalid pivot", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"><span class="bar_0"><span class="bar_0_0"></span></span></div>');
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(1);
                    expect(div.children().children().length).to.be(1);
                    var span = score.dom.fromString('<span class="bar_1"></div>');
                    expect(function() { div.prepend(span, div); }).to.throwError();
                    expect(function() { div.prepend(span, 1); }).to.throwError();
                    expect(function() { div.prepend(span, div.find('.bar_0_0')); }).to.throwError();
                    expect(function() { div.prepend(span, div.find('.doesnt-exist')); }).to.throwError();
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(1);
                    expect(div.children().children().length).to.be(1);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it("should insert at correct position when pivot is provided", function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var div = score.dom.fromString('<div class="foo"><span class="bar_0"></span><span class="bar_2"></span></div>');
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(2);
                    var span = score.dom.fromString('<span class="bar_1"></div>');
                    div.prepend(span, div.children()[0]);
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(3);
                    expect(div.children()[0]).to.be(span[0]);
                    div.prepend(span, div.children()[2]);
                    expect(div.length).to.be(1);
                    expect(div.children().length).to.be(3);
                    expect(div.children()[1]).to.be(span[0]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });


    describe('#attr', function() {

        it('should return null if the attribute does not exist', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var node = score.dom.fromString('<span></span>');
                    expect(node.attr('class')).to.be(null);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should return the correct id of "#fixture"', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    expect(fixture.attr('id')).to.be('fixture');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should return throw an exception, if called on multile nodes', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom.fromString('<span class="foo"></span><span class="bar"></span>');
                    expect(function() { nodes.attr('class'); }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should remove attributes if called with value null', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var nodes = score.dom.fromString('<span class="foo"></span><span class="bar"></span>');
                    nodes.attr('class', null);
                    expect(nodes.eq(0).attr('class')).to.be(null);
                    expect(nodes.eq(1).attr('class')).to.be(null);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should throw an Error when operating on an empty node list', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var empty = score.dom();
                    expect(function() { empty.attr('id'); }).to.throwError();
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

    describe('class manipulation', function() {

        it('should detect that the "#fixture" tag has no `foo` class', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    expect(fixture.hasClass('foo')).to.be(false);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should be able to add and remove a class to the "#fixture" tag', function(done) {
            loadScore(['dom'], function(score) {
                try {
                    var fixture = score.dom('#fixture');
                    expect(fixture.hasClass('foo')).to.be(false);
                    expect(fixture.addClass('foo')).to.be(fixture);
                    expect(fixture.hasClass('foo')).to.be(true);
                    expect(fixture.removeClass('foo')).to.be(fixture);
                    expect(fixture.hasClass('foo')).to.be(false);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

    });

});

