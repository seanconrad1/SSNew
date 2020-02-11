import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const list = [
  {
    name: 'Map',
    icon: 'globe',
    type: 'font-awesome',
  },
  {
    name: 'My Spots',
    type: 'font-awesome',
    icon: 'bookmark',
  },
  // {
  //   name: 'Settings',
  //   type: 'font-awesome',
  //   icon: 'wrench',
  // },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
  },
  divider: { backgroundColor: 'grey', marginTop: 0 },
  title: {
    fontFamily: 'Lobster',
    justifyContent: 'space-around',
    color: 'black',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
});

const SideMenu = props => {
  const logOut = () => {
    console.log('getting here');
    props.navigation.navigate('Login');
  };

  // logOut = () => {
  //   // debugger
  //   deviceStorage
  //     .removeJWT('jwt')
  //     .then(() => this.props.logoutUser())
  //     .then(() => this.props.navigation.navigate('Login'));
  // };

  // approvals = () => {
  //   if (
  //     this.props.user.user.username === 'seanrad' ||
  //     this.props.user.user.username === 'zackrosebrugh' ||
  //     this.props.user.user.username === 'p0intBlankk'
  //   ) {
  //     return (
  //       <ListItem
  //         title="Approvals"
  //         leftIcon={{ name: 'check', type: 'font-awesome' }}
  //         onPress={() => this.props.navigation.navigate('Approvals')}
  //       />
  //     );
  //   }
  // };

  // administration = () => {
  //   if (this.props.user.user.username === 'seanrad') {
  //     return (
  //       <ListItem
  //         title="Administration"
  //         leftIcon={{ name: 'gear', type: 'font-awesome' }}
  //         onPress={() => this.props.navigation.navigate('AdminConsole')}
  //       />
  //     );
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkateSense</Text>

      <DrawerContentScrollView>
        <Divider style={styles.divider} />
        <View>
          {list.map((item, i) => (
            <ListItem
              key={i}
              leftIcon={{ name: item.icon, type: item.type }}
              title={item.name}
              onPress={() =>
                props.navigation.navigate('NavDrawer', { screen: item.name })
              }
            />
          ))}
          <ListItem
            title="Logout"
            leftIcon={{ name: 'sign-out', type: 'font-awesome' }}
            onPress={logOut}
          />

          {/* {this.props.user.user !== null ? this.approvals() : null}

            {this.props.user.user !== null ? this.administration() : null} */}
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default SideMenu;
