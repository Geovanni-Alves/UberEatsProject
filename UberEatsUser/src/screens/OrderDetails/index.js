import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';

import styles from './styles';
import BasketDishItem from '../../components/BasketDishItem';
import { useOrderContext } from '../../contexts/OrderContext';
import { useEffect, useState } from 'react';

//const order = orders[0];

const OrderDetailsHeader = ({order}) => {
  //console.log (order)
  return (
    <View>
      <View style={styles.page}>
        <Image 
          source={{ uri: order.restaurant[0].image }} 
          style={styles.image} 
        />
        <View style={styles.container}>
          <Text style={styles.title}>{order.restaurant[0].name}</Text>
          <Text style={styles.subtitle}>{order.status} &#8226; </Text>
          
          <Text style={styles.menuTitle}>Your orders</Text>
        </View>
      </View>
    </View>
  )
};

const OrderDetails = ({id}) => {
  const [order, setOrder] = useState();
  const { getOrder } = useOrderContext();

  
  useEffect(()=>{
    getOrder(id).then(setOrder);
  },[])
  //console.log('order object inside order details screen', order)
  if (!order) {
    return <ActivityIndicator size={"large"} color="gray" />
  }
  return (
    <FlatList
      ListHeaderComponent={() => <OrderDetailsHeader order={order}/>} 
      data={order.dishes} 
      renderItem={({item}) => <BasketDishItem basketDish={item}/>}
    />
  )
}

export default OrderDetails