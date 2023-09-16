import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent the click event from propagating further
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleModalClick}>
      <div className="absolute bg-slate-600 p-4 shadow-md">
        <button onClick={onClose} className="rounded-full top-2 right-2 w-12 h-12 bg-npc-light-gray">
          X
        </button>
        <div className="font-bold text-center">
            Hello
        </div>
      </div>
    </div>
  );
};

export default Modal;
