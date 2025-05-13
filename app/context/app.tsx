"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PoolInfo } from "../types";

type SelectedPairContextType = {
  selectedPair: PoolInfo | undefined;
  setSelectedPair: (pair: PoolInfo | undefined) => void;
};

const SelectedPairContext = createContext<SelectedPairContextType | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPair, setSelectedPair] = useState<PoolInfo | undefined>(undefined);

  return (
    <SelectedPairContext.Provider value={{ selectedPair, setSelectedPair }}>
      {children}
    </SelectedPairContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(SelectedPairContext);
  if (!context) {
    throw new Error(
      "useAppContext must be used within a AppProvider"
    );
  }
  return context;
};
