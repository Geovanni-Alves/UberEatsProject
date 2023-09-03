import { useRef,  useState, useEffect } from "react";
import { View,  useWindowDimensions, ActivityIndicator  } from "react-native";
import styles from './styles';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation, useRoute} from "@react-navigation/native";
import { useOrderContext } from "../../contexts/OrderContext";
import BottomSheetDetails from "./BottomSheetDetails";
import CustomMarker from "../../components/CustomMarker";
import { Ionicons } from '@expo/vector-icons';
import { DataStore } from "aws-amplify";
import { Driver } from '../../models';
import { useAuthContext } from "../../contexts/AuthContext";


const OrderDeliveryScreen = () => {
  //const [dishItems, setDishItems] = useState([]);
  const mapRef = useRef(null);

  const {width, height} = useWindowDimensions();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  
  const {
    order,
    user,
    dishes,
    acceptOrder,
    fetchOrder,
    orderFromModel,
    completeOrder,
    pickUpOrder
  } = useOrderContext();

  const { dbDriver } = useAuthContext();

  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

  useEffect(() => {
    if (!driverLocation) {
      return;
    }
    DataStore.save(Driver.copyOf(dbDriver,(updated) => {
      updated.lat = driverLocation.latitude
      updated.lng = driverLocation.longitude
    })
  );
  },[driverLocation])

  useEffect (() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({accuracy: 5 });
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
    
    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
      }, 
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude
        })
      }
    )
    return () => foregroundSubscription;
  }, []);
  
  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  }

  if (!order?.restaurant) {
    return <ActivityIndicator style={{ padding: 50 }} size={'large'} color='gray' />;
  }
  const restaurantLocation = {
    latitude: order?.restaurant.lat, 
    longitude: order?.restaurant.lng
  }
  const deliveryLocation = {
    latitude: user?.lat, 
    longitude: user?.lng
  };

  //console.log(order.status)
  if (!order || !user || !driverLocation){
    return <ActivityIndicator style={{padding: 50}} size={'large'} color='gray'/>
  }
  //console.log('order = ',order.status);
  //console.log('orderFromModel = ',orderFromModel);
  //console.log(dishItems);
 
  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{width, height}}
        showsUserLocation={true} 
        followsUserLocation={true}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007
        }}
      >
        <MapViewDirections 
          origin={driverLocation}
          destination={orderFromModel.status === "ACCEPTED" 
            ? restaurantLocation
            : deliveryLocation
          }
          strokeWidth={10}
          waypoints={orderFromModel.status === "READY_FOR_PICKUP" 
            ? [restaurantLocation] 
            : [] 
          }
          strokeColor='#3fc060'
          apikey={GOOGLE_MAPS_APIKEY}
          onReady={(result) => {
            //if (result.distance <= 0.1 ) {
            //setIsDriverClose(result.distance <= 0.50); //0.10
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
            //console.warn('Driver is Close')
            //}
          }}
        />
        <CustomMarker data={order.restaurant} type="RESTAURANT" />
        <CustomMarker data={user} type="USER" />
      </MapView>
      <BottomSheetDetails 
        totalKm={totalKm} 
        totalMinutes={totalMinutes} 
        onAccepted={zoomInOnDriver}
      />
      {order.status === "READY_FOR_PICKUP" && (
        <Ionicons 
          onPress={() => navigation.goBack()}
          name='arrow-back-circle'
          size={45}
          color='black'
          style={{ top: 40, left: 15, position: 'absolute'}}
        />
      )}
    </View>
  );
}

export default OrderDeliveryScreen;