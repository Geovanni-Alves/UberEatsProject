import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from 'aws-amplify'; 
import { Order,User,OrderDish, Restaurant } from '../models';
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbDriver } = useAuthContext();
  //const [ activeOrder, setActiveOrder ] = useState();
  const [order, setOrder] = useState();
  const [orderFromModel, setOrderFromModel] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();
  const [restaurantFetched, setRestaurantFetched] = useState(false);

  const fetchRestaurantAndMerge = async () => {
    if (!order || !order.orderRestaurantId) {
      return; // Exit if order or restaurant ID is missing
    }

    try {
      const restaurantFromQuery = await DataStore.query(Restaurant, order.orderRestaurantId);
      const mergedOrder = { ...order, restaurant: restaurantFromQuery };
      setOrder(mergedOrder);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }

    const fetchedOrder = await DataStore.query(Order, id);
    setOrder(fetchedOrder);
    const orderFromModel = await DataStore.query(Order, id)
    setOrderFromModel(orderFromModel);

    DataStore.query(User, fetchedOrder.userID).then(setUser);

    DataStore.query(OrderDish, (od) => od.orderID.eq(fetchedOrder.id)).then(
      setDishes
    );

    setRestaurantFetched(false); // Reset the restaurant fetch status
  };

  useEffect(() => {
    if (!orderFromModel) {
      return;
    }
    const subscription = DataStore.observe(Order, orderFromModel.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          // console.log('Order has been updated', element);
          fetchOrder(element.id);
        }
      }
    ) 
  },[orderFromModel?.id])  ;


  useEffect(() => {
    if (order && !restaurantFetched) {
      fetchRestaurantAndMerge();
      setRestaurantFetched(true);
    }
  }, [order, restaurantFetched]);


  const acceptOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(orderFromModel, (updated) => {
        updated.status = "ACCEPTED"; 
        updated.Driver = dbDriver;
      })
    );
    setOrderFromModel(updatedOrder);
  };

  const pickUpOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(orderFromModel, (updated) => {
        updated.status = "PICKED_UP"; 
      })
    );
    setOrderFromModel(updatedOrder);
  };

  const completeOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(orderFromModel, (updated) => {
        updated.status = "COMPLETED"; 
      })
    );
    setOrderFromModel(updatedOrder);
  };
  return (
    <OrderContext.Provider value=
    {{ 
      acceptOrder, 
      order, 
      user, 
      dishes, 
      fetchOrder, 
      orderFromModel,
      completeOrder,
      pickUpOrder 
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);