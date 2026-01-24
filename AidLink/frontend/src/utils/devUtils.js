// Development utilities for testing and debugging

/**
 * Clear all SEDS-related storage data
 * Useful for testing the first-visit experience
 */
export const clearAllSEDSData = () => {
  // Clear sessionStorage (user sessions)
  sessionStorage.removeItem('seds_user');
  
  // Clear localStorage (app data)
  localStorage.removeItem('seds_user');
  localStorage.removeItem('seds_donation_requests');
  localStorage.removeItem('seds_donations');
  localStorage.removeItem('seds_receiver_requests');
  localStorage.removeItem('seds_users');
  localStorage.removeItem('seds_activity_logs');
  console.log('All SEDS data cleared from storage');
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = () => {
  const savedUser = sessionStorage.getItem('seds_user') || localStorage.getItem('seds_user');
  if (!savedUser) return false;
  
  try {
    const user = JSON.parse(savedUser);
    return user && user.id && user.email && user.role;
  } catch {
    return false;
  }
};

// Make it available in browser console for easy testing
if (typeof window !== 'undefined') {
  window.clearSEDSData = clearAllSEDSData;
  window.isSEDSUserLoggedIn = isUserLoggedIn;
}

