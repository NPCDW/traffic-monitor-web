import {defineConfig} from 'vite'
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
    return defineConfig({
        server: {
            https: false,
            port: 3030,
            host: "0.0.0.0",
            // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
            proxy: {
                "/api": {
                    target: "https://6pyshjtu-qhm0th3w-h2daj85y5vot.c2.mcprev.cn",
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