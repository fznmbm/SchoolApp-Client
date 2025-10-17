import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx("bg-surface dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;