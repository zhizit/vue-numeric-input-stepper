import NumericInputStepper from './NumericInputStepper.vue';
import type { App } from 'vue';

export { NumericInputStepper };
export type { ChangeEvent } from './types';
export type { NumericInputStepperProps } from './types';

// 値変換ユーティリティ
export { createValueConverter, textSizeConverter } from './utils/ValueConverter';
export type { ConversionConfig } from './utils/ValueConverter';

export const install = (app: App) => {
  app.component('NumericInputStepper', NumericInputStepper);
};

