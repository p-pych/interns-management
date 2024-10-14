import { createRouter, createWebHistory } from 'vue-router'
import ListInterns from '@/views/ListInterns.vue'
import EditInternView from '@/views/EditInternView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ListInterns',
      component: ListInterns,
    },
    {
      path: '/edit/:id',
      name: 'EditIntern',
      component: EditInternView,
    },
  ],
})

export default router
