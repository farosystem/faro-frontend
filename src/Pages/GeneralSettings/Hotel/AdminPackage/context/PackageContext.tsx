import React, { createContext, useContext, useReducer } from 'react';
import { PackageAction, packageReducer, PackageState } from './packageReducer';
import { packageInitialState } from './packageInitialState';

interface PackageContextType {
  state: PackageState;
  dispatch: React.Dispatch<PackageAction>;
}

export const PackageContext = createContext<PackageContextType | null>(null);

export const PackageProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(packageReducer, packageInitialState);
  return <PackageContext.Provider value={{ state, dispatch }}>{children}</PackageContext.Provider>;
};

export const usePackage = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  return context;
};
