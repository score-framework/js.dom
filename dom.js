/**
 * Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

// Universal Module Loader
// https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/v1.0.0/returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['score.init'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        factory(require('score.init'));
    } else {
        // Browser globals (root is window)
        factory(root.score);
    }
})(this, function(score) {

    score.extend('dom', [], function() {

        var i, j, result, tmp, wrapped, re, existing,

            matches = ['matches', 'webkitMatchesSelector', 'msMatchesSelector'].filter(function(func) {
                return func in document.documentElement;
            })[0],

            dom = function(arg) {
                result = Object.create(dom.proto);
                if (arg) {
                    if (typeof arg == 'object' && Object.getPrototypeOf(arg) == dom.proto) {
                        result = arg;
                    } else if (Array.isArray(arg)) {
                        result.concat(arg);
                    } else if (/\[object (HTMLCollection|NodeList)\]/.test(Object.prototype.toString.call(arg))) {
                        for (i = 0; i < arg.length; i++) {
                            result.push(arg[i]);
                        }
                    } else if (typeof arg == 'object') {
                        result.push(arg);
                    } else {
                        tmp = dom.queryGlobal(arg);
                        for (i = tmp.length - 1; i >= 0; i--) {
                            result.push(tmp[i]);
                        }
                    }
                }
                return result;
            };

        dom.proto = Object.create(Array.prototype, {

            // filtering

            first: {get: function() {
                if (!this.length) {
                    throw new Error('Empty list');
                }
                return score.dom(this[0]);
            }},

            eq: {value: function(index) {
                return score.dom(this[index]);
            }},

            uniq: {value: function(index) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    if (result.indexOf(this[i]) < 0) {
                        result.push(this[i]);
                    }
                }
                return result;
            }},

            // clone

            clone: {value: function(deep) {
                if (typeof deep == 'undefined') {
                    deep = true;
                }
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    result.push(this[i].cloneNode(deep));
                }
                return result;
            }},

            // queries

            matches: {value: function(selector) {
                if (!this.length) {
                    throw new Error('Empty list');
                }
                for (i = 0; i < this.length; i++) {
                    if (!dom.testMatch(this[i], selector)) {
                        return false;
                    }
                }
                return true;
            }},

            empty: {value: function() {
                return !this.length;
            }},

            // iterators

            forEach: {value: function(callback, thisArg) {
                for (i = 0; i < this.length; i++) {
                    callback.call(thisArg, score.dom(this[i]), i, this);
                }
                return this;
            }},

            // DOM traversal

            children: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = this[i].children;
                    for (j = 0; j < tmp.length; j++) {
                        if (!selector || dom.testMatch(tmp[j], selector)) {
                            result.push(tmp[j]);
                        }
                    }
                }
                return result;
            }},

            parent: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = this[i].parentNode;
                    if (!selector || dom.testMatch(tmp, selector)) {
                        result.push(tmp);
                    }
                }
                return result;
            }},

            find: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = dom.queryLocal(this[i], selector);
                    for (j = 0; j < tmp.length; j++) {
                        result.push(tmp[j]);
                    }
                }
                return result;
            }},

            closest: {value: function(selector) {
                result = Object.create(dom.proto);
                for (i = 0; i < this.length; i++) {
                    tmp = this[i].parentNode;
                    while (tmp) {
                        if (dom.testMatch(tmp, selector)) {
                            result.push(tmp);
                            break;
                        }
                        tmp = tmp.parentNode;
                    }
                }
                return result;
            }},

            // node operations

            text: {value: function(value) {
                if (typeof value == 'undefined') {
                    if (!this.length) {
                        throw new Error('Empty list');
                    } else if (this.length > 1) {
                        throw new Error('Attempting Single-Node-Operation on multiple nodes');
                    }
                    return this[0].textContent;
                }
                for (i = 0; i < this.length; i++) {
                    this[i].textContent = value;
                }
                return this;
            }},

            attr: {value: function(attribute, value) {
                if (typeof value == 'undefined') {
                    if (!this.length) {
                        throw new Error('Empty list');
                    } else if (this.length > 1) {
                        throw new Error('Attempting Single-Node-Operation on multiple nodes');
                    }
                    return this[0].getAttribute(attribute);
                }
                if (value === null) {
                    for (i = 0; i < this.length; i++) {
                        this[i].removeAttribute(attribute);
                    }
                } else {
                    for (i = 0; i < this.length; i++) {
                        this[i].setAttribute(attribute, value);
                    }
                }
                return this;
            }},

            // restructuring

            detach: {value: function() {
                for (i = 0; i < this.length; i++) {
                    this[i].parentNode.removeChild(this[i]);
                }
                return this;
            }},

            append: {value: function(value) {
                if (!this.length) {
                    throw new Error('Empty list');
                } else if (this.length > 1) {
                    throw new Error('Attempting Single-Node-Operation on multiple nodes');
                }
                wrapped = score.dom(value);
                for (i = 0; i < wrapped.length; i++) {
                    this[0].appendChild(wrapped[i]);
                }
                return this;
            }},

            prepend: {value: function(value) {
                if (!this.length) {
                    throw new Error('Empty list');
                } else if (this.length > 1) {
                    throw new Error('Attempting Single-Node-Operation on multiple nodes');
                }
                if (!this[0].children.length) {
                    return this.append(value);
                }
                tmp = this[0].children[0];
                wrapped = score.dom(value);
                for (i = 0; i < wrapped.length; i++) {
                    this[0].insertBefore(wrapped[i], tmp);
                }
                return this;
            }},

            // css classes

            // TODO: Use Element.classList when changing minimum supported
            // Internet Explorer version to IE10:
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

            hasClass: {value: function(cls) {
                if (!this.length) {
                    return false;
                }
                re = new RegExp('(^|\\s+)(' + cls + ')(\\s+|$)');
                for (i = 0; i < this.length; i++) {
                    if (!this[i].className.match(re)) {
                        return false;
                    }
                }
                return true;
            }},

            addClass: {value: function(cls) {
                re = new RegExp('(^|\\s+)(' + cls + ')(\\s+|$)');
                for (i = 0; i < this.length; i++) {
                    existing = this[i].className;
                    if (!existing) {
                        this[i].className = cls;
                    } else if (!existing.match(re)) {
                        this[i].className = existing + ' ' + cls;
                    }
                }
                return this;
            }},

            toggleClass: {value: function(cls) {
                re = new RegExp('(^|\\s+)(' + cls + ')(\\s+|$)');
                for (i = 0; i < this.length; i++) {
                    existing = this[i].className;
                    if (!existing) {
                        this[i].className = cls;
                    } else if (existing.match(re)) {
                        this[i].className = existing.replace(re, '$3');
                    } else {
                        this[i].className = existing + ' ' + cls;
                    }
                }
                return this;
            }},

            removeClass: {value: function(cls) {
                re = new RegExp('(^|\\s+)(' + cls + ')(\\s+|$)');
                for (i = 0; i < this.length; i++) {
                    existing = this[i].className;
                    if (existing) {
                        this[i].className = existing.replace(re, '$3');
                    }
                }
                return this;
            }},

            // events

            on: {value: function(event, callback) {
                for (i = 0; i < this.length; i++) {
                    this[i].addEventListener(event, callback);
                }
                return this;
            }},

            off: {value: function(event, callback) {
                for (i = 0; i < this.length; i++) {
                    this[i].removeEventListener(event, callback);
                }
                return this;
            }}

        });

        dom.fromString = function(html) {
            var div = document.createElement('div');
            div.insertAdjacentHTML('afterbegin', html);
            return score.dom(div.children).detach();
        };

        dom.queryGlobal = document.querySelectorAll.bind(document);

        dom.queryLocal = function(root, selector) {
            return root.querySelectorAll(selector);
        };

        dom.testMatch = function(node, selector) {
            return node[matches](selector);
        };

        dom.__version__ = '0.0.7';

        return dom;

    });

});
