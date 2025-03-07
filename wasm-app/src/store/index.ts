import { create } from "zustand";

import { WorkloadResource } from "@/services/listWorkloads";

interface CommonStore {
  isViewList: boolean;
  setIsViewList: (IsViewList: boolean) => void;
  selectedNamespace: string;
  setSelectedNamespace: (selectedNamespace: string) => void;
  workloads: WorkloadResource[];
  setWorkloads: (workloads: WorkloadResource[]) => void;
  workloadsLoading: boolean;
  setWorkloadsLoading: (IsViewList: boolean) => void;
  isDetailFromViewMap: boolean;
  setIsDetailFromViewMap: (isWorkloadDetailView: boolean) => void;
}

export const useCommonStore = create<CommonStore>((set) => ({
  isViewList: true,
  setIsViewList: (isViewList) => set({ isViewList }),
  selectedNamespace: "",
  setSelectedNamespace: (selectedNamespace) => set({ selectedNamespace }),
  workloads: [],
  setWorkloads: (workloads: WorkloadResource[]) => set({ workloads }),
  workloadsLoading: true,
  setWorkloadsLoading: (workloadsLoading) => set({ workloadsLoading }),
  isDetailFromViewMap: false,
  setIsDetailFromViewMap: (isDetailFromViewMap) => set({ isDetailFromViewMap }),
}));
