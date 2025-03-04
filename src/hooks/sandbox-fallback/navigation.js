
/**
 * Create event handlers for navigation
 * @param {Function} navigate - React Router's navigate function
 * @param {Function} setShowFallback - Function to hide fallback UI
 * @returns {Object} Navigation handlers
 */
export const createNavigationHandlers = (navigate, setShowFallback) => {
  // Handler for returning to previous screen
  const handleReturnToPreviousScreen = (previousPathRef, location) => {
    console.log('Attempting to return to previous screen:', previousPathRef.current);
    if (previousPathRef.current && previousPathRef.current !== location.pathname) {
      navigate(previousPathRef.current);
    } else {
      navigate('/');
    }
    setShowFallback(false);
  };

  // Handler for navigating to a specific path
  const handleNavigateToPath = (path) => {
    console.log('Navigating to path:', path);
    navigate(path);
    setShowFallback(false);
  };

  return {
    handleReturnToPreviousScreen,
    handleNavigateToPath
  };
};
