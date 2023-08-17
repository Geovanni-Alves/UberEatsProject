import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from '../screens/OrdersScreen';
import OrdersDeliveryScreen from '../screens/OrderDeliveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {dbDriver} = useAuthContext();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {dbDriver ? (
        <>
          <Stack.Screen name='OrdersScreen' component={OrdersScreen}/>
          <Stack.Screen name='OrdersDeliveryScreen' component={OrdersDeliveryScreen}/>
        </>
      ):(
        <Stack.Screen name='Profile' component={ProfileScreen} />
      )}
    </Stack.Navigator>
  )
}

export default Navigation;