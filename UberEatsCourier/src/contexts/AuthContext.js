import { createContext, useState, useEffect, useContext } from "react";
import { Auth, DataStore } from 'aws-amplify'; 
import { Driver } from '../models';
//import '@azure/core-asynciterator-polyfill';
//import 'core-js/full/symbol/async-iterator';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbDriver, setDbDriver] = useState(null);
  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  },[]);

  useEffect(() => {
    DataStore.query(Driver, (driver) => driver.sub.eq(sub)).then((drivers) => 
      setDbDriver(drivers[0])
    );
  },[sub]);
  
  return (
    <AuthContext.Provider value={{ authUser, dbDriver, sub, setDbDriver }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);