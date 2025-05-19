import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'danger';
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  let className = '';
  if (variant === 'outline') className = 'outline';
  if (variant === 'danger') className = 'danger';
  return (
    <button className={className} {...props}>
      {props.children}
    </button>
  );
};

export default Button;