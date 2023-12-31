import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from '../screens/OrdersScreen';
import OrdersDeliveryScreen from '../screens/OrderDeliveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthContext } from "../contexts/AuthContext";
import { ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {dbDriver, loading } = useAuthContext();

  if (loading) {
    return <ActivityIndicator size='large' color='gray' />;
  }

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