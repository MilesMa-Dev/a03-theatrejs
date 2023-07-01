import react from '@vitejs/plugin-react';
import path from "path";
import glslify from 'rollup-plugin-glslify';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const commonConfig = {
    plugins: [
      react(),
      glslify()
    ],
    define: {
      __APP_ENV__: env.APP_ENV
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, "src"),
      }
    },
    assetsInclude: ['**/*.gltf', '**/*.glb'],
  }

  

  if (command === 'serve') {
    const devConfig = {
      base: './'
    }
    return Object.assign({}, commonConfig, devConfig)
  } else {
    // command === 'build'
    const proConfig = {
      base: './'
    }
    return Object.assign({}, commonConfig, proConfig)
  }
})
