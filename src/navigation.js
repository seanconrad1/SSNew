import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map/Map';
import SideDrawer from './components/SideDrawer';
import SpotBook from './screens/SpotBook/SpotBook';
import NewSpotPage from './screens/NewSpotPage/NewSpotPage';
import LocationSelectorMap from './screens/NewSpotPage/LocationSelectorMap';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return <SideDrawer {...props} />;
}

function NavDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Root"
      drawerContent={drawerProps => CustomDrawerContent(drawerProps)}>
      {/* <Drawer.Screen name="Root" component={Root} /> */}
      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen name="My Spots" component={SpotBook} />
    </Drawer.Navigator>
  );
}
const Navigation = props => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Drawer.Screen name="NavDrawer" component={NavDrawer} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="New Spot" component={NewSpotPage} />
        <Stack.Screen
          name="LocationSelectorMap"
          component={LocationSelectorMap}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
