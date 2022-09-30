![Plug Banner](https://storageapi.fleek.co/fleek-team-bucket/plug-banner.png)

# 🔌 Plug Extension - E2E Tests

[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Discord](https://img.shields.io/badge/Discord-Channel-blue)](https://discord.gg/yVEcEzmrgm)

## 📖 Introduction

This folder contains E2E tests for Plug Extensions written using Puppeteer.

#### ✅ Covered functionalities:

- Create wallet
- Import wallet
- Send tokens
- Send custom tokens
- Send NFTs
- Deposit view
- Add custom token
- Add network
- Edit account
- Create account
- Lock wallet
- Settings: Contacts
- Settings: Secret Recovery Phrase
- Settings: Network
- Settings: Export DFX Identity 
- Settings: Help 

## ⚙️ Development

You need to perform following actions to start developing new tests:

1. Clone Plug Extension repository
2. Install dependencies by running `yarn`
3. Switch directory `cd tests`
4. Create new Plug Extension build by running `yarn build`
5. Run tests with `yarn test` or `yarn test:watch` command.
6. Enjoy! 🙌

> ⚠️ IMPORTANT NOTE:
Tests couldn't be used in CI/CD process due to lack of headless mode for extensions, so they should be run in the release branch before the merge

### 📗 Elements selection 

### <em> Elements Must Be Selectable by <strong> data-testid</strong> property</em>, e.g:

```html
<Button data-testid="add-network-button" variant="rainbow" onClick={handleAddNetwork} /> 
```

### 🔐 Environment variables 

| Variable        | Usage      |
| ------------- |:-------------:| 
| `SEEDPHRASE`      | Seedphrase to unlock test wallet |
| `MAIN_PRINCIPAL_ID`     | Principal ID of test wallet main account      |  
| `MAIN_ACCOUNT_ID` | Account ID of test wallet main account      | 
| `SUB_PRINCIPAL_ID` | Principal ID of test wallet sub account      | 
| `SUB_ACCOUNT_ID` | Account ID of test wallet sub account      | 
| `ICNS_NAME` | ICNS name | 
| `PASSWORD` | Wallet password      | 
| `DUST_CANISTER_ID` | DUST Canister ID      | 
| `BETA_CANISTER_ID` |   BETA Canister ID  | 
| `WTC_CANISTER_ID` | WTC Canister ID      | 
| `XTC_CANISTER_ID` | XTC Canister ID      | 
| `WICP_CANISTER_ID` | WICP Canister ID      | 
| `TEST_COIN_CANISTER_ID` | TEST Canister ID      | 
| `WRONG_ID` | Wrong Principal ID     | 
| `WRONG_ACCOUNT_ID` | Wrong Account ID      | 
| `WRONG_CANISTER_ID` | Wrong Canister ID      | 
| `WRONG_ICNS_NAME` | Non-existing ICNS name      |
| `NETWORK_NAME` | Network name      |
| `HOST_NAME` | Network Host name      |
| `CANISTER_ID` | Network Canister ID     |
| `WRONG_HOST_NAME` | Wrong Network Host name      |



