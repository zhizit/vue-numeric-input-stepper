<template>
  <div class="numeric-input-stepper">
    <div class="numeric-input-stepper__controls">
      <button
        type="button"
        class="numeric-input-stepper__button numeric-input-stepper__button--decrement"
        :disabled="isDecrementDisabled || disabled"
        :aria-label="`Decrease ${unit || 'value'}`"
        :aria-disabled="isDecrementDisabled || disabled"
        @mousedown.prevent="onDecrementPress"
        @mouseup="onRelease"
        @mouseleave="onRelease"
        @touchstart.prevent="onDecrementPress"
        @touchend="onRelease"
        @touchcancel="onRelease"
      >
        <slot name="decrement-icon">
          <svg class="icon-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </slot>
      </button>
      <input
        ref="inputRef"
        type="text"
        class="numeric-input-stepper__input"
        :value="displayValue"
        :disabled="disabled"
        :aria-label="`Numeric input${unit ? ` in ${unit}` : ''}`"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onEnter"
      />
      <button
        type="button"
        class="numeric-input-stepper__button numeric-input-stepper__button--increment"
        :disabled="isIncrementDisabled || disabled"
        :aria-label="`Increase ${unit || 'value'}`"
        :aria-disabled="isIncrementDisabled || disabled"
        @mousedown.prevent="onIncrementPress"
        @mouseup="onRelease"
        @mouseleave="onRelease"
        @touchstart.prevent="onIncrementPress"
        @touchend="onRelease"
        @touchcancel="onRelease"
      >
        <slot name="increment-icon">
          <svg class="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </slot>
      </button>
    </div>
    <span v-if="unit && showUnit" class="numeric-input-stepper__unit">{{ unit }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { PressTimerManager } from './utils/PressTimerManager';
import { DebounceSaveManager } from './utils/DebounceSaveManager';
import {
  handleNumericInputKeydown,
  validateNumericInput,
  parseAndClampInput,
  clampValue,
} from './utils/NumericInputHelpers';

export interface ChangeEvent {
  oldValue: number;
  newValue: number;
}

export interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showUnit?: boolean;
  disabled?: boolean;
  interval?: number;
  longPressDelay?: number;
  saveDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 400,
  step: 1,
  unit: '',
  showUnit: true,
  disabled: false,
  interval: 100,
  longPressDelay: 350,
  saveDelay: 800,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  save: [value: number];
  change: [event: ChangeEvent];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const displayValue = ref<string | number>(props.modelValue);
const isInputting = ref(false);
const hasPressRepeatTriggered = ref(false);

let pressTimerManager: PressTimerManager | null = null;
let saveManager: DebounceSaveManager | null = null;

const isDecrementDisabled = computed(() => {
  return clampValue(props.modelValue, props.min, props.max) <= props.min;
});

const isIncrementDisabled = computed(() => {
  return clampValue(props.modelValue, props.min, props.max) >= props.max;
});

const changeValue = (delta: number): void => {
  const newValue = clampValue(props.modelValue + delta, props.min, props.max);
  updateValue(newValue);
};

const updateValue = (newValue: number): void => {
  displayValue.value = newValue;
  emit('update:modelValue', newValue);
  if (saveManager) {
    saveManager.schedule(newValue);
  }
};

const onDecrementPress = (): void => {
  if (isDecrementDisabled.value || props.disabled) return;
  hasPressRepeatTriggered.value = false;
  changeValue(-props.step);
  if (pressTimerManager) {
    pressTimerManager.start(() => {
      hasPressRepeatTriggered.value = true;
      changeValue(-props.step);
    }, props.longPressDelay);
  }
};

const onIncrementPress = (): void => {
  if (isIncrementDisabled.value || props.disabled) return;
  hasPressRepeatTriggered.value = false;
  changeValue(props.step);
  if (pressTimerManager) {
    pressTimerManager.start(() => {
      hasPressRepeatTriggered.value = true;
      changeValue(props.step);
    }, props.longPressDelay);
  }
};

const onRelease = (): void => {
  if (pressTimerManager) {
    pressTimerManager.stop();
  }
  // 長押しでリピートが発生していた場合のみ、保留中の保存を即座に確定
  if (hasPressRepeatTriggered.value && saveManager) {
    saveManager.commitPending();
  }
};

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const inputValue = target.value;

  if (validateNumericInput(inputValue)) {
    displayValue.value = inputValue;
    isInputting.value = true;
  } else {
    target.value = String(displayValue.value);
  }
};

const onKeydown = (event: KeyboardEvent): void => {
  handleNumericInputKeydown(event);
};

const onFocus = (): void => {
  isInputting.value = true;
};

const onBlur = (): void => {
  commitInput();
};

const onEnter = (): void => {
  commitInput();
  if (inputRef.value) {
    inputRef.value.blur();
  }
};

const commitInput = (): void => {
  isInputting.value = false;
  const numValue = parseAndClampInput(
    String(displayValue.value),
    props.modelValue,
    props.min,
    props.max
  );
  displayValue.value = numValue;
  updateValue(numValue);
};

onMounted(() => {
  pressTimerManager = new PressTimerManager(props.interval);
  saveManager = new DebounceSaveManager(
    props.saveDelay,
    (value: number) => emit('save', value),
    (oldValue: number, newValue: number) =>
      emit('change', { oldValue, newValue }),
    props.modelValue
  );
});

watch(
  () => props.modelValue,
  (newValue: number) => {
    if (!isInputting.value) {
      displayValue.value = newValue;
      if (saveManager) {
        saveManager.updateCommittedValue(newValue);
      }
    }
  }
);

onBeforeUnmount(() => {
  if (pressTimerManager) {
    pressTimerManager.cleanup();
  }
  if (saveManager) {
    saveManager.cleanup();
  }
});
</script>

<style scoped>
.numeric-input-stepper {
  display: flex;
  align-items: center;
  gap: var(--stepper-gap, 8px);
  padding: var(--stepper-padding, 5px 6px);
}

.numeric-input-stepper__controls {
  display: flex;
  align-items: center;
  gap: var(--stepper-controls-gap, 4px);
}

.numeric-input-stepper__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--stepper-button-width, 32px);
  height: var(--stepper-button-height, 32px);
  padding: var(--stepper-button-padding, 0);
  border: var(--stepper-button-border, 1px solid rgba(0, 0, 0, 0.2));
  background-color: var(--stepper-button-bg, transparent);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  border-radius: var(--stepper-button-radius, 4px);
  color: var(--stepper-button-color, currentColor);
}

.numeric-input-stepper__button:hover:not(:disabled) {
  background-color: var(--stepper-button-hover-bg, rgba(0, 0, 0, 0.05));
}

.numeric-input-stepper__button:active:not(:disabled) {
  background-color: var(--stepper-button-active-bg, rgba(0, 0, 0, 0.1));
}

.numeric-input-stepper__button:disabled {
  opacity: var(--stepper-button-disabled-opacity, 0.5);
  cursor: not-allowed;
}

.numeric-input-stepper__button svg {
  width: var(--stepper-icon-width, 16px);
  height: var(--stepper-icon-height, 16px);
  color: var(--stepper-icon-color, currentColor);
  stroke: var(--stepper-icon-stroke, currentColor);
}

.numeric-input-stepper__input {
  width: var(--stepper-input-width, 44px);
  height: var(--stepper-input-height, 24px);
  border: var(--stepper-input-border, 1px solid rgba(0, 0, 0, 0.2));
  border-radius: var(--stepper-input-radius, 4px);
  text-align: center;
  font-size: var(--stepper-input-font-size, 14px);
  background-color: var(--stepper-input-bg, transparent);
  color: var(--stepper-input-color, inherit);
}

.numeric-input-stepper__input:focus {
  outline: none;
  border-color: var(--stepper-input-focus-border-color, rgba(0, 0, 0, 0.4));
}

.numeric-input-stepper__input:disabled {
  opacity: var(--stepper-input-disabled-opacity, 0.5);
  cursor: not-allowed;
}

.numeric-input-stepper__unit {
  font-size: var(--stepper-unit-font-size, 13px);
  color: var(--stepper-unit-color, rgba(0, 0, 0, 0.6));
}
</style>

