import {View,Text,StyleSheet, FlatList } from 'react-native';


const BasketDishItem = ({ basketDish }) => {
  //console.log("Basket Dish content",basketDish);
  return (
  <View style={styles.row}>
    <View style={styles.quantityContainer}>
      <Text>{basketDish.quantity}</Text>
    </View>
    <Text style={{fontWeight: '600'}}>{basketDish.dishName}</Text>
    <Text style={{marginLeft: 'auto'}}>$ {basketDish.dishPrice}</Text>
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

