import { useAppContext } from "@/context";
import iconClose from "@/images/icon-close.svg";
import { classnames, GameModal, ModifierValue } from "@/utilities";
import { FC, PropsWithChildren } from "react";
import "./modal.base.styles.scss";

type ModalComponentProps = PropsWithChildren<{
  title?: string;
  classNameModifiers?: Record<string, ModifierValue>;
  modalName: Lowercase<GameModal>;
  disableCloseBtn?: boolean;
}>;

export const ModalComponent: FC<ModalComponentProps> = ({
  title,
  children,
  classNameModifiers = {},
  disableCloseBtn,
  modalName,
}) => {
  const { gameMode, onToggleModal } = useAppContext();
  return (
    <div className="modal">
      <div
        id={modalName}
        className={classnames("md-content", classNameModifiers)}
      >
        <button
          className="md-close-button"
          disabled={disableCloseBtn}
          onClick={() =>
            onToggleModal(modalName, { mode: gameMode, ...classNameModifiers })
          }
        >
          <img className="md-close-icon" alt="close icon" src={iconClose} />
        </button>

        <div className="md-header">
          {title ? <h1 className="md-title">{title}</h1> : null}
        </div>

        <div className="md-content-wrapper">{children}</div>
      </div>
    </div>
  );
};
