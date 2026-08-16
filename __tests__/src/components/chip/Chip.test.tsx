import { Chip } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Chip", () => {
  it("should render a button", () => {
    render(<Chip board="standard" option="rock" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call onSelectOption with the selected option", () => {
    const mockOnSelectOption = vi.fn();

    render(
      <Chip
        board="standard"
        onSelectOption={mockOnSelectOption}
        option="rock"
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnSelectOption).toHaveBeenCalledOnce();
    expect(mockOnSelectOption).toHaveBeenCalledWith("rock");
  });

  it("should not fail when the onSelectOption prop is empty", () => {
    render(<Chip board="standard" option="paper" />);

    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  it("should mark a non-winning chip as neutral", () => {
    const { container } = render(
      <Chip board="outcome" option="scissors" isWinningChip={false} />,
    );

    expect(container.firstElementChild?.className).toContain("neutral");
  });

  it("should mark a winning chip", () => {
    const { container } = render(
      <Chip board="outcome" option="scissors" isWinningChip />,
    );

    expect(container.firstElementChild?.className).toContain("winner");
  });
});
