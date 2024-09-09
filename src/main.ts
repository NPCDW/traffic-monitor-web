import {createApp} from 'vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "./styles/common.scss";
import "./styles/element-dark.scss";
import "./styles/reset.scss";
import "./styles/var.scss";
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
