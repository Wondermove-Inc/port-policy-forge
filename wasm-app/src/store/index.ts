import { create } from "zustand";

interface CommonStore {
  isViewList: boolean;
  setIsViewList: (IsViewList: boolean) => void;
}

export const useCommonStore = create<CommonStore>((set) => ({
  isViewList: false,
  setIsViewList: (isViewList) => set({ isViewList }),
}));
