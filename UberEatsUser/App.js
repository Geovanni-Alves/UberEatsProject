import 'core-js/full/symbol/async-iterator';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { NavigationContainer } from '@react-navigation/native'
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import AuthContextProvider from './src/contexts/AuthContext';
import BasketContextProvider from './src/contexts/BasketContext';
import OrderContextProvider from './src/contexts/OrderContext';

//import '@azure/core-asynciterator-polyfill';
import { Analytics, DataStore } from 'aws-amplify';

// Aws Amplify config 
import { Amplify } from '@aws-amplify/core';
import config from './src/aws-exports';
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
    },
});



function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <BasketContextProvider>
          <OrderContextProvider>
            <RootNavigator />
          </OrderContextProvider>
        </BasketContextProvider>
      </AuthContextProvider>
      
      <StatusBar style="light"/>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);

