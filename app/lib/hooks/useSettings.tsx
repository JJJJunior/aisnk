import { create } from "zustand";
import { SettingsType } from "../types";

type SettingsStore = {
  setting: SettingsType;
  addSetting: (setting: SettingsType) => void;
  settingInfo: () => SettingsType;
  removeSetting: () => void;
};

export const useSettings = create<SettingsStore>((set, get) => ({
  setting: {
    key: "",
    value: "",
  },
  addSetting: (setting: SettingsType) =>
    set((state) => ({
      setting: {
        key: setting.key,
        value: setting.value,
      },
    })),
  settingInfo: () => get().setting,
  removeSetting: () => set({ setting: undefined }),
}));
