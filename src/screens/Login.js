import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//Context
import { store } from '../../store';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useMutation } from '@apollo/react-hooks';
import LOGIN_MUTATION from '../graphql/mutations/loginMutation';

const FONT_SIZE_BIG = hp('8');
const FONT_SIZE_SMALL = hp('6');

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const [login] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (globalState.state.authorized) {
      props.navigation.navigate('NavDrawer', { screen: 'Map' });
    }
  });

  const onSubmit = async () => {
    let response;

    try {
      response = await login({ variables: { email, password } });
    } catch (e) {
      Alert('test');
    }

    dispatch({
      type: 'set user',
      obj: {
        name: response.data.login.name,
        email: response.data.login.email,
        user_id: response.data.login.user_id,
        token: response.data.login.token,
        authorized: true,
      },
    });

    if (response.data.login.token) {
      try {
        await AsyncStorage.setItem('AUTH_TOKEN', response.data.login.token);
      } catch (e) {
        Alert('test');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        {/*eslint-disable-next-line react-native/no-raw-text*/}
        <Text style={[styles.header, { fontSize: hp('6') }]}>SkateSense</Text>
      </View>

      <View>
        {/* <Text style={{ color: 'red' }}>{this.props.error ? this.props.error : null}</Text> */}
      </View>

      <Input
        leftIconContainerStyle={styles.iconPadding}
        placeholder="Email"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        value={email}
        keyboardType="default"
        onChangeText={uname => setEmail(uname)}
      />

      <Input
        leftIconContainerStyle={styles.iconPadding}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={pass => setPassword(pass)}
      />

      <Button
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Submit"
        buttonStyle={styles.submitButton}
        onPress={onSubmit}
        // disabled={this.props.authenticatingUser}
        // loading={this.props.authenticatingUser}
      />

      <Button
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Sign Up"
        buttonStyle={styles.signupButton}
        onPress={() => props.navigation.navigate('SignUp')}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: hp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontFamily: 'Lobster-Regular',
    fontWeight: 'bold',
    marginBottom: hp('5%'),
  },
  submitButton: {
    marginTop: hp('5%'),
    backgroundColor: 'rgb(244, 2, 87)',
    width: wp('80%'),
    height: hp('6%'),
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('20%'),
    marginBottom: hp('2%'),
  },
  signupButton: {
    backgroundColor: 'grey',
    width: wp('80%'),
    height: hp('6%'),
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('20%'),
  },
  iconPadding: { paddingRight: 8 },
});

export default Login;
