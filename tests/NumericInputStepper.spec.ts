import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import NumericInputStepper from '../src/NumericInputStepper.vue';

describe('NumericInputStepper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        min: 1,
        max: 100,
      },
    });

    expect(wrapper.find('.numeric-input-stepper').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('.numeric-input-stepper__button--decrement').exists()).toBe(true);
    expect(wrapper.find('.numeric-input-stepper__button--increment').exists()).toBe(true);
  });

  it('displays the modelValue in input', () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 42,
      },
    });

    const input = wrapper.find('input').element as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('emits update:modelValue when increment button is clicked', async () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        min: 1,
        max: 100,
      },
    });

    const incrementButton = wrapper.find('.numeric-input-stepper__button--increment');
    await incrementButton.trigger('mousedown');
    await incrementButton.trigger('mouseup');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([11]);
  });

  it('emits update:modelValue when decrement button is clicked', async () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        min: 1,
        max: 100,
      },
    });

    const decrementButton = wrapper.find('.numeric-input-stepper__button--decrement');
    await decrementButton.trigger('mousedown');
    await decrementButton.trigger('mouseup');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([9]);
  });

  it('disables decrement button when value is at minimum', () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 1,
        min: 1,
        max: 100,
      },
    });

    const decrementButton = wrapper.find('.numeric-input-stepper__button--decrement');
    expect(decrementButton.attributes('disabled')).toBeDefined();
  });

  it('disables increment button when value is at maximum', () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 100,
        min: 1,
        max: 100,
      },
    });

    const incrementButton = wrapper.find('.numeric-input-stepper__button--increment');
    expect(incrementButton.attributes('disabled')).toBeDefined();
  });

  it('respects step prop', async () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        min: 1,
        max: 100,
        step: 5,
      },
    });

    const incrementButton = wrapper.find('.numeric-input-stepper__button--increment');
    await incrementButton.trigger('mousedown');
    await incrementButton.trigger('mouseup');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([15]);
  });

  it('clamps value to min/max range', async () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        min: 1,
        max: 100,
      },
    });

    const input = wrapper.find('input');
    await input.setValue('200');
    await input.trigger('blur');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([100]);
  });

  it('displays unit when provided', () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        unit: 'pt',
      },
    });

    expect(wrapper.find('.numeric-input-stepper__unit').text()).toBe('pt');
  });

  it('disables all controls when disabled prop is true', () => {
    const wrapper = mount(NumericInputStepper, {
      props: {
        modelValue: 10,
        disabled: true,
      },
    });

    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.numeric-input-stepper__button--decrement').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.numeric-input-stepper__button--increment').attributes('disabled')).toBeDefined();
  });
});

