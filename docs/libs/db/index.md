---
title: Documentation - Dokklib-DB
description: Dokklib-DB is a Python library for the DynamoDB single table pattern.
---
# Dokklib-DB

![CI](https://github.com/dokklib/dokklib-db/workflows/CI/badge.svg) [![Join the chat at https://gitter.im/dokklib/dokklib-db](https://badges.gitter.im/dokklib/dokklib-db.svg)](https://gitter.im/dokklib/dokklib-db?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Dokklib-DB is a Python library for the [DynamoDB](/guides/aws/dynamodb/) single table pattern.

## Features

- Simple, Pythonic query interface on top of Boto3. No more nested dict literals!
- Type safety for primary keys and indices (for documentation and data integrity).
- Easy error handling.
- Full type hint & unit test coverage + integration testing.

## Install

Install Dokklib-DB:

`pip install "boto3>=1.10.34,<2" dokklib-db`

Requires Python 3.6 or later.

!!! note
    Boto3 is not specified as an installation requirement for Dokklib-DB, so you have to install it separately (like in the example command above).
    The reason for this is to make Dokklib-DB easier to use in AWS Lambda where Boto3 is part of the default environment.
    The earliest supported Boto3 version is `1.10.34` which is the same version as the Boto3 package in the Python 3 AWS Lambda environments.

## Import

Import Dokklib-DB:

```python
import dokklib_db as db
```

## Github Repo

Please open feature requests and bug reports in the [Dokklib-DB Github repo.](https://github.com/dokklib/dokklib-db)

## Status

The library is in beta and under heavy development as I'm working on it while building a [serverless project](https://github.com/dokknet/dokknet-api) that relies on it.
I have only implemented parts of the DynamoDB API that I needed so far, but I'm planning on achieving full coverage.
Feature and pull requests are very welcome on [Github!](https://github.com/dokklib/dokklib-db) (Please open an issue, before starting work on a pull request to avoid wasted effort.)
