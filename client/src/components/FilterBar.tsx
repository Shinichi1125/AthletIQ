import React from "react";
import { activityOptions, activityConditions } from "../constants/activityOptions";
import { isActivitySprintSets, isActivityShortSprint } from "../utils/helper";

interface FilterBarProps {
  activityName: string;
  activityCondition: string;
  splitDiffMin: string;
  splitDiffMax: string;
  onActivityNameChange: (value: string) => void;
  onActivityConditionChange: (value: string) => void;
  onSplitDiffMinChange: (value: string) => void;
  onSplitDiffMaxChange: (value: string) => void;
  onFilter: () => void;
  onClear: () => void;
  t: (key: string) => string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activityName,
  activityCondition,
  splitDiffMin,
  splitDiffMax,
  onActivityNameChange,
  onActivityConditionChange,
  onSplitDiffMinChange,
  onSplitDiffMaxChange,
  onFilter,
  onClear,
  t,
}) => {
  const showConditionDropdown = activityName === "One_Hand_Pullups";
  const showSplitDiffInputs = isActivitySprintSets({ Activity: activityName }) && !isActivityShortSprint({ Activity: activityName });

  const isFilterDisabled =
    !activityName ||
    (showConditionDropdown && !activityCondition) ||
    (showSplitDiffInputs && (splitDiffMin === "" || splitDiffMax === ""));

  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        {t("Activity_Name")}:
        <select
          value={activityName}
          onChange={(e) => onActivityNameChange(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">{t("Select_Activity")}</option>
          {activityOptions.map((activity) => (
            <option key={activity} value={activity}>
              {t(activity)}
            </option>
          ))}
        </select>
      </label>

      {showConditionDropdown && (
        <label style={{ marginLeft: "20px" }}>
          {t("Condition")}:
          <select
            value={activityCondition}
            onChange={(e) => onActivityConditionChange(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">{t("Select_Condition")}</option>
            {activityConditions.map((cond) => (
              <option key={cond} value={cond}>
                {t(cond)}
              </option>
            ))}
          </select>
        </label>
      )}

      {showSplitDiffInputs && (
        <span style={{ marginLeft: "20px" }}>
          {t("Split_Diff_Range")}:
          <input
            type="number"
            value={splitDiffMin}
            placeholder={t("Min")}
            onChange={(e) => onSplitDiffMinChange(e.target.value)}
            style={{ width: "60px", marginLeft: "5px", marginRight:"5px" }}
          />
          -
          <input
            type="number"
            value={splitDiffMax}
            placeholder={t("Max")}
            onChange={(e) => onSplitDiffMaxChange(e.target.value)}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </span>
      )}

      <button
        onClick={onFilter}
        style={{ marginLeft: "10px" }}
        disabled={isFilterDisabled}
      >
        {t("Filter")}
      </button>

      <button onClick={onClear} style={{ marginLeft: "10px" }}>
        {t("Reset")}
      </button>
    </div>
  );
};

export default FilterBar;
