<template>
    <el-form ref="loginFormRef" :model="loginForm" size="large">
      <el-form-item prop="password">
        <el-input v-model="loginForm.token" type="password" placeholder="Token" show-password autocomplete="new-password">
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
  
  const loading = ref(false);
  const loginForm = ref({
    token: ""
  });
  
  // login
  const login = () => {
  };
  
  onMounted(() => {
  });
  </script>
  
  <style scoped lang="scss">
  @import "../index.scss";
  </style>
  