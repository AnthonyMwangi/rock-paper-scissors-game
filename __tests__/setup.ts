import "@testing-library/jest-dom/vitest";
import { afterAll, vi } from "vitest";
import { MockAppContext } from "./utils/mockAppContext";
import { MockStore } from "./utils/mockStore";

vi.mock(import("@/context/app.context"), async (importActual) => ({
  ...(await importActual()),
  useAppContext: vi.fn(() => MockAppContext.getState()),
}));

vi.mock("@/store", () => {
  // Create a base mock function to simulate the hook / selector usage
  const mockUseStore = vi.fn((selector: (_: unknown) => unknown) => {
    const mockState = MockStore.getState();
    return selector ? selector(mockState) : mockState;
  });

  // Attach the getState method to the mock function for vanilla JS usage
  (mockUseStore as unknown as Record<string, unknown>).getState = vi.fn(() =>
    MockStore.getState(),
  );

  return {
    useGlobalStore: mockUseStore,
  };
});

vi.mock("@/hooks/useLayout.ts", () => ({
  useLayout: vi.fn(),
}));

afterAll(() => {
  MockAppContext.reset();
  MockStore.reset();
});
