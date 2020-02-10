import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map/Map';
import NewMap from './screens/Map/NewMap';
import SideDrawer from './components/SideDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      {/* <Stack.Screen name="Map" component={Map} /> */}
    </Stack.Navigator>
  );
}

// function CustomDrawerContent(props) {
//   return <SideDrawer />;
// }

function CustomDrawerContent(props) {
  return <SideDrawer {...props} />;
}

const Navigation = props => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Root"
        drawerContent={drawerProps => CustomDrawerContent(drawerProps)}>
        <Drawer.Screen name="Root" component={Root} />
        <Drawer.Screen name="Map" component={Map} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

// const RootStack = createStackNavigator(
//   {
//     Map: { screen: Map },
//     Login: { screen: Login },
//     SignUp: { screen: SignUp },
//     // Map: {screen: Map},
//     // CommentsPage:{screen: CommentsPage},
//     // UsersPage:{screen: UsersPage},
//   },
//   {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//       drawerLockMode: 'locked-closed',
//     },
//   },
// );

// const Drawer = createStackNavigator(
//   {
//     Map: { screen: Map },
//     // Settings: {screen: Settings},
//     // SpotPage: {screen: SpotPage},
//     // NewSpotPage: {screen: NewSpotPage},
//     // LocationSelectorMap: {screen: LocationSelectorMap},
//     // AdminConsole:{screen: AdminConsole},
//     // PostsPage:{screen: PostsPage},
//     // Approvals:{screen: Approvals},
//     // ApprovalSpotPage:{screen: ApprovalSpotPage},
//   },
//   {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//     },
//   },
//   {
//     initialRouteName: 'Map',
//   },
// );

// const HomeNavigationDrawer = createDrawerNavigator(
//   {
//     RootStack: { screen: RootStack },
//     Drawer: { screen: Drawer },
//   },
//   {
//     contentComponent: SideDrawer,
//     drawerOpenRoute: 'DrawerOpen',
//     drawerCloseRoute: 'DrawerClose',
//     drawerToggleRoute: 'DrawerToggle',
// drawerWidth: 250,
//   },
// );

// const PrimaryNav = createStackNavigator(
//   {
//     HomeNavigationDrawer: { screen: HomeNavigationDrawer },
//   },
//   {
//     // Default config for all screens
//     headerMode: 'none',
//     title: 'Main',
//     initialRouteName: 'HomeNavigationDrawer',
// gesturesEnabled: false,
//   },
// );

// const AppNavigatorContainer = createAppContainer(PrimaryNav);
