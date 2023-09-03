import { createContext, useState, useEffect, useContext } from "react";
import { Auth, DataStore } from 'aws-amplify'; 
import { Driver } from '../models';
//import '@azure/core-asynciterator-polyfill';
//import 'core-js/full/symbol/async-iterator';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbDriver, setDbDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  },[]);

  useEffect(() => {
    if (!sub) {
      return;
    }
    DataStore.query(Driver, (driver) => driver.sub.eq(sub)).then(
      (drivers) => {
      setDbDriver(drivers[0]);
      setLoading(false);
      }
    );
  },[sub]);
  
  useEffect(() => {
    if (!dbDriver) {
      return;
    }
    const subscription = DataStore.observe(Driver, dbDriver.id).subscribe(
      (msg) => {
      if (msg.opType === "UPDATE") {
        setDbDriver(msg.element);
      }
    })
    return () => subscription.unsubscribe();
  },[dbDriver])
  
  return (
    <AuthContext.Provider value={{ authUser, dbDriver, sub, setDbDriver, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);