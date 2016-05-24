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

CSS Class Manipulation
----------------------

The module allows adding/removing css classes using the usual method names:

.. code-block:: javascript

    if (score.dom('body').hasClass('spam')) {
        score.dom('.knight').addClass('ni');
        score.dom('#cheese-shop').removeClass('cheese');
        score.dom('.self-defense').toggleClass('fruit');
    }

DOM restructuring
-----------------

You can remove nodes from the DOM using ``detach()``, and attach them beneath
another given node using ``prepend()`` or ``append()``, depending on whether
they should be inserted at the beginning, or the end of the children list:

.. code-block:: javascript

    score.dom('.parrot').detach();
    score.dom('.fruits').append(score.dom.fromString('<li>Banana</li>'));
    score.dom('.fruits').prepend(score.dom.fromString('<li>Carrot</li>'));
    score.dom('.fruits').children().eq(0).text() // 'Carrot'


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
