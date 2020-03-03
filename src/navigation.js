import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map/Map';
import SideDrawer from './components/SideDrawer';
import SpotBook from './screens/SpotBook/SpotBook';
import NewSpotPage from './screens/NewSpotPage/NewSpotPage';
import LocationSelectorMap from './screens/NewSpotPage/LocationSelectorMap';
import Approvals from './screens/Approvals';
import AsyncStorage from '@react-native-community/async-storage';
import { store } from '../store';

const Drawer = createDrawerNavigator();
const AuthStack = createNativeStackNavigator();

const userToken = false;

function CustomDrawerContent(props) {
  return <SideDrawer {...props} />;
}

const NavDrawer = () => {
  return (
    <Drawer.Navigator
      headerMode="none"
      initialRouteName="Map"
      drawerContent={drawerProps => CustomDrawerContent(drawerProps)}>
      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen name="My Spots" component={SpotBook} />
      <Drawer.Screen name="Approvals" component={Approvals} />
    </Drawer.Navigator>
  );
};

const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);

const RootStack = createNativeStackNavigator();
const RootStackScreen = ({ getAuthToken }) => {
  const { state, dispatch } = useContext(store);
  console.log(state.token);
  let jwt;
  (async () => {
    jwt = await getAuthToken();
  })().catch(err => {
    console.error(err);
  });

  // console.log(jwt);

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none">
        {state.token ? (
          <RootStack.Screen name="App" component={NavDrawer} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackScreen;
