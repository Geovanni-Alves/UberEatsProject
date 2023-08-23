import 'core-js/full/symbol/async-iterator';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import AuthContextProvider from "./src/contexts/AuthContext";

// import { DataStore } from 'aws-amplify';
// import { ExpoSQLiteAdapter } from '@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter';

// DataStore.configure({
//   storageAdapter: ExpoSQLiteAdapter
// });

// Aws Amplify config 
// Aws Amplify config 
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);


function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);