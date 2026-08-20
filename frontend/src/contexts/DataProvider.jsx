import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [options, setOptions] = useState({});
  return (
    <DataContext.Provider
      value={{
        posts,
        setPosts,
        options,
        setOptions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
// eslint-disable-next-line
export const useData = () => useContext(DataContext);
