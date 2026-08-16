import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "../../../src/components";
import { AppContextValues } from "../../../src/context";

const mockContext: Partial<AppContextValues> = {
  gameMode: "standard",
  currentPlayerScore: 12,
};

vi.mock("@/context", () => ({
  useAppContext: () => mockContext,
}));

vi.mock("@/utilities", async () => {
  const actual = await vi.importActual("@/utilities");

  return {
    ...actual,
    GameLogo: {
      standard: ({ className }: { className?: string }) => (
        <svg data-testid="standard-logo" className={className} />
      ),
      bonus: ({ className }: { className?: string }) => (
        <svg data-testid="bonus-logo" className={className} />
      ),
    },
  };
});

describe("Header", () => {
  it("should render the current score", () => {
    render(<Header />);

    expect(screen.getByText("SCORE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("12");
  });

  it("should render the logo for the current game mode", () => {
    render(<Header />);

    expect(screen.getByTestId("standard-logo")).toBeInTheDocument();
  });

  it("should render the bonus logo when bonus mode is active", () => {
    mockContext.gameMode = "bonus";

    render(<Header />);

    expect(screen.getByTestId("bonus-logo")).toBeInTheDocument();

    mockContext.gameMode = "standard";
  });
});
