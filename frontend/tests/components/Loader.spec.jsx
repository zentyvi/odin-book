import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loader from "../../src/components/Loader";

describe("Loader component", () => {
  it("should render standard loader", () => {
    render(<Loader />);

    const loader = screen.getByTestId("loader");
    const label = screen.getByText("Loading...");

    expect(loader).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it("should render custom label", () => {
    render(<Loader label="Cusom label" />);

    const label = screen.getByText("Cusom label");

    expect(label).toBeInTheDocument();
  });
});
