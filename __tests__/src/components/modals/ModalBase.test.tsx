import { ModalBase } from "@/components/modals/ModalBase.component";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { beforeAll, describe, expect, it, vi } from "vitest";

describe("ModalBase", () => {
  const mockToggleModal = vi.fn();

  beforeAll(() => {
    MockAppContext.update({
      gameMode: "standard",
      onToggleModal: mockToggleModal,
    });
  });

  it("should render its children", () => {
    render(
      <ModalBase modalName="rules">
        <p>Modal content</p>
      </ModalBase>,
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should render the title when supplied", () => {
    render(
      <ModalBase modalName="rules" title="Rules">
        Content
      </ModalBase>,
    );

    expect(screen.getByRole("heading", { name: "Rules" })).toBeInTheDocument();
  });

  it("should use the modal name as the content id", () => {
    render(<ModalBase modalName="leaderboard">Content</ModalBase>);

    expect(document.getElementById("leaderboard")).toBeInTheDocument();
  });

  it("should close the modal with the current game mode", () => {
    render(<ModalBase modalName="rules">Content</ModalBase>);

    fireEvent.click(screen.getByRole("button", { name: "" }));

    expect(mockToggleModal).toHaveBeenCalledWith("rules", {
      mode: "standard",
    });
  });

  it("should disable the close button when requested", () => {
    render(
      <ModalBase modalName="rules" disableCloseBtn>
        Content
      </ModalBase>,
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
