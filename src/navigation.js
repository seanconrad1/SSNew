import React from 'react';
import {
  createAppContainer,
  createDrawerNavigator,
  DrawerItems,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import SignUp from './screens/SignUp';
import Login from './screens/Login';

const RootStack = createStackNavigator(
  {
    // Login: {screen: Login},
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

// const HomeNavigationDrawer = createDrawerNavigator({
//   RootStack: {screen: RootStack},
// });

// const PrimaryNav = createStackNavigator(
//   {
//     HomeNavigationDrawer: {screen: HomeNavigationDrawer},
//   },
//   {
//     // Default config for all screens
//     headerMode: 'none',
//     title: 'Main',
//     initialRouteName: 'HomeNavigationDrawer',
//     gesturesEnabled: false,
//   },
// );

const AppNavigatorContainer = createAppContainer(RootStack);

const Navigation = props => {
  console.log('nav line 81: ', props);
  return <AppNavigatorContainer>{props.children}</AppNavigatorContainer>;
};

export default Navigation;
