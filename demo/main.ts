import { createApp, ref } from 'vue';
import NumericInputStepper from '../src/NumericInputStepper.vue';

console.log('Starting app initialization...');

try {
  const app = createApp({
    components: {
      NumericInputStepper,
    },
    setup() {
      console.log('Setup function called');
      const value1 = ref(14);
      const value2 = ref(100);
      const value3 = ref(10);
      const value4 = ref(50);
      const value5 = ref(25);
      const eventLogs = ref([]);

    const onSave1 = (val: number) => {
      console.log('Save 1:', val);
    };

    const onChange1 = (event: { oldValue: number; newValue: number }) => {
      console.log('Change 1:', event);
    };

    const onSave2 = (val: number) => {
      console.log('Save 2:', val);
    };

    const onSave3 = (val: number) => {
      const time = new Date().toLocaleTimeString();
      eventLogs.value.unshift(`[${time}] Save: ${val}`);
      if (eventLogs.value.length > 10) {
        eventLogs.value.pop();
      }
    };

    const onChange3 = (event: { oldValue: number; newValue: number }) => {
      const time = new Date().toLocaleTimeString();
      eventLogs.value.unshift(`[${time}] Change: ${event.oldValue} → ${event.newValue}`);
      if (eventLogs.value.length > 10) {
        eventLogs.value.pop();
      }
    };

        return {
          value1,
          value2,
          value3,
          value4,
          value5,
          eventLogs,
          onSave1,
          onChange1,
          onSave2,
          onSave3,
          onChange3,
        };
  },
  });

  app.mount('#app');
  console.log('App mounted successfully');
} catch (error) {
  console.error('Error mounting app:', error);
  document.getElementById('app')!.innerHTML = `
    <div style="color: red; padding: 20px;">
      <h2>エラーが発生しました</h2>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}

