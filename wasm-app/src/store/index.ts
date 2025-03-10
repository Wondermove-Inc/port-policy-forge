import { create } from "zustand";

import { WorkloadResource } from "@/services/listWorkloads";
import { Port } from "@/models";

interface CommonStore {
  isViewList: boolean;
  setIsViewList: (IsViewList: boolean) => void;
  selectedNamespace: string;
  setSelectedNamespace: (selectedNamespace: string) => void;
  workloads: WorkloadResource[];
  setWorkloads: (workloads: WorkloadResource[]) => void;
  workloadsLoading: boolean;
  setWorkloadsLoading: (IsViewList: boolean) => void;
  isDetailFromMap: boolean;
  setIsDetailFromMap: (isWorkloadDetailView: boolean) => void;
  lastConnectionWorkload?: {
    uuid: string;
    isOpen: boolean;
  } | null;
  portHover: Port | null;
  setPortHover: (portHover: Port | null) => void;
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
  isDetailFromMap: false,
  setIsDetailFromMap: (isDetailFromMap) => set({ isDetailFromMap }),
  portHover: null,
  setPortHover: (portHover) => set({ portHover }),
}));
