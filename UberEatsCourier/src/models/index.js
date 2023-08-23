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

const { Driver, User, BasketDish, Restaurant, Dish, OrderDish, Order, Basket } = initSchema(schema);

export {
  Driver,
  User,
  BasketDish,
  Restaurant,
  Dish,
  OrderDish,
  Order,
  Basket,
  TransportationModes,
  OrderStatus
};