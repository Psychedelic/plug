![](https://storageapi.fleek.co/fleek-team-bucket/plug-banner.png)

# Plug

[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Discord](https://img.shields.io/badge/Discord-Channel-blue)](https://discord.gg/yVEcEzmrgm)

## Introduction

Welcome to Plug! An [Internet Computer](https://dfinity.org/) crypto wallet and authentication provider as a browser extension. Find our latest version in this repository's releases, or on our [website](https://plugwallet.ooo/). You can go to our [documentation](https://docs.plugwallet.ooo/) to learn more about how to interact with Plug as a developer.

> **Warning: Plug is still alpha software - treat it as a hot wallet.**

This repository is the frontend for Plug's browser extension. It uses the [Plug Controller](https://github.com/Psychedelic/plug-controller) and the [Plug Inpage Provider](https://github.com/Psychedelic/plug-inpage-provider) to power the features in Plug and all its interactions with the Internet Computer.

## Browser Support

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](/) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](/) | [![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](/) | [![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png)](/) |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 49 & later ✔                                                                                  | 52 & later ✔                                                                                     | 36 & later ✔                                                                               | 79 & later ✔                                                                            | Latest ✔                                                                                   |

## 🚀 Install

Plug can be installed in two ways. You can get it from the official **Chrome Extension Store or the Firefox Add-on Store** (recommended, receives auto-updates):

- [Get from Chrome Extension Store (Chrome, Brave, Chromium)](https://chrome.google.com/webstore/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm)
- [Get from Firefox Add-on Store (Firefox browser)](https://addons.mozilla.org/en-US/firefox/addon/plug/)

Or download the latest version's build in this **repository's releases**, and follow the guides below for a manual installation (doesn't auto-update):

- [Install Plug in Chrome (GitHub build)](./docs/install-plug-in-chrome.md)
- [Install Plug in Firefox (GitHub build)](./docs/install-plug-in-firefox.md)

## 🏗️ Development Quick Start

Ensure you have

- [Node.js](https://nodejs.org) 10 or later installed
- [Yarn](https://yarnpkg.com) v1 or v2 installed

You need a **personal access token** to install some of our npm packages.

The token must have the `repo` and `read:packages` scopes to login to the [GitHub Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

If you don't have one, create the personal access token [in the developer settings](https://github.com/settings/tokens).

Run the following command to authenticate, using the **personal access token** as your **password**:

```
npm login --registry=https://npm.pkg.github.com --scope=@psychedelic
```

Then run the following:

- `yarn install` to install dependencies.
- `yarn run dev:chrome` to start the development server for chrome extension
- `yarn run dev:firefox` to start the development server for firefox addon
- `yarn run dev:opera` to start the development server for opera extension
- `yarn run build:chrome` to build chrome extension
- `yarn run build:firefox` to build firefox addon
- `yarn run build:opera` to build opera extension
- `yarn run build` builds and packs extensions all at once to extension/ directory

### Development

- `yarn install` to install dependencies.
- To watch file changes in development

  - Chrome
    - `yarn run dev:chrome`
  - Firefox
    - `yarn run dev:firefox`
  - Opera
    - `yarn run dev:opera`

- **Load extension in browser**

- ### Chrome

  - Go to the browser address bar and type `chrome://extensions`
  - Check the `Developer Mode` button to enable it.
  - Click on the `Load Unpacked Extension…` button.
  - Select your extension’s extracted directory.

- ### Firefox

  - Load the Add-on via `about:debugging` as temporary Add-on.
  - Choose the `manifest.json` file in the extracted directory

- ### Opera

  - Load the extension via `opera:extensions`
  - Check the `Developer Mode` and load as unpacked from extension’s extracted directory.

### Production

- `yarn run build` builds the extension for all the browsers to `extension/BROWSER` directory respectively.

Note: By default the `manifest.json` is set with version `0.0.0`. The webpack loader will update the version in the build with that of the `package.json` version. In order to release a new version, update version in `package.json` and run script.

If you don't want to use `package.json` version, you can disable the option [here](https://github.com/abhijithvijayan/web-extension-starter/blob/e10158c4a49948dea9fdca06592876d9ca04e028/webpack.config.js#L79).

### Generating browser specific manifest.json

Update `source/manifest.json` file with browser vendor prefixed manifest keys

```js
{
  "__chrome__name": "SuperChrome",
  "__firefox__name": "SuperFox",
  "__edge__name": "SuperEdge",
  "__opera__name": "SuperOpera"
}
```

if the vendor is `chrome` this compiles to:

```js
{
  "name": "SuperChrome",
}
```

---

Add keys to multiple vendors by separating them with | in the prefix

```
{
  __chrome|opera__name: "SuperBlink"
}
```

if the vendor is `chrome` or `opera`, this compiles to:

```
{
  "name": "SuperBlink"
}
```

See the original [README](https://github.com/abhijithvijayan/wext-manifest-loader) of `wext-manifest-loader` package for more details

### Linting Config

- Shared Eslint & Prettier Configuration - [`@abhijithvijayan/eslint-config`](https://www.npmjs.com/package/@abhijithvijayan/eslint-config)

## License

Plug extension © Fleek LLC
Original template MIT © [Abhijith Vijayan](https://abhijithvijayan.in)
