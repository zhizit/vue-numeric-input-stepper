import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch, reactive } from 'vue';
import NumericInputStepper from './NumericInputStepper.vue';
import { textSizeConverter } from './utils/ValueConverter';

const meta: Meta<typeof NumericInputStepper> = {
  title: 'Components/NumericInputStepper',
  component: NumericInputStepper,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: { type: 'number', min: 1, max: 100, step: 1 },
      description: 'The current value (v-model)',
    },
    min: {
      control: { type: 'number', min: 1, max: 100, step: 1 },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number', min: 1, max: 100, step: 1 },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number' },
      description: 'Increment/decrement step',
    },
    unit: {
      control: { type: 'text' },
      description: 'Unit label to display',
    },
    showUnit: {
      control: { type: 'boolean' },
      description: 'Show/hide unit label',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the component',
    },
    interval: {
      control: { type: 'number' },
      description: 'Long-press repeat interval (ms)',
    },
    longPressDelay: {
      control: { type: 'number' },
      description: 'Long-press detection delay (ms)',
    },
    saveDelay: {
      control: { type: 'number' },
      description: 'Debounce delay for save event (ms)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumericInputStepper>;

export const Default: Story = {
  render: (args) => ({
    components: { NumericInputStepper },
    setup() {
      const reactiveArgs = reactive(args as any);
      const value = ref(reactiveArgs.modelValue ?? 50);
      // argsが変更されたときにvalueを更新
      watch(() => reactiveArgs.modelValue, (newVal) => {
        if (newVal !== undefined) {
          value.value = newVal;
        }
      });
      watch(() => reactiveArgs.min, () => {
        // minが変更されたら、valueを範囲内に調整
        const min = reactiveArgs.min ?? 1;
        const max = reactiveArgs.max ?? 100;
        const clamped = Math.max(min, Math.min(max, value.value));
        if (clamped !== value.value) {
          value.value = clamped;
        }
      });
      watch(() => reactiveArgs.max, () => {
        // maxが変更されたら、valueを範囲内に調整
        const min = reactiveArgs.min ?? 1;
        const max = reactiveArgs.max ?? 100;
        const clamped = Math.max(min, Math.min(max, value.value));
        if (clamped !== value.value) {
          value.value = clamped;
        }
      });
      return {
        args: reactiveArgs,
        value,
      };
    },
    template: `
      <div style="padding: 20px;">
        <p style="margin-bottom: 10px;">Value: {{ value }} (min: {{ args.min }}, max: {{ args.max }})</p>
        <NumericInputStepper
          v-model="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :unit="args.unit"
          :show-unit="args.showUnit"
          :disabled="args.disabled"
          :interval="args.interval"
          :long-press-delay="args.longPressDelay"
          :save-delay="args.saveDelay"
          @save="(val) => console.log('Save:', val)"
          @change="(event) => console.log('Change:', event)"
        />
      </div>
    `,
  }),
  args: {
    modelValue: 50,
    min: 1,
    max: 100,
    step: 1,
    unit: 'pt',
    showUnit: true,
    disabled: false,
    interval: 100,
    longPressDelay: 350,
    saveDelay: 800,
  },
};

export const WithUnit: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const value = ref(14);
      return { value };
    },
    template: `
      <div style="padding: 20px;">
        <p style="margin-bottom: 10px;">Font Size: {{ value }}pt</p>
        <NumericInputStepper
          v-model="value"
          :min="1"
          :max="100"
          unit="pt"
        />
      </div>
    `,
  }),
};

export const CustomStep: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const value = ref(100);
      return { value };
    },
    template: `
      <div style="padding: 20px;">
        <p style="margin-bottom: 10px;">Value: {{ value }}px (Step: 10)</p>
        <NumericInputStepper
          v-model="value"
          :min="0"
          :max="1000"
          :step="10"
          unit="px"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const value = ref(50);
      return { value };
    },
    template: `
      <div style="padding: 20px;">
        <p style="margin-bottom: 10px;">Value: {{ value }} (disabled)</p>
        <NumericInputStepper
          v-model="value"
          :min="1"
          :max="100"
          :disabled="true"
        />
      </div>
    `,
  }),
};

export const WithoutUnit: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const value = ref(25);
      return { value };
    },
    template: `
      <div style="padding: 20px;">
        <p style="margin-bottom: 10px;">Value: {{ value }}</p>
        <NumericInputStepper
          v-model="value"
          :min="1"
          :max="100"
          unit="pt"
          :show-unit="false"
        />
      </div>
    `,
  }),
};

export const EventLog: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const value = ref(10);
      const eventLogs = ref<string[]>([]);

      const onSave = (val: number) => {
        const time = new Date().toLocaleTimeString();
        eventLogs.value.unshift(`[${time}] Save: ${val}`);
        if (eventLogs.value.length > 10) {
          eventLogs.value.pop();
        }
      };

      const onChange = (event: { oldValue: number; newValue: number }) => {
        const time = new Date().toLocaleTimeString();
        eventLogs.value.unshift(`[${time}] Change: ${event.oldValue} → ${event.newValue}`);
        if (eventLogs.value.length > 10) {
          eventLogs.value.pop();
        }
      };

      return { value, eventLogs, onSave, onChange };
    },
    template: `
      <div style="padding: 20px;">
        <p style="margin-bottom: 10px;">Value: {{ value }}</p>
        <NumericInputStepper
          v-model="value"
          :min="1"
          :max="50"
          @save="onSave"
          @change="onChange"
        />
        <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; max-height: 200px; overflow-y: auto;">
          <div style="font-size: 0.85em; font-weight: bold; margin-bottom: 8px;">Event Log:</div>
          <div v-for="(log, index) in eventLogs" :key="index" style="padding: 4px 0; border-bottom: 1px solid #eee; font-size: 0.85em;">
            {{ log }}
          </div>
          <div v-if="eventLogs.length === 0" style="color: #999; font-size: 0.85em;">
            No events yet. Try changing the value.
          </div>
        </div>
      </div>
    `,
  }),
};

export const CustomStyles: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const value1 = ref(14);
      const value2 = ref(20);
      const value3 = ref(30);
      const value4 = ref(40);
      return { value1, value2, value3, value4 };
    },
    template: `
      <div style="padding: 20px;">
        <style>
          .large-stepper {
            --stepper-button-width: 48px;
            --stepper-button-height: 48px;
            --stepper-input-width: 80px;
            --stepper-input-height: 36px;
            --stepper-input-font-size: 18px;
            --stepper-gap: 16px;
          }
          .colorful-stepper {
            --stepper-button-bg: #007bff;
            --stepper-button-color: white;
            --stepper-button-hover-bg: #0056b3;
            --stepper-button-active-bg: #004085;
            --stepper-button-radius: 8px;
            --stepper-input-border: 2px solid #007bff;
            --stepper-input-focus-border-color: #0056b3;
          }
          .minimal-stepper {
            --stepper-button-border: none;
            --stepper-button-bg: #f0f0f0;
            --stepper-button-hover-bg: #e0e0e0;
            --stepper-input-border: none;
            --stepper-input-bg: #f9f9f9;
            --stepper-gap: 4px;
          }
          .dark-stepper {
            --stepper-button-bg: #333;
            --stepper-button-color: white;
            --stepper-button-hover-bg: #555;
            --stepper-button-border: 1px solid #555;
            --stepper-input-bg: #222;
            --stepper-input-color: white;
            --stepper-input-border: 1px solid #555;
            --stepper-input-focus-border-color: #007bff;
            --stepper-unit-color: #aaa;
          }
        </style>
        
        <div style="margin-bottom: 30px;">
          <h3 style="margin-top: 0;">Default Style</h3>
          <p>Value: {{ value1 }}</p>
          <NumericInputStepper v-model="value1" :min="1" :max="100" unit="pt" />
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin-top: 0;">Large Size</h3>
          <p>Value: {{ value2 }}</p>
          <NumericInputStepper v-model="value2" :min="1" :max="100" unit="px" class="large-stepper" />
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin-top: 0;">Colorful Buttons</h3>
          <p>Value: {{ value3 }}</p>
          <NumericInputStepper v-model="value3" :min="1" :max="100" unit="pt" class="colorful-stepper" />
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin-top: 0;">Minimal Design</h3>
          <p>Value: {{ value4 }}</p>
          <NumericInputStepper v-model="value4" :min="1" :max="100" unit="px" class="minimal-stepper" />
        </div>

        <div style="background: #1a1a1a; color: white; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Dark Theme</h3>
          <p>Value: {{ value4 }}</p>
          <NumericInputStepper v-model="value4" :min="1" :max="100" unit="pt" class="dark-stepper" />
        </div>
      </div>
    `,
  }),
};

export const ValueConversion: Story = {
  render: () => ({
    components: { NumericInputStepper },
    setup() {
      const { toInternal } = textSizeConverter;
      
      const displayValue = ref(14);
      const internalValue = ref(toInternal(14));

      const onSave = (displayVal: number) => {
        const internalVal = toInternal(displayVal);
        internalValue.value = internalVal;
        console.log('Display:', displayVal, '→ Internal:', internalVal);
      };

      return { displayValue, internalValue, onSave };
    },
    template: `
      <div style="padding: 20px;">
        <div style="margin-bottom: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #1976d2;">Value Conversion Demo</p>
          <p style="margin: 0; font-size: 0.9em; color: #555;">
            Display values (1-100) to users, while storing internal values (23-1000) in the database.
          </p>
        </div>
        <p style="margin-bottom: 10px;">
          <strong>Display Value (shown to user):</strong> {{ displayValue }} <span style="color: #666; font-size: 0.9em;">(range: 1-100)</span>
        </p>
        <NumericInputStepper
          v-model="displayValue"
          :min="1"
          :max="100"
          unit="pt"
          @save="onSave"
        />
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0;">
            <strong>Internal Value (saved to database):</strong> {{ internalValue }} <span style="color: #666; font-size: 0.9em;">(range: 23-1000)</span>
          </p>
          <p style="margin: 0; font-size: 0.85em; color: #666;">
            Using textSizeConverter utility to convert between display and internal values.
          </p>
        </div>
      </div>
    `,
  }),
};

