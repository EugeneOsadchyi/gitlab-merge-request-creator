# Gitlab - Create Merge Request

A simple tool which creates a new Merge Request in the GitLab from the current branch.

It sets you, as an __'assignee'__ and your team as __'reviewers'__.

## Table of contents
- [Gitlab - Create Merge Request](#gitlab---create-merge-request)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
    - [Available options](#available-options)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Usage
```sh
create-mr --title 'I am a title' --draft true
```

### Available options
 - __title__ - the title of the Merge Request
 - __description__ - the description of the Merge Request (default: [Merge Request template](https://docs.gitlab.com/ee/user/project/description_templates.html), if it is configured)
 - __draft__ - is the Merge Request should be a Draft (default: true)


## Prerequisites
- GitLab
- NodeJS (I am using [asdf](https://asdf-vm.com/) as a version manager)
- Gitlab Personal Access Token with API access (https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- Merge Request approval rule configured on the GitLab project (https://docs.gitlab.com/ee/user/project/merge_requests/approvals/rules.html)


## Installation
1. Create a copy of the `config.json` and fill the gaps
    ```sh
    cp config.example.json config.json
    ```

    Example:
    ```json
    {
      "gitlabBaseURL": "https://gitlab.com/api",
      "personalAccessToken": "1234567890",
      "approvalRuleName": "Team Sunrisers",
      "targetBranch": "develop"
    }
    ```
2. Install dependencies
    ```sh
    npm install
    ```
3. Compile the project
    ```sh
    npm run build
    ```
4. Add an alias in you `.bashrc`/`.zshrc` to the script
    ```sh
    echo "alias create-mr=\"node $(pwd)/build/src/index.js\"" >> ~/.bashrc
    ```
    or
    ```sh
    echo "alias create-mr=\"node $(pwd)/build/src/index.js\"" >> ~/.zshrc
    ```
5. Apply the changes to the current terminal session
    ```sh
    source ~/.bashrc
    ```
    or
    ```sh
    source ~/.zshrc
    ```
