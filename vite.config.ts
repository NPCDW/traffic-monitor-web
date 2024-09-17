import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default ({mode}) => {
    console.log(mode)
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    console.log(env)
    return defineConfig({
        server: {
            https: false,
            port: +env.VITE_DEV_SERVER_PORT,
            host: "0.0.0.0",
            // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
            proxy: {
                "/api": {
                    target: env.VITE_DEV_SERVER_BASE_URL,
                    changeOrigin: true
                }
            },
        },
        plugins: [
            vue(),
            svgLoader(),
            AutoImport({
                resolvers: [
                    ElementPlusResolver(),
                    IconsResolver({
                        prefix: 'Icon',
                    }),
                ],
            }),
            Components({
                resolvers: [
                    ElementPlusResolver(),
                    IconsResolver({
                        enabledCollections: ['ep'],
                    }),
                ],
            }),
            Icons({
                autoInstall: true,
            }),
        ],
    })
}