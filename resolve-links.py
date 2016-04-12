#!/usr/bin/env python

# coding=utf-8

"""Author: Lukasz Opiola
Copyright (C) 2016 ACK CYFRONET AGH
This software is released under the MIT license cited in 'LICENSE.txt'

This script is used to automate maintenance of dependency between
oz-gui-default and oz-gui-homepage, which works as follows.

oz-gui-default is included in this project as a subtree. In src dir, there are
symbolic links to all of the files of oz-gui-default. This ensures that the
same codebase is used. Programmer may decide to override a file, and when he
places a regular file in src dir, it will NOT be automatically replaced by a
symbolic link. He may also create new files that do not exist in oz-gui-default
and they will stay untouched.
"""

import os

script_dir = os.path.dirname(os.path.realpath(__file__))
def_gui_src_path = os.path.join(script_dir, 'oz-gui-default', 'src')
src_path = os.path.join(script_dir, 'src')

checked_files = {}
links_ok = 0
links_added = 0
links_broken = 0
broken_links = []
overrides_detected = 0
overrides = []
homepage_files = 0

# Walk the oz-gui-default dir and resolve links
for root, _, files in os.walk(def_gui_src_path):
    for file in files:
        # Absolute path to file in oz-gui-default
        abs_file_path = os.path.join(root, file)
        # Relative path to file in oz-gui-default
        # (relative to oz-gui-default/src)
        rel_file_path = os.path.relpath(abs_file_path, def_gui_src_path)
        # Corresponding path in src dir
        path_to_check = os.path.join(src_path, rel_file_path)
        checked_files[path_to_check] = True
        # Check if this file exists in src dir
        # print(abs_file_path)
        # print(rel_file_path)
        # print(path_to_check)

        # This file is a link
        if os.path.islink(path_to_check):
            # print('link')
            link_target = os.path.abspath(
                os.path.join(os.path.dirname(path_to_check),
                             os.readlink(path_to_check)))
            # Check if this link's target is the file in oz-gui-default
            if link_target == abs_file_path:
                links_ok += 1
            else:
                links_broken += 1
                broken_links.append(rel_file_path)
                # print(link_target)
                # print(os.path.abspath(link_target))
                # print(abs_file_path)

        # This file is a file
        elif os.path.isfile(path_to_check):
            # print('file')
            overrides_detected += 1
            overrides.append(rel_file_path)

        # This file does not exist
        else:
            link_dir = os.path.dirname(path_to_check)
            link_target = os.path.relpath(abs_file_path, link_dir)
            # Make directory if it does not exist
            if not os.path.isdir(link_dir):
                os.makedirs(link_dir)
            os.symlink(link_target, path_to_check)
            links_added += 1

            # print(link_target, path_to_check)
            # print('nothing')

# Walk the src dir and look for paths that were not checked
for root, _, files in os.walk(src_path):
    for file in files:
        # Absolute path to file in src
        abs_file_path = os.path.join(root, file)
        # Relative path to file in src
        rel_file_path = os.path.relpath(abs_file_path, src_path)
        if not abs_file_path in checked_files:
            homepage_files += 1
            if os.path.islink(abs_file_path):
                if not os.path.isfile(os.readlink(abs_file_path)):
                    links_broken += 1
                    broken_links.append(rel_file_path)


print('Finished!')
print('-----------------------------------------------')
print('')
print('Links OK:         {0}'.format(links_ok))
print('')
print('Links added:      {0}'.format(links_added))
print('')
print('Homepage files:   {0}   (files/links specific only for homepage)'.format(
    homepage_files))
print('')
print(
'Overriden files:  {0}   (files from default GUI that were overriden)'.format(
    overrides_detected))
for override in overrides:
    print('   \033[92m{0}\033[0m'.format(override))
print('')
print('Broken links:     {0}   (should be fixed manually)'.format(links_broken))
for broken_link in broken_links:
    print('   \033[91m{0}\033[0m'.format(broken_link))
print('')
