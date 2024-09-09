import * as VueRouter from 'vue-router'
import Login from '../pages/login/index.vue'

const routes = [
    {path: '/', redirect: '/login'},
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/traffic',
        component: Login,
    },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})

export default router