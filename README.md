# aws-lex-proxy

### NPM library providing proxy functionality for those needing AWS Lex to be used outside AWS infrastructure without aws-sdk in deployable artifact
[![version](https://img.shields.io/npm/v/aws-lex-proxy.svg)](http://npm.im/aws-lex-proxy)
[![travis build](https://img.shields.io/travis/crisboarna/aws-lex-proxy.svg)](https://travis-ci.org/crisboarna/aws-lex-proxy)
[![codecov coverage](https://img.shields.io/codecov/c/github/crisboarna/aws-lex-proxy.svg)](https://codecov.io/gh/crisboarna/aws-lex-proxy)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8d87ae38dea34aa09d0daa0ab81b81cd)](https://www.codacy.com/app/crisboarna/aws-lex-proxy)
[![dependency status](https://img.shields.io/david/crisboarna/aws-lex-proxy.svg)](https://david-dm.org/crisboarna/aws-lex-proxy)
[![MIT License](https://img.shields.io/npm/l/aws-lex-proxy.svg)](./LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)
[![Greenkeeper](https://badges.greenkeeper.io/crisboarna/aws-lex-proxy.svg)](https://greenkeeper.io/)
[![code style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg)](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg)

## Table of Contents
* [Motivation](#motivation)
* [Installation](#installation)
* [Setup](#setup)
* [Usage](#usage)
* [Documentation](#documentation)
* [Architecture](#architecture)

## Motivation
As AWS Lex does not provide external API endpoint when being setup it results in only two possibilities of using the NLP product:
- deploying exclusively on AWS infrastructure (Lambda) to access the functionality
- using AWS SDK

This is meant to provide third option:
- vanilla HTTPS endpoint to query Lex.

This is achieved by setting up an microservice using AWS API Gateway and Lambda. The HTTPS endpoint will be the API Gateway that triggers Lambda which queries Lex and returns data.
CloudFormation stack setup is provided with all needed commands.

## Installation

```javascript
npm i aws-lex-proxy
```

## Setup
You can either setup the infrastructure in one of the following ways:
1. Create manually via Console API a stack similar to below [architecture](#architecture) diagram as Gateway -> Lambda -> Lex with API Gateway `Request Template` for `application/json` and Lambda content as in [usage](#usage) below.
2. Clone this package's GitHub repository and
- Change `package.json` -> `config` -> `profile` to your profile name
- Change `package.json` -> `config` -> `s3BucketName` to your bucket's name
- Change `src/bin/lambda.ts` `BOT_ALIAS` and `BOT_NAME` to your values
- Run `npm run setup` will deploy the CloudFormation stack and in output you will have the API endpoints to use with your application

## Usage
**NOTE**: The proxy function takes in AWS SDK configured(if used locally during testing without IAM). This puts SDK version used at users discretion as long as it contains the LexRuntime functionality.

This is the Lambda function content

```typescript
import LexProxy from 'aws-lex-proxy';
/// AWS SDK setup here
const BOT_ALIAS = 'AwesomeBotAlias';
const BOT_NAME = 'AwesomeBotName';

const handler = (event, context, cb) => {
    const lexProxy = new LexProxy(BOT_ALIAS, BOT_NAME, awsSdk);
    lexProxy.proxy(event, context, cb);
}

export default handler
```

## Documentation
You can find the documentation [here](https://crisboarna.github.io/aws-lex-proxy)

## Architecture
![Architectural Diagram](images/Architectural-Diagram.png?raw=true "Architectural Diagram")
