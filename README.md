About
=====

*oz-gui-homepage* is GUI written in Ember dedicated for OZ worker that hosts
onedata.org homepage. It is build upn oz-gui-default project.

This project reuses most of oz-gui-default project, and extends it to provide
a GUI with more features. To ensure that the same code is reused and
that the project is easy to maintain whenever any of the projects change,
following solution is applied.

oz-gui-default is included in this project as a subtree. In src dir, there are
symbolic links to all of the files of oz-gui-default. This ensures that the
same codebase is used. Programmer may decide to override a file, and when he
places a regular file in src dir, it will NOT be automatically replaced by a
symbolic link. He may also create new files that do not exist in oz-gui-default
and they will stay untouched.

There is a script used to traverse the projects and resolve all symbolic links,
called **resolve-links.py**.


Goals
-----

Getting Started
---------------

Support
-------

