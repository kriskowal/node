
Node Narwhal Compatibility Layer
================================

A package used as an engine-specific compatibility for either
Narwhal on Node or Node on Narwhal.  This is the `narwhal` subtree
of the `narwhal-node` Narwhal engine package for Node, but can also
be used be used as a Node package.

This package works in conjunction with `narwhal-lib`, which provides
the pure-JavaScript components of Narwhal that can be used on any
engine.

Milage will vary depending on which modules you need and whether
those modules in turn depend on Narwhal IO or transcoding modules.

In the region where Narwhal and Node collide, there are a lot of big
chunks of broken JavaScript lying around.  Not everything that works on
Narwhal works on Node, and not everything that works on Node works on
Narwhal.  A lot of Narwhal API's are in flux to accommodate Node,
particular with regard to module name spaces.  If Narwhal module `X`
doesn't load, it's likely that it's been moved to `narwhal/X`. This
is very much a work in progress.


License
-------

Copyright &copy; 2010, Kris Kowal, MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

