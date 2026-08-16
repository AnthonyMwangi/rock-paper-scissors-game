import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modals } from "../../../src/components/modals";

const mockContext = {
  isModalOpen: {
    rules: false,
    leaderboard: false,
    username: false,
  },
};

vi.mock("@/context/app.context", () => ({
  useAppContext: () => mockContext,
}));

vi.mock("@/components/modals/modal.rules.component", () => ({
  RulesModal: () => <div>Rules Modal</div>,
}));

vi.mock("@/components/modals/modal.leaderboard.component", () => ({
  LeaderboardModal: () => <div>Leaderboard Modal</div>,
}));

vi.mock("@/components/modals/modal.username.component", () => ({
  UsernameModal: () => <div>Username Modal</div>,
}));

describe("Modals", () => {
  it("should render no modal when all modals are closed", () => {
    render(<Modals />);

    expect(screen.queryByText("Rules Modal")).not.toBeInTheDocument();
    expect(screen.queryByText("Leaderboard Modal")).not.toBeInTheDocument();
    expect(screen.queryByText("Username Modal")).not.toBeInTheDocument();
  });

  it("should render the rules modal when rules is open", () => {
    mockContext.isModalOpen.rules = true;

    render(<Modals />);

    expect(screen.getByText("Rules Modal")).toBeInTheDocument();

    mockContext.isModalOpen.rules = false;
  });

  it("should render the leaderboard modal when leaderboard is open", () => {
    mockContext.isModalOpen.leaderboard = true;

    render(<Modals />);

    expect(screen.getByText("Leaderboard Modal")).toBeInTheDocument();

    mockContext.isModalOpen.leaderboard = false;
  });

  it("should render the username modal when username is open", () => {
    mockContext.isModalOpen.username = true;

    render(<Modals />);

    expect(screen.getByText("Username Modal")).toBeInTheDocument();

    mockContext.isModalOpen.username = false;
  });

  it("should render multiple open modals simultaneously", () => {
    mockContext.isModalOpen.rules = true;
    mockContext.isModalOpen.username = true;

    render(<Modals />);

    expect(screen.getByText("Rules Modal")).toBeInTheDocument();
    expect(screen.getByText("Username Modal")).toBeInTheDocument();

    mockContext.isModalOpen.rules = false;
    mockContext.isModalOpen.username = false;
  });
});
