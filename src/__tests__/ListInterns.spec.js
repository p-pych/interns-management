import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ListInterns from '../views/ListInterns.vue'
import { createRouter, createWebHistory } from 'vue-router'
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
} from 'naive-ui'
import flushPromises from 'flush-promises'

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: ListInterns },
    {
      path: '/edit/:id',
      name: 'EditIntern',
      component: { template: '<div>Edit Intern View</div>' },
    },
  ],
})

describe('ListInterns.vue', () => {
  const mountComponent = () => {
    return mount(
      {
        template: `
          <n-config-provider :theme-overrides="themeOverrides">
            <n-dialog-provider>
              <n-notification-provider>
                <list-interns />
              </n-notification-provider>
            </n-dialog-provider>
          </n-config-provider>
        `,
        components: {
          ListInterns,
          NConfigProvider,
          NDialogProvider,
          NNotificationProvider,
        },
        data() {
          return {
            themeOverrides: {
              common: {
                primaryColor: '#000',
              },
            },
          }
        },
      },
      {
        global: {
          plugins: [mockRouter],
          stubs: {
            transition: false,
          },
        },
      },
    )
  }

  it('should render correctly', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.findComponent(ListInterns).exists()).toBe(true)
    const title = wrapper.find('.user-list-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('User list')
  })

  it('should load intern data', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: [
              {
                id: 1,
                first_name: 'Jan',
                last_name: 'Kowalski',
                avatar: 'avatar_url',
              },
            ],
          }),
      }),
    )

    const wrapper = mountComponent()
    await flushPromises()
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1)
    expect(rows[0].text()).toContain('Jan Kowalski')
  })

  it('should navigate to edit view when clicking edit', async () => {
    const pushMock = vi.spyOn(mockRouter, 'push')

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: [
              {
                id: 1,
                first_name: 'Jan',
                last_name: 'Kowalski',
                avatar: 'avatar_url',
              },
            ],
          }),
      }),
    )

    const wrapper = mountComponent()
    await flushPromises()
    const editButton = wrapper.find('.edit-btn')
    expect(editButton.exists()).toBe(true)
    await editButton.trigger('click')

    expect(pushMock).toHaveBeenCalledWith({
      name: 'EditIntern',
      params: { id: 1 },
    })
  })
})
