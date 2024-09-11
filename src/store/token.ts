import { defineStore } from "pinia"
import { ref } from "vue"
import { useRememberPasswordStore } from "./remember_password"
import axios from "axios"

export const useTokenStore = defineStore('token', () => {
    const token = ref(localStorage.getItem('token') || sessionStorage.getItem('token') || '')
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }
    function hasToken() {
        return token.value !== ''
    }
    function getToken() {
        return token.value
    }
    function setToken(token_para: string) {
        token.value = token_para
        axios.defaults.headers.common['Authorization'] = `Bearer ${token_para}`;
        if (useRememberPasswordStore().getRememberPassword() === 'true') {
            localStorage.setItem('token', token_para)
        } else {
            sessionStorage.setItem('token', token_para)
        }
    }
    function clearToken() {
        token.value = ''
        axios.defaults.headers.common['Authorization'] = `Bearer `;
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
    }
    return { hasToken, getToken, setToken, clearToken }
})