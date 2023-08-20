import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from "aws-amplify";
import { Basket, BasketDish, Dish } from "../models";
import { useAuthContext } from "./AuthContext";
import '@azure/core-asynciterator-polyfill';

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext();

  const [restaurant, setRestaurant] = useState(null);
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);
  const [dishes, setDishes]= useState([]);

  const totalPrice = BasketDish.quantity * 10;
  // const totalPrice = basketDishes.reduce(
  //   (sum, basketDish) => {
  //     if (basketDish.dish && typeof basketDish.dish.price === 'number') {
  //       return sum + basketDish.quantity * basketDish.dish.price;
  //     } else {
  //       console.warn('Invalid basketDish:', basketDish);
  //       return sum;
  //     }
  //   },
  //   restaurant?.deliveryFee || 0
  // );
  // const totalPrice = basketDishes.reduce(
  //   (sum, basketDish) => sum + basketDish.quantity * basketDish.dish.price,
  //   restaurant?.deliveryFee || 0
  // );
  
  useEffect(() => { 
    if (dbUser && restaurant) {
      DataStore
        .query(Basket, (b) =>
          b.and(b => [
            b.restaurantID.eq(restaurant.id),
            b.userID.eq(dbUser.id)
          ])).then((baskets) => setBasket(baskets[0]));
    }
  }, [dbUser, restaurant]);

  // useEffect(() => {
  //   if (basket) {
  //     //console.log('valor do basketID',basket.id)
  //     DataStore
  //       .query(BasketDish, (bd) => bd.basketID.eq(basket.id))
  //       .then(setBasketDishes)
  //     ;
  //   }
  // }, [basket]);
  useEffect(() => {
    if (basket) {
      console.log('Executing query for basketDishes');
      DataStore.query(BasketDish, (bd) => bd.basketID.eq(basket.id), {
        relationships: ['dish'],
      })
      .then((basketDishes) => {
        console.log('Retrieved Basket Dishes:', basketDishes);
        // Extract the Dish objects from basketDishes
        const fetchedDishes = basketDishes.map(bd => bd.dish);
        setBasketDishes(basketDishes);
        setDishes(fetchedDishes);
      })
      .catch(error => {
        console.error("Error fetching basket dishes:", error);
      });
      console.log('content of basket dishes ',basketDishes)
      console.log('content of dishes', dishes)

    }
  }, [basket]);


const addDishToBasket = async (dish, quantity) => {
  // get the existing basket or create a new one
  let theBasket = basket || (await createNewBasket());

  // create a BasketDish item and save to Datastore
  const newDish = await DataStore.save(
    new BasketDish({
      quantity,
      dishID: dish.id,
      basketID: theBasket.id,
    })
  );

  // Fetch the associated Dish object
  const associatedDish = await DataStore.query(Dish, dish.id);

  setBasketDishes([...basketDishes, newDish]);
  setDishes([...dishes, associatedDish]);
};



  // const addDishToBasket = async (dish, quantity) => {
  //   // get the existing basket or create a new one
  //   let theBasket = basket || (await createNewBasket());
  //   // create a BasketDish item and save to Datastore
  //   const newDish = await DataStore.save(
  //     new BasketDish({ 
  //       quantity,
  //       dishID: dish.id,
  //       basketID: theBasket.id })
  //   );
  //   setBasketDishes([...basketDishes, newDish]);
  // };

  const createNewBasket = async () => {
    const newBasket = await DataStore.save(
      new Basket({ userID: dbUser.id, restaurantID: restaurant.id })
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
        dishes,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
