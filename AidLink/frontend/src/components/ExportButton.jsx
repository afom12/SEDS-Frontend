import React, { useState } from 'react';
import { FaDownload, FaFileCsv, FaFileAlt, FaPrint } from 'react-icons/fa';
import { exportToCSV, exportToJSON, printToPDF } from '../utils/export';
import { useTranslation } from 'react-i18next';

const ExportButton = ({ data, filename, exportType = 'all', elementId, title }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (type) => {
    switch (type) {
      case 'csv':
        exportToCSV(data, `${filename || 'export'}.csv`);
        break;
      case 'json':
        exportToJSON(data, `${filename || 'export'}.json`);
        break;
      case 'pdf':
        printToPDF(elementId, title || filename || 'Document');
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  if (exportType === 'csv' && data) {
    return (
      <button
        onClick={() => handleExport('csv')}
        className="btn-outline flex items-center gap-2"
        aria-label="Export to CSV"
      >
        <FaFileCsv />
        {t('common.exportCSV', { defaultValue: 'Export CSV' })}
      </button>
    );
  }

  if (exportType === 'json' && data) {
    return (
      <button
        onClick={() => handleExport('json')}
        className="btn-outline flex items-center gap-2"
        aria-label="Export to JSON"
      >
        <FaFileAlt />
        {t('common.exportJSON', { defaultValue: 'Export JSON' })}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline flex items-center gap-2"
        aria-label="Export options"
        aria-expanded={isOpen}
      >
        <FaDownload />
        {t('common.export', { defaultValue: 'Export' })}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-fade-in">
            <div className="py-1">
              {data && (
                <>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaFileCsv />
                    {t('common.exportCSV', { defaultValue: 'Export CSV' })}
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaFileAlt />
                    {t('common.exportJSON', { defaultValue: 'Export JSON' })}
                  </button>
                </>
              )}
              {elementId && (
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaPrint />
                  {t('common.printPDF', { defaultValue: 'Print PDF' })}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;

