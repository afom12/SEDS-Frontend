import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaHandHoldingHeart } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center shadow-sm">
                <FaHandHoldingHeart className="text-white text-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-text-dark">SEDS</span>
                <span className="text-xs text-gray-500">Share & Donor Platform</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-primary transition-colors">
                  {t('nav.getStarted')}
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">{t('footer.about')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  {t('footer.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  {t('footer.trustTransparency')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  {t('footer.contactUs')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-sm text-gray-600 mt-2 md:mt-0 flex items-center">
            {t('footer.madeWith')} <FaHeart className="mx-1 text-red-500" /> {t('footer.forTransparency')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

