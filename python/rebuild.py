#!/usr/bin/env python3
from glob import glob
from os.path import realpath
from os.path import dirname
from os.path import isfile
from os.path import basename
import os
import re

project_root = realpath(dirname(realpath(__file__)) + '/..')
docroot =     project_root + '/docroot'
modules_root =  docroot + '/modules'
js_root =    docroot + '/js'
css_root =    docroot + '/css'
index_path =  docroot + '/index.html'

with open(project_root + '/version.txt', 'r') as f:
  version = f.read()

def main():
  contents = rebuild()
  with open(index_path, 'w') as f:
    f.write(contents)

def get_file_contents():
  if not isfile(index_path):
    print('Index missing.')
    exit()

  with open(index_path, 'r') as f:
    contents = f.read()
  return contents

def rebuild():
  contents = get_file_contents()
  contents = update_tags(contents)
  contents = update_modules(contents)
  contents = update_version(contents)
  return contents

def update_tags(contents):
  tags = builld_tags()
  tag_replacement = '\\1\n' + '\n'.join(tags) + '\n\\3'
  resource_pattern = re.compile(
    '(<!-- resource_files -->)(.*)(<!-- /resource_files -->)', re.DOTALL)
  return resource_pattern.sub(tag_replacement, contents)

def update_modules(contents):
  module_names = [basename(path) for path in glob(modules_root + '/*')]
  modules_pattern = re.compile('App.init\([^\)]*\);', re.DOTALL)
  module_replacement = 'App.init([{}]);'.format(', '.join(module_names))
  return modules_pattern.sub(module_replacement, contents)

def update_version(contents):
  version_pattern = re.compile('(class="version">)([^<]*)')
  version_replacement = r'\g<1>' + version
  return version_pattern.sub(version_replacement, contents)

def builld_tags():
  js_builder = TagBuilder('<script src="{}?v={}"></script>', 'js')
  css_builder = TagBuilder('<link rel="stylesheet" type="text/css" href="{}?v={}">', 'css')

  js_dirs = glob(js_root + '/*')
  module_dirs = glob(modules_root + '/*')

  [js_builder.process_dir(dir) for dir in js_dirs]
  [js_builder.process_dir(dir) for dir in module_dirs]
  css_builder.process_dir(css_root)
  [css_builder.process_dir(dir) for dir in module_dirs]

  return css_builder.tags + js_builder.tags

class TagBuilder(object):

  def __init__(self, template, ext):
    self.template = template
    self.ext = ext
    self.tags = []

  def process_dir(self, dir):
    pattern = '{}/*.{}'.format(dir, self.ext)
    [self.process_path(path) for path in glob(pattern)]

  def process_path(self, path):
    path = path.replace(docroot + '/', '')
    self.tags.append(self.template.format(path, version))

if __name__ == '__main__':
  main()

