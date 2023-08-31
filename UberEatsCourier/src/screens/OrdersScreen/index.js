import { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, useWindowDimensions, } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import OrderItem from "../../components/OrderItem";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Entypo } from '@expo/vector-icons';
import { DataStore } from "aws-amplify";
import { Order, Restaurant } from '../../models';
import CustomMarker from "../../components/CustomMarker";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  
  const snapPoints = useMemo(() => ["12%", "95%"],[])
  

  useEffect(() => {
    const fetchOrdersWithRestaurants = async () => {
      const queriedOrders = await DataStore.query(Order, (filterOrder) => filterOrder.status.eq("READY_FOR_PICKUP"));
      const orderPromises = queriedOrders.map(async (order) => {
        const associatedRestaurant = await DataStore.query(Restaurant, order.orderRestaurantId);
        return { ...order, restaurant: associatedRestaurant };
      });
      const ordersWithRestaurants = await Promise.all(orderPromises);
      setOrders(ordersWithRestaurants);
    };

    fetchOrdersWithRestaurants();
    
  }, []);

  return (
    <View style={{ backgroundColor: "lightblue", flex: 1}}>
      <MapView 
        style={{
          height,
          width,
        }} 
        //provider={PROVIDER_GOOGLE}
        showsUserLocation={true} 
        followsUserLocation={true}
      >
        {orders.map((order) => (
          <CustomMarker key={order.id} data={order.restaurant} type="RESTAURANT" />
        ))}
        
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text 
            style={{
              fontSize: 20, 
              fontWeight: "600", 
              letterSpacing: 0.5, 
              paddingBottom: 5,
            }}>You're Online</Text>
          <Text style={{letterSpacing: 0.5, color: "grey"}}>Available Orders: {orders.length}</Text>
        </View>
        <BottomSheetFlatList 
          data={orders}
          renderItem={({item}) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  )
};

export default OrdersScreen;