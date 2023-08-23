import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BasketDishItem = ({ basketDish }) => {
  return (
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>{basketDish.quantity}</Text>
      </View>
      <Text style={{ fontWeight: '600' }}>{basketDish.Dish.name}</Text>
      <Text style={{ marginLeft: 'auto' }}>$ {basketDish.Dish.price}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  quantityContainer:{
    backgroundColor: 'lightgrey',
    paddingHorizontal: 5,
    marginRight: 10,
    paddingVertical: 2,
    borderRadius: 3,
  }
});


export default BasketDishItem;

