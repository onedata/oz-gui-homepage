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
import filecmp
import shutil
from stat import *

script_dir = os.path.dirname(os.path.realpath(__file__))
def_gui_src_path = os.path.join(script_dir, 'oz-gui-default', 'src')
src_path = os.path.join(script_dir, 'src')

checked_files = {}
count_files_ok = 0
count_files_created = 0
count_files_updated = 0
count_links_ok = 0
count_links_created = 0
count_links_broken = 0
links_broken = []
count_overrides = 0
overrides = []
count_homepage_files = 0
homepage_files = []
to_ignore = []


# Creating symlinks with required dir structure and overwrite
def symlink(src, dest):
    dest_dir = os.path.dirname(dest)
    if not os.path.isdir(dest_dir):
        os.makedirs(dest_dir)
    if os.path.islink(dest):
        os.remove(dest)
    os.symlink(src, dest)


# Copying files with required dir structure and overwrite
def copy(src, dest, perms):
    dest_dir = os.path.dirname(dest)
    if not os.path.isdir(dest_dir):
        os.makedirs(dest_dir)
    if os.path.isfile(dest):
        os.remove(dest)
    shutil.copyfile(src, dest)
    os.chmod(dest, perms)


# Excluded directories
exclude = set(['node_modules', 'bower_components', 'tmp', 'dist'])

# Walk the oz-gui-default dir and resolve links
for root, dirs, files in os.walk(def_gui_src_path, topdown=True):
    # Skip excluded dirs
    dirs[:] = [d for d in dirs if d not in exclude]
    # Look through dirs for symlinks to dirs
    for dir in dirs:
        abs_dir_path = os.path.join(root, dir)
        rel_dir_path = os.path.relpath(abs_dir_path, def_gui_src_path)
        path_to_check = os.path.join(src_path, rel_dir_path)
        checked_files[path_to_check] = True
        # Check only symlinks to directories
        if os.path.islink(abs_dir_path):
            # Check if same dir/file exists in src dir
            if os.path.islink(path_to_check):
                orig_link_target = os.readlink(abs_dir_path)
                curr_link_target = os.readlink(path_to_check)
                if orig_link_target == curr_link_target:
                    count_links_ok += 1
                else:
                    abs_curr_link_target = os.path.abspath(
                        os.path.join(os.path.dirname(path_to_check),
                                     curr_link_target))
                    # Check if this link's target is the file in oz-gui-default
                    if os.path.exists(abs_curr_link_target):
                        count_homepage_files += 1
                        homepage_files.append(rel_dir_path)
                    else:
                        count_links_broken += 1
                        links_broken.append(rel_dir_path)
                # os.chmod("/tmp/test_file", 664)
                pass
            elif os.path.isdir(path_to_check):
                count_homepage_files += 1
                homepage_files.append(rel_dir_path)
            elif os.path.isfile(path_to_check):
                count_homepage_files += 1
                homepage_files.append(rel_dir_path)
            else:
                link_target = os.readlink(abs_dir_path)
                os.symlink(link_target, path_to_check)
                count_links_created += 1

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
        if os.path.exists(path_to_check):
            # File exists. Check if it is read only.
            if oct(os.stat(path_to_check)[ST_MODE])[-3:] == '444':
                # Read only - it was copied here by the script
                # Should be later added to git ignore
                to_ignore.append(rel_file_path)
                # Check if it should be updated
                if filecmp.cmp(abs_file_path, path_to_check):
                    # No need to update
                    count_files_ok += 1
                else:
                    # Update to newer version
                    copy(abs_file_path, path_to_check, 0444)
                    count_files_updated += 1
            else:
                # Not read only - an overriden file
                count_overrides += 1
                overrides.append(rel_file_path)
        else:
            # File does not exist, copy it
            copy(abs_file_path, path_to_check, 0444)
            # Should be later added to git ignore
            to_ignore.append(rel_file_path)
            count_files_created += 1

            # #os.chmod(path_to_check, 0444)
            #
            # # This file is a link
            # if os.path.islink(path_to_check):
            #     # print('link')
            #     link_target = os.path.abspath(
            #         os.path.join(os.path.dirname(path_to_check),
            #                      os.readlink(path_to_check)))
            #     # Check if this link's target is the file in oz-gui-default
            #     if link_target == abs_file_path:
            #         count_links_ok += 1
            #     else:
            #         count_links_broken += 1
            #         links_broken.append(rel_file_path)
            #         # print(link_target)
            #         # print(os.path.abspath(link_target))
            #         # print(abs_file_path)
            #
            # # This file is a file
            # # elif os.path.isfile(path_to_check):
            #     # print('file')
            #     # count_overrides += 1
            #     # overrides.append(rel_file_path)
            #
            # # This file does not exist
            # else:
            #     link_dir = os.path.dirname(path_to_check)
            #     link_target = os.path.relpath(abs_file_path, link_dir)
            #     # Make directory if it does not exist
            #     # if not os.path.isdir(link_dir):
            #     #     os.makedirs(link_dir)
            #     # os.symlink(link_target, path_to_check)
            #     # count_links_added += 1
            #
            #     # print(link_target, path_to_check)
            #     # print('nothing')

# Walk the src dir and look for paths that were not checked
for root, dirs, files in os.walk(src_path, topdown=True):
    # Skip excluded dirs
    dirs[:] = [d for d in dirs if d not in exclude]
    for file in files:
        # Absolute path to file in src
        abs_file_path = os.path.join(root, file)
        # Relative path to file in src
        rel_file_path = os.path.relpath(abs_file_path, src_path)
        if not abs_file_path in checked_files:
            count_homepage_files += 1
            homepage_files.append(rel_file_path)
            if os.path.islink(abs_file_path):
                if not os.path.isfile(os.readlink(abs_file_path)):
                    count_links_broken += 1
                    links_broken.append(rel_file_path)


gitignore_path = os.path.join(script_dir, 'src', '.gitignore')
with open(gitignore_path) as gitignore:
    content = gitignore.readlines()
    new_content = []
    # Read the beginning of gitignore
    for line in content:
        new_content.append(line)
        if line == '# inject-default-gui.py\n':
            break
    # Add a blank line
    new_content.append('\n')
    # Add files to ignore
    for file_to_ignore in to_ignore:
        new_content.append('{0}\n'.format(file_to_ignore))

    with open(gitignore_path, 'w') as gitignore_write:
        for line in new_content:
            gitignore_write.write(line)


overrides_str = ''
for override in overrides:
    overrides_str += '   \033[93m{0}\033[0m\n'.format(override)

homepage_str = ''
for homepage_file in homepage_files:
    homepage_str += '   \033[92m{0}\033[0m\n'.format(homepage_file)

broken_links_str = ''
for broken_link in links_broken:
    broken_links_str += '   \033[91m{0}\033[0m\n'.format(broken_link)

end_message = '''\
Finished!
-----------------------------------------------
Links:   (injected from default GUI)
    up-to-date:   {count_links_ok}
    created:      {count_links_created}

Files:   (injected from default GUI)
    up-to-date:   {count_files_ok}
    created:      {count_files_created}
    updated:      {count_files_updated}

Overrides:        {count_overrides}   (files from default GUI that are overriden)
{overrides_str}

Homepage files:   {count_homepage_files}   (files/links specific only for homepage)
{homepage_str}

Broken links:     {count_links_broken}   (should be fixed manually)
{broken_links_str}'''.format(
    count_links_ok=count_links_ok,
    count_links_created=count_links_created,
    count_files_ok=count_files_ok,
    count_files_created=count_files_created,
    count_files_updated=count_files_updated,
    count_overrides=count_overrides,
    overrides_str=overrides_str,
    count_homepage_files=count_homepage_files,
    homepage_str=homepage_str,
    count_links_broken=count_links_broken,
    broken_links_str=broken_links_str,
)

print(end_message)

# print('Broken links:     {0}   (should be fixed manually)'.format(
# count_links_broken))
# for broken_link in links_broken:
#     print('   \033[91m{0}\033[0m'.format(broken_link))
# print('')
