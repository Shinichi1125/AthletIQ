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
  isJapanese: boolean;
  guestMode?: boolean;
  t: (key: string) => string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onFilter,
  onClear,
  isJapanese,
  guestMode = false,
  t,
}) => {
  const {
    activityName,
    activityCondition,
    timeMin, timeMax,
    splitDiffMin, splitDiffMax,
    weightMin, weightMax,
    repsMin, repsMax,
    shoes,
    startDate, endDate,
    noteQuery,
    setCount
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
  const showSetCountInput = Boolean(activityName);

  const minTime = parseFloat(timeMin);
  const maxTime = parseFloat(timeMax);
  const minSplitDiff = parseFloat(splitDiffMin);
  const maxSplitDiff = parseFloat(splitDiffMax);
  const minWeight = parseFloat(weightMin);
  const maxWeight = parseFloat(weightMax);
  const minReps = parseFloat(repsMin);
  const maxReps = parseFloat(repsMax);
  const setCountValue = parseFloat(setCount);

  const isDateRangeInvalid = Boolean(startDate && endDate && startDate > endDate);
  const isTimeRangeInvalid = !Number.isNaN(minTime) && !Number.isNaN(maxTime) && minTime > maxTime;
  const hasNegativeTime =
    (!Number.isNaN(minTime) && minTime < 0) || (!Number.isNaN(maxTime) && maxTime < 0);
  const isSplitDiffRangeInvalid =
    !Number.isNaN(minSplitDiff) && !Number.isNaN(maxSplitDiff) && minSplitDiff > maxSplitDiff;
  const isWeightRangeInvalid =
    !Number.isNaN(minWeight) && !Number.isNaN(maxWeight) && minWeight > maxWeight;
  const hasNegativeWeight =
    (!Number.isNaN(minWeight) && minWeight < 0) || (!Number.isNaN(maxWeight) && maxWeight < 0);
  const isRepsRangeInvalid =
    !Number.isNaN(minReps) && !Number.isNaN(maxReps) && minReps > maxReps;
  const hasNegativeReps =
    (!Number.isNaN(minReps) && minReps < 0) || (!Number.isNaN(maxReps) && maxReps < 0);
  const hasNegativeSetCount = !Number.isNaN(setCountValue) && setCountValue < 0;

  const hasDateRange = Boolean(startDate && endDate);
  const isFilterDisabled =
    (!activityName && noteQuery === '' && !hasDateRange) ||
    (showConditionDropdown && !activityCondition) ||
    isDateRangeInvalid ||
    isTimeRangeInvalid ||
    hasNegativeTime ||
    isSplitDiffRangeInvalid ||
    isWeightRangeInvalid ||
    hasNegativeWeight ||
    isRepsRangeInvalid ||
    hasNegativeReps ||
    hasNegativeSetCount;

  return (
    <div className="filter-bar">
      <div className="filter-field">
        <div>
          <select
            value={activityName}
            onChange={(e) => onChange({ activityName: e.target.value })}
            aria-label={t("Activity_Name")}
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
            aria-label={t("Condition")}
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
              aria-invalid={isTimeRangeInvalid || hasNegativeTime || undefined}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={timeMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ timeMax: e.target.value })}
              aria-invalid={isTimeRangeInvalid || hasNegativeTime || undefined}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error">
            {isTimeRangeInvalid
              ? t("Min_Less_Than_Or_Equal_Max")
              : (hasNegativeTime ? t("Non_Negative_Only") : "")}
          </div>
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
              aria-invalid={isSplitDiffRangeInvalid || undefined}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="text"
              value={splitDiffMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ splitDiffMax: e.target.value })}
              pattern="^-?\d+(\.\d+)?$"
              aria-invalid={isSplitDiffRangeInvalid || undefined}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error">
            {isSplitDiffRangeInvalid ? t("Min_Less_Than_Or_Equal_Max") : ""}
          </div>
        </div>
      )}

      {showShoesDropdown && (
        <div className="filter-field">
          <div>
          <select
            value={shoes}
            onChange={(e) => onChange({ shoes: e.target.value })}
            aria-label={t("Shoes")}
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
              value={weightMin}
              placeholder={t("Min")}
              onChange={(e) => onChange({ weightMin: e.target.value })}
              aria-invalid={isWeightRangeInvalid || hasNegativeWeight || undefined}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={weightMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ weightMax: e.target.value })}
              aria-invalid={isWeightRangeInvalid || hasNegativeWeight || undefined}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error">
            {isWeightRangeInvalid
              ? t("Min_Less_Than_Or_Equal_Max")
              : (hasNegativeWeight ? t("Non_Negative_Only") : "")}
          </div>
        </div>
      )}

      {showRepsInputs && (
        <div className="filter-field">
          <label>{t("Reps_Range")}</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="number"
              value={repsMin}
              placeholder={t("Min")}
              onChange={(e) => onChange({ repsMin: e.target.value })}
              aria-invalid={isRepsRangeInvalid || hasNegativeReps || undefined}
              style={{ width: 80 }}
            />
            <span style={{ alignSelf: "center" }}>–</span>
            <input
              type="number"
              value={repsMax}
              placeholder={t("Max")}
              onChange={(e) => onChange({ repsMax: e.target.value })}
              aria-invalid={isRepsRangeInvalid || hasNegativeReps || undefined}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error">
            {isRepsRangeInvalid
              ? t("Min_Less_Than_Or_Equal_Max")
              : (hasNegativeReps ? t("Non_Negative_Only") : "")}
          </div>
        </div>
      )}

      {showSetCountInput && (
        <div className="filter-field">
          <label>{t("Set_Count")}</label>
          <div>
            <input
              type="number"
              min={1}
              value={setCount}
              placeholder={t("Set_Count")}
              onChange={(e) => onChange({ setCount: e.target.value })}
              aria-invalid={hasNegativeSetCount || undefined}
              style={{ width: 80 }}
            />
          </div>
          <div className="filter-error">
            {hasNegativeSetCount ? t("Non_Negative_Only") : ""}
          </div>
        </div>
      )}

      {isJapanese && !guestMode && (
        <div className="filter-field">
          <div>
            <input
              type="text"
              value={filters.noteQuery}
              placeholder={t("Enter_Keyword")}
              onChange={(e) => onChange({ noteQuery: e.target.value })}
              style={{ width: 220 }}
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
            aria-invalid={isDateRangeInvalid || undefined}
            aria-label={t("Date_Range")}
          />
          <span style={{ alignSelf: "center" }}>—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            aria-invalid={isDateRangeInvalid || undefined}
            aria-label={t("Date_Range")}
          />
        </div>
        <div className="filter-error">
          {isDateRangeInvalid ? t("Date_Range_Invalid") : ""}
        </div>
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
