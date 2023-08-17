import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import 'core-js/full/symbol/async-iterator';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import AuthContextProvider from "./src/contexts/AuthContext";


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