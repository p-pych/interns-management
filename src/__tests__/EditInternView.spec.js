import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import EditInternView from '../views/EditInternView.vue'
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
    { path: '/edit/:id', name: 'EditIntern', component: EditInternView },
  ],
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: () => ({
      params: {
        id: '1',
      },
    }),
  }
})

describe('EditInternView.vue', () => {
  const mountComponent = () => {
    return mount(
      {
        template: `
          <n-config-provider :theme-overrides="themeOverrides">
            <n-dialog-provider>
              <n-notification-provider>
                <edit-intern-view />
              </n-notification-provider>
            </n-dialog-provider>
          </n-config-provider>
        `,
        components: {
          EditInternView,
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
    expect(wrapper.findComponent(EditInternView).exists()).toBe(true)
    const title = wrapper.find('.edit-user-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Edit user')
  })

  it('should load user data', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              id: 1,
              first_name: 'Jan',
              last_name: 'Kowalski',
              avatar: 'avatar_url',
            },
          }),
      }),
    )

    const wrapper = mountComponent()
    await flushPromises()
    const firstNameInput = wrapper.find('input[placeholder="Enter first name"]')
    const lastNameInput = wrapper.find('input[placeholder="Enter last name"]')

    expect(firstNameInput.exists()).toBe(true)
    expect(lastNameInput.exists()).toBe(true)

    expect(firstNameInput.element.value).toBe('Jan')
    expect(lastNameInput.element.value).toBe('Kowalski')
  })

  it('should update user data when clicking update', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              id: 1,
              first_name: 'Jan',
              last_name: 'Kowalski',
              avatar: 'avatar_url',
            },
          }),
      }),
    )

    const wrapper = mountComponent()
    await flushPromises()
    const firstNameInput = wrapper.find('input[placeholder="Enter first name"]')
    const lastNameInput = wrapper.find('input[placeholder="Enter last name"]')

    await firstNameInput.setValue('Janina')
    await lastNameInput.setValue('Kowalska')

    global.fetch = vi.fn((url, options) => {
      if (options && options.method === 'PUT') {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              first_name: 'Janina',
              last_name: 'Kowalska',
            }),
        })
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              id: 1,
              first_name: 'Jan',
              last_name: 'Kowalski',
              avatar: 'avatar_url',
            },
          }),
      })
    })
    const updateButton = wrapper.find('.update-button')
    expect(updateButton.exists()).toBe(true)
    await updateButton.trigger('click')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://reqres.in/api/users/1',
      expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: 'Janina',
          last_name: 'Kowalska',
        }),
      }),
    )
  })
})
