import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders logos and initial count", () => {
    render(<App />);

    // Check for Vite logo
    expect(screen.getByAltText("Vite logo")).toBeInTheDocument();

    // Check for React logo
    expect(screen.getByAltText("React logo")).toBeInTheDocument();

    // Check for heading
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();

    // Check initial count
    expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
  });

  test("increments count on button click", () => {
    render(<App />);

    const button = screen.getByRole("button", { name: /count is 0/i });
    fireEvent.click(button);

    expect(screen.getByText(/count is 1/i)).toBeInTheDocument();
  });
});
