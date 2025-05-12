import { create } from 'zustand'

interface ChainConnectionState {
  isConnected: boolean;
  setConnected: (isConnected: boolean) => void;
}

const useChainConnection = create<ChainConnectionState>((set) => ({
  isConnected: false,
  setConnected: (isConnected: boolean) => set({ isConnected }),
}))

export { useChainConnection }