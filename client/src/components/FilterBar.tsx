import React from "react";
import { activityOptions, activityConditions } from "../constants/activityOptions";

interface FilterBarProps {
  activityName: string;
  activityCondition: string;
  onActivityNameChange: (value: string) => void;
  onActivityConditionChange: (value: string) => void;
  onFilter: () => void;
  onClear: () => void;
  t: (key: string) => string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activityName,
  activityCondition,
  onActivityNameChange,
  onActivityConditionChange,
  onFilter,
  onClear,
  t,
}) => {
  const isFilterDisabled = !activityName || (activityName === "One_Hand_Pullups" && !activityCondition);

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

      {activityName === "One_Hand_Pullups" && (
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

      <button onClick={onFilter} style={{ marginLeft: "10px" }} disabled={isFilterDisabled}>
        {t("Filter")}
      </button>

      <button onClick={onClear} style={{ marginLeft: "10px" }}>
        {t("Reset")}
      </button>
    </div>
  );
};

export default FilterBar;
