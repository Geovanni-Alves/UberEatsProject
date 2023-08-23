import { createContext, useState, useEffect, useContext } from "react";
import { DataStore, Predicates } from "aws-amplify";
import { Basket, BasketDish, Dish } from "../models";
import { useAuthContext } from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();

  const [restaurant, setRestaurant] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);

  const totalPrice = 10;
  // const totalPrice = basketDishes.reduce(
  //   (sum, basketDish) => sum + basketDish.quantity * basketDish.Dish.price,
  //   restaurant?.deliveryFee
  // );

  useEffect(() => {
    if (dbUser && restaurant ){
      DataStore
        .query(Basket, (b) => b.and(b => [
          b.restaurantID.eq(restaurant.id),
          b.userID.eq(dbUser.id)
          ])
        )
        .then((baskets) => setBasket(baskets[0]));
    }
  }, [dbUser, restaurant]);


  useEffect(() => {
    if (basket) {
      DataStore
        .query(BasketDish, (bd) => bd.basketID.eq(basket.id))
        .then(setBasketDishes);
    }
     //console.log('fechBasketDishes Object ',fetchBasketDishesWithDishes());
  }, [basket]);

  const addDishToBasket = async (dish, quantity) => { // start here
    // get the existing basket or create a new one
    let theBasket = basket || (await createNewBasket());
    //console.log("theBasket object:", theBasket);
    // create a BasketDish item and save to Datastore
    const newDish = await DataStore.save(
      new BasketDish({ 
        quantity, 
        Dish: dish, 
        basketID: theBasket.id 
      })
    );
    // const dishOnTheBasket = DataStore.query(Dish, d => d.id.eq(newDish.basketDishDishId))
   

    // setBasketDishes([...basketDishes, newDish], dishOnTheBasket);
    // console.log('dish on basket object', dishOnTheBasket);
    // console.log('basketDishes', basketDishes);

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
        totalPrice
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
