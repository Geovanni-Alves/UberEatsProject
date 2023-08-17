import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import DishListItem from "../../components/DishListItem";
import Header  from "./Header";
import styles from './styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { Restaurant, Dish } from "../../models";
import { useBasketContext } from "../../contexts/BasketContext";
//import '@azure/core-asynciterator-polyfill';
//import 'core-js/full/symbol/async-iterator';

const RestaurantDetailsPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();
  
  const id = route.params?.id;
  
  const { setRestaurant: setBasketRestaurant, basket, basketDishes } = useBasketContext();
  
  useEffect(() => {
    if (!id) {
      return;
    }
    setBasketRestaurant(null);
    
    // fetch the restaurant with the id
    DataStore
      .query(Restaurant, id)
      .then(setRestaurant
    );
    // fetch the dishes from that choose restaurant
    DataStore
      .query(Dish, (dish) => dish.restaurantID.eq(id)) //changed after the tutorial, eq turn a function without quotes
      .then(setDishes
    );
  },[id]);

  useEffect(() => {
    setBasketRestaurant(restaurant);
  },[restaurant])

  if (!restaurant){
    return (<ActivityIndicator size={"large"} color="gray"/>)
  }
  
  return (
    <View style={styles.page}>
      <FlatList 
        ListHeaderComponent={() => <Header restaurant={restaurant} />}
        data={dishes}
        renderItem={({ item }) => <DishListItem dish={item} />}
        keyExtractor={(item) => item.name}
      />
      <Ionicons 
        onPress={() => navigation.goBack()}
        name="arrow-back-circle" 
        size={45}
        color='white'
        style={styles.iconContainer} 
      />
      { basket && (
        <Pressable onPress={() => navigation.navigate('Basket')} style={styles.button}>
          <Text style={styles.buttonText}>Open Basket ({basketDishes.length})</Text>
        </Pressable>
      )}
    </View>
  );
};

export default RestaurantDetailsPage;