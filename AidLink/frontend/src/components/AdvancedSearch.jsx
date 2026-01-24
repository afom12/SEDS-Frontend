import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AdvancedSearch = ({
  onSearch,
  onFilterChange,
  filters = [],
  placeholder = 'Search...',
  showAdvanced = true,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter((v) => v && v !== 'all').length;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            aria-label="Search"
          />
        </div>

        {/* Filter Toggle */}
        {showAdvanced && filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 border-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showFilters || activeFilterCount > 0
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 hover:border-primary text-gray-700'
            }`}
            aria-expanded={showFilters}
          >
            <FaFilter />
            {t('common.filter', { defaultValue: 'Filter' })}
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && filters.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {t('common.filters', { defaultValue: 'Filters' })}
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <FaTimes className="text-xs" />
                {t('common.clearFilters', { defaultValue: 'Clear all' })}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={activeFilters[filter.key] || filter.defaultValue || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : filter.type === 'range' ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={activeFilters[filter.key]?.min || ''}
                      onChange={(e) =>
                        handleFilterChange(filter.key, {
                          ...activeFilters[filter.key],
                          min: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={activeFilters[filter.key]?.max || ''}
                      onChange={(e) =>
                        handleFilterChange(filter.key, {
                          ...activeFilters[filter.key],
                          max: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

