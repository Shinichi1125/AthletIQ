jest.mock("./components/FetchData", () => () => <div>FetchData Mock</div>);
jest.mock("./auth/google", () => ({
  initGoogleSignIn: (cb: any) => {},
  getIdToken: () => null,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app shell", () => {
  render(<App />);
  expect(screen.getByText("AthletIQ")).toBeInTheDocument();
});
