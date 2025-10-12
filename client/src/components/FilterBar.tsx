import React from "react";
import { useTranslation } from "react-i18next";
import { activityOptions } from "../constants/activityOptions";

interface FilterBarProps {
  activityName: string;
  onActivityNameChange: (value: string) => void;
  onFilter: () => void;
  onClear: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activityName,
  onActivityNameChange,
  onFilter,
  onClear,
}) => {
  const { t } = useTranslation();

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

      <button onClick={onFilter} style={{ marginLeft: "10px" }}>
        {t("Filter")} 
      </button>

      <button onClick={onClear} style={{ marginLeft: "10px" }}>
        {t("Reset")}
      </button>
    </div>
  );
};

export default FilterBar;
