import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import eslint from "vite-plugin-eslint";
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    }),
    lazyImport({
      resolvers: [
        VxeResolver({
          libraryName: 'vxe-pc-ui'
        }),
        VxeResolver({
          libraryName: 'vxe-table'
        })
      ]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
});
