import { Modals } from "@/components/modals";
import { render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { beforeAll, describe, expect, it } from "vitest";

describe("Modals", () => {
  beforeAll(() => {
    MockAppContext.update({
      isModalOpen: {
        rules: false,
        leaderboard: false,
        username: false,
      },
    });
  });

  it("should render no modal when all modals are closed", () => {
    render(<Modals />);

    expect(screen.queryByTestId("rules-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("leaderboard-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("username-modal")).not.toBeInTheDocument();
  });

  it("should render the rules modal when rules is open", () => {
    MockAppContext.update({
      isModalOpen: {
        rules: true,
        leaderboard: false,
        username: false,
      },
    });

    render(<Modals />);

    expect(screen.queryByTestId("rules-modal")).toBeInTheDocument();
  });

  it("should render the leaderboard modal when leaderboard is open", () => {
    MockAppContext.update({
      isModalOpen: {
        rules: false,
        leaderboard: true,
        username: false,
      },
    });

    render(<Modals />);

    expect(screen.queryByTestId("leaderboard-modal")).toBeInTheDocument();
  });

  it("should render the username modal when username is open", () => {
    MockAppContext.update({
      isModalOpen: {
        rules: false,
        leaderboard: false,
        username: true,
      },
    });

    render(<Modals />);

    expect(screen.queryByTestId("username-modal")).toBeInTheDocument();
  });
});
