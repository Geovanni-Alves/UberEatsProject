import { View, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Mapview, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {Driver, Order} from '../../models';
import { DataStore } from "aws-amplify";
import {FontAwesome5} from '@expo/vector-icons';
import { useRef } from "react";

const OrderLiveUpdates = ({ id }) => {
  const [order, setOrder] = useState(null);
  const [driver, setDriver]= useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
     DataStore.query(Order, id).then(setOrder);
  },[]);

  useEffect(() => {
    if (!order){
      return
    }
    const subscription = DataStore.observe(Order,order.id).subscribe(msg => {
      if (msg.opType === "UPDATE") {
        setOrder(msg.element);
      }
    });
    return () => subscription.unsubscribe();
  },[order])

  useEffect(() => {
    if (order?.orderDriverId) {
      DataStore.query(Driver, order.orderDriverId).then(setDriver);
    }
  },[order?.orderDriverId]);

  useEffect(() => {
    if (driver?.lng && driver.lat) {
      mapRef.current.animateToRegion({
        latitude: driver.lat,
        longitude: driver.lng,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      })
    }
  },[driver?.lng, driver?.lat])

  useEffect(() => {
    if (!driver) {
      return;
    }
    const subscription = DataStore.observe(Driver, driver.id).subscribe(msg => {
    if (msg.opType ==='UPDATE') {
      setDriver(msg.element);
    }
    });
    return () => subscription.unsubscribe();
  },[driver]);

  return (
    <View>
      <Text>Status: {order?.status || "loading"} </Text>
      <Mapview 
        style={styles.map} 
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
      >
        { driver?.lat && <Marker 
          coordinate={{latitude: driver.lat, longitude:driver.lng}}
        >
          <View style={{
              padding: 5, 
              backgroundColor: 'green', 
              borderRadius: 40, 
          }}>
            <FontAwesome5 name="motorcycle" size={24} color='white' />
          </View>
        </Marker>}
      </Mapview>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
})

export default OrderLiveUpdates;

