/**
 * Display Name Utility
 * Handles fallback logic for user display names according to server API spec
 */

interface UserWithNames {
  displayName?: string;
  preferredUsername?: string;
  username: string;
}

/**
 * Get the appropriate display name for a user
 * Priority: displayName > preferredUsername > username
 */
export const getDisplayName = (user: UserWithNames): string => {
  if (user.displayName) {
    return user.displayName;
  }
  
  if (user.preferredUsername) {
    return user.preferredUsername;
  }
  
  return user.username;
};

/**
 * Get username with @ prefix for mentions/handles
 */
export const getUsername = (user: UserWithNames): string => {
  return `@${user.username}`;
};

/**
 * Get short display name (truncated if too long)
 */
export const getShortDisplayName = (user: UserWithNames, maxLength: number = 20): string => {
  const displayName = getDisplayName(user);
  
  if (displayName.length <= maxLength) {
    return displayName;
  }
  
  return `${displayName.substring(0, maxLength - 3)}...`;
};