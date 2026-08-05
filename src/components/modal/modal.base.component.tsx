import iconClose from "@/images/icon-close.svg";
import { classnames, ModifierValue } from "@/utilities";
import { FC, PropsWithChildren } from "react";
import "./modal.base.styles.scss";

type ModalComponentProps = PropsWithChildren<{
  title: string;
  onCloseModal: () => void;
  classNameModifiers: Record<string, ModifierValue>;
  modalName: string;
}>;

export const ModalComponent: FC<ModalComponentProps> = ({
  title,
  children,
  modalName,
  classNameModifiers = {},
  onCloseModal,
}) => {
  return (
    <div className="modal">
      <div
        id={modalName}
        className={classnames("md-content", classNameModifiers)}
      >
        <button className="md-close-button" onClick={onCloseModal}>
          <img className="md-close-icon" alt="close icon" src={iconClose} />
        </button>

        <div className="md-header">
          {title ? <h2 className="md-title">{title}</h2> : null}
        </div>

        <div className="md-content-wrapper">{children}</div>
      </div>
    </div>
  );
};
