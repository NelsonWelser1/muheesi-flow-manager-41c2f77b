import React, { createContext, useState, useContext } from 'react';

const AutoFillContext = createContext();

export const useAutoFill = () => useContext(AutoFillContext);

export const AutoFillProvider = ({ children }) => {
  const [autoFillData, setAutoFillData] = useState({});

  const updateAutoFillData = (key, value) => {
    setAutoFillData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };

  return (
    <AutoFillContext.Provider value={{ autoFillData, updateAutoFillData }}>
      {children}
    </AutoFillContext.Provider>
  );
};