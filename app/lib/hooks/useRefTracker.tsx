import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RefStore {
  refId: string; // 存储 ref 的 id
  addRef: (refId: string) => void; // 添加 ref
  removeRef: () => void; // 移除 ref
}

const useRefTracker = create(
  persist<RefStore>(
    (set) => ({
      refId: "", // 初始 ref 值为空
      addRef: (refId: string) => set({ refId }), // 添加 ref
      removeRef: () => set({ refId: "" }), // 移除 ref，将 id 设置为空
    }),
    {
      name: "ref-user", // 存储在 localStorage 中的名称
      storage: createJSONStorage(() => localStorage), // 使用 localStorage 进行持久化
    }
  )
);

export default useRefTracker;
