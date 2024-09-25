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
    is_fake: 0,
  },
  addSetting: (setting: SettingsType) =>
    set((state) => ({
      setting: {
        key: setting.key,
        is_fake: setting.is_fake,
      },
    })),
  settingInfo: () => get().setting,
  removeSetting: () => set({ setting: undefined }),
}));
