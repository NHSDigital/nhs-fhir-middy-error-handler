# Release

Managing versioning and releases is done using [semantic-release](https://semantic-release.gitbook.io/semantic-release/). This is a tool that automatically determines the next version number based on the commit history. It also automatically creates a release and publishes it to GitHub and npm.

## Commit messages

Commit messages must follow a commit format inspired by the [esLint conventional commit](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-eslint) format. This is enforced with a github workflow on all pull requests. The format is as follows:

```text
<tag>: [ticket/dependabot] - <description>

Eg:
Docs: [AEA-1234] - Update README.md
Upgrade: [dependabot] - Bump pip-licenses from 4.3.3 to 4.3.4
```

Supported tags and their meanings are defined in the [contributing guidelines](./CONTRIBUTING.md).

## Running a release

Once all desired pull requests have been merged to `main`, a release can be run using the `Release to NPM` workflow. This will:

- Run quality checks on the code, including license checks, linting, and unit tests.
- Run semantic-release to determine the next version number and create a release.
- Publish the release to GitHub and npm.
