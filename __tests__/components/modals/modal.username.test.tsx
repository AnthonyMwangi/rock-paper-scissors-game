import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { UsernameModal } from "../../../src/components/modals/modal.username.component";
import * as appContext from "../../../src/context/app.context";
import * as utilities from "../../../src/utilities";

vi.mock("@/store", () => ({
  useGlobalStore: {
    getState: () => ({
      app: {
        player: undefined,
      },
    }),
  },
}));

vi.mock("@/hooks/useLayout.ts", () => ({
  useLayout: vi.fn(),
}));

describe("UsernameModal", () => {
  const mockToggleModal = vi.fn();
  const mockUpdateUserName = vi.spyOn(utilities.Firebase, "updateUserName");

  const mockUseAppContext = vi
    .spyOn(appContext, "useAppContext")
    .mockReturnValue({
      onToggleModal: mockToggleModal,
    } as unknown as appContext.AppContextValues);

  afterAll(() => {
    mockUseAppContext.mockReset();
    mockUpdateUserName.mockReset();
  });

  it("should render the username input", () => {
    render(<UsernameModal />);

    expect(
      screen.getByRole("textbox", { name: /enter your name/i }),
    ).toBeInTheDocument();
  });

  it("should render the update username button", () => {
    render(<UsernameModal />);

    expect(
      screen.getByRole("button", { name: "Update Username" }),
    ).toBeInTheDocument();
  });

  it("should show a validation error when an invalid username is submitted", () => {
    render(<UsernameModal />);

    fireEvent.click(screen.getByRole("button", { name: "Update Username" }));

    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(mockUpdateUserName).not.toHaveBeenCalled();
  });

  it("should update the username and close the modal for a valid username", async () => {
    const mockName = "mock-username";

    render(<UsernameModal />);

    fireEvent.change(
      screen.getByRole("textbox", { name: /enter your name/i }),
      { target: { value: mockName } },
    );

    fireEvent.click(screen.getByTestId("md-save-button"));

    await waitFor(() => {
      expect(mockUpdateUserName).toHaveBeenCalledWith(mockName);
    });

    expect(mockToggleModal).toHaveBeenCalledWith("username", {});
  });

  it("should clear the submit error when the user starts typing", () => {
    render(<UsernameModal />);

    fireEvent.click(screen.getByRole("button", { name: "Update Username" }));

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "Anthony" },
    });

    expect(input).not.toHaveClass("hasError");
  });
});
