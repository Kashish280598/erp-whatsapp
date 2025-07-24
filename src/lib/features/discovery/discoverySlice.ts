import { createSlice } from '@reduxjs/toolkit';

interface Integration {
    name: string;
    description: string;
    logo: string;
    riskCategory: string;
    isSupported: boolean;
}

interface SettingsState {
    isShowAll: boolean;
    notCompatibleIntegration: {
        isOpen: boolean;
        selectedIntegration: Integration | null;
    };
    supportedIntegration: {
        isOpen: boolean;
        selectedIntegration: Integration | null;
    }
}

const initialState: SettingsState = {
    isShowAll: false,
    notCompatibleIntegration: {
        isOpen: false,
        selectedIntegration: null
    },
    supportedIntegration: {
        isOpen: false,
        selectedIntegration: null
    }
};

// Async Thunks


// Slice
const discoverySlice = createSlice({
    name: 'discovery',
    initialState,
    reducers: {
        openNotCompatibleIntegrationSideDrawer: (state, action) => {
            state.notCompatibleIntegration.isOpen = true;
            state.notCompatibleIntegration.selectedIntegration = action.payload;
        },
        closeNotCompatibleIntegrationSideDrawer: (state) => {
            state.notCompatibleIntegration.isOpen = false;
            state.notCompatibleIntegration.selectedIntegration = null;
        },
        openSupportedIntegrationSideDrawer: (state, action) => {
            state.supportedIntegration.isOpen = true;
            state.supportedIntegration.selectedIntegration = action.payload;
        },
        closeSupportedIntegrationSideDrawer: (state) => {
            state.supportedIntegration.isOpen = false;
            state.supportedIntegration.selectedIntegration = null;
        },
        setIsShowAll: (state, action) => {
            state.isShowAll = action.payload;
        }
    },
});

export const {
    openNotCompatibleIntegrationSideDrawer,
    closeNotCompatibleIntegrationSideDrawer,
    openSupportedIntegrationSideDrawer,
    closeSupportedIntegrationSideDrawer,
    setIsShowAll
} = discoverySlice.actions;
export default discoverySlice.reducer; 