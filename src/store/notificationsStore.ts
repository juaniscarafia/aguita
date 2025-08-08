import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  enabled: boolean;
  intervalMs: number;
};
type Actions = {
  setEnabled: (v: boolean) => void;
  setIntervalMs: (ms: number) => void;
};

export const useNotificationsStore = create<State & Actions>()(
  persist(
    (set) => ({
      enabled: false,
      intervalMs: 60 * 60 * 1000, // 1h por defecto
      setEnabled: (v) => set({ enabled: v }),
      setIntervalMs: (ms) => set({ intervalMs: ms }),
    }),
    { name: "aguita-notifications" }
  )
);