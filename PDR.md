# Project Design Requirements (PDR)
## Mobile P2Pool XMR Observer App

**Date:** January 29, 2026  
**Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current Project Structure](#2-current-project-structure)
3. [P2Pool Documentation](#3-p2pool-documentation)
4. [P2Pool Observer API](#4-p2pool-observer-api)
5. [Similar Projects](#5-similar-projects)
6. [Tech Stack](#6-tech-stack)
7. [Implementation Plan](#7-implementation-plan)
8. [API Endpoints Reference](#8-api-endpoints-reference)

---

## 1. Project Overview

### 1.1 Objective

Create a simple mobile application that allows users to monitor their P2Pool mining statistics for a single XMR (Monero) address. The app will fetch and display relevant mining information from the P2Pool Observer API.

### 1.2 Key Features

- **Address Input**: Allow user to enter/save a single XMR wallet address
- **Mining Statistics**: Display shares, payouts, and miner information
- **Pool Status**: Show current P2Pool network status
- **Payout History**: List recent payouts received
- **Real-time Updates**: Periodic refresh of mining data
- **Offline Support**: Cache last known data for offline viewing
- **Check Sidechains**: Change the chain bwtween p2pool main, mini and nano

### 1.3 Target Platforms

- Android
- iOS
- (Optional) Web

---

## 2. Current Project Structure

### 2.1 File Layout

```
mob_xmr_observer_app/
├── App.tsx                 # Root app entry point
├── src/
│   └── App.tsx            # Main application component
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── .eslintrc.cjs          # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md              # Project documentation
```

### 2.2 Current Dependencies

```json
{
  "dependencies": {
    "expo": "^54.0.31",
    "react": "18.2.0",
    "react-native": "0.73.6"
  },
  "devDependencies": {
    "@types/react": "18.2.79",
    "typescript": "5.4.5",
    "eslint": "8.57.0",
    "prettier": "3.2.5"
  }
}
```

### 2.3 Current App State

The project is an Expo-managed React Native boilerplate with TypeScript support. It has a basic UI structure ready for development.

---

## 3. P2Pool Documentation

### 3.1 What is P2Pool?

P2Pool is a decentralized mining pool for Monero that combines the advantages of pool mining and solo mining:

- **Decentralized**: No central server that can be shutdown/blocked
- **Permissionless**: No one decides who can mine
- **Trustless**: No pool wallet, funds are never in custody
- **0% fee**: No pool fees
- **~0.00027 XMR minimal payout**: Very low minimum payout threshold
- **PPLNS payout scheme**: Pay-Per-Last-N-Shares

### 3.2 P2Pool Sidechains

| Sidechain | Block Time | Minimum Difficulty | Target Hashrate |
|-----------|------------|-------------------|-----------------|
| **Main** | 10 seconds | 100,000 | Higher hashrate miners |
| **Mini** | 10 seconds | 100,000 | Lower hashrate miners |
| **Nano** | 10 seconds | 100,000 | Very low hashrate miners |

### 3.3 How Payouts Work

1. Miner finds a pool share
2. Share stays in PPLNS window for up to 2160 pool blocks (6 hours)
3. When P2Pool finds a Monero block, miners with shares in the PPLNS window receive payouts
4. Payout is proportional to the total difficulty of shares in the PPLNS window

### 3.4 Key Parameters

- **Block time**: 10 seconds
- **PPLNS window**: Up to 2160 blocks (6 hours, auto-adjustable)
- **Uncle penalty**: 20%
- **Minimum payout**: ~0.00027 XMR (Monero block reward / 2160)

### 3.5 P2Pool Observer Instances

| Observer | URL | Sidechain |
|----------|-----|-----------|
| P2Pool.Observer | https://p2pool.observer | Main |
| MINI.P2Pool.Observer | https://mini.p2pool.observer | Mini |
| NANO.P2Pool.Observer | https://nano.p2pool.observer | Nano |

**Source Code**: https://git.gammaspectra.live/P2Pool/observer

---

## 4. P2Pool Observer API

### 4.1 Base URLs

- **Main**: `https://p2pool.observer/api`
- **Mini**: `https://mini.p2pool.observer/api`
- **Nano**: `https://nano.p2pool.observer/api`

### 4.2 Common Types

| Type | Description | Format |
|------|-------------|--------|
| `types.Hash` | 256-bit hash value | 64 hexadecimal characters |
| `address.Address` | Monero address | Base58 encoded |
| `types.Difficulty` | 128-bit unsigned integer | 64-bit number or 32 hex chars |

### 4.3 Key Endpoints

#### GET /api/pool_info
Returns general information about the P2Pool sidechain and Monero network.

**Response includes:**
- `sidechain`: Current sidechain status (last block, effort, window stats)
- `mainchain`: Monero network info (height, difficulty, reward)
- `versions`: Latest P2Pool and Monero versions

#### GET /api/miner_info/{address}
Returns information about a specific miner.

**Parameters:**
- `address`: Monero wallet address (starting with 4)
- `?shareEstimates`: (optional) Use estimates for share count

**Response:**
```json
{
  "id": 3,
  "address": "47ab14...",
  "shares": [
    {
      "shares": 559294,
      "uncles": 17861,
      "last_height": 4868281
    }
  ],
  "last_share_height": 4868281,
  "last_share_timestamp": 1681256979
}
```

#### GET /api/payouts/{address}
Returns payouts received by the miner.

**Parameters:**
- `address`: Monero wallet address
- `?search_limit`: Maximum records to return (default: 10, 0 for all)

**Response:**
```json
[
  {
    "miner": 3,
    "template_id": "...",
    "side_height": 5428093,
    "main_id": "...",
    "main_height": 2910747,
    "timestamp": 1687085695,
    "coinbase_id": "...",
    "coinbase_reward": 3400854816,
    "coinbase_private_key": "...",
    "coinbase_output_index": 26,
    "global_output_index": 75393989
  }
]
```

#### GET /api/side_blocks_in_window/{address}
Returns sidechain blocks for a miner in the current PPLNS window.

**Parameters:**
- `address`: Monero wallet address
- `?window`: Window size (max: PPLNS_WINDOW * 4 * 7)
- `?from`: Height to start from

#### GET /api/shares
Returns recent sidechain shares.

**Parameters:**
- `?limit`: Maximum records (default: 50, max: PPLNS_WINDOW)
- `?miner`: Filter by miner address
- `?onlyBlocks`: Exclude uncle shares

#### GET /api/found_blocks
Returns blocks found on the Monero network by P2Pool.

**Parameters:**
- `?limit`: Maximum records (default: 50, max: 1000)
- `?miner`: Filter by miner address

#### WebSocket /api/events
Real-time event stream for:
- `side_block`: New sidechain block
- `found_block`: New Monero block found by P2Pool
- `orphaned_block`: Orphaned block

---

## 5. Similar Projects

### 5.1 Gupax

**Repository**: https://github.com/gupax-io/gupax  
**Stars**: 441+  
**Language**: Rust (Desktop GUI)

**Description**: GUI Uniting P2Pool And XMRig. A desktop application for mining Monero on P2Pool with XMRig.

**Features**:
- Integrated P2Pool and XMRig management
- Local Monero node support
- Remote node crawler
- XMRvsBeast raffle participation
- Status monitoring and benchmarks

**Relevance**: Shows what data points are important to miners and how to present mining statistics.

### 5.2 P2Pool Observer (Web)

**Repository**: https://git.gammaspectra.live/P2Pool/observer  
**Language**: Go (97.7%)

**Description**: Official P2Pool Observer web application providing statistics and historical archives.

**Features**:
- Real-time pool statistics
- Miner lookup by address
- Payout history
- Block explorer
- WebSocket events API

**Relevance**: Primary data source for our mobile app. The web interface serves as a reference for data presentation.

### 5.3 Related Mobile Apps (Monero Ecosystem)

| App | Platform | Description |
|-----|----------|-------------|
| Cake Wallet | iOS/Android | Full Monero wallet with P2Pool payout support |
| Monerujo | Android | Monero wallet compatible with P2Pool payouts |
| Feather Wallet | Desktop | Monero wallet with mining features |

**Note**: There is currently no dedicated mobile app for P2Pool mining statistics, making this project unique in the ecosystem.

---

## 6. Tech Stack

### 6.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.73.6 | Cross-platform mobile framework |
| **Expo** | 54.x | Development platform & tooling |
| **TypeScript** | 5.4.5 | Type-safe JavaScript |

### 6.2 Recommended Additional Dependencies

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "react-native-screens": "latest",
    "react-native-safe-area-context": "latest",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "@react-native-async-storage/async-storage": "latest",
    "axios": "^1.x",
    "date-fns": "^3.x",
    "react-native-svg": "latest"
  }
}
```

### 6.3 Architecture Pattern

```
src/
├── api/                    # API clients and types
│   ├── p2poolObserver.ts   # P2Pool Observer API client
│   └── types.ts            # API response types
├── components/             # Reusable UI components
│   ├── common/             # Generic components
│   └── mining/             # Mining-specific components
├── hooks/                  # Custom React hooks
│   ├── usePoolInfo.ts
│   ├── useMinerInfo.ts
│   └── usePayouts.ts
├── screens/                # Screen components
│   ├── HomeScreen.tsx
│   ├── StatsScreen.tsx
│   ├── PayoutsScreen.tsx
│   └── SettingsScreen.tsx
├── store/                  # State management
│   └── useStore.ts
├── utils/                  # Utility functions
│   ├── formatters.ts       # XMR amount formatting
│   └── validators.ts       # Address validation
├── theme/                  # Styling and theming
│   └── index.ts
└── App.tsx                 # Root component
```

### 6.4 Expo Documentation Links

- **Overview**: https://docs.expo.dev/guides/overview
- **Routing**: https://docs.expo.dev/router/basics/layout
- **Hooks API**: https://docs.expo.dev/router/reference/hooks
- **Testing**: https://docs.expo.dev/router/reference/testing

### 6.5 React Native Documentation

- **Getting Started**: https://reactnative.dev/docs/getting-started
- **Environment Setup**: https://reactnative.dev/docs/environment-setup
- **Core Components**: https://reactnative.dev/docs/intro-react-native-components

---

## 7. Implementation Plan

### Phase 1: Core Setup
- [ ] Set up project structure and folders
- [ ] Add navigation (React Navigation or Expo Router)
- [ ] Create basic screens (Home, Stats, Payouts, Settings)
- [ ] Implement theme and styling system

### Phase 2: API Integration
- [ ] Create P2Pool Observer API client
- [ ] Define TypeScript types for API responses
- [ ] Implement data fetching hooks with React Query
- [ ] Add error handling and loading states

### Phase 3: Core Features
- [ ] Address input and validation
- [ ] Display miner information
- [ ] Show payout history
- [ ] Display pool statistics

### Phase 4: Enhanced Features
- [ ] Local storage for saved address
- [ ] Pull-to-refresh functionality
- [ ] Notification support (optional)
- [ ] Multiple sidechain support (main/mini/nano)

### Phase 5: Polish
- [ ] Offline mode with cached data
- [ ] Dark/Light theme toggle
- [ ] Localization (English/Portuguese)
- [ ] Performance optimization

---

## 8. API Endpoints Reference

### Quick Reference Table

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pool_info` | GET | Pool and network status |
| `/api/miner_info/{address}` | GET | Miner statistics |
| `/api/payouts/{address}` | GET | Payout history |
| `/api/side_blocks_in_window` | GET | Blocks in PPLNS window |
| `/api/side_blocks_in_window/{address}` | GET | Miner blocks in window |
| `/api/shares` | GET | Recent shares |
| `/api/found_blocks` | GET | Found Monero blocks |
| `/api/block_by_id/{id}` | GET | Block details by ID |
| `/api/block_by_height/{height}` | GET | Block details by height |
| `/api/events` | WebSocket | Real-time events |
| `/api/last_found` | GET | Last found block (redirect) |
| `/api/tip` | GET | Latest share (redirect) |

### Example API Calls

```typescript
// Get pool info
const poolInfo = await fetch('https://p2pool.observer/api/pool_info');

// Get miner info
const address = '47ab14EokGgCTX7RYoVhrNMjVA7GfW1jyMAmL7qBQz9fa4RZ6ZsBUgeRGuPWjqeM1wLptSJH5xuX2H4mAepMYvu6JqWMsGw';
const minerInfo = await fetch(`https://p2pool.observer/api/miner_info/${address}`);

// Get payouts (last 20)
const payouts = await fetch(`https://p2pool.observer/api/payouts/${address}?search_limit=20`);

// Get shares in current window
const shares = await fetch(`https://p2pool.observer/api/side_blocks_in_window/${address}`);
```

### XMR Amount Formatting

P2Pool API returns amounts in atomic units (piconero). To convert to XMR:

```typescript
const formatXMR = (atomicUnits: number): string => {
  const xmr = atomicUnits / 1e12;
  return xmr.toFixed(12).replace(/\.?0+$/, '');
};

// Example: 3400854816 -> "0.003400854816" XMR
```

### Address Validation

Monero addresses:
- **Primary address**: Starts with `4`, 95 characters
- **Subaddress**: Starts with `8`, 95 characters
- Both use Base58 encoding with checksum

```typescript
const isValidMoneroAddress = (address: string): boolean => {
  if (!address) return false;
  if (address.length !== 95) return false;
  if (!address.startsWith('4') && !address.startsWith('8')) return false;
  // Additional Base58 validation can be added
  return true;
};
```

---

## Appendix A: P2Pool Official Resources

- **P2Pool GitHub**: https://github.com/SChernykh/p2pool
- **P2Pool.io**: https://p2pool.io
- **P2Pool FAQ**: https://p2pool.io/#faq
- **P2Pool Setup Help**: https://p2pool.io/#help
- **Seth's Guide**: https://sethforprivacy.com/guides/run-a-p2pool-node/

## Appendix B: Monero Resources

- **Monero Project**: https://github.com/monero-project/monero
- **GetMonero.org**: https://www.getmonero.org
- **Monero Downloads**: https://www.getmonero.org/downloads/

## Appendix C: Development Tools

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook

---

*This document was generated on January 29, 2026 as part of the mob_xmr_observer_app project planning phase.*
