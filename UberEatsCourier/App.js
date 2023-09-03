import 'core-js/full/symbol/async-iterator';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import AuthContextProvider from "./src/contexts/AuthContext";
import OrderContextProvider from "./src/contexts/OrderContext";

// import { DataStore } from 'aws-amplify';
// import { ExpoSQLiteAdapter } from '@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter';

// DataStore.configure({
//   storageAdapter: ExpoSQLiteAdapter
// });
// ignore warning logs
import { LogBox } from 'react-native';
LogBox.ignoreLogs(["Setting a timer"]);

// Aws Amplify config 
import { Amplify, Auth } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);
Auth.configure(awsExports);

function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <OrderContextProvider>
            <Navigation />
          </OrderContextProvider>
        </AuthContextProvider>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);