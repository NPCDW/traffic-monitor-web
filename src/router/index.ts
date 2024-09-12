import * as VueRouter from 'vue-router'
import Login from '../pages/login/index.vue'
import Traffic from '../pages/Traffic.vue'
import { useTokenStore } from '../store/token'

const routes = [
    {path: '/', redirect: '/traffic'},
    {
        path: '/login',
        component: Login,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/traffic',
        component: Traffic,
        meta: {
            requiresAuth: true,
        },
    },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to) => {
    const store = useTokenStore()
  
    if (to.meta.requiresAuth && !store.hasToken()) return '/login'
})

export default router