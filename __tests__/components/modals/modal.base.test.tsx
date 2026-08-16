import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalComponent } from "../../../src/components/modals/modal.base.component";
import { AppContextValues } from "../../../src/context";

const mockContext: Partial<AppContextValues> = {
  gameMode: "standard",
  onToggleModal: vi.fn(),
};

vi.mock("@/context", () => ({
  useAppContext: () => mockContext,
}));

vi.mock("@/hooks", () => ({
  useLayout: () => () => {},
}));

vi.mock("@/images", () => ({
  Icons: {
    IconClose: () => <span />,
  },
}));

describe("ModalComponent", () => {
  it("should render its children", () => {
    render(
      <ModalComponent modalName="rules">
        <p>Modal content</p>
      </ModalComponent>,
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should render the title when supplied", () => {
    render(
      <ModalComponent modalName="rules" title="Rules">
        Content
      </ModalComponent>,
    );

    expect(screen.getByRole("heading", { name: "Rules" })).toBeInTheDocument();
  });

  it("should use the modal name as the content id", () => {
    render(<ModalComponent modalName="leaderboard">Content</ModalComponent>);

    expect(document.getElementById("leaderboard")).toBeInTheDocument();
  });

  it("should close the modal with the current game mode", () => {
    render(<ModalComponent modalName="rules">Content</ModalComponent>);

    fireEvent.click(screen.getByRole("button", { name: "" }));

    expect(mockContext.onToggleModal).toHaveBeenCalledWith("rules", {
      mode: "standard",
    });
  });

  it("should disable the close button when requested", () => {
    render(
      <ModalComponent modalName="rules" disableCloseBtn>
        Content
      </ModalComponent>,
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
