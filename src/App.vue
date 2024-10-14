<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { NNotificationProvider, NConfigProvider, NModalProvider, NDialogProvider } from 'naive-ui'
import Navbar from './components/navigation/NavBar.vue'


</script>

<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-modal-provider>
        <n-notification-provider :max=3>
          <Navbar />
          <RouterView />
        </n-notification-provider>
      </n-modal-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
:global(body) {
  background: #f8f8f8;
}
</style>
