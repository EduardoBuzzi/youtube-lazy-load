import path, { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      name: 'YouTubeLazyLoad',
      formats: ['es', 'umd'],
      fileName: (format) => `youtube-lazy-load.${format}.js`,
    },
    // sourcemap: true,
    minify: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['src/page/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});