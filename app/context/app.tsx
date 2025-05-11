"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Type for the pair
export type Pair = {
  id: number;
  pairName: string;
  latestPrice: string;
  isFavorite: boolean;
  icon: string;
};

// Type for context value
type SelectedPairContextType = {
  selectedPair: Pair | null;
  setSelectedPair: (pair: Pair) => void;
};

// Create context
const SelectedPairContext = createContext<SelectedPairContextType | undefined>(undefined);

// Provider component
export const SelectedPairProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);

  return (
    <SelectedPairContext.Provider value={{ selectedPair, setSelectedPair }}>
      {children}
    </SelectedPairContext.Provider>
  );
};

// Hook to use context
export const useSelectedPair = () => {
  const context = useContext(SelectedPairContext);
  if (!context) {
    throw new Error("useSelectedPair must be used within a SelectedPairProvider");
  }
  return context;
};
