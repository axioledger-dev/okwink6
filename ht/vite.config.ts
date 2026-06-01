import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
// import { visualizer } from 'rollup-plugin-visualizer'

// Định nghĩa __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default ({ mode }: { mode: string }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_VERSION, VITE_PORT, VITE_BASE_URL, VITE_API_URL, VITE_API_PROXY_URL } = env

  console.log(`🚀 API_URL = ${VITE_API_URL}`)
  console.log(`🚀 VERSION = ${VITE_VERSION}`)

  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION)
    },
    base: VITE_BASE_URL,
    server: {
      port: Number(VITE_PORT),
      proxy: {
        '/api': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true,
          secure: false
        },
        '/app': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true,
          secure: false
        }
      },
      host: true
    },
    // Path alias
    resolve: {
      alias: {
        '@': resolvePath('src'),
        '@views': resolvePath('src/views'),
        '@imgs': resolvePath('src/assets/images'),
        '@icons': resolvePath('src/assets/icons'),
        '@utils': resolvePath('src/utils'),
        '@stores': resolvePath('src/store'),
        '@plugins': resolvePath('src/plugins'),
        '@styles': resolvePath('src/assets/styles')
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      terserOptions: {
        compress: {
          // Loại bỏ console trong môi trường production
          drop_console: true,
          // Loại bỏ debugger trong môi trường production
          drop_debugger: true
        }
      },
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: [],
        include: ['src/views/**/*.vue']
      }
    },
    plugins: [
      vue(),
      tailwindcss(),
      // Tự động import API theo nhu cầu (auto-import)
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: 'src/types/import/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
          filepath: './.auto-import.json',
          globalsPropValue: true
        }
      }),
      // Tự động import component theo nhu cầu (auto-import)
      Components({
        dts: 'src/types/import/components.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      // Tùy chỉnh theme ElementPlus theo nhu cầu
      ElementPlus({
        useSource: true
      }),
      // Nén file (compression)
      viteCompression({
        verbose: false, // Có hiển thị kết quả nén ra console hay không
        disable: false, // Có disable nén hay không
        algorithm: 'gzip', // Thuật toán nén
        ext: '.gz', // Đuôi mở rộng của file sau khi nén
        threshold: 10240, // Chỉ xử lý các tài nguyên có kích thước lớn hơn giá trị này (10240B = 10KB)
        deleteOriginFile: false // Có xóa file gốc sau khi nén hay không
      }),
      vueDevTools()
      // Phân tích bundle (bundle analyzer)
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: 'dist/stats.html' // Đường dẫn và tên file báo cáo phân tích được tạo ra
      // }),
    ],
    // Dependency pre-bundling: Tránh lặp lại request và transform khi runtime, tối ưu tốc độ load lần đầu
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'xlsx',
        'xgplayer',
        'crypto-js',
        'file-saver',
        'vue-img-cutter',
        'element-plus/es',
        'element-plus/es/components/*/style/css',
        'element-plus/es/components/*/style/index'
      ]
    },
    css: {
      preprocessorOptions: {
        // Sass variable và mixin
        scss: {
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
          additionalData: `
            @use "@styles/core/el-light.scss" as *;
            @use "@styles/core/mixin.scss" as *;
          `
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  })
}

function resolvePath(paths: string) {
  return path.resolve(__dirname, paths)
}
