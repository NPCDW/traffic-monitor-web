import { defineStore } from "pinia"
import { ref } from "vue"
import { useRememberPasswordStore } from "./remember_password"

export const useTokenStore = defineStore('token', () => {
    const token = ref(localStorage.getItem('token') || sessionStorage.getItem('token') || '')
    function hasToken() {
        return token.value !== ''
    }
    function getToken() {
        return token.value
    }
    function setToken(token_para: string) {
        token.value = token_para
        if (useRememberPasswordStore().getRememberPassword() === 'true') {
            localStorage.setItem('token', token_para)
        } else {
            sessionStorage.setItem('token', token_para)
        }
    }
    function clearToken() {
        token.value = ''
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
    }
    return { hasToken, getToken, setToken, clearToken }
})