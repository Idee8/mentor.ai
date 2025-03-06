'use client';

import { useSession } from '@/lib/auth-client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface AppContextType {
  selectedFilePathnames: Array<string>;
  setSelectedFilePathnames: Dispatch<SetStateAction<string[]>>;
}

export const AppContext = createContext<AppContextType>({
  selectedFilePathnames: [],
  setSelectedFilePathnames: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isMounted, setIsMounted] = useState(false);
  const { data, isPending } = useSession();

  useEffect(() => {
    if (isMounted !== false && data && data.user) {
      console.log(selectedFilePathnames);
      localStorage.setItem(
        `${data.user.email}/selected-file-pathnames`,
        JSON.stringify(selectedFilePathnames),
      );
    }
  }, [selectedFilePathnames, isMounted, data]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data?.user && !isPending) {
      setSelectedFilePathnames(
        JSON.parse(
          localStorage.getItem(`${data.user.email}/selected-file-pathnames`) ||
            '[]',
        ),
      );
    }
  }, [data, isPending]);

  return (
    <AppContext.Provider
      value={{
        selectedFilePathnames,
        setSelectedFilePathnames,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
