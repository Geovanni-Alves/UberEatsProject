import {View,Text,StyleSheet, FlatList, Pressable } from 'react-native';
import BasketDishItem from '../../components/BasketDishItem';
import { useBasketContext } from '../../contexts/BasketContext';
import { useOrderContext } from '../../contexts/OrderContext';
import { useNavigation } from '@react-navigation/native';


const BasketScreen = () => {
  const { restaurant, basketDishes, totalPrice } = useBasketContext();
  const { createOrder } = useOrderContext();
  const navigation = useNavigation();

  //console.log("basketDishes:", basketDishes);
  const onCreateOrder = async () => {
    await createOrder();
    navigation.goBack();
  }
  //console.log(dishes)
  //console.log(totalPrice);
  return (
  <View style={styles.page}>
    <Text style={styles.name}>{restaurant?.name}</Text>
    <Text style={{fontWeight: 'bold', marginTop: 20, fontSize: 19}}>Your items</Text>
    
    <FlatList 
      data={basketDishes} 
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BasketDishItem basketDish={item}/>}
    />

    <View style={styles.separator}/>

    <Pressable onPress={onCreateOrder} style={styles.button}>
      <Text style={styles.buttonText}> 
        Create order &#8226; $ {totalPrice.toFixed(2)} 
      </Text>
    </Pressable>
  </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    paddingVertical: 30,
    padding: 10,
  },
  name:{
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  },
  description:{
    color: 'gray',
  },
  separator:{
    height: 1,
    backgroundColor: 'lightgrey',
    marginVertical: 10,
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  quantity:{
    fontSize: 25,
    marginHorizontal: 20
  },
  button:{
    backgroundColor: 'black',
    marginTop: 'auto',
    padding: 20,
    alignItems: 'center',
  },
  buttonText:{
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  quantityContainer:{
    backgroundColor: 'lightgrey',
    paddingHorizontal: 5,
    marginRight: 10,
    paddingVertical: 2,
    borderRadius: 3,
  }
});

export default BasketScreen;
