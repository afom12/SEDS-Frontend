import React from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: t('shortcuts.search', { defaultValue: 'Focus search' }) },
    { keys: ['Esc'], description: t('shortcuts.close', { defaultValue: 'Close modal/dialog' }) },
    { keys: ['Alt', 'D'], description: t('shortcuts.dashboard', { defaultValue: 'Go to dashboard' }) },
    { keys: ['Alt', 'H'], description: t('shortcuts.home', { defaultValue: 'Go to home' }) },
    { keys: ['Alt', 'L'], description: t('shortcuts.logout', { defaultValue: 'Logout' }) },
    { keys: ['Ctrl', '/'], description: t('shortcuts.help', { defaultValue: 'Show help' }) },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('shortcuts.title', { defaultValue: 'Keyboard Shortcuts' })}>
      <div className="space-y-4">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
            <span className="text-gray-700">{shortcut.description}</span>
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, keyIndex) => (
                <React.Fragment key={keyIndex}>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm">
                    {key}
                  </kbd>
                  {keyIndex < shortcut.keys.length - 1 && (
                    <span className="text-gray-400 mx-1">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsModal;

