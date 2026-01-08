import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    root: command === 'build' ? undefined : './demo',
    plugins: [
      vue(),
      ...(isBuild
        ? [
            dts({
              insertTypesEntry: true,
              include: ['src/**/*'],
              exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
            }),
          ]
        : []),
    ],
    server: {
      port: 3000,
      open: true,
    },
    ...(isBuild && {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'VueNumericInputStepper',
          formats: ['es', 'cjs'],
          fileName: (format) => `vue-numeric-input-stepper.${format === 'es' ? 'esm' : 'cjs'}.js`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
        cssCodeSplit: false,
      },
    }),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  };
});

