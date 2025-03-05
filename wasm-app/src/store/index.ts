import { create } from "zustand";

interface CommonStore {
  isViewList: boolean;
  setIsViewList: (IsViewList: boolean) => void;
  selectedCluster: string;
  setSelectedCluster: (selectedCluster: string) => void;
  selectedNamespace: string;
  setSelectedNamespace: (selectedNamespace: string) => void;
}

export const useCommonStore = create<CommonStore>((set) => ({
  isViewList: true,
  setIsViewList: (isViewList) => set({ isViewList }),
  selectedCluster: "",
  setSelectedCluster: (selectedCluster) => set({ selectedCluster }),
  selectedNamespace: "",
  setSelectedNamespace: (selectedNamespace) => set({ selectedNamespace }),
}));
