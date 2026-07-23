import type { FC } from "react";

import Button from "../Button/Button";
import ModalClose from "./ModalClose";
import ModalDescription from "./ModalDescription";
import { ModalMain, type ModalMainProps } from "./ModalMain";
import ModalTitle from "./ModalTitle";

interface ModalComponent extends FC<ModalMainProps> {
  Close: typeof ModalClose;
  Title: typeof ModalTitle;
  Desc: typeof ModalDescription;
  Button: typeof Button;
}

const Modal = Object.assign(ModalMain, {
  Close: ModalClose,
  Title: ModalTitle,
  Desc: ModalDescription,
  Button,
}) as ModalComponent;

export default Modal;
