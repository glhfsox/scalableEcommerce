import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({ type = 'text', className = '', count = 1 }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getSkeletonClasses = () => {
    switch (type) {
      case 'text':
        return 'h-4';
      case 'title':
        return 'h-6 w-3/4';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      case 'image':
        return 'h-48 w-full';
      case 'button':
        return 'h-10 w-24';
      case 'card':
        return 'h-64 w-full';
      default:
        return 'h-4';
    }
  };

  const skeletons = Array(count).fill(0).map((_, index) => (
    <div
      key={index}
      className={`${baseClasses} ${getSkeletonClasses()} ${className}`}
    />
  ));

  return <>{skeletons}</>;
};

Skeleton.propTypes = {
  type: PropTypes.oneOf(['text', 'title', 'avatar', 'image', 'button', 'card']),
  className: PropTypes.string,
  count: PropTypes.number,
};

export default Skeleton; 