import { Button } from "@/components";
import { useAppContext } from "@/context";
import { useGlobalStore } from "@/store";
import {
  clsx,
  Firebase,
  USERNAME_ERROR_MESSAGES,
  validateUsername,
} from "@/utilities";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { ModalBase } from "./ModalBase.component";

export const UsernameModal: FC = () => {
  const { onToggleModal } = useAppContext();

  const [username, setUsername] = useState<string>(
    useGlobalStore.getState().app.player?.displayName || "",
  );

  const [submitErrorCount, setSubmitErrorCount] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handle username input
   * - Clear any previous submit errors
   */
  const handleUsernameInput = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      if (submitErrorCount) setSubmitErrorCount(null);
      return setUsername(e.target.value || "");
    },
    [submitErrorCount],
  );

  /**
   * Validate username on-type and on-submit
   */
  const handleValidation = useCallback(
    (isFinal: boolean) => {
      if (!username && !isFinal) return undefined;
      const validationFormat = validateUsername(username);
      return !validationFormat.valid
        ? USERNAME_ERROR_MESSAGES[validationFormat.reason]
        : undefined;
    },
    [username],
  );

  /**
   * Save username and close modal
   */
  const handleSaveUsername = useCallback(async () => {
    const error = handleValidation(true);
    if (error) return setSubmitErrorCount((c) => (c || 0) + 1);

    setIsLoading(true);
    setApiError(null);

    const response = await Firebase.updateUserName(username)
      .then(() => {
        return { error: undefined };
      })
      .catch((e) => {
        return { error: e.message };
      });

    setIsLoading(false);

    if (response.error) {
      return setApiError(response.error);
    }

    return onToggleModal("username", {});
  }, [handleValidation, onToggleModal, username]);

  const validationErrorMessage = useMemo(
    () => apiError || handleValidation(false),
    [apiError, handleValidation],
  );

  return (
    <ModalBase modalName="username" disableCloseBtn={isLoading}>
      <div className="md-input-wrapper">
        <h2 className="md-heading">Don&lsquo;t play as a ghost!</h2>

        <label htmlFor="display-name-input" className="md-input-label">
          Enter your name to claim your spot on the leaderboard
        </label>

        <input
          type="text"
          key={submitErrorCount}
          className={clsx("md-input", {
            hasError: !!submitErrorCount && !!validationErrorMessage,
          })}
          placeholder="Enter your name"
          onChange={handleUsernameInput}
          id="display-name-input"
          data-testid="username-input"
          autoComplete="name"
          disabled={isLoading}
          value={username}
        />

        <span className="md-input-error" data-testid="input-error">
          {validationErrorMessage}
        </span>

        <Button
          label="Update Username"
          onClick={handleSaveUsername}
          className={clsx("md-save-button", { isLoading })}
          isLoading={isLoading}
          id="save-button"
        />
      </div>
    </ModalBase>
  );
};
