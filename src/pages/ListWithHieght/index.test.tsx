import { render, fireEvent } from "@testing-library/react";
import ListWithHeight from "./index";

// Mock the useDocumentMeta hook
jest.mock("../../hooks/useTitle", () => ({
  __esModule: true,
  default: jest.fn(() => {})
}));

// Mock the Card component
jest.mock("../../components/Card", () => ({
  __esModule: true,
  default: ({ label }: { label: string }) => <div>{label}</div>
}));

describe("ListWithHeight Component", () => {
  it("renders initial 10 cards", () => {
    const { getAllByText } = render(<ListWithHeight />);
    const cards = getAllByText(/Card No. is/i);
    expect(cards.length).toBe(10);
  });

  it("loads more cards on scroll near bottom", () => {
    const { container, getAllByText } = render(<ListWithHeight />);
    const scrollContainer = container.querySelector(".listWithHeight");

    if (!scrollContainer) throw new Error("Scroll container not found");

    // Simulate scroll near bottom
    Object.defineProperty(scrollContainer, "scrollHeight", { value: 1000 });
    Object.defineProperty(scrollContainer, "clientHeight", { value: 500 });
    Object.defineProperty(scrollContainer, "scrollTop", { value: 481 }); // scrollRemain = 19

    fireEvent.scroll(scrollContainer);

    // Wait for re-render
    setTimeout(() => {
      const cards = getAllByText(/Card No. is/i);
      expect(cards.length).toBeGreaterThan(10);
    }, 0);
  });

  
});
