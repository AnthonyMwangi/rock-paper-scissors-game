import { ToggleButton } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ToggleButton", () => {
  const mockStandardOption = {
    id: "standard",
    label: "Standard",
    onClick: vi.fn(),
  };

  const mockBonusOption = {
    id: "bonus",
    label: "Bonus",
    onClick: vi.fn(),
  };

  it("should render every option", () => {
    render(
      <ToggleButton
        options={[mockStandardOption, mockBonusOption]}
        selectedOptionID="standard"
      />,
    );

    expect(
      screen.getByRole("button", { name: mockStandardOption.label }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: mockBonusOption.label }),
    ).toBeInTheDocument();
  });

  it("should pass click handlers through to buttons", () => {
    render(
      <ToggleButton
        selectedOptionID="standard"
        options={[mockStandardOption]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: mockStandardOption.label }),
    );

    expect(mockStandardOption.onClick).toHaveBeenCalledOnce();
  });

  it("should mark the selected option", () => {
    render(
      <ToggleButton
        options={[mockStandardOption, mockBonusOption]}
        selectedOptionID={mockBonusOption.id}
      />,
    );

    const bonusButton = screen.getByRole("button", {
      name: mockBonusOption.label,
    });

    const standardButton = screen.getByRole("button", {
      name: mockStandardOption.label,
    });

    expect(standardButton.className).not.toContain("is-selected");
    expect(bonusButton.className).toContain("is-selected");
  });

  it("should support dark theme", () => {
    const { container } = render(
      <ToggleButton
        options={[mockStandardOption, mockBonusOption]}
        selectedOptionID={mockStandardOption.id}
        theme="dark"
      />,
    );

    expect(container.firstElementChild?.className).toContain("theme-dark");
  });
});
