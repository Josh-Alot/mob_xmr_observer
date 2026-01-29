# Project Requirements Document
## Mobile P2Pool XMR Observer App

**Version:** 1.0.0  
**Date:** January 29, 2026

---

## Table of Contents

1. [Functional Requirements](#1-functional-requirements)
2. [Non-Functional Requirements](#2-non-functional-requirements)
3. [Tech Stack](#3-tech-stack)
4. [Architecture & System Design](#4-architecture--system-design)
5. [Security Requirements](#5-security-requirements)
6. [Mobile Development Best Practices](#6-mobile-development-best-practices)
7. [API Consumption Guidelines](#7-api-consumption-guidelines)

---

## 1. Functional Requirements

### 1.1 User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | User can enter a Monero wallet address (starting with `4` or `8`) | High |
| FR-002 | User can save/persist a single wallet address locally | High |
| FR-003 | User can clear/change saved wallet address | High |
| FR-004 | Address validation with visual feedback (valid/invalid) | High |
| FR-005 | QR code scanning for address input | Medium |

### 1.2 Mining Statistics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-010 | Display current shares count (shares + uncles) | High |
| FR-011 | Display last share timestamp with relative time | High |
| FR-012 | Display last share height | High |
| FR-013 | Display estimated hashrate (when available) | Medium |
| FR-014 | Display shares in current PPLNS window | High |
| FR-015 | Display total blocks mined by address | Medium |

### 1.3 Payout Information

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-020 | Display list of recent payouts (configurable limit) | High |
| FR-021 | Display payout amount in XMR (formatted) | High |
| FR-022 | Display payout timestamp with date/time | High |
| FR-023 | Display payout Monero block height | Medium |
| FR-024 | Calculate and display total earnings | Medium |
| FR-025 | Display payout transaction ID (linkable to explorer) | Low |

### 1.4 Pool Status

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-030 | Display current P2Pool sidechain status | High |
| FR-031 | Display current Monero network info (height, difficulty) | High |
| FR-032 | Display current block reward | High |
| FR-033 | Display pool hashrate | Medium |
| FR-034 | Display number of miners | Medium |
| FR-035 | Display pool effort percentage | Medium |

### 1.5 Multi-Sidechain Support

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-040 | Support Main sidechain (p2pool.observer) | High |
| FR-041 | Support Mini sidechain (mini.p2pool.observer) | High |
| FR-042 | Support Nano sidechain (nano.p2pool.observer) | High |
| FR-043 | Easy switching between sidechains | High |
| FR-044 | Persist selected sidechain preference | Medium |

### 1.6 Data Refresh & Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-050 | Manual pull-to-refresh on all data screens | High |
| FR-051 | Auto-refresh data at configurable intervals (1-30 min) | Medium |
| FR-052 | Background refresh with local notifications | Low |
| FR-053 | Push notification on new payout received | Low |

### 1.7 Offline Support

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-060 | Cache last fetched data locally | High |
| FR-061 | Display cached data when offline with indicator | High |
| FR-062 | Display last sync timestamp | High |
| FR-063 | Automatic retry on connectivity restore | Medium |

### 1.8 User Interface

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-070 | Bottom tab navigation (Home, Stats, Payouts, Settings) | High |
| FR-071 | Dark mode support | High |
| FR-072 | Light mode support | High |
| FR-073 | System theme auto-detection | Medium |
| FR-074 | Localization: English | High |
| FR-075 | Localization: Portuguese | High |

---

## 2. Non-Functional Requirements

### 2.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | App cold start time | < 2 seconds |
| NFR-002 | Screen transition time | < 300ms |
| NFR-003 | API response handling | < 500ms (UI feedback) |
| NFR-004 | Memory usage (idle) | < 100MB |
| NFR-005 | Memory usage (active) | < 200MB |
| NFR-006 | Battery impact | Minimal (< 1%/hour idle) |

### 2.2 Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-010 | App crash rate | < 0.1% of sessions |
| NFR-011 | API error recovery | Graceful with retry |
| NFR-012 | Data persistence reliability | 99.9% |
| NFR-013 | Offline functionality | Full read of cached data |

### 2.3 Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-020 | Android minimum version | Android 8.0 (API 26) |
| NFR-021 | iOS minimum version | iOS 14.0 |
| NFR-022 | Screen size support | 4" to tablets |
| NFR-023 | Orientation support | Portrait (primary) |
| NFR-024 | Accessibility compliance | WCAG 2.1 AA |

### 2.4 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-030 | Concurrent API requests | Max 3 parallel |
| NFR-031 | Cache size limit | 10MB max |
| NFR-032 | Payout history limit | 1000 entries max |

### 2.5 Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-040 | Code coverage (unit tests) | > 70% |
| NFR-041 | Code coverage (integration) | > 50% |
| NFR-042 | Linting compliance | 100% (ESLint) |
| NFR-043 | TypeScript strict mode | Enabled |
| NFR-044 | Documentation coverage | All public APIs |

---

## 3. Tech Stack

### 3.1 Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.76.x (New Architecture) | Cross-platform mobile framework |
| **Expo** | SDK 52+ | Development platform & tooling |
| **TypeScript** | 5.6.x | Type-safe development |
| **Node.js** | 20.x LTS | Development runtime |

### 3.2 Navigation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo Router** | 4.x | File-based routing (recommended) |
| **React Navigation** | 7.x | Navigation primitives |
| **react-native-screens** | 4.x | Native navigation containers |
| **react-native-safe-area-context** | 4.x | Safe area handling |

### 3.3 State Management & Data Fetching

| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Query** | 5.x | Server state management & caching |
| **Zustand** | 5.x | Client state management |
| **@react-native-async-storage/async-storage** | 2.x | Persistent storage |
| **react-native-mmkv** | 3.x | High-performance key-value storage |

### 3.4 Networking

| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.7.x | HTTP client with interceptors |
| **ky** | 1.x | Alternative: lightweight HTTP client |
| **expo-secure-store** | 14.x | Secure credential storage |

### 3.5 UI Components & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tamagui** | 1.x | Cross-platform UI kit (recommended) |
| **NativeWind** | 4.x | Alternative: Tailwind for RN |
| **react-native-reanimated** | 3.x | Smooth animations |
| **react-native-gesture-handler** | 2.x | Gesture handling |
| **react-native-svg** | 15.x | SVG rendering |
| **expo-haptics** | 14.x | Haptic feedback |
| **expo-blur** | 14.x | Blur effects |

### 3.6 Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | 4.x | Date manipulation |
| **zod** | 3.x | Runtime validation |
| **bignumber.js** | 9.x | Precise number handling (XMR) |
| **expo-clipboard** | 7.x | Clipboard operations |
| **expo-linking** | 7.x | Deep linking |

### 3.7 Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Jest** | 29.x | Unit testing framework |
| **React Native Testing Library** | 12.x | Component testing |
| **MSW** | 2.x | API mocking |
| **Detox** | 20.x | E2E testing |

### 3.8 Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.x | Code linting (flat config) |
| **Prettier** | 3.x | Code formatting |
| **Husky** | 9.x | Git hooks |
| **lint-staged** | 15.x | Pre-commit linting |
| **Commitlint** | 19.x | Commit message linting |

### 3.9 Monitoring & Analytics (Optional)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Sentry** | 6.x | Error tracking |
| **expo-updates** | 0.27.x | OTA updates |

### 3.10 Package.json (Recommended)

```json
{
  "name": "p2pool-observer-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepare": "husky"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-haptics": "~14.0.0",
    "expo-clipboard": "~7.0.0",
    "expo-linking": "~7.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-screens": "~4.4.0",
    "react-native-safe-area-context": "~4.14.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-svg": "~15.8.0",
    "react-native-mmkv": "~3.2.0",
    "@tanstack/react-query": "~5.62.0",
    "zustand": "~5.0.0",
    "axios": "~1.7.9",
    "zod": "~3.24.0",
    "date-fns": "~4.1.0",
    "bignumber.js": "~9.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@types/react": "~18.3.0",
    "@testing-library/react-native": "~12.9.0",
    "typescript": "~5.6.0",
    "eslint": "~9.17.0",
    "prettier": "~3.4.0",
    "jest": "~29.7.0",
    "jest-expo": "~52.0.0",
    "husky": "~9.1.0",
    "lint-staged": "~15.2.0"
  }
}
```

---

## 4. Architecture & System Design

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile Application                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐ │
│  │    Home     │  │    Stats    │  │   Payouts   │  │Settings│ │
│  │   Screen    │  │   Screen    │  │   Screen    │  │ Screen │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └───┬────┘ │
│         │                │                │              │      │
│  ┌──────┴────────────────┴────────────────┴──────────────┴────┐ │
│  │                    Presentation Layer                       │ │
│  │  • UI Components  • Hooks  • Navigation  • Theming          │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
│                                │                                 │
│  ┌─────────────────────────────┴───────────────────────────────┐ │
│  │                     Domain Layer                             │ │
│  │  • Business Logic  • Validation  • Data Transformation       │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
│                                │                                 │
│  ┌─────────────────────────────┴───────────────────────────────┐ │
│  │                      Data Layer                              │ │
│  │  • API Client  • Cache  • Local Storage  • State Management  │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │    P2Pool Observer API   │
                    │  (Main / Mini / Nano)    │
                    └─────────────────────────┘
```

### 4.2 Project Structure

```
mob_xmr_observer_app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab layout configuration
│   │   ├── index.tsx             # Home screen
│   │   ├── stats.tsx             # Stats screen
│   │   ├── payouts.tsx           # Payouts screen
│   │   └── settings.tsx          # Settings screen
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx            # 404 screen
├── src/
│   ├── api/                      # API layer
│   │   ├── client.ts             # Axios instance configuration
│   │   ├── endpoints.ts          # API endpoint definitions
│   │   ├── p2pool-api.ts         # P2Pool API methods
│   │   └── types/                # API types
│   │       ├── pool-info.ts
│   │       ├── miner-info.ts
│   │       ├── payouts.ts
│   │       └── index.ts
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Text.tsx
│   │   │   └── index.ts
│   │   ├── mining/               # Mining-specific components
│   │   │   ├── AddressInput.tsx
│   │   │   ├── SharesCard.tsx
│   │   │   ├── PayoutItem.tsx
│   │   │   ├── PoolStatusCard.tsx
│   │   │   └── index.ts
│   │   └── feedback/             # Feedback components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── index.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── queries/              # TanStack Query hooks
│   │   │   ├── usePoolInfo.ts
│   │   │   ├── useMinerInfo.ts
│   │   │   ├── usePayouts.ts
│   │   │   └── useSharesInWindow.ts
│   │   ├── useAddress.ts         # Address management
│   │   ├── useSidechain.ts       # Sidechain selection
│   │   ├── useTheme.ts           # Theme management
│   │   └── index.ts
│   ├── store/                    # State management
│   │   ├── slices/               # Zustand slices
│   │   │   ├── addressSlice.ts
│   │   │   ├── settingsSlice.ts
│   │   │   └── cacheSlice.ts
│   │   ├── store.ts              # Combined store
│   │   └── index.ts
│   ├── services/                 # Business logic services
│   │   ├── address-validator.ts
│   │   ├── xmr-formatter.ts
│   │   ├── cache-manager.ts
│   │   └── index.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts         # Date/number formatting
│   │   ├── constants.ts          # App constants
│   │   └── index.ts
│   ├── theme/                    # Theming
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── i18n/                     # Internationalization
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── pt.json
│   │   └── index.ts
│   └── types/                    # Global types
│       ├── navigation.ts
│       └── index.ts
├── assets/                       # Static assets
│   ├── images/
│   └── fonts/
├── __tests__/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── app.json                      # Expo configuration
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint flat config
├── jest.config.js                # Jest configuration
└── package.json
```

### 4.3 Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Interaction                          │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                      React Components                             │
│  • Render UI based on state                                       │
│  • Dispatch actions through hooks                                 │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Custom Hooks                                │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │  TanStack Query │    │     Zustand     │                      │
│  │  (Server State) │    │ (Client State)  │                      │
│  │  • API Data     │    │ • User Prefs    │                      │
│  │  • Caching      │    │ • UI State      │                      │
│  │  • Refetching   │    │ • Sidechain     │                      │
│  └────────┬────────┘    └────────┬────────┘                      │
│           │                      │                               │
└───────────┼──────────────────────┼───────────────────────────────┘
            │                      │
            ▼                      ▼
┌───────────────────────┐  ┌───────────────────────┐
│     API Client        │  │   Persistent Storage   │
│  • Axios Instance     │  │  • MMKV/AsyncStorage  │
│  • Interceptors       │  │  • SecureStore        │
│  • Error Handling     │  │                       │
└───────────┬───────────┘  └───────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────────┐
│                     P2Pool Observer API                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │    Main     │  │    Mini     │  │    Nano     │               │
│  │ p2pool.obs  │  │ mini.p2pool │  │ nano.p2pool │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└───────────────────────────────────────────────────────────────────┘
```

### 4.4 State Management Architecture

```typescript
// Store Structure
interface AppState {
  // Address slice
  address: {
    current: string | null;
    isValid: boolean;
    lastValidated: number;
  };
  
  // Settings slice
  settings: {
    sidechain: 'main' | 'mini' | 'nano';
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'pt';
    refreshInterval: number; // minutes
    notificationsEnabled: boolean;
  };
  
  // Cache slice
  cache: {
    lastSync: number;
    minerInfo: MinerInfo | null;
    poolInfo: PoolInfo | null;
    payouts: Payout[];
  };
}
```

### 4.5 API Client Architecture

```typescript
// Layered API architecture
// Layer 1: HTTP Client (Axios)
// Layer 2: API Client (with interceptors, retry, error handling)
// Layer 3: Domain API (typed methods)
// Layer 4: Query Hooks (TanStack Query)

// Example flow:
usePayouts(address) 
  → p2poolApi.getPayouts(address) 
    → apiClient.get('/payouts/{address}')
      → axios.get(url, config)
```

### 4.6 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Cache Hierarchy                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  L1: TanStack Query Cache (In-Memory)                          │
│  ├── Stale time: 30 seconds                                    │
│  ├── Cache time: 5 minutes                                     │
│  └── Auto-refetch on mount/focus                               │
│                                                                 │
│  L2: MMKV Persistent Cache (Local Storage)                     │
│  ├── Updated on successful fetch                               │
│  ├── Used for offline mode                                     │
│  └── Max size: 10MB                                            │
│                                                                 │
│  L3: HTTP Cache Headers (Server Controlled)                    │
│  └── Respect Cache-Control headers                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.7 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Screens (app/)                                                 │
│  └── Smart components, data fetching, navigation                │
│                                                                 │
│  Feature Components (src/components/mining/)                    │
│  └── Domain-specific, composed from UI components               │
│                                                                 │
│  UI Components (src/components/ui/)                             │
│  └── Stateless, reusable, styled primitives                     │
│                                                                 │
│  Feedback Components (src/components/feedback/)                 │
│  └── Loading, error, empty states                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Security Requirements

### 5.1 Data Protection

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-001 | No sensitive data in logs | Strip addresses in production logs |
| SEC-002 | Secure storage for address | Use `expo-secure-store` for address |
| SEC-003 | No plaintext storage | Encrypt cached data at rest |
| SEC-004 | Memory protection | Clear sensitive data on app background |
| SEC-005 | No analytics without consent | Opt-in analytics only |

### 5.2 Network Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-010 | HTTPS only | Enforce TLS 1.3 minimum |
| SEC-011 | Certificate pinning | Pin P2Pool Observer certificates |
| SEC-012 | No HTTP fallback | Reject insecure connections |
| SEC-013 | Request timeout | Max 30 seconds per request |
| SEC-014 | Rate limiting | Max 10 requests/minute to API |
| SEC-015 | Network state validation | Verify connectivity before requests |

### 5.3 Input Validation

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-020 | Address format validation | Regex + length check (95 chars) |
| SEC-021 | Address prefix validation | Must start with `4` or `8` |
| SEC-022 | Base58 checksum validation | Verify Monero address checksum |
| SEC-023 | API response validation | Zod schema validation |
| SEC-024 | Sanitize all user inputs | Trim, normalize whitespace |
| SEC-025 | Prevent injection attacks | Encode all URL parameters |

### 5.4 Application Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-030 | No debug mode in production | Strip debug code in release |
| SEC-031 | Code obfuscation | Enable Hermes bytecode |
| SEC-032 | Root/Jailbreak detection | Warn users on compromised devices |
| SEC-033 | Screenshot protection | Prevent screenshots of sensitive data |
| SEC-034 | Biometric lock (optional) | FaceID/TouchID for app access |
| SEC-035 | Session timeout | Clear state after 30 min inactive |

### 5.5 Secure API Consumption

```typescript
// Security Configuration Example
const securityConfig = {
  // Network Security
  network: {
    enforceHttps: true,
    minTlsVersion: '1.3',
    connectionTimeout: 30000,
    readTimeout: 30000,
    certificatePins: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', // p2pool.observer
    ],
  },
  
  // Rate Limiting
  rateLimit: {
    maxRequestsPerMinute: 10,
    burstLimit: 5,
    cooldownPeriod: 60000,
  },
  
  // Request Validation
  request: {
    maxUrlLength: 2048,
    allowedDomains: [
      'p2pool.observer',
      'mini.p2pool.observer',
      'nano.p2pool.observer',
    ],
    requireContentType: true,
  },
  
  // Response Validation
  response: {
    maxBodySize: 5 * 1024 * 1024, // 5MB
    validateSchema: true,
    rejectOnValidationError: false, // Log and continue
  },
};
```

### 5.6 Secure Storage Implementation

```typescript
// Secure storage architecture
interface SecureStorageConfig {
  // Encrypted storage for sensitive data
  sensitiveData: {
    storage: 'expo-secure-store',
    encryption: 'AES-256-GCM',
    keychain: {
      accessibility: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
      requireAuthentication: false,
    },
  };
  
  // Fast storage for non-sensitive cached data
  cachedData: {
    storage: 'react-native-mmkv',
    encryption: true,
    encryptionKey: 'derived-from-device-id',
  };
}

// What goes where:
// SecureStore: wallet address, user preferences
// MMKV (encrypted): API cache, UI state
// Memory only: session tokens, temporary data
```

### 5.7 Privacy Requirements

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-040 | No tracking without consent | Privacy-first approach |
| SEC-041 | Data minimization | Only store necessary data |
| SEC-042 | User data export | Allow users to export their data |
| SEC-043 | User data deletion | Complete data wipe option |
| SEC-044 | No third-party SDKs | Minimize external dependencies |
| SEC-045 | Privacy policy display | In-app privacy policy |

---

## 6. Mobile Development Best Practices

### 6.1 Performance Optimization

#### 6.1.1 Rendering Performance

```typescript
// Use React.memo for expensive components
const PayoutItem = React.memo(({ payout }: PayoutItemProps) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const totalEarnings = useMemo(() => 
  payouts.reduce((acc, p) => acc + p.amount, 0n),
  [payouts]
);

// Use useCallback for event handlers
const handleRefresh = useCallback(() => {
  refetch();
}, [refetch]);

// Use FlashList instead of FlatList for large lists
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={payouts}
  renderItem={renderPayout}
  estimatedItemSize={80}
  keyExtractor={(item) => item.id}
/>
```

#### 6.1.2 Bundle Optimization

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Tree shaking for lodash (if used)
      'lodash',
      // Remove console logs in production
      ['transform-remove-console', { exclude: ['error', 'warn'] }],
      // Reanimated plugin (must be last)
      'react-native-reanimated/plugin',
    ],
  };
};
```

#### 6.1.3 Image Optimization

```typescript
// Use expo-image for optimized image loading
import { Image } from 'expo-image';

<Image
  source={require('./assets/logo.png')}
  style={styles.logo}
  contentFit="contain"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### 6.2 Error Handling

#### 6.2.1 Error Boundary Implementation

```typescript
// Global error boundary
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### 6.2.2 API Error Handling

```typescript
// Centralized error handling
const handleApiError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return { type: 'network', message: 'No internet connection' };
    }
    
    switch (error.response.status) {
      case 400:
        return { type: 'validation', message: 'Invalid request' };
      case 404:
        return { type: 'not_found', message: 'Miner not found' };
      case 429:
        return { type: 'rate_limit', message: 'Too many requests' };
      case 500:
        return { type: 'server', message: 'Server error' };
      default:
        return { type: 'unknown', message: 'Something went wrong' };
    }
  }
  
  return { type: 'unknown', message: 'An unexpected error occurred' };
};
```

### 6.3 Accessibility (a11y)

```typescript
// Accessible component example
const SharesCard = ({ shares, lastUpdate }: SharesCardProps) => {
  return (
    <View
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`You have ${shares} shares. Last updated ${lastUpdate}`}
    >
      <Text
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        Shares
      </Text>
      <Text
        accessibilityRole="text"
        accessibilityLiveRegion="polite"
      >
        {shares}
      </Text>
    </View>
  );
};

// Accessibility configuration
const accessibilityConfig = {
  minimumTouchTargetSize: 44, // 44x44 points minimum
  colorContrast: 4.5, // WCAG AA standard
  reduceMotion: true, // Respect system setting
  screenReader: true, // Full VoiceOver/TalkBack support
};
```

### 6.4 Offline-First Architecture

```typescript
// Offline-first data fetching
const useMinerInfoOffline = (address: string) => {
  const queryClient = useQueryClient();
  const cache = useCacheStore();
  
  return useQuery({
    queryKey: ['minerInfo', address],
    queryFn: async () => {
      const data = await p2poolApi.getMinerInfo(address);
      // Persist to local cache
      cache.setMinerInfo(data);
      return data;
    },
    // Use cached data while fetching
    placeholderData: () => cache.minerInfo,
    // Keep data fresh
    staleTime: 30 * 1000,
    // Retry on network failure
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Network mode
    networkMode: 'offlineFirst',
  });
};
```

### 6.5 Internationalization (i18n)

```typescript
// i18n setup with expo-localization
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: require('./locales/en.json'),
  pt: require('./locales/pt.json'),
});

i18n.defaultLocale = 'en';
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;

// Usage
const SharesCard = () => {
  return (
    <Text>{i18n.t('mining.shares')}</Text>
  );
};

// Locale files structure
// locales/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry"
  },
  "mining": {
    "shares": "Shares",
    "payouts": "Payouts",
    "lastShare": "Last Share"
  }
}

// locales/pt.json
{
  "common": {
    "loading": "Carregando...",
    "error": "Ocorreu um erro",
    "retry": "Tentar novamente"
  },
  "mining": {
    "shares": "Shares",
    "payouts": "Pagamentos",
    "lastShare": "Último Share"
  }
}
```

### 6.6 Testing Strategy

```typescript
// Unit test example
describe('XMR Formatter', () => {
  it('should format atomic units to XMR', () => {
    expect(formatXMR(1000000000000n)).toBe('1');
    expect(formatXMR(3400854816n)).toBe('0.003400854816');
    expect(formatXMR(0n)).toBe('0');
  });
});

// Component test example
describe('AddressInput', () => {
  it('should validate Monero address', async () => {
    const onValidAddress = jest.fn();
    render(<AddressInput onValidAddress={onValidAddress} />);
    
    const input = screen.getByPlaceholderText('Enter Monero address');
    fireEvent.changeText(input, '4' + 'a'.repeat(94));
    
    await waitFor(() => {
      expect(onValidAddress).toHaveBeenCalledWith('4' + 'a'.repeat(94));
    });
  });
});

// Integration test example
describe('Mining Stats Flow', () => {
  it('should fetch and display miner info', async () => {
    server.use(
      rest.get('*/api/miner_info/*', (req, res, ctx) => {
        return res(ctx.json(mockMinerInfo));
      })
    );
    
    render(<StatsScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('559,294 shares')).toBeOnTheScreen();
    });
  });
});
```

---

## 7. API Consumption Guidelines

### 7.1 API Client Configuration

```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { z } from 'zod';

const BASE_URLS = {
  main: 'https://p2pool.observer/api',
  mini: 'https://mini.p2pool.observer/api',
  nano: 'https://nano.p2pool.observer/api',
} as const;

type Sidechain = keyof typeof BASE_URLS;

const createApiClient = (sidechain: Sidechain): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URLS[sidechain],
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'P2PoolObserver-Mobile/1.0.0',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add timestamp for cache busting if needed
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Log error (sanitized)
      logApiError(error);
      return Promise.reject(error);
    }
  );

  return client;
};
```

### 7.2 Type-Safe API Methods

```typescript
// src/api/p2pool-api.ts
import { z } from 'zod';

// Response schemas
const MinerInfoSchema = z.object({
  id: z.number(),
  address: z.string(),
  shares: z.array(z.object({
    shares: z.number(),
    uncles: z.number(),
    last_height: z.number(),
  })),
  last_share_height: z.number(),
  last_share_timestamp: z.number(),
});

const PayoutSchema = z.object({
  miner: z.number(),
  template_id: z.string(),
  side_height: z.number(),
  main_id: z.string(),
  main_height: z.number(),
  timestamp: z.number(),
  coinbase_id: z.string(),
  coinbase_reward: z.number(),
  coinbase_private_key: z.string(),
  coinbase_output_index: z.number(),
  global_output_index: z.number(),
});

const PayoutsResponseSchema = z.array(PayoutSchema);

// Type exports
export type MinerInfo = z.infer<typeof MinerInfoSchema>;
export type Payout = z.infer<typeof PayoutSchema>;

// API methods
export const createP2PoolApi = (client: AxiosInstance) => ({
  getMinerInfo: async (address: string): Promise<MinerInfo> => {
    const response = await client.get(`/miner_info/${encodeURIComponent(address)}`);
    return MinerInfoSchema.parse(response.data);
  },

  getPayouts: async (address: string, limit = 20): Promise<Payout[]> => {
    const response = await client.get(`/payouts/${encodeURIComponent(address)}`, {
      params: { search_limit: limit },
    });
    return PayoutsResponseSchema.parse(response.data);
  },

  getPoolInfo: async (): Promise<PoolInfo> => {
    const response = await client.get('/pool_info');
    return PoolInfoSchema.parse(response.data);
  },

  getSharesInWindow: async (address: string): Promise<SharesInWindow[]> => {
    const response = await client.get(`/side_blocks_in_window/${encodeURIComponent(address)}`);
    return SharesInWindowSchema.parse(response.data);
  },
});
```

### 7.3 Query Hooks with TanStack Query

```typescript
// src/hooks/queries/useMinerInfo.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiClient } from '../useApiClient';

export const useMinerInfo = (
  address: string | null,
  options?: Omit<UseQueryOptions<MinerInfo>, 'queryKey' | 'queryFn'>
) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ['minerInfo', address],
    queryFn: () => {
      if (!address) throw new Error('Address is required');
      return api.getMinerInfo(address);
    },
    enabled: !!address && isValidMoneroAddress(address),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// src/hooks/queries/usePayouts.ts
export const usePayouts = (
  address: string | null,
  limit = 20,
  options?: Omit<UseQueryOptions<Payout[]>, 'queryKey' | 'queryFn'>
) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ['payouts', address, limit],
    queryFn: () => {
      if (!address) throw new Error('Address is required');
      return api.getPayouts(address, limit);
    },
    enabled: !!address && isValidMoneroAddress(address),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
```

### 7.4 Rate Limiting Implementation

```typescript
// src/api/rate-limiter.ts
interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: number[] = [];
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );

    if (this.requests.length >= this.config.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.config.windowMs - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.acquire();
    }

    this.requests.push(now);
  }
}

// Usage in API client
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

client.interceptors.request.use(async (config) => {
  await rateLimiter.acquire();
  return config;
});
```

### 7.5 XMR Amount Handling

```typescript
// src/services/xmr-formatter.ts
import BigNumber from 'bignumber.js';

const ATOMIC_UNITS_PER_XMR = new BigNumber(1e12);

export const formatXMR = (
  atomicUnits: number | bigint | string,
  options: FormatOptions = {}
): string => {
  const {
    maxDecimals = 12,
    minDecimals = 0,
    trimTrailingZeros = true,
  } = options;

  const bn = new BigNumber(atomicUnits.toString());
  const xmr = bn.dividedBy(ATOMIC_UNITS_PER_XMR);

  let formatted = xmr.toFixed(maxDecimals);

  if (trimTrailingZeros) {
    // Remove trailing zeros but keep minDecimals
    const [integer, decimal = ''] = formatted.split('.');
    const trimmedDecimal = decimal.replace(/0+$/, '').padEnd(minDecimals, '0');
    formatted = trimmedDecimal ? `${integer}.${trimmedDecimal}` : integer;
  }

  return formatted;
};

export const parseXMR = (xmr: string): bigint => {
  const bn = new BigNumber(xmr);
  const atomicUnits = bn.multipliedBy(ATOMIC_UNITS_PER_XMR);
  return BigInt(atomicUnits.toFixed(0));
};

// Format for display with locale
export const formatXMRDisplay = (
  atomicUnits: number | bigint,
  locale = 'en-US'
): string => {
  const xmr = formatXMR(atomicUnits, { maxDecimals: 8 });
  const number = parseFloat(xmr);
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(number) + ' XMR';
};
```

---

## Appendix A: Configuration Files

### ESLint Configuration (eslint.config.mjs)

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  }
);
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@api/*": ["src/api/*"],
      "@utils/*": ["src/utils/*"],
      "@store/*": ["src/store/*"],
      "@theme/*": ["src/theme/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

---

## Appendix B: Monero Address Validation

```typescript
// src/services/address-validator.ts
const MONERO_ADDRESS_LENGTH = 95;
const MONERO_PRIMARY_PREFIX = '4';
const MONERO_SUBADDRESS_PREFIX = '8';
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export const isValidMoneroAddress = (address: string): boolean => {
  // Basic validation
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Length check
  if (address.length !== MONERO_ADDRESS_LENGTH) {
    return false;
  }

  // Prefix check (primary or subaddress)
  if (!address.startsWith(MONERO_PRIMARY_PREFIX) && 
      !address.startsWith(MONERO_SUBADDRESS_PREFIX)) {
    return false;
  }

  // Base58 character validation
  for (const char of address) {
    if (!BASE58_ALPHABET.includes(char)) {
      return false;
    }
  }

  return true;
};

export const getAddressType = (address: string): 'primary' | 'subaddress' | 'invalid' => {
  if (!isValidMoneroAddress(address)) {
    return 'invalid';
  }
  
  return address.startsWith(MONERO_PRIMARY_PREFIX) ? 'primary' : 'subaddress';
};

export const truncateAddress = (address: string, chars = 8): string => {
  if (!address || address.length < chars * 2 + 3) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
```

---

*Document created on January 29, 2026*  
*Mobile P2Pool XMR Observer App - Requirements Specification*
