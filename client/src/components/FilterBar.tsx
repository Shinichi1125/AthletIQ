import React from "react";
import { activityOptions, activityConditions, shoesType } from "../constants/activityOptions";
import {
  isActivitySprintSets,
  isActivityShortSprint,
  isActivityTempoRun,
  isWeightTraining,
  isTimeBasedCalisthenics,
  isRepsBasedCalisthenics,
  isSingleLimbExercise
 } from "../utils/helper";
import { FilterState } from "../types";
import "./FilterBar.css";

interface FilterBarProps {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onFilter: () => void;
  onClear: () => void;
  t: (key: string) => string;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onFilter, onClear, t }) => {
  const {
    activityName,
    activityCondition,
    timeMin, timeMax,
    splitDiffMin, splitDiffMax,
    shoes,
    startDate, endDate,
  } = filters;

  const showConditionDropdown = activityName === "One_Hand_Pullups";
  const showTimeInputs =
    isActivitySprintSets({ Activity: activityName }) ||
    isActivityTempoRun({ Activity: activityName }) ||
    isTimeBasedCalisthenics({ Activity: activityName });
  const showSplitDiffInputs = isActivitySprintSets({ Activity: activityName }) && !isActivityShortSprint({ Activity: activityName });
  const showShoesDropdown = isActivitySprintSets({ Activity: activityName });
  const showWeightInputs = isWeightTraining({ Activity: activityName }) || isSingleLimbExercise({ Activity: activityName });;
  const showRepsInputs = showWeightInputs || activityCondition || isRepsBasedCalisthenics({ Activity: activityName });

  const isFilterDisabled = !activityName || (showConditionDropdown && !activityCondition);

  return (
    <div className="filter-bar">
      <div className="filter-field">
        <div>
          <select
            value={activityName}
            onChange={(e) => onChange({ activityName: e.target.value })}
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
          <div>
            <select
              value={activityCondition}
              onChange={(e) => onChange({ activityCondition: e.target.value })}
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
          <label>{t("Time_Range")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="number"
              value={timeMin}
              placeholder={t("Min")}
              onChange={(e) => onChange({ timeMin: e.target.value })}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={timeMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ timeMax: e.target.value })}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error" />
        </div>
      )}

      {showSplitDiffInputs && (
        <div className="filter-field">
          <label>{t("Split_Diff_Range")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              value={splitDiffMin}
              placeholder={t("Min")}
              onChange={(e) => onChange({ splitDiffMin: e.target.value })}
              pattern="^-?\d+(\.\d+)?$"
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="text"
              value={splitDiffMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ splitDiffMax: e.target.value })}
              pattern="^-?\d+(\.\d+)?$"
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error" />
        </div>
      )}

      {showShoesDropdown && (
        <div className="filter-field">
          <div>
            <select
              value={shoes}
              onChange={(e) => onChange({ shoes: e.target.value })}
            >
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

      {showWeightInputs && (
        <div className="filter-field">
          <label>{t("Weight_Range")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="number"
              value={filters.weightMin}
              placeholder={t("Min")}
              onChange={(e) => onChange({ weightMin: e.target.value })}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={filters.weightMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ weightMax: e.target.value })}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error" />
        </div>
      )}

      {showRepsInputs && (
        <div className="filter-field">
          <label>{t("Reps_Range")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="number"
              value={filters.repsMin}
              placeholder={t("Min")}
              onChange={(e) => onChange({ repsMin: e.target.value })}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={filters.repsMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ repsMax: e.target.value })}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error" />
        </div>
      )}

      <div className="filter-field">
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
          <span style={{ alignSelf: "center" }}>—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
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
