export interface FilterState {
  activityName: string;
  activityCondition: string;
  timeMin: string;
  timeMax: string;
  splitDiffMin: string;
  splitDiffMax: string;
  shoes: string;
  startDate: string;
  endDate: string;
  weightMin: string;
  weightMax: string;
  repsMin: string;
  repsMax: string;
  noteQuery: string;
}

export interface TempoRunSplits {
  First_100m?: number;
  Second_100m?: number;
  Third_100m?: number;
  Fourth_100m?: number;
}
  
export interface SprintHalfSplit {
  Time: number;
  Steps?: number;
}

export interface SprintSplits {
  First_Half?: SprintHalfSplit;
  Second_Half?: SprintHalfSplit;
}

export interface SprintSet {
  Set: number;
  Time: number;
  Steps: number;
  Splits?: SprintSplits[];
}

export interface SingleLimbReps {
  Left_Arm?: number;
  Right_Arm?: number;
  Left_Leg?: number;
  Right_Leg?: number;
}

export interface UnitValue {
  Value: number;
  Unit: string;
}

export interface StrengthSet {
  Set: number;
  Reps?: number | SingleLimbReps;
  Weight?: UnitValue;
  Time?: UnitValue;
  Hops?: number;
}

export interface Activity {
  Activity: string;
  Reps?: number;
  Sets?: StrengthSet[] | SprintSet[];
  Time?: number;
  Splits?: TempoRunSplits;
  Weight?: UnitValue;
  Distance?: UnitValue;
  Shoes?: string;
  Condition?: string; 
}

export interface TrainingDay {
  Date: string;
  Weather: string;
  Location: string;
  Time: {
    Start: string;
    End: string;
  };
  Activities: Activity[];
  Body_Weight?: UnitValue;
  Notes?: Note[];
  References?: Reference[];
}
  
export interface Note {
  note: NoteContent[] | { text: string };
}
  
export interface NoteContent {
  text: string;
  link?: string;
}
  
export interface Reference {
  reference: {
    title: string;
    link: string;
  };
}
