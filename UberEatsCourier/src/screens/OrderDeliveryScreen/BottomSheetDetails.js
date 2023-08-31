import { useRef, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import styles from './styles';
import { useOrderContext } from "../../contexts/OrderContext";
import { useNavigation} from "@react-navigation/native";

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: 'Accept Order',
  ACCEPTED: 'Pick-Up Order',
  PICKED_UP: 'Complete Delivery'
}

const BottomSheetDetails = (props) => {

  const navigation = useNavigation();
  const { totalKm, totalMinutes, onAccepted } = props;
  const isDriverClose = totalKm <= 1; // decrease for higher accuracy 

  const {
    order,
    user,
    dishes,
    acceptOrder,
    orderFromModel,
    completeOrder,
    pickUpOrder
  } = useOrderContext();

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"],[])
  
  const onButtonPressed = async () => {
    const {status} = orderFromModel;
    if (status === "READY_FOR_PICKUP") {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onAccepted();
    }
    else if (status === "ACCEPTED"){
      bottomSheetRef.current?.collapse();
      await pickUpOrder();
    }
    else if (status === "PICKED_UP") {
      await completeOrder();
      bottomSheetRef.current?.collapse();
      navigation.goBack();
      //console.warn('Delivery Finished');
    }
  }
  const isButtonDisabled = () => {
    const {status} = orderFromModel;
    if (status === "READY_FOR_PICKUP"){
      return false;
    }
    if ((status === "ACCEPTED" || status === "PICKED_UP") && isDriverClose) {
      return false;
    }
    return true;
  }

  return (
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
              {dishes?.map((dishItem) => (
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
          <Pressable style={{
            ...styles.buttonContainer,
             backgroundColor: isButtonDisabled() ? 'grey' : '#3fc060',
            }} 
            onPress={onButtonPressed} 
            disabled={isButtonDisabled()}
          >
            <Text style={styles.buttonText}>{STATUS_TO_TITLE[orderFromModel.status]}</Text>
          </Pressable>
      </BottomSheet>
  );
};

export default BottomSheetDetails;