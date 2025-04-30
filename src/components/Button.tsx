import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded shadow-lg transition-all ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl"} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;