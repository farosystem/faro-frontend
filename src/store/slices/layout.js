import { createSlice } from '@reduxjs/toolkit';
import {
  layoutTypes,
  layoutWidthTypes,
  leftSideBarThemeTypes,
  leftSidebarTypes,
  topBarThemeTypes
} from '../../constants/layout';

const initialState = {
  layoutType: layoutTypes.VERTICAL,
  layoutWidth: layoutWidthTypes.FLUID,
  leftSideBarTheme: leftSideBarThemeTypes.DARK,
  leftSideBarType: leftSidebarTypes.DEFAULT,
  topbarTheme: topBarThemeTypes.LIGHT,
  showRightSidebar: false,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
  collapsedSideMenu: false
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setLayoutType: (state, action) => {
      state.layoutType = action.payload;
    },
    setShowRightSidebar: (state, action) => {
      state.showRightSidebar = action.payload;
    },
    setLeftMenu: (state, action) => {
      state.leftMenu = action.payload;
    },
    setLeftSideBarType: (state, action) => {
      state.leftSideBarType = action.payload;
    },
    setCollapsedSideMenu: (state, action) => {
      state.collapsedSideMenu = action.payload;
    },
    setLayoutWidth: (state, action) => {
      state.layoutWidth = action.payload;
    },
    setLeftSideBarTheme: (state, action) => {
      state.leftSideBarTheme = action.payload;
    },
    setTopbarTheme: (state, action) => {
      state.topbarTheme = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    }
  }
});

export const {
  setLayoutType,
  setShowRightSidebar,
  setLeftMenu,
  setLeftSideBarType,
  setCollapsedSideMenu,
  setLayoutWidth,
  setLeftSideBarTheme,
  setTopbarTheme,
  setIsMobile,
  setShowSidebar
} = layoutSlice.actions;

export default layoutSlice.reducer;
