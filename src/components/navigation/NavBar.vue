<template>
    <n-layout class="navbar-container">
        <n-layout-header class="navbar-header">
            <div class="logo">
                Intern Editor 3000
            </div>
            <n-menu :options="menuOptions" mode="horizontal" @update:value="handleMenuSelect" class="navbar-menu"
                :theme-overrides="menuThemeOverrides" />
        </n-layout-header>
    </n-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NLayout, NLayoutHeader, NMenu } from 'naive-ui';

export default {
    components: {
        NLayout,
        NLayoutHeader,
        NMenu
    },
    setup() {
        const router = useRouter();
        const menuOptions = ref([
            {
                key: 'interns',
                icon: '🏠',
            },
        ]);

        const handleMenuSelect = (key) => {
            switch (key) {
                case 'interns':
                    router.push({ name: 'ListInterns' });
                default:
                    break;
            }
        };
        const menuThemeOverrides = {
            itemTextColor: '#ffffff',
            itemTextColorActive: '#ffffff',
            itemTextColorHover: '#000000',
        };
        return {
            menuOptions,
            handleMenuSelect,
            menuThemeOverrides
        };
    }
};
</script>

<style scoped>
.navbar-container {
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #469171;
    color: #fff;
}

.logo {
    font-size: 20px;
    width: 200px;
    font-weight: bold;
}

.navbar-menu {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    color: white;
}
</style>
