import { useState } from 'react';

export default function useModal(initOpen = false) {
  const [isOpen, setIsOpen] = useState(initOpen);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, handleOpen, handleClose, handleToggle };
}
