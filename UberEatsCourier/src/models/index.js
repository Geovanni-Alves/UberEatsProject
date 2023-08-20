// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED"
};

const { User, BasketDish, Order, OrderDish, Basket, Dish, Restaurant, DishBasketDish } = initSchema(schema);

export {
  User,
  BasketDish,
  Order,
  OrderDish,
  Basket,
  Dish,
  Restaurant,
  DishBasketDish,
  OrderStatus
};