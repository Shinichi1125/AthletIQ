import React from "react";
import { activityOptions, activityConditions, shoesType } from "../constants/activityOptions";
import { isActivitySprintSets, isActivityShortSprint, isActivityTempoRun } from "../utils/helper";

interface FilterBarProps {
  activityName: string;
  activityCondition: string;
  splitDiffMin: string;
  splitDiffMax: string;
  timeMin: string;
  timeMax: string;
  shoes: string;
  startDate: string;
  endDate: string;
  onActivityNameChange: (value: string) => void;
  onActivityConditionChange: (value: string) => void;
  onSplitDiffMinChange: (value: string) => void;
  onSplitDiffMaxChange: (value: string) => void;
  onTimeMinChange: (value: string) => void;
  onTimeMaxChange: (value: string) => void;
  onShoesChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onFilter: () => void;
  onClear: () => void;
  t: (key: string) => string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activityName,
  activityCondition,
  splitDiffMin,
  splitDiffMax,
  timeMin,
  timeMax,
  shoes,
  startDate,
  endDate,
  onActivityNameChange,
  onActivityConditionChange,
  onSplitDiffMinChange,
  onSplitDiffMaxChange,
  onTimeMinChange,
  onTimeMaxChange,
  onShoesChange,
  onStartDateChange,
  onEndDateChange,
  onFilter,
  onClear,
  t,
}) => {
  const showConditionDropdown = activityName === "One_Hand_Pullups";
  const showTimeInputs = isActivitySprintSets({ Activity: activityName }) || isActivityTempoRun({ Activity: activityName });
  const showSplitDiffInputs = isActivitySprintSets({ Activity: activityName }) && !isActivityShortSprint({ Activity: activityName });
  const showShoesDropdown = isActivitySprintSets({ Activity: activityName });
  const isFilterDisabled = !activityName || (showConditionDropdown && !activityCondition);

  return (
    <div className="filter-bar">
      <div className="filter-field">
        <div style={{ display: "flex", gap: 6 }}>
          <label>{t("Activity_Name")}</label>
          <select
            value={activityName}
            onChange={(e) => onActivityNameChange(e.target.value)}
          >
            <option value="">{t("Select_Activity")}</option>
            {activityOptions.map((activity) => (
              <option key={activity} value={activity}>
                {t(activity)}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-error" />
      </div>

      {showConditionDropdown && (
        <div className="filter-field">
          <div style={{ display: "flex", gap: 6 }}>
            <label>{t("Condition")}</label>
            <select
              value={activityCondition}
              onChange={(e) => onActivityConditionChange(e.target.value)}
            >
              <option value="">{t("Select_Condition")}</option>
              {activityConditions.map((cond) => (
                <option key={cond} value={cond}>
                  {t(cond)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-error" />
        </div>
      )}

      {showTimeInputs && (
        <div className="filter-field">
          <div style={{ display: "flex", gap: 6 }}>
            <label>{t("Time_Range")}</label>
            <input
              type="number"
              value={timeMin}
              placeholder={t("Min")}
              onChange={(e) => onTimeMinChange(e.target.value)}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={timeMax}
              placeholder={t("Max")}
              onChange={(e) => onTimeMaxChange(e.target.value)}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error" />
        </div>
      )}

      {showSplitDiffInputs && (
        <div className="filter-field">
          <div style={{ display: "flex", gap: 6 }}>
            <label>{t("Split_Diff_Range")}</label>
            <input
              type="text"
              value={splitDiffMin}
              placeholder={t("Min")}
              onChange={(e) => onSplitDiffMinChange(e.target.value)}
              pattern="^-?\d+(\.\d+)?$"
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="text"
              value={splitDiffMax}
              placeholder={t("Max")}
              onChange={(e) => onSplitDiffMaxChange(e.target.value)}
              pattern="^-?\d+(\.\d+)?$"
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error" />
        </div>
      )}

      {showShoesDropdown && (
        <div className="filter-field">
          <div style={{ display: "flex", gap: 6 }}>
            <label>{t("Shoes")}</label>
            <select value={shoes} onChange={(e) => onShoesChange(e.target.value)}>
              <option value="">{t("Select_Shoes")}</option>
              {shoesType.map((shoe) => (
                <option key={shoe} value={shoe}>
                  {t(shoe)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-error" />
        </div>
      )}

      <div className="filter-field">
        <div style={{ display: "flex", gap: 6 }}>
          <label>{t("Date_Range")}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <span style={{ alignSelf: "center" }}>—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
        <div className="filter-error" />
      </div>

      <div className="filter-actions">
        <button onClick={onFilter} disabled={isFilterDisabled}>
          {t("Filter")}
        </button>
        <button onClick={onClear}>{t("Reset")}</button>
      </div>
    </div>
  );
};

export default FilterBar;
