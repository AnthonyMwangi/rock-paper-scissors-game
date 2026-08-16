import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameBoardSelection } from "../../../src/components/board/board.selection.component";
import { AppContextValues } from "../../../src/context";

const mockContext: Partial<AppContextValues> = {
  gameMode: "standard",
  onSelectPlayerOption: vi.fn(),
};

vi.mock("@/context/app.context", () => ({
  useAppContext: () => mockContext,
}));

describe("GameBoardSelection", () => {
  it("should render all standard game options", () => {
    render(<GameBoardSelection />);

    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("should render all bonus game options", () => {
    mockContext.gameMode = "bonus";

    render(<GameBoardSelection />);

    expect(screen.getAllByRole("button")).toHaveLength(5);

    mockContext.gameMode = "standard";
  });

  it("should pass option selection to the context handler", () => {
    render(<GameBoardSelection />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mockContext.onSelectPlayerOption).toHaveBeenCalledWith("rock");
  });
});
