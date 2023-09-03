import { createContext, useContext, useEffect, useState } from "react";
import { DataStore } from 'aws-amplify';
import { Order, OrderDish, Basket, Restaurant } from '../models';
import { useAuthContext } from "./AuthContext";
import { useBasketContext } from "./BasketContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();

  const { restaurant, totalPrice, basketDishes, basket } = useBasketContext();
  
  const [ orders, setOrders ] = useState([]);

  const fetchOrders =  async () => {
    if (dbUser) {
      const mergedOrders = [];
      //console.log('useEffect dispared',dbUser);
      
      try {
        const orders = await DataStore
          .query(Order, (o) => o.userID.eq(dbUser.id
        ));
    
        for (const order of orders) {
          const orderRestaurant = await DataStore
            .query(Restaurant, (r) => r.id.eq(order.orderRestaurantId
          ));

          const mergedOrder = { ...order, restaurant: orderRestaurant[0] }; 
          mergedOrders.push(mergedOrder);
        }
      
        setOrders(mergedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  }


  useEffect(() => {
    fetchOrders();
  },[dbUser]);
  //console.log('orders object ',orders);

  const createOrder = async () => {
    //console.warn("abs");
    // create the order
    //console.log(totalPrice);
    const newOrder = await DataStore.save(
      new Order({
        userID: dbUser.id,
        Restaurant: restaurant,
        status: 'NEW',
        total: totalPrice,
      })
    );
    // add all basketDishes to order
    await Promise.all(
      basketDishes.map((basketDish) => 
        DataStore.save(
          new OrderDish({ 
            quantity: basketDish.quantity,
            orderID: newOrder.id,
            //Dish: basketDish.Dish, 
            dishName: basketDish.dishName,
            dishPrice: basketDish.dishPrice,
            dishDescription: basketDish.dishDescription,
          })
        )
      )
     );
    // delete basket
    await DataStore.delete(basket);
    setOrders([...orders, newOrder]);
  };

  const getOrder = async (id) => {
    const order = await DataStore.query(Order,id);
    const orderDishes = await DataStore.query(OrderDish, (od) => 
      od.orderID.eq(id)
    );
    const orderRestaurant = await DataStore.query(Restaurant, (r) =>
      r.id.eq(order.orderRestaurantId)
    );
    return {...order, dishes: orderDishes, restaurant: orderRestaurant};
  }
 
  return (
    <OrderContext.Provider value ={{ createOrder, orders, getOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);