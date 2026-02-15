import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBar from "./FilterBar";
import { FilterState } from "../types";

const baseFilters: FilterState = {
  activityName: "",
  activityCondition: "",
  timeMin: "",
  timeMax: "",
  splitDiffMin: "",
  splitDiffMax: "",
  shoes: "",
  startDate: "",
  endDate: "",
  weightMin: "",
  weightMax: "",
  repsMin: "",
  repsMax: "",
  setCount: "",
  noteQuery: "",
};

const renderFilterBar = (
  overrides: Partial<FilterState> = {},
  onFilter = jest.fn()
) => {
  const Wrapper: React.FC = () => {
    const [filters, setFilters] = React.useState<FilterState>({
      ...baseFilters,
      ...overrides,
    });
    return (
      <FilterBar
        filters={filters}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onFilter={onFilter}
        onClear={jest.fn()}
        isJapanese={false}
        guestMode={false}
        t={(key) => key}
      />
    );
  };

  render(<Wrapper />);
  return { onFilter };
};

describe("FilterBar", () => {
  it("Filter button disabled until Activity selected", async () => {
    renderFilterBar();

    const filterButton = screen.getByRole("button", { name: "Filter" });
    expect(filterButton).toBeDisabled();

    const activitySelect = screen.getByLabelText("Activity_Name");
    userEvent.selectOptions(activitySelect, "Plank");

    expect(filterButton).toBeEnabled();
  });

  it('when Activity is "One_Hand_Pullups", condition dropdown appears and Filter stays disabled until condition chosen', async () => {
    renderFilterBar();

    const filterButton = screen.getByRole("button", { name: "Filter" });
    const activitySelect = screen.getByLabelText("Activity_Name");
    userEvent.selectOptions(activitySelect, "One_Hand_Pullups");

    const conditionSelect = screen.getByLabelText("Condition");
    expect(conditionSelect).toBeInTheDocument();
    expect(filterButton).toBeDisabled();

    userEvent.selectOptions(conditionSelect, "Rope_Assisted");
    expect(filterButton).toBeEnabled();
  });

  it("click Filter calls onFilter once (when enabled)", async () => {
    const { onFilter } = renderFilterBar({ activityName: "Plank" });

    const filterButton = screen.getByRole("button", { name: "Filter" });
    expect(filterButton).toBeEnabled();

    userEvent.click(filterButton);
    expect(onFilter).toHaveBeenCalledTimes(1);
  });

  it("entering min > max shows error text and clears when fixed", async () => {
    renderFilterBar({ activityName: "Plank" });

    const minInput = screen.getByPlaceholderText("Min");
    const maxInput = screen.getByPlaceholderText("Max");

    userEvent.type(minInput, "10");
    userEvent.type(maxInput, "5");

    expect(screen.getByText("Min_Less_Than_Or_Equal_Max")).toBeInTheDocument();

    userEvent.clear(maxInput);
    userEvent.type(maxInput, "12");

    expect(screen.queryByText("Min_Less_Than_Or_Equal_Max")).toBeNull();
  });
});
