<template>
  <el-form ref="loginFormRef" :model="loginForm" size="large">
    <el-form-item prop="password">
      <el-input v-model="loginForm.token" @keyup.enter="login()" type="password" placeholder="Token" show-password autocomplete="new-password">
        <template #prefix>
          <i-ep-lock />
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button round size="large" type="primary" style="width: 100%;" :loading="loading" @click="login()">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
import app_api from '../../../api/app';
import { useTokenStore } from "../../../store/token"

const loading = ref(false);
const loginForm = ref({
  token: ""
});
const router = useRouter()

// login
const login = () => {
  loading.value = true;
  const tokenStore = useTokenStore()
  tokenStore.setToken(loginForm.value.token)
  app_api.version().then(res => {
    router.push({ path: '/traffic' })
  }).catch(err => {
    ElMessage.error('登录失败' + err)
  }).finally(() => {
    loading.value = false;
  })
};

onMounted(() => {
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>