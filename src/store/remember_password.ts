import { defineStore } from "pinia"
import { ref } from "vue"

export const useRememberPasswordStore = defineStore('rememberPassword', () => {
    const rememberPassword = ref(localStorage.getItem('rememberPassword') || 'true')
    function getRememberPassword() {
        return rememberPassword.value
    }
    function setRememberPassword(rememberPassword_para: string) {
        rememberPassword.value = rememberPassword_para
        localStorage.setItem('rememberPassword', rememberPassword_para)
    }
    return { getRememberPassword, setRememberPassword }
})