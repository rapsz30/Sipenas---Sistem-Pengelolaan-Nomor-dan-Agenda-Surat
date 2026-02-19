import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) => {
  const baseStyle = {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const variantStyles = {
    primary: {
      backgroundColor: "#2196f3",
      color: "white",
    },
    secondary: {
      backgroundColor: "#B1B1B1",
      color: "white",
    },
  };

  const combinedStyle = { ...baseStyle, ...variantStyles[variant] };

  return (
    <button style={combinedStyle} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;