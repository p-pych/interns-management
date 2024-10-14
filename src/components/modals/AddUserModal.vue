<template>
    <n-modal :show="showModal" preset="card" @close="handleClose" style="max-width: 600px;">
        <template #header>
            <h3 style="text-align: center;" class="add-user-title">Add New User</h3>
        </template>

        <n-grid x-gap="12" y-gap="12">
            <n-grid-item span="24">
                <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
                    <n-form-item label="First Name" path="firstName"><n-input v-model:value="formValue.firstName"
                            placeholder="Enter first name" /></n-form-item>
                    <n-form-item label="Last Name" path="lastName"><n-input v-model:value="formValue.lastName"
                            placeholder="Enter last name" /></n-form-item>
                    <n-form-item label="Avatar" path="avatar"><n-upload v-model:value="formValue.avatar" show-file-list>
                            <n-button>Upload Avatar</n-button>
                        </n-upload></n-form-item>
                </n-form>
            </n-grid-item>
        </n-grid>

        <template #footer>
            <div class="modal-footer">
                <n-button type="error" ghost @click="handleClose">Cancel</n-button>
                <n-button type="primary" @click="addIntern" class="submit-btn">Submit</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { NModal, NForm, NFormItem, NUpload, NInput, NButton, NGrid, NGridItem, NSpace, useNotification } from 'naive-ui';
import type { FormInst } from 'naive-ui'

export default {
    components: {
        NButton,
        NInput,
        NSpace,
        NFormItem,
        NForm,
        NGrid,
        NGridItem,
        NUpload,
        NModal
    },
    props: {
        showModal: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:showModal', 'user-added'],
    setup(props, { emit }) {
        const handleClose = () => {
            emit('update:showModal', false); // Ukrywa modal
        };
        const formRef = ref<FormInst | null>(null)
        const notification = useNotification()
        const formValue = ref({
            firstName: '',
            lastName: '',
            avatar: '',
        })
        return {
            formRef,
            formValue,
            rules: {
                firstName: {
                    required: true,
                    message: 'Please input your first name',
                    trigger: ['input', 'blur'],
                },
                lastName: {
                    required: true,
                    message: 'Please input your last name',
                    trigger: ['input', 'blur'],
                },
            },
            addIntern(e: MouseEvent) {
                e.preventDefault()
                formRef.value?.validate(async (errors) => {
                    console.log(formValue)
                    if (!errors) {
                        console.log(formRef.value)
                        const response = await fetch('https://reqres.in/api/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formValue.value),
                        })

                        if (response.ok) {
                            notification.success({
                                title: `Success`,
                                content: 'User was created successfully'
                            })
                        }
                    }
                    else {
                        console.log(errors)
                        notification.error({
                            title: `Ups. Something went wrong`,
                            content: 'Please fix the errors and try again'
                        })
                    }
                })
            },
            handleClose
        }

    },

}
</script>

<style scoped>
.userModal {
    max-width: 600px;
    background: white;
    padding: 20px;
    text-align: center;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 10px;
}

.n-modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

@media (max-width: 768px) {
    .n-modal {
        max-width: 100%;
        padding: 15px;
    }
}
</style>