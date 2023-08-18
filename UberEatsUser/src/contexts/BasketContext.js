import { createContext, useState, useEffect, useContext } from 'react';
import { DataStore } from 'aws-amplify';
import { Basket, BasketDish} from '../models';
import { useAuthContext } from './AuthContext';
//import '@azure/core-asynciterator-polyfill';
//import 'core-js/full/symbol/async-iterator';

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();
  const [ restaurant, setRestaurant ] = useState(null);
  const [ basket, setBasket ] = useState(null);
  const [ basketDishes, setBasketDishes ] = useState([]);
  
  
  const totalPrice = basketDishes.reduce(
    (sum, basketDish) => sum + basketDish.quantity * basketDish.dishPrice,
    restaurant?.deliveryFee
  );
  
  const getDataBasket = async () => {
    const dataBasket = await DataStore
    .query(Basket, (b) => b.and (b => [ 
      b.restaurantID.eq(restaurant.id),
      b.userID.eq(dbUser.id)]
    ));
    console.log(dataBasket);
  }
  


  useEffect(() => {
    getDataBasket()
    //console.log(getDataBasket())
  }
  ,[dbUser, restaurant]);
 

  useEffect(() => {
    if (basket) {
      //console.log("id do basket atual :", basket.id);
      const data = DataStore.query(BasketDish, bd => bd.basketID.eq(basket.id));
      
    }
  },[basket])

  

  const addDishToBasket = async (dish, quantity) => {

    //console.log("add dish to basket", dish, quantity)
    // get the existing basket or create a new one
    let theBasket = basket || (await createNewBasket());

    // create a BasketDish item and save to Datastore
    const newDish = await DataStore.save(
      new BasketDish({ 
        quantity, 
        Dish: dish, 
        basketID: theBasket.id, 
      })
    );

    setBasketDishes([...basketDishes, newDish]);
  };

  const createNewBasket = async () => {
    const newBasket = await DataStore.save(
      new Basket({ 
        userID: dbUser.id, 
        restaurantID: restaurant.id 
      })
    );
    setBasket(newBasket);
    return newBasket;
  };
  

  return (
    <BasketContext.Provider 
      value={{ 
        addDishToBasket, 
        setRestaurant, 
        restaurant,
        basket,
        basketDishes,
        totalPrice,
      }}
    >
      {children}
    </BasketContext.Provider>
  )
}

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext); 