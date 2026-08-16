import { GameBoardSelection } from "@/components/board/board.selection.component";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { beforeAll, describe, expect, it, vi } from "vitest";

describe("GameBoardSelection", () => {
  const mockSelectPlayerOption = vi.fn();

  beforeAll(() => {
    MockAppContext.update({
      onSelectPlayerOption: mockSelectPlayerOption,
      gameMode: "standard",
    });
  });

  it("should render all standard game options", () => {
    render(<GameBoardSelection />);

    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("should render all bonus game options", () => {
    MockAppContext.update({ gameMode: "bonus" });

    render(<GameBoardSelection />);

    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("should pass option selection to the context handler", () => {
    MockAppContext.update({ gameMode: "standard" });

    render(<GameBoardSelection />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mockSelectPlayerOption).toHaveBeenCalledWith("rock");
  });
});
