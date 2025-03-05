import { useState } from "react";

export const useDisclosure = () => {
  const [visible, setVisible] = useState<boolean>(false);

  function toggle() {
    setVisible(!visible);
  }

  function close() {
    setVisible(false);
  }

  function open() {
    setVisible(true);
  }

  return {
    visible,
    toggle,
    close,
    open,
  };
};
