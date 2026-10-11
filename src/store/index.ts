import { create } from 'zustand';

interface AppState {
	ready: boolean;
	setReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
	ready: false,
	setReady: (ready) => set({ ready }),
}));
