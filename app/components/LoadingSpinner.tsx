import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#F97316' // Orange-500 color
}) => {
  let dimensions;
  
  switch (size) {
    case 'small':
      dimensions = 'h-6 w-6 border-2';
      break;
    case 'large':
      dimensions = 'h-16 w-16 border-4';
      break;
    default:
      dimensions = 'h-10 w-10 border-3';
  }

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full ${dimensions} border-t-transparent`}
        style={{ 
          borderColor: `transparent transparent transparent ${color}`,
          borderTopColor: 'transparent',
          borderRightColor: color,
          borderBottomColor: color
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;