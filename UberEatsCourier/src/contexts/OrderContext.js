import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from 'aws-amplify'; 
import { Driver, Order } from '../models';
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbDriver } = useAuthContext();
  const [ activeOrder, setActiveOrder ] = useState();

  const acceptOrder = (order) => {
    console.log('object order',order);
    //console.log(dbDriver);
    // update the order, and change status and assign the driver 
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED"; 
        updated.Driver = dbDriver;
      })
    ).then(setActiveOrder);
  }

  return (
    <OrderContext.Provider value={{acceptOrder}}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);