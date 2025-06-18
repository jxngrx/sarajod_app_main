import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ColorContextProps {
  colorId: number | null;
  updateColor: (id: number) => void;
}

export const ColorContext = createContext<ColorContextProps | undefined>(
  undefined
);

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [colorId, setColorId] = useState<number | null>(null);

  useEffect(() => {
    const loadColor = async () => {
      const storedColorId = await AsyncStorage.getItem("colorId");
      if (storedColorId) {
        setColorId(parseInt(storedColorId, 10));
      }
      console.log(colorId, "colorid");
      console.log(storedColorId);
    };
    loadColor();
    console.log(colorId, "newcolorid");
  }, []);

  const updateColor = async (id: number) => {
    setColorId(id);
    await AsyncStorage.setItem("colorId", id.toString());
  };

  return (
    <ColorContext.Provider value={{ colorId, updateColor }}>
      {children}
    </ColorContext.Provider>
  );
};
