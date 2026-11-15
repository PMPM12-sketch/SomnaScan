import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";

// jsdom lacks these browser features that the UI library expects
beforeAll(() => {
  global.ResizeObserver =
    global.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  window.matchMedia =
    window.matchMedia ||
    (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || (() => false);
});

test("app renders the dashboard and the medical disclaimer", () => {
  render(<App />);
  expect(screen.getByTestId("medical-disclaimer-footer")).toBeInTheDocument();
  expect(screen.getByTestId("reset-inputs-button")).toBeInTheDocument();
  expect(screen.getByTestId("export-pdf-button")).toBeInTheDocument();
});

test("reset button does not crash the page", () => {
  render(<App />);
  fireEvent.click(screen.getByTestId("reset-inputs-button"));
  expect(screen.getByTestId("medical-disclaimer-footer")).toBeInTheDocument();
});

test("error boundary shows a friendly message instead of a blank page", () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  const Boom = () => {
    throw new Error("boom");
  };
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );
  expect(within(screen.getByRole("alert")).getByText(/something went wrong/i)).toBeInTheDocument();
  spy.mockRestore();
});
