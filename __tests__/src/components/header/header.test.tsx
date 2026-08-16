import { Header } from "@/components";
import { render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { beforeAll, describe, expect, it } from "vitest";

describe("Header", () => {
  beforeAll(() => {
    MockAppContext.update({
      gameMode: "standard",
      currentPlayerScore: 12,
    });
  });

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
    MockAppContext.update({ gameMode: "bonus" });

    render(<Header />);

    expect(screen.getByTestId("bonus-logo")).toBeInTheDocument();
  });
});
