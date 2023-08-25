import { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, useWindowDimensions, ActivityIndicator, Pressable } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import styles from './styles';
import MapView, { Marker , PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation, useRoute} from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { Order, User, Restaurant, OrderDish } from '../../models';
import { useOrderContext } from "../../contexts/OrderContext";


const ORDER_STATUSES = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
}

const OrderDeliveryScreen = () => {
  const [user, setUser] = useState(null);
  //const [order, setOrder] = useState(null);
  const [dishItems, setDishItems] = useState([]);

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  const {width, height} = useWindowDimensions();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP)
  
  const [isDriverClose, setIsDriverClose] = useState(false);

  const {acceptOrder} = useOrderContext();

  const snapPoints = useMemo(() => ["12%", "95%"],[])
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  //const order = route.params?.orderWithRestaurant; 

  useEffect(() => {
    if (!id) {
      return;
    }
    DataStore.query(Order, id).then(setOrder);
  },[id])
  console.log('order object order delivey screen ',order);
  useEffect(() => {
    if (!order) {
      return;
    }
    DataStore.query(User, order.userID).then(setUser);
    DataStore.query(OrderDish, od => od.orderID.eq(order.id)).then(setDishItems);

  },[order])

  //console.log('object user: ',user);
  useEffect (() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({accuracy: 3 });
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 100
      }, (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude
        })
      }
    )
    return () => foregroundSubscription;
  }, []);
  
  //console.warn(driverLocation);


  const onButtonPressed = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
      console.log('object order before pass to context: ',order)
      acceptOrder(order);
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED){
      bottomSheetRef.current?.collapse();
      setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP){
      bottomSheetRef.current?.collapse();
      navigation.goBack();
      console.warn('Delivery Finished');
    }
  }

  const renderButtonTitle = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP){
      return 'Accept Order'
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED){
      return 'Pick-Up Order'
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP){
      return 'Complete Delivery'
    }
  }

  const isButtonDisabled = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP){
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose){
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose){
      return false;
    }
    return true;
  }
  const restaurantLocation = {
    latitude: order?.restaurant.lat, 
    longitude: order?.restaurant.lng
  };
  const deliveryLocation = {
    latitude: user?.lat, 
    longitude: user?.lng
  };
   if (!driverLocation){
    return <ActivityIndicator style={{padding: 50}} size={'large'} color='gray'/>
  }

  if (!order || !user || !driverLocation){
    return <ActivityIndicator style={{padding: 50}} size={'large'} color='gray'/>
  }

  //console.log(dishItems);
 
  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
        style={{width, height}}
        showsUserLocation={true} 
        //followsUserLocation={true}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007
        }}
      >
        <MapViewDirections 
          origin={driverLocation}
          destination={deliveryStatus === ORDER_STATUSES.ACCEPTED 
            ? restaurantLocation
            : deliveryLocation
          }
          strokeWidth={10}
          waypoints={deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP 
            ? [restaurantLocation] 
            : [] 
          }
          strokeColor='#3fc060'
          apikey={GOOGLE_MAPS_APIKEY}
          onReady={(result) => {
            //if (result.distance <= 0.1 ) {
            setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
            //console.warn('Driver is Close')
            //}
          }}
        />
        <Marker
          coordinate={{
            latitude: order.restaurant.lat, 
            longitude: order.restaurant.lng
          }}
          title={order.restaurant.name}
          description={order.restaurant.address}
        >
          <View style={{backgroundColor: 'green', padding: 5, borderRadius: 15}}>
            <Entypo name='shop' size={30} color='white' />
          </View>
        </Marker>
        <Marker
          coordinate={deliveryLocation}
          title={user.name}
          description={user.address}
        >
          <View style={{backgroundColor: 'green', padding: 5, borderRadius: 15}}>
            <MaterialIcons name='restaurant' size={30} color='white' />
          </View>
        </Marker>
      </MapView>
      {deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP && (
        <Ionicons 
          onPress={() => navigation.goBack()}
          name='arrow-back-circle'
          size={45}
          color='black'
          style={{top: 40, left: 15, position: 'absolute'}}
        />
      )}
     
      <BottomSheet 
        ref={bottomSheetRef} 
        snapPoints={snapPoints} 
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style = {styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(0)} min</Text>
            <FontAwesome5
              name="shopping-bag"
              size={30}
              color="#3fc060"
              style={{marginHorizontal: 10}}
            />
          <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} Km</Text>
          </View>
          <View style={styles.deliveryDetailsContainer}>
            <Text 
              style={styles.restaurantName}>
              {order.restaurant.name}
            </Text>
            <View style={styles.addressContainer}> 
              <Fontisto 
                name='shopping-store' 
                size={22} 
                color='grey'
              />
              <Text 
                style={styles.addressText}>
                {order.restaurant.address}
              </Text>
            </View>
            <View style={styles.addressContainer}> 
              <FontAwesome5
                name="map-marker-alt"
                size={30}
                color='grey'
              />
              <Text 
                style={styles.addressText}>
                {user.address}
              </Text>
           </View>
            <View style={styles.orderDetailsContainer}>
              {dishItems.map((dishItem) => (
                <Text style={styles.orderItemText} key={dishItem.id}>
                  {dishItem.dishName} x{dishItem.quantity}
                </Text>
              ))}
              {/* <BottomSheetFlatList
                data={dishItems}
                renderItem={( { item } ) => ( 
                  <Text style={styles.orderItemText} key={dishItems.id}>
                    {item.dishName} x{item.quantity}
                  </Text>
                )}
              /> */}
            </View>
          </View>
          <Pressable style={{...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'grey' : '#3fc060'}} onPress={onButtonPressed} disabled={isButtonDisabled()}>
            <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
          </Pressable>
      </BottomSheet>
      
    </View>
  );
}

export default OrderDeliveryScreen;