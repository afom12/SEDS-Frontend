import React from 'react';
import { Link } from 'react-router-dom';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon = FaInbox, 
  title, 
  message, 
  action, 
  actionLabel, 
  actionLink,
  secondaryAction,
  secondaryActionLabel,
  secondaryActionLink,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 px-4 animate-fade-in ${className}`}>
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Icon className="text-gray-400 dark:text-gray-500 text-3xl" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">{message}</p>
      
      {(action || actionLink) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {actionLink ? (
            <Link to={actionLink} className="btn-primary">
              {actionLabel || 'Get Started'}
            </Link>
          ) : (
            <button onClick={action} className="btn-primary">
              {actionLabel || 'Get Started'}
            </button>
          )}
          
          {secondaryActionLink && (
            <Link to={secondaryActionLink} className="btn-outline">
              {secondaryActionLabel || 'Learn More'}
            </Link>
          )}
          {secondaryAction && !secondaryActionLink && (
            <button onClick={secondaryAction} className="btn-outline">
              {secondaryActionLabel || 'Learn More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

