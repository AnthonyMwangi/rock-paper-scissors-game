import { UsernameModal } from "@/components/modals/ModalUsername.component";
import * as utilities from "@/utilities";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { MockStore } from "mockUtils/mockStore";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock(import("@/utilities/utilities.username"), async (importActual) => ({
  ...(await importActual()),
  validateUsername: vi.fn(),
}));

describe("UsernameModal", () => {
  const mockToggleModal = vi.fn();
  const mockUpdateUserName = vi.spyOn(utilities.Firebase, "updateUserName");

  beforeAll(() => {
    MockStore.update({ player: undefined });

    MockAppContext.update({
      onToggleModal: mockToggleModal,
    });
  });

  afterAll(() => {
    mockToggleModal.mockReset();
    mockUpdateUserName.mockReset();
  });

  it("should render the username input", () => {
    render(<UsernameModal />);

    expect(screen.queryByTestId("username-input")).toBeInTheDocument();
  });

  it("should render the update username button", () => {
    render(<UsernameModal />);

    expect(screen.queryByTestId("save-button")).toBeInTheDocument();
  });

  it("should show a validation error when an invalid username is submitted", () => {
    render(<UsernameModal />);

    act(() => {
      fireEvent.click(screen.getByTestId("save-button"));
    });

    expect(screen.queryByTestId("input-error")).toBeInTheDocument();
    expect(mockUpdateUserName).not.toHaveBeenCalled();
  });

  it("should update the username and close the modal for a valid username", async () => {
    const mockName = "mock-username";

    render(<UsernameModal />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: mockName },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(mockUpdateUserName).toHaveBeenCalledWith(mockName);
    });

    expect(mockToggleModal).toHaveBeenCalledWith("username", {});
  });

  it("should clear the submit error when the user starts typing", () => {
    render(<UsernameModal />);

    fireEvent.click(screen.getByTestId("save-button"));

    const input = screen.getByTestId("username-input");

    fireEvent.change(input, {
      target: { value: "Anthony" },
    });

    expect(input.className).not.toContain("has-error");
  });
});
