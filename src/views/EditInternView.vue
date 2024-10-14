<template>
    <n-layout class="container">
        <n-layout-header class="layout-header">
            <h2 class="edit-user-title">Edit user</h2>
        </n-layout-header>
        <n-grid cols="24" x-gap="16" y-gap="16" class="main-grid" item-responsive>
            <n-grid-item span="24 400:24 800:24 1000:16" class="form-item">
                <div class="form-container">
                    <n-form :model="user" label-width="100px" class="form-content">
                        <div>
                            <n-grid cols="24" x-gap="16" align-items="center" item-responsive>
                                <n-grid-item span="24 400:24 800:12 1000:12">
                                    <n-form-item label="First Name">
                                        <n-input v-model:value="user.firstName" data-test="first-name-input"
                                            placeholder="Enter first name" class="input-field" />
                                    </n-form-item>
                                </n-grid-item>
                                <n-grid-item span="24 400:24 800:12 1000:12">
                                    <n-form-item label="Last Name">
                                        <n-input v-model:value="user.lastName" data-test="last-name-input"
                                            placeholder="Enter last name" class="input-field" />
                                    </n-form-item>
                                </n-grid-item>
                            </n-grid>
                        </div>
                        <div class="button-container">
                            <n-button type="success" class="update-button" @click="updateUser">
                                Update Details
                            </n-button>
                        </div>
                    </n-form>
                </div>
            </n-grid-item>
            <n-grid-item span="24 400:24 800:24 1000:8" class="avatar-item">
                <div class="avatar-container">
                    <n-image width="150" height="150" :src="user.avatar" alt="User avatar" class="user-avatar" />
                    <input type="file" id="fileInput" @change="handleFileChange" class="file-input" />
                    <label for="fileInput" class="change-photo-button">
                        <n-icon>
                            <CameraOutline />
                        </n-icon> Change Photo
                    </label>
                </div>
            </n-grid-item>

        </n-grid>
    </n-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { NGrid, NGridItem, NForm, NFormItem, NInput, NButton, NImage, NIcon, NLayout, NLayoutHeader, NLayoutContent, useNotification } from 'naive-ui';
import { CameraOutline } from '@vicons/ionicons5';

export default {
    components: {
        NGrid,
        NGridItem,
        NForm,
        NFormItem,
        NInput,
        NButton,
        NImage,
        NIcon,
        NLayout,
        NLayoutHeader,
        NLayoutContent,
        CameraOutline,
    },
    setup() {
        const route = useRoute();
        const user = ref({
            firstName: '',
            lastName: '',
            avatar: ''
        });
        const notification = useNotification()
        onMounted(() => {
            document.title = 'Edit Intern'
            const internId = route.params.id;
            fetch(`https://reqres.in/api/users/${internId}`)
                .then(response => response.json())
                .then(data => {
                    user.value = {
                        firstName: data.data.first_name,
                        lastName: data.data.last_name,
                        avatar: data.data.avatar
                    };
                });
        });
        const updateUser = () => {
            const internId = route.params.id;
            const updatedData = {
                first_name: user.value.firstName,
                last_name: user.value.lastName
            };

            fetch(`https://reqres.in/api/users/${internId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        notification.success({ title: `Success`, content: 'User details updated successfully!' });
                    }
                })
                .catch(error => {
                    notification.error({ title: `Error`, content: 'Failed to update user details. Please try again.' });
                    console.error('Error:', error);
                });
        };
        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                user.value.avatar = URL.createObjectURL(file);
            }
        };

        return {
            user,
            handleFileChange,
            updateUser
        };
    },
};
</script>

<style scoped>
.container {
    padding: 5rem;
    background: #f8f8f8;
}

.layout-header {
    padding: 2rem;
    background-color: #f8f8f8;
}

.edit-user-title {
    font-size: 24px;
    margin: 0;
}

.main-grid {
    padding: 20px;
}

.avatar-container,
.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 300px;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar {
    border-radius: 50%;
    margin-bottom: 20px;
}

.file-input {
    display: none;
    padding: 2rem;
}

.change-photo-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
    border: 1px solid #dcdcdc;
    background-color: #ffffff;
    color: #333;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-top: auto;
}

.change-photo-button:hover {
    background-color: #f0f0f0;
}

.form-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
}



.button-container {
    margin-top: auto;
    display: flex;
    justify-content: flex-start;
    width: 100%;
}

.update-button {
    width: 200px;
    height: 40px;
    color: white;
}

@media (max-width: 768px) {
    .layout-content {
        padding: 20px;
        height: 80vh;
        background-color: #f8f8f8;
    }

    .form-container,
    .avatar-container {
        padding: 2rem;
    }

    .edit-user-title {
        text-align: center;
    }

    .change-photo-button {
        font-size: 14px;
    }

    .container {
        background: #f8f8f8;
    }
}

@media (max-width: 768px) {
    .layout-content {
        padding: 20px;
        height: 80vh;
        background-color: #f8f8f8;
    }

    .form-container,
    .avatar-container {
        padding: 1rem;
    }

    .edit-user-title {
        text-align: center;
    }

    .change-photo-button {
        font-size: 14px;
    }

    .form-content {
        padding: 1rem;
        flex-grow: 1;
    }

    .container {
        background: #f8f8f8;
        padding: 1rem;
    }

    .input-field {
        width: 95%
    }

    .avatar-item {
        order: -1;
    }

    .form-item {
        order: 1;
    }
}
</style>
