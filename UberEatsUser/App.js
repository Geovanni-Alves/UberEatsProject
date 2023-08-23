import 'core-js/full/symbol/async-iterator';
import { DataStore } from 'aws-amplify';
import { ExpoSQLiteAdapter } from '@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { NavigationContainer } from '@react-navigation/native'
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import AuthContextProvider from './src/contexts/AuthContext';
import BasketContextProvider from './src/contexts/BasketContext';
import OrderContextProvider from './src/contexts/OrderContext';


//import '@azure/core-asynciterator-polyfill';

// Aws Amplify config 
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);


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

