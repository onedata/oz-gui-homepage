SRC_DIR	 ?= src
REL_DIR	 ?= rel
DOC_DIR  ?= doc

.PHONY: deps build_dev build_prod doc clean test

all: build_dev

rel: build_prod

deps:
	cd $(SRC_DIR) && npm install
	cd $(SRC_DIR) && bower install --allow-root

build_dev: deps
	cd $(SRC_DIR) && ember build -dev --output-path=../$(REL_DIR)

build_prod: deps
	cd $(SRC_DIR) && ember build -prod --output-path=../$(REL_DIR)

doc:
	cd $(SRC_DIR) && jsdoc -c .jsdoc.conf -d ../$(DOC_DIR)

clean:
	cd $(SRC_DIR) && rm -rf node_modules bower_components dist tmp

test: deps
	cd $(SRC_DIR) && xvfb-run ember test

test_xunit_output: deps
	cd $(SRC_DIR) && xvfb-run ember test -r xunit
