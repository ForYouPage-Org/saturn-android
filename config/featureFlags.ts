// 🎯 MVP Feature Flags Configuration
// This file controls which features are enabled/disabled
// Keep UI components intact, disable complex backend functionality

export const FEATURE_FLAGS = {
  // 🚫 DISABLED FOR MVP - Complex Features
  REAL_TIME_CHAT: false, // Disable Socket.io real-time messaging
  PUSH_NOTIFICATIONS: false, // Disable push notification service
  BACKGROUND_PROCESSING: false, // Disable BackgroundFetch & TaskManager
  SOCKET_CONNECTIONS: false, // Disable all Socket.io connections
  VIDEO_UPLOAD: false, // Disable video upload/processing
  AUDIO_UPLOAD: false, // Disable audio upload/processing
  ADVANCED_SEARCH: false, // Disable complex search features
  COMPLEX_MEDIA_PROCESSING: false, // Disable compression/processing
  DRAWER_NAVIGATION: false, // Disable complex drawer navigation
  BLUR_EFFECTS: false, // Disable expensive BlurView effects

  // ✅ ENABLED FOR MVP - Core Features
  AUTHENTICATION: true, // Keep auth system
  BASIC_POSTING: true, // Text + single image posts
  BASIC_FEED: true, // Simple feed display
  USER_PROFILE: true, // Basic profile functionality
  BASIC_SEARCH: true, // Simple user search
  BASIC_INTERACTIONS: true, // Like, comment (basic)
  BEAUTIFUL_ANIMATIONS: true, // Keep all smooth animations

  // 🔧 DEVELOPMENT FLAGS
  DEV_AUTO_LOGIN: true, // Skip auth for testing
  DEV_MOCK_DATA: true, // Use mock data where needed
  DEV_CONSOLE_LOGS: __DEV__, // Console logs only in development
};

// Helper functions for feature checking
export const isFeatureEnabled = (
  feature: keyof typeof FEATURE_FLAGS
): boolean => {
  return FEATURE_FLAGS[feature] === true;
};

export const isFeatureDisabled = (
  feature: keyof typeof FEATURE_FLAGS
): boolean => {
  return FEATURE_FLAGS[feature] === false;
};

// Coming Soon message for disabled features
export const COMING_SOON_MESSAGE = "This feature is coming soon! 🚀";

// Mock data for disabled features
export const MOCK_RESPONSES = {
  CHAT_MESSAGES: [],
  NOTIFICATIONS: [],
  SEARCH_RESULTS: [],
  SOCKET_EVENTS: null,
};
