<template>
    <n-layout class="container">
        <n-layout-header style="background:#f8f8f8">
            <h1 class="user-list-title">User list</h1>
        </n-layout-header>
        <n-layout-content>
            <n-grid x-gap="0" y-gap="0" class="table-grid">
                <n-grid-item span="24" class="grid-item">
                    <div class="header">
                        <n-input v-model:value="searchQuery" placeholder="Search for users..." size="large" clearable
                            prefix-icon="search-outline" class="search-input" />
                        <n-button size="large" type="success" class="add-user-btn" round @click="showModal = true">
                            <n-icon>
                                <AddOutline />
                            </n-icon> Add User
                        </n-button>
                    </div>
                </n-grid-item>

                <n-grid-item span="24" class="grid-item">
                    <n-data-table :columns="columns" :data="filteredInterns" :loading="loading" />
                </n-grid-item>

                <n-grid-item span="24" class="grid-item">
                    <n-pagination v-model:page="pagination.page" :page-count="pagination.pageCount"
                        :page-size="pagination.pageSize" class="customPagination" @update:page="fetchInterns" />
                </n-grid-item>
            </n-grid>
            <AddUserModal :showModal="showModal" @update:showModal="showModal = $event" />

        </n-layout-content>
    </n-layout>
</template>

<script lang=ts>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { NDataTable, NButton, NIcon, NInput, NPagination, NAvatar, NGrid, NGridItem, NLayout, NLayoutHeader, NLayoutContent, useDialog, useNotification } from 'naive-ui';
import { CreateOutline, TrashOutline, AddOutline, SearchOutline } from '@vicons/ionicons5';
import AddUserModal from '../components/modals/AddUserModal.vue';
import type { Intern } from '@/types/Intern';

export default {

    components: {
        NDataTable,
        NButton,
        NIcon,
        NInput,
        NPagination,
        CreateOutline,
        TrashOutline,
        AddOutline,
        SearchOutline,
        NLayout,
        NLayoutHeader,
        NGridItem,
        NGrid,
        NLayoutContent,
        AddUserModal
    },
    setup() {
        const router = useRouter();
        const showModal = ref(false);
        const loading = ref(false);
        const interns = ref([]);
        const searchQuery = ref('');
        const pagination = ref({
            page: 1,
            pageSize: 8,
            pageCount: 0,
        });
        const dialog = useDialog();
        const notification = useNotification()
        const columns = [
            {
                title: '',
                width: 100,
                key: 'avatar',
                render(row: Intern) {
                    return h(NAvatar, {
                        size: 'large',
                        round: true,
                        src: row.avatar,
                    }
                    )
                },
            },
            {
                title: 'Full Name',
                key: 'Full Name',
                render(row: Intern) {
                    return `${row.first_name} ${row.last_name}`
                },
            },
            {
                title: 'Action',
                key: 'id',
                width: 100,
                render(row: Intern) {
                    return h('div', [
                        h(
                            NButton,
                            {
                                text: true,
                                size: 'medium',
                                class: 'edit-btn',
                                onClick: () => editIntern(row),
                            },
                            {
                                default: () =>
                                    h(NIcon, {
                                        size: 22, color: 'grey',
                                    }, {
                                        default: () => h(CreateOutline),
                                    }),
                            }
                        ),
                        h(
                            NButton,
                            {
                                text: true,
                                size: 'medium',
                                onClick: () => deleteIntern(row),
                            },
                            {
                                default: () =>
                                    h(NIcon, { size: 22, color: 'grey' }, {
                                        default: () => h(TrashOutline),
                                    }),
                            }
                        ),
                    ]);
                },
            },
        ]
        const fetchInterns = async () => {
            loading.value = true;
            const { page, pageSize } = pagination.value;
            const response = await fetch(`https://reqres.in/api/users?page=${page}&per_page=${pageSize}&delay=2`);
            const data = await response.json();
            interns.value = data.data;
            pagination.value.pageCount = data.total_pages;
            loading.value = false;
        };

        const handlePageChange = (page: number) => {
            pagination.value.page = page;
            fetchInterns();
        };

        const editIntern = (row: Intern) => {
            router.push({ name: 'EditIntern', params: { id: row.id } })
        };

        const deleteIntern = (row: Intern) => {
            dialog.warning({
                title: 'Delete User',
                content: `Are you sure you want to permanently delete user ${row.first_name} ${row.last_name}?`,
                positiveText: 'Yes',
                negativeText: 'No',
                onPositiveClick: async () => {
                    try {
                        const response = await fetch(`https://reqres.in/api/users/${row.id}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            throw new Error('Failed to delete user');
                        }
                        interns.value = interns.value.filter((intern: Intern) => intern.id !== row.id);
                        notification.success({
                            title: `Success`,
                            content: `Deleted trainee with id: ${row.id}`
                        })
                    } catch (error) {
                        console.error('Error deleting trainee:', error);
                        dialog.error({
                            title: 'Error',
                            content: 'An error occurred while deleting the user. Please try again.',
                        });
                    }
                },
            });
        };

        const filteredInterns = computed(() => {
            if (!searchQuery.value) return interns.value;
            return interns.value.filter((interns: Intern) =>
                `${interns.first_name} ${interns.last_name}`.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        onMounted(() => {
            document.title = 'User List'
            fetchInterns();
        });

        return {
            columns,
            interns,
            searchQuery,
            filteredInterns,
            fetchInterns,
            pagination,
            loading,
            handlePageChange,
            editIntern,
            deleteIntern,
            showModal
        };
    },
};
</script>

<style scoped>
.container {
    padding: 5rem;
    background: #f8f8f8;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 1rem
}

.table-grid {
    background: white;
}

.grid-item {
    padding: 1rem;
}

.search-input {
    width: 300px;
}

.add-user-btn {
    background-color: #469171;
    color: white;
    font-size: 18px;
    padding: 10px 20px;
}

.customPagination {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 5px;
}


@media (max-width: 768px) {
    .container {
        padding: 2rem;
        background: #f8f8f8;
    }

    .header {
        flex-direction: column;
        align-items: flex-end;
        margin-bottom: 0px;
    }

    .search-input {
        width: 100%;
        margin-bottom: 10px;
    }

    .add-user-btn {
        padding: 12px;
    }


}
</style>