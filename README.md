# NHS FHIR Middy Error Handler

[![Release to NPM](https://github.com/NHSDigital/nhs-fhir-middy-error-handler/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/NHSDigital/nhs-fhir-middy-error-handler/actions/workflows/release.yml)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=NHSDigital_nhs-fhir-middy-error-handler)](https://sonarcloud.io/summary/new_code?id=NHSDigital_nhs-fhir-middy-error-handler)

This repository contains a variant of the Middy Error Handler for use in a FHIR AWS lambda.

## Functionality

This repository creates an NPM package that is designed to be used as error handling middleware for a FHIR AWS lambda, returning FHIR compliant error messages as OperationOutcome resources.

### Versions

This project has a dependency on @aws-lambda-powertools/logger.  
If you are using @aws-lambda-powertools/logger in your project, and you are using version 1.x of @aws-lambda-powertools/logger, then you must use version 1.x of this module.  
If you are using @aws-lambda-powertools/logger in your project, and you are using version 2.x of @aws-lambda-powertools/logger, then you must use version 2.x of this module.

### Usage

To integrate this into your project, install the package using the following:

```bash
npm install @nhs/fhir-middy-error-handler
```

Then add the following to your middy middleware stack:

```typescript
import middy from "@middy/core"
import {Logger, injectLambdaContext} from "@aws-lambda-powertools/logger"
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda"
import errorHandler from "@nhs/fhir-middy-error-handler";

const logger = new Logger({serviceName: "myService", logLevel: "INFO"})

const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  ...
}

export const handler = middy(lambdaHandler)
  .use(injectLambdaContext(logger))
  .use(errorHandler({ logger }));
```

See a working example in <https://github.com/NHSDigital/prescriptionsforpatients/blob/main/packages/getMyPrescriptions/src/getMyPrescriptions.ts>

## Project Structure

- `.devcontainer` Contains a dockerfile and vscode devcontainer definition
- `.github` Contains github workflows that are used for building and deploying from pull requests and releases
- `scripts` Contains a script to check python licenses
- `src` Contains the source code for the project
- `tests` Contains the tests for the project

## Contributing

Contributions to this project are welcome from anyone, providing that they conform to the [guidelines for contribution](./CONTRIBUTING.md) and the [community code of conduct](./CODE_OF_CONDUCT.md).

### Licensing

This code is dual licensed under the MIT license and the OGL (Open Government License). Any new work added to this repository must conform to the conditions of these licenses. In particular this means that this project may not depend on GPL-licensed or AGPL-licensed libraries, as these would violate the terms of those libraries' licenses.

The contents of this repository are protected by Crown Copyright (C).

## Development

It is recommended that you use visual studio code and a devcontainer as this will install all necessary components and correct versions of tools and languages.  
See <https://code.visualstudio.com/docs/devcontainers/containers> for details on how to set this up on your host machine.  
There is also a workspace file in .vscode that should be opened once you have started the devcontainer. The workspace file can also be opened outside of a devcontainer if you wish.

All commits must be made using [signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

Once the steps at the link above have been completed. Add to your ~/.gnupg/gpg.conf as below:

```
use-agent
pinentry-mode loopback
```

and to your ~/.gnupg/gpg-agent.conf as below:

```
allow-loopback-pinentry
```

As described here:
<https://stackoverflow.com/a/59170001>

You will need to create the files, if they do not already exist.
This will ensure that your VSCode bash terminal prompts you for your GPG key password.

You can cache the gpg key passphrase by following instructions at <https://superuser.com/questions/624343/keep-gnupg-credentials-cached-for-entire-user-session>

### CI Setup

The GitHub Actions require a secret to exist on the repo called "SONAR_TOKEN".
This can be obtained from [SonarCloud](https://sonarcloud.io/)
as described [here](https://docs.sonarsource.com/sonarqube/latest/user-guide/user-account/generating-and-using-tokens/).
You will need the "Execute Analysis" permission for the project (NHSDigital_nhs-fhir-middy-error-handler) in order for the token to work.

### Pre-commit hooks

Some pre-commit hooks are installed as part of the install above, to run basic lint checks and ensure you can't accidentally commit invalid changes.
The pre-commit hook uses python package pre-commit and is configured in the file .pre-commit-config.yaml.
A combination of these checks are also run in CI.

### Make commands

There are `make` commands that are run as part of the CI pipeline and help alias some functionality during development.

#### Default target

- `make` runs the default target which runs deep-clean, install, lint, check-licenses, build, and test

#### Install targets

- `install` installs python, pre-commit hooks, and node modules

#### Clean and deep-clean targets

- `clean` clears up any files that have been generated by building or testing locally.
- `deep-clean` runs clean target and also removes any node_modules installed locally.

#### Linting and testing

- `lint` runs lint for all code
- `test` runs all tests

#### Check licenses

- `check-licenses` checks licenses for all packages used in node and python

### GitHub folder

This .github folder contains workflows and templates related to github

- `pull_request_template.yml`: Template for pull requests.
- `dependabot.yml`: Dependabot definition file

Workflows are in the .github/workflows folder

- `combine_dependabot_prs.yml`: Workflow for combining dependabot pull requests. Runs on demand
- `dependabot_auto_approve_and_merge.yml`: Workflow to auto merge dependabot updates
- `pr_link.yml`: Workflow to link Pull Requests to Jira tickets and runs when a pull request is opened.
- `pr_title_check.yml`: Workflow to check the format of a pull request is compliant with the project standards. See [guidelines for contribution](./CONTRIBUTING.md) for details.
- `pull_request.yml`: Called when pull request is opened or updated. Runs rename_dependabot_prs.yml, [quality_checks](https://github.com/NHSDigital/eps-workflow-quality-checks), and pr_title_check.yml
- `release.yml`: Uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) to release main branch to [NPM](https://www.npmjs.com/package/@nhs/fhir-middy-error-handler).
- `rename_dependabot_prs.yml`: Renames dependabot pull requests to comply with project standards.

### Running a Release

Details of running the release can be found in [RELEASE.md](./RELEASE.md).
