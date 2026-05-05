import { useState } from "react";

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    title: "",
    message: "",
    onConfirm: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await confirmData.onConfirm();
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return {
    isOpen,
    title: confirmData.title,
    message: confirmData.message,
    openModal,
    closeModal,
    handleConfirm,
    isLoading
  };
};
