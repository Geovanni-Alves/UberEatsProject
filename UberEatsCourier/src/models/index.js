// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED"
};

const { Driver, OrderDish, Order, BasketDish, Basket, User, Dish, Restaurant } = initSchema(schema);

export {
  Driver,
  OrderDish,
  Order,
  BasketDish,
  Basket,
  User,
  Dish,
  Restaurant,
  TransportationModes,
  OrderStatus
};