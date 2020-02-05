import React from 'react';
import {createAppContainer, DrawerItems} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Map from './screens/Map';

const RootStack = createStackNavigator(
  {
    // Login: {screen: Login},
    Map: {screen: Map},

    SignUp: {screen: SignUp},
    Login: {screen: Login},
    // CommentsPage:{screen: CommentsPage},
    // UsersPage:{screen: UsersPage},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
      drawerLockMode: 'locked-closed',
    },
  },
);

const Drawer = createStackNavigator(
  {
    Map: {screen: Map},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
  {
    initialRouteName: 'Map',
  },
);

const HomeNavigationDrawer = createDrawerNavigator(
  {
    RootStack: {screen: RootStack},
    Drawer: {screen: Drawer},
  },
  {
    // contentComponent: SideMenu,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
  },
);

const PrimaryNav = createStackNavigator(
  {
    HomeNavigationDrawer: {screen: HomeNavigationDrawer},
  },
  {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'HomeNavigationDrawer',
    gesturesEnabled: false,
  },
);

const AppNavigatorContainer = createAppContainer(PrimaryNav);

const Navigation = props => {
  return <AppNavigatorContainer>{props.children}</AppNavigatorContainer>;
};

export default Navigation;
