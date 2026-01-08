export interface ChangeEvent {
  oldValue: number;
  newValue: number;
}

export interface NumericInputStepperProps {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  interval?: number;
  longPressDelay?: number;
  saveDelay?: number;
}

