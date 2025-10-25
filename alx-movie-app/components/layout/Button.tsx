import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string };

const LayoutButton: React.FC<Props> = ({ label, children, className = '', ...rest }) => {
  return (
    <button className={`px-3 py-1 rounded ${className}`} {...rest}>
      {children ?? label}
    </button>
  );
};

export default LayoutButton;