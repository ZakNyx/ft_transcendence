import React from "react";

interface IconButtonProps {
  imagePath: string;
  isActive: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ imagePath, isActive }) => {
  return (
    <div
      className={`bg-[#9464ca] rounded-full p-2 hover:bg-purple-400 transition-all ${
        isActive ? "bg-[#cab4e4]" : ""
      }`}
    >
      <img src={imagePath} alt="Icon" className="w-6 h-6" />
    </div>
  );
};

export default IconButton;