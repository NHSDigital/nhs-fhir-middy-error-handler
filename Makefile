install: install-python install-hooks install-node

install-node:
	npm ci

install-python:
	poetry install

install-hooks:
	poetry run pre-commit install --install-hooks --overwrite

build: build-node

build-node:
	npm run build

lint: lint-node lint-python

lint-node:
	npm run lint

lint-python:
	poetry run flake8 scripts/*.py --config .flake8

test: test-node

test-node: build-node
	npm run test

clean:
	rm -rf coverage
	rm -rf lib

deep-clean: clean
	rm -rf .venv
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

check-licenses: check-licenses-node check-licenses-python

check-licenses-node:
	npm run check-licenses
	
check-licenses-python:
	scripts/check_python_licenses.sh
