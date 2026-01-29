# P2Pool Observer Mobile

A modern React Native mobile application for monitoring your P2Pool mining statistics on the Monero network.

## Features

- **Multi-Sidechain Support**: Monitor Main, Mini, and Nano sidechains
- **Mining Statistics**: View shares, uncles, hashrate estimates
- **Payout Tracking**: Complete payout history with transaction links
- **Pool Status**: Real-time pool information and network stats
- **Offline Support**: Cached data available when offline
- **Dark/Light Mode**: Automatic or manual theme selection
- **Bilingual**: English and Portuguese support
- **Modern UI**: Clean, accessible interface following Material Design 3

## Tech Stack

- **React Native** 0.76+ with New Architecture
- **Expo** SDK 52+ with Expo Router
- **TypeScript** 5.6+ with strict mode
- **TanStack Query** for server state management
- **Zustand** for client state
- **MMKV** for high-performance storage
- **Zod** for runtime validation

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Development Scripts

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Testing
npm test
npm run test:coverage
```

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── stats.tsx      # Statistics screen
│   │   ├── payouts.tsx    # Payouts screen
│   │   └── settings.tsx   # Settings screen
│   └── _layout.tsx        # Root layout
├── src/
│   ├── api/               # API layer
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components
│   │   ├── mining/       # Mining-specific components
│   │   └── feedback/     # Loading/error states
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand state management
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── theme/            # Theming system
│   └── i18n/             # Internationalization
├── assets/               # Static assets
└── __tests__/            # Test files
```

## API Integration

The app consumes the P2Pool Observer API:
- Main: `https://p2pool.observer/api`
- Mini: `https://mini.p2pool.observer/api`
- Nano: `https://nano.p2pool.observer/api`

## Security

- HTTPS only connections
- Secure address storage with Expo SecureStore
- Rate limiting (10 requests/minute)
- Input validation with Zod schemas
- No sensitive data in logs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [P2Pool](https://github.com/SChernykh/p2pool) - Decentralized Monero mining pool
- [P2Pool Observer](https://p2pool.observer) - Statistics API provider
- [Monero](https://getmonero.org) - The cryptocurrency this app monitors
