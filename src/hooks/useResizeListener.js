import { useEffect } from 'react';

/**
 * Custom hook that listens to window resize events and executes a callback function.
 * @param {Function} onResize - Callback function to execute on window resize.
 */
function useResizeListener(onResize) {
  useEffect(() => {
    // Ensure the callback is a function
    if (typeof onResize !== 'function') {
      console.error('The provided onResize handler is not a function.');
      return;
    }

    // Define the resize event listener
    const handleResize = () => {
      onResize();
    };

    // Add the resize event listener to the window
    window.addEventListener('resize', handleResize);

    // Call the handler right away so state gets updated with initial window size
    handleResize();

    // Remove the event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [onResize]); // Re-bind the effect if the onResize function changes
}

export default useResizeListener;