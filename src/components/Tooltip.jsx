import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollX + 8;
        break;
      default:
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
    }

    // Keep tooltip within viewport
    const padding = 8;
    if (top < scrollY + padding) {
      top = scrollY + padding;
    }
    if (left < scrollX + padding) {
      left = scrollX + padding;
    }
    if (left + tooltipRect.width > scrollX + window.innerWidth - padding) {
      left = scrollX + window.innerWidth - tooltipRect.width - padding;
    }

    setTooltipPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </span>
      {isVisible && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            id="tooltip"
            role="tooltip"
            className={`fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg pointer-events-none animate-fade-in ${
              position === 'top' ? 'mb-2' : position === 'bottom' ? 'mt-2' : ''
            }`}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {content}
            <div
              className={`absolute w-0 h-0 border-4 ${
                position === 'top'
                  ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-r-transparent border-b-transparent border-l-transparent'
                  : position === 'bottom'
                  ? 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-r-transparent border-t-transparent border-l-transparent'
                  : position === 'left'
                  ? 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-r-transparent border-t-transparent border-b-transparent'
                  : 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-l-transparent border-t-transparent border-b-transparent'
              }`}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;

