import { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, FlatList, useWindowDimensions, } from 'react-native';
import BottomSheet from "@gorhom/bottom-sheet";
import OrderItem from "../../components/OrderItem";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from '@expo/vector-icons';
import { DataStore } from "aws-amplify";
import { Order } from '../../models';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  
  const snapPoints = useMemo(() => ["12%", "95%"],[])
  
  useEffect(() => {
    DataStore.query((Order)).then(setOrders);
  },[]);

  console.log(orders);
  /*
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setDriverLocation(location);
      
    })();*/


  return (
    <View style={{ backgroundColor: "lightblue", flex: 1}}>
      <MapView 
        style={{
          height,
          width,
        }} 
        showsUserLocation={true} 
        followsUserLocation={true}
   
      >
        {orders.map((order) => (
          <Marker 
            key={order.id}
            title={order.Restaurant.name} 
            description={order.Restaurant.address} 
            coordinate={{
              //latitude: location?.coords.latitude,
              //longitude: location?.coords.longitude,
              latitude: order.Restaurant.lat, //37.771849, 
              longitude: order.Restaurant.lng //-122.422899
            }}
          >
            <View style={{backgroundColor: 'green', padding: 5, borderRadius: 15}}>
              <Entypo name="shop" size={24} color='white' />
            </View>
          </Marker>
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
          <Text style={{letterSpacing: 0.5, color: "grey"}}>Avaliable Orders: {orders.length}</Text>
        </View>
        <FlatList 
          data={orders}
          renderItem={({item}) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  )
};

export default OrdersScreen;