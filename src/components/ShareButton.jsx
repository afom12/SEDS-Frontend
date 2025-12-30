import React, { useState } from 'react';
import { FaShare, FaCopy, FaFacebook, FaTwitter, FaLink } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useToastContext } from '../context/ToastContext';

const ShareButton = ({ url, title, description }) => {
  const { t } = useTranslation();
  const toast = useToastContext();
  const [isOpen, setIsOpen] = useState(false);

  const currentUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success(t('share.copied', { defaultValue: 'Link copied to clipboard!' }));
      setIsOpen(false);
    } catch (err) {
      toast.error(t('share.copyError', { defaultValue: 'Failed to copy link' }));
    }
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: currentUrl,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline flex items-center gap-2"
        aria-label="Share"
        aria-expanded={isOpen}
      >
        <FaShare />
        {t('common.share', { defaultValue: 'Share' })}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-fade-in">
            <div className="py-1">
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FaCopy />
                {t('share.copyLink', { defaultValue: 'Copy Link' })}
              </button>
              {navigator.share && (
                <button
                  onClick={shareNative}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaShare />
                  {t('share.share', { defaultValue: 'Share...' })}
                </button>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <button
                onClick={shareOnFacebook}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FaFacebook className="text-blue-600" />
                Facebook
              </button>
              <button
                onClick={shareOnTwitter}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FaTwitter className="text-blue-400" />
                Twitter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;

