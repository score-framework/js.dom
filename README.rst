.. image:: https://raw.githubusercontent.com/score-framework/py.doc/master/docs/score-banner.png
    :target: http://score-framework.org

`The SCORE Framework`_ is a collection of harmonized python and javascript
libraries for the development of large scale web projects. Powered by strg.at_.

.. _The SCORE Framework: http://score-framework.org
.. _strg.at: http://strg.at


*********
score.dom
*********

.. _js_dom:

.. image:: https://travis-ci.org/score-framework/js.dom.svg?branch=master
    :target: https://travis-ci.org/score-framework/js.dom

This module provides a convenient wrapper for DOM nodes. Its API resembles that
of jQuery, since this has become the best known DOM manipulation API over time.

Quickstart
==========

.. code-block:: html

    <script src="score.init.js"></script>
    <script src="score.dom.js"></script>
    <script>
        (function() {
            var romans = score.dom('.roman');
            score.dom('.home').append(romans);
        })();
    </script>

Details
=======

Constructor
-----------

The "constructor" [1]_ will return an object deriving from ``score.dom.proto``.
It accepts either of the following:

- *Nothing*: Creates an empty node list.
  
.. code-block:: javascript

      score.dom()

- Selector: Selects all nodes matching the selector globally

.. code-block:: javascript

      score.dom('body')

- NodeList object:

.. code-block:: javascript

      score.dom(document.getElementsByTagName('a'))

- A ``score.dom`` object:

.. code-block:: javascript

      var bodyNode = score.dom('body');
      score.dom(bodyNode).addClass('foo');


.. [1] The term *constructor* is actually incorrect, as ``score.dom`` is just a
       normal function.

Creating new nodes
------------------

The constructor above is for wrapping already existing DOM nodes. It is also
possible to create score.dom objects with brand new nodes by using the
``create()`` function:

.. code-block:: javascript

    var node = score.dom.create('div');


score.dom Object
----------------

Whenever you call ``score.dom()``, you will receive an array-like object
containing a list of nodes. This object actually inherits the Array prototype,
allowing you to use all array features:

.. code-block:: javascript

    var nodes = score.dom('.spam');
    nodes.length; // 3
    nodes[0]; // A native HTMLDivElement: <div class="spam">...</div>

There is just one exception: we are overriding the ``forEach()`` function to
provide score.dom objects:

.. code-block:: javascript

    nodes.forEach(function(node) {
        // node is a score.dom object
        console.log(node.attr('class'));
    });

Since score.dom objects are actually arrays, all operations are always
performed on *all* nodes in your array. This might come as a surprise in
certain cases, where jQuery is a bit inconsistent:

.. code-block:: javascript

    // Remove all nodes, that hava a "spam" class, from the document:
    score.dom('.spam').detach();

    // Select all child nodes of all ".knight" nodes, i.e. the nodes
    // ".foo" and ".bar" in the following document:
    //   <div class="knight"><span class="foo"></span></div>
    //   <div class="knight"><span class="bar"></span></div>
    score.dom('.knight').children();

    // Select all parent nodes of all ".cheese" nodes; the resulting object
    // will contain the "#cheese-shop" *twice*:
    //   <div id="cheese-shop">
    //     <div class="customer"></div>
    //     <div class="customer"></div>
    //   </div>
    score.dom('.customer').parent().length; // 2
    score.dom('.customer').parent().uniq().length; // 1


Safety Measures
---------------

Apart from simplifying the complex DOM API, this module also tries to aid
development by throwing errors, whenever it assumes that something might have
gone wrong.  Currently, we have two distinct checks for some of the operations
available. Note, that the precautions are tied to *operations*, not whole
*functions*: Some usage of the function might have a different set of
constraints than another.

.. _min1:
.. _js_dom_min1:

Minimum Length 1
````````````````

Some operations intend to change a node. These operations will fail, if the
score.dom object is empty:

.. code-block:: javascript

    // create a new node:
    var banana = score.dom.create('span').addClass('banana');
    // select an existing node from the document
    var fruits = score.dom('#fruits')
    // What we're not realizing at this point is that our colleague has changed
    // the ID of the "fruits"-node to "weapons", and that our fruits-variable
    // is nothing but an empty array. This is why the next function will cause
    // an Error to be thrown:
    fruits.append(banana);  // Error: "Empty list"


.. _sno:
.. _js_dom_sno:

Single Node Operations
``````````````````````

Some operations are marked as Single Node Operations (SNO for short). These
operations will fail if the score.dom object contains more than one element:

.. code-block:: javascript

    try {
        var nodes = score.dom('.spam');
        if (nodes.length > 1) {
            // this will throw an error since we
            // have more than one node:
            nodes.text()
        }
    } catch (e) {
        console.log(e);  // "Attempting Single-Node-Operation on multiple nodes"
    }



Filtering
---------

If you have a ``score.dom`` object, you can reduce its list of nodes using the
following methods:

* ``eq(index)`` will return a new ``score.dom`` object containing a single
  node, the one at the given index. Will throw an Error, if the index it out of
  range.
* The dynamic value ``first`` returns the same as ``eq(0)``:

  .. code-block:: javascript

      score.dom('.knight').first;  // The first knight
      score.dom('#cheese-shop').find('.cheese').first;  // throws an Error

* The function ``uniq()`` will remove duplicates from your node list:

  .. code-block:: javascript

      score.dom('.customer').parent().uniq();


Cloning
-------

The represented Nodes can be duplicated using ``clone()``:

.. code-block:: javascript

    var spams = score.dom('.spam');
    spams.first.parent().append(spams.clone());

The function makes deep clones of all elements unless called with ``false``:

.. code-block:: javascript

    var spams = score.dom('.spam');
    var shallowCopies = spams.clone(false);


Querying
--------

You can query, if *all* nodes in your list match a given selector using
``matches()`` (min1_):

.. code-block:: javascript

    var spams = score.dom('.spam');
    spams.matches('.spam');


Node Operations
---------------

There are two operations you can perform on individual nodes:

* ``text()`` will return the textContent_ of the node (sno_)
  or set the textContent of all nodes to a given value:

  .. code-block:: javascript

      // setting the text content:
      score.dom('body').text('hello world');

      // retrieving the text content (sno):
      score.dom('body').text();

* ``attr()`` does the same for the value of an attribute:

  .. code-block:: javascript

      // setting an attribute:
      score.dom('#parrot').attr('data-state', 'deceased');

      // getting the value of an attribute (sno)
      // (returns null if attribute does not exist):
      score.dom('.customer').attr('data-state');

      // removing an attribute:
      score.dom('.customer').attr('data-state', null);

.. _textContent: https://developer.mozilla.org/en/docs/Web/API/Node/textContent 

Restructuring
-------------

You can remove nodes from the document using ``detach()``, removing them from
the DOM. You can then attach them beneath another given node using
``prepend()`` or ``append()``, depending on whether they should be inserted at the
beginning, or the end of the children list. Both functions are `single node
operations`_ and will throw an error, if the score.dom object
they were called on does not contain exactly one node:

.. code-block:: javascript

    score.dom('.parrot').detach();
    score.dom('.fruits').append(score.dom.fromString('<li>Banana</li>'));
    score.dom('.fruits').prepend(score.dom.fromString('<li>Carrot</li>'));
    score.dom('.fruits').children().first.text() // 'Carrot'


Traversal
---------

The function ``parent()`` returns a new ``score.dom`` containing each node's
parent. ``children()`` returns a new ``score.dom`` containing all child nodes
of every node.

``find()`` will find all nodes beneath the original nodes matching given
selector.

``closest()`` queries the document upward until the given selector matches.
This is done for each node in the original list.

.. code-block:: javascript

    // Assuming the following document:
    //   <div id="top>
    //     <div class="lvl2">
    //       <span class="bottom">
    //       <span class="bottom">
    //     </div>
    //     <div class="lvl2">
    //       <span class="bottom">
    //       <span class="bottom">
    //     </div>
    //   </div>

    var bottoms = score.dom('.bottom');
    bottoms.length === 4;
    var bottomParents = bottoms.parent();
    bottomParents.length === 4;
    bottomParents.hasClass('lvl2');
    bottomParents[0] === bottomParents[1];
    bottomParents[2] === bottomParents[3];
    bottomParents[0] !== bottomParents[2];
    var tops = bottomParents.closest('#top');
    tops.length == 4;
    tops[0] === tops[1];
    tops[0] === tops[2];
    tops[0] === tops[3];
    var secondLevels = score.dom('#top').find('.lvl2');
    secondLevels.length === 2;


CSS Class Manipulation
----------------------

The module allows adding/removing css classes using the usual method names:

.. code-block:: javascript

    if (score.dom('body').hasClass('spam')) {
        score.dom('.knight').addClass('ni');
        score.dom('#cheese-shop').removeClass('cheese');
        score.dom('.self-defense').toggleClass('fruit');
    }

Note that ``hasClass()`` will only return ``true``, if *all* nodes have the
given css class.


Acknowledgments
===============

Many thanks to BrowserStack_ and `Travis CI`_ for providing automated tests for
our open source projects! We wouldn't be able to maintain our high quality
standards without them!

.. _BrowserStack: https://www.browserstack.com
.. _Travis CI: https://travis-ci.org/


License
=======

Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria

All files in and beneath this directory are part of The SCORE Framework.
The SCORE Framework and all its parts are free software: you can redistribute
them and/or modify them under the terms of the GNU Lesser General Public
License version 3 as published by the Free Software Foundation which is in the
file named COPYING.LESSER.txt.

The SCORE Framework and all its parts are distributed without any WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. For more details see the GNU Lesser General Public License.

If you have not received a copy of the GNU Lesser General Public License see
http://www.gnu.org/licenses/.

The License-Agreement realised between you as Licensee and STRG.AT GmbH as
Licenser including the issue of its valid conclusion and its pre- and
post-contractual effects is governed by the laws of Austria. Any disputes
concerning this License-Agreement including the issue of its valid conclusion
and its pre- and post-contractual effects are exclusively decided by the
competent court, in whose district STRG.AT GmbH has its registered seat, at the
discretion of STRG.AT GmbH also the competent court, in whose district the
Licensee has his registered seat, an establishment or assets.
