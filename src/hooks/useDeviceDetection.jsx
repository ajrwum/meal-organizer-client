import { useState, useEffect } from 'react';

const TOUCH_DEVICE = 'mobile';
const DESKTOP_DEVICE = 'desktop';

/**
 * Custom hook created to allow device detection on meal create & edit forms since the drag & drop is only available with the HTML API and does not work on Touch devices
 *
 * @returns deviceType - as a string containing either 'mobile' if the device has touch points or 'desktop otherwise
 */
function useDeviceDetection() {
  // to add button when on mobile device
  const [deviceType, setDeviceType] = useState('');

  // testing the device (mobile or not)
  useEffect(() => {
    let hasTouchScreen = false;
    if ('maxTouchPoints' in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ('msMaxTouchPoints' in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = window.matchMedia && matchMedia('(pointer:coarse)');
      if (mQ && mQ.media === '(pointer:coarse)') {
        hasTouchScreen = !!mQ.matches;
      } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }

    if (hasTouchScreen) setDeviceType(TOUCH_DEVICE);
    else setDeviceType(DESKTOP_DEVICE);
  });

  return deviceType;
}

export default useDeviceDetection;
