# Saturn Android

Mobile client for Saturn - a decentralized social media platform built with ActivityPub.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Android Studio with Android SDK
- Java JDK 17
- Saturn backend running locally (see server.readme.md)

## Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API URL
# For Android emulator: EXPO_PUBLIC_API_URL=http://10.0.2.2:4000
# For physical device: EXPO_PUBLIC_API_URL=http://YOUR_IP:4000
```

3. Start the Saturn backend server:
```bash
# In the backend directory
npm run dev
```

4. Run the Android app:
```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run the app on Android emulator/device
- `npm run ios` - Run the app on iOS simulator (macOS only)
- `npm run build` - Build the app for production
- `npm run clean` - Clean Android build cache
- `npm run reset` - Reset cache and reinstall dependencies

## Project Structure

```
saturn-android/
├── android/          # Android native code
├── assets/           # Images, fonts, and other assets
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── redux/            # Redux store and API slices
├── routes/           # Navigation configuration
├── screen/           # Screen components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Features

- User authentication (login/register)
- Create and view posts
- Like and comment on posts
- Follow/unfollow users
- Real-time notifications
- Media uploads (images, videos, audio)
- Dark mode support
- Offline support with Redux persist

## Tech Stack

- React Native 0.79.4
- Expo SDK 53
- Redux Toolkit for state management
- React Navigation for routing
- TypeScript for type safety
- React Native Paper for UI components
- Socket.io for real-time features

## Troubleshooting

### Build Issues

If you encounter build errors:

1. Clean the build:
```bash
npm run clean
cd android && ./gradlew clean
```

2. Reset Metro cache:
```bash
npx expo start --clear
```

3. Reinstall dependencies:
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### API Connection Issues

- For Android emulator: Use `http://10.0.2.2:4000` instead of `localhost`
- For physical device: Use your computer's IP address
- Ensure the backend server is running and accessible

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
