# VPN Keybase Bot

## Overview
This bot runs an Algo VPN script

## Local Installation Guide
### 1. Install and run keybase on local device

You should install and run the keybase application on your device.

> **Note**: We recommend either creating a dedicated Keybase account for the bot, or if you decide to reuse your own account at the very least create a dedicated paperkey so you can revoke it later if the machines rise up.

#### Example for Ubuntu installation

```
curl --remote-name https://prerelease.keybase.io/keybase_amd64.deb
sudo apt install ./keybase_amd64.deb
run_keybase
```

### 2. Download the source & install dependencies

Clone the repository with the following command:

```sh
git clone https://github.com/Tgemayel/vpnbot.git
```

Next, navigate into the project folder of downloaded source and install the NPM dependencies:

```sh
cd vpnbot
yarn install (or npm install)
```

### 3. Configuration
Before run bot server, we should set configuration and environment variables.

In the project on terminal, copy .env.example file to .env file.

```
 cp .env.example .env
```

Change the keybase account info in the .env file and save it.

running:
```
npm start (or yarn start)
```
