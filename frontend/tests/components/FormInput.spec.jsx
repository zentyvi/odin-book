import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "../../src/components/FormInput";

describe("FormInput component", () => {
  it("should render standard input with label and placeholder", () => {
    render(
      <FormInput id="username" label="Username" placeholder="Enter username" />,
    );

    const inputElement = screen.getByPlaceholderText("Enter username");
    const labelElement = screen.getByText("Username");

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe("INPUT");
    expect(labelElement).toBeInTheDocument();
  });

  it("should render required asterisk when isRequired is true", () => {
    render(<FormInput id="email" label="Email" isRequired={true} />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should render subtitle when provided", () => {
    render(
      <FormInput
        id="password"
        label="Password"
        subTitle="Must be at least 8 characters"
      />,
    );

    expect(
      screen.getByText("Must be at least 8 characters"),
    ).toBeInTheDocument();
  });

  it('should render textarea when type is set to "textarea"', () => {
    render(
      <FormInput id="bio" label="Bio" type="textarea" cols={40} rows={5} />,
    );

    const textareaElement = screen.getByRole("textbox");

    expect(textareaElement.tagName).toBe("TEXTAREA");
    expect(textareaElement).toHaveAttribute("cols", "40");
    expect(textareaElement).toHaveAttribute("rows", "5");
  });

  it("should call onChange callback when user types", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FormInput id="search" label="Search" value="" onChange={handleChange} />,
    );

    const inputElement = screen.getByRole("textbox");
    await user.type(inputElement, "hello");

    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it("should handle error as a string", () => {
    render(
      <FormInput id="email" label="Email" error="Invalid email address" />,
    );

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("should handle error as an object with msg property", () => {
    render(
      <FormInput
        id="email"
        label="Email"
        error={{ msg: "Field is required" }}
      />,
    );

    expect(screen.getByText("Field is required")).toBeInTheDocument();
  });
});
