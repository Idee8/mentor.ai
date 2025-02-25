"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import { useRequestAccessModal } from "@/components/landing";

export const LandingContext = createContext<{
  setShowRequestAccessModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowRequestAccessModal: () => {},
});

const LandingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { RequestAccessModal, setShowRequestAccessModal } =
    useRequestAccessModal();

  return (
    <LandingContext.Provider value={{ setShowRequestAccessModal }}>
      <RequestAccessModal />

      {children}
    </LandingContext.Provider>
  );
};

export default LandingProvider;
