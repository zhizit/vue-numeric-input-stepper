# Vue Numeric Input Stepper

[![CI](https://github.com/zhizit/vue-numeric-input-stepper/actions/workflows/ci.yml/badge.svg)](https://github.com/zhizit/vue-numeric-input-stepper/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/vue-numeric-input-stepper.svg)](https://www.npmjs.com/package/vue-numeric-input-stepper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A flexible and accessible numeric input stepper component for Vue 3 with long-press support and debounced saving.

## Screenshot

![Vue Numeric Input Stepper](https://github.com/zhizit/vue-numeric-input-stepper/blob/main/assets/images/screenshot.png?raw=true)

## Demo

<video src="https://github.com/zhizit/vue-numeric-input-stepper/blob/main/assets/images/demo.mp4?raw=true" controls width="800" style="max-width: 100%; height: auto;">
  Your browser does not support the video tag. 
  [Download demo video](https://github.com/zhizit/vue-numeric-input-stepper/blob/main/assets/images/demo.mp4?raw=true) instead.
</video>

## Features

- ✅ **Long-press support** - Hold buttons to continuously increment/decrement
- ✅ **Debounced saving** - Automatic save with configurable delay
- ✅ **Keyboard input** - Direct numeric input with validation
- ✅ **Accessibility** - Full ARIA support and keyboard navigation
- ✅ **TypeScript** - Fully typed with TypeScript
- ✅ **Vue 3** - Built with Composition API
- ✅ **Customizable** - Configurable step, intervals, and styling

## Installation

```bash
npm install vue-numeric-input-stepper
```

## Basic Usage

```vue
<template>
  <NumericInputStepper
    v-model="value"
    :min="1"
    :max="100"
    unit="pt"
    @save="onSave"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NumericInputStepper } from 'vue-numeric-input-stepper';

const value = ref(10);

const onSave = (newValue: number) => {
  console.log('Saved:', newValue);
  // Save to API or store
};

const onChange = (event: { oldValue: number; newValue: number }) => {
  console.log('Changed:', event);
};
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | **required** | The current value (v-model) |
| `min` | `number` | `1` | Minimum value |
| `max` | `number` | `400` | Maximum value |
| `step` | `number` | `1` | Increment/decrement step |
| `unit` | `string` | `''` | Unit label to display |
| `showUnit` | `boolean` | `true` | Show/hide unit label |
| `disabled` | `boolean` | `false` | Disable the component |
| `interval` | `number` | `100` | Long-press repeat interval (ms) |
| `longPressDelay` | `number` | `350` | Long-press detection delay (ms) |
| `saveDelay` | `number` | `800` | Debounce delay for save event (ms) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted when value changes (v-model) |
| `save` | `number` | Emitted after debounce delay when value is saved |
| `change` | `{ oldValue: number, newValue: number }` | Emitted when value is committed |

## Slots

| Slot | Description |
|------|-------------|
| `decrement-icon` | Custom icon for decrement button |
| `increment-icon` | Custom icon for increment button |

## Examples

### Custom Icons

```vue
<template>
  <NumericInputStepper v-model="value" :min="0" :max="100">
    <template #decrement-icon>
      <span>−</span>
    </template>
    <template #increment-icon>
      <span>+</span>
    </template>
  </NumericInputStepper>
</template>
```

### Different Step Size

```vue
<template>
  <NumericInputStepper
    v-model="value"
    :min="0"
    :max="1000"
    :step="10"
    unit="px"
  />
</template>
```

### Custom Timing

```vue
<template>
  <NumericInputStepper
    v-model="value"
    :interval="50"
    :long-press-delay="200"
    :save-delay="500"
  />
</template>
```

## Global Installation

```typescript
import { createApp } from 'vue';
import { install } from 'vue-numeric-input-stepper';

const app = createApp(App);
app.use({ install });
```

Then use it in any component:

```vue
<template>
  <NumericInputStepper v-model="value" />
</template>
```

## Styling

The component uses CSS variables for easy customization. You can override any style by setting CSS variables:

```css
/* Example: Customize colors and sizes */
.numeric-input-stepper {
  --stepper-button-width: 40px;
  --stepper-button-height: 40px;
  --stepper-button-bg: #007bff;
  --stepper-button-color: white;
  --stepper-button-hover-bg: #0056b3;
  --stepper-input-width: 60px;
  --stepper-input-font-size: 16px;
  --stepper-gap: 12px;
}
```

### Available CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--stepper-gap` | `8px` | Gap between controls and unit |
| `--stepper-padding` | `5px 6px` | Padding of the container |
| `--stepper-controls-gap` | `4px` | Gap between buttons and input |
| `--stepper-button-width` | `32px` | Button width |
| `--stepper-button-height` | `32px` | Button height |
| `--stepper-button-padding` | `0` | Button padding |
| `--stepper-button-border` | `1px solid rgba(0, 0, 0, 0.2)` | Button border |
| `--stepper-button-bg` | `transparent` | Button background |
| `--stepper-button-color` | `currentColor` | Button text/icon color |
| `--stepper-button-hover-bg` | `rgba(0, 0, 0, 0.05)` | Button hover background |
| `--stepper-button-active-bg` | `rgba(0, 0, 0, 0.1)` | Button active background |
| `--stepper-button-disabled-opacity` | `0.5` | Disabled button opacity |
| `--stepper-button-radius` | `4px` | Button border radius |
| `--stepper-icon-width` | `16px` | Icon width |
| `--stepper-icon-height` | `16px` | Icon height |
| `--stepper-icon-color` | `currentColor` | Icon color |
| `--stepper-icon-stroke` | `currentColor` | Icon stroke color |
| `--stepper-input-width` | `44px` | Input width |
| `--stepper-input-height` | `24px` | Input height |
| `--stepper-input-border` | `1px solid rgba(0, 0, 0, 0.2)` | Input border |
| `--stepper-input-radius` | `4px` | Input border radius |
| `--stepper-input-font-size` | `14px` | Input font size |
| `--stepper-input-bg` | `transparent` | Input background |
| `--stepper-input-color` | `inherit` | Input text color |
| `--stepper-input-focus-border-color` | `rgba(0, 0, 0, 0.4)` | Input focus border color |
| `--stepper-input-disabled-opacity` | `0.5` | Disabled input opacity |
| `--stepper-unit-font-size` | `13px` | Unit label font size |
| `--stepper-unit-color` | `rgba(0, 0, 0, 0.6)` | Unit label color |

## Value Conversion (UI Display Value ↔ Internal Value)

If you need to convert between display values (shown to users) and internal values (stored in database), you can use the value converter utility:

```typescript
import { createValueConverter, textSizeConverter } from 'vue-numeric-input-stepper';

// Use predefined text size converter (1-100 → 23-1000)
const { toInternal, toDisplay } = textSizeConverter;

const displayValue = 14; // What user sees
const internalValue = toInternal(displayValue); // 151 (what to save)

// Or create custom converter
const customConverter = createValueConverter({
  displayMin: 1,
  displayMax: 100,
  internalMin: 0,
  internalMax: 10000,
});
```

### Example: Using with conversion

```vue
<template>
  <NumericInputStepper
    v-model="displayValue"
    :min="1"
    :max="100"
    @save="onSave"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NumericInputStepper, textSizeConverter } from 'vue-numeric-input-stepper';

const displayValue = ref(14); // Display value shown to user
const { toInternal, toDisplay } = textSizeConverter;

// Convert internal value to display value on initialization
const initializeFromInternal = (internalValue: number) => {
  displayValue.value = toDisplay(internalValue);
};

// Convert display value to internal value on save
const onSave = (displayVal: number) => {
  const internalVal = toInternal(displayVal);
  // Save internalVal to API/database
  console.log('Saving internal value:', internalVal);
};
</script>
```

## TypeScript

Full TypeScript support is included:

```typescript
import type { ChangeEvent } from 'vue-numeric-input-stepper';

const handleChange = (event: ChangeEvent) => {
  console.log(event.oldValue, event.newValue);
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Storybook

Interactive documentation and examples are available in Storybook:

```bash
npm run storybook
```

Then open `http://localhost:6006` in your browser.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

