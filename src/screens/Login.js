import React, { useState, useContext, useEffect, useCallback } from 'react';
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
import { TEST_USERNAME, TEST_PASSWORD } from 'react-native-dotenv';

const FONT_SIZE_BIG = hp('8');
const FONT_SIZE_SMALL = hp('6');

const Login = props => {
  const [email, setEmail] = useState(__DEV__ ? '' : '');
  const [password, setPassword] = useState(__DEV__ ? '' : '');
  const [disableButton, setDisableButton] = useState(false);
  const [errors, setErrors] = useState([]);

  const [login] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    const checkAuth = async () => {
      const value = await AsyncStorage.getItem('AUTH_TOKEN');
      if (value) {
        props.navigation.navigate('NavDrawer', { screen: 'Map' });
      }
    };
    checkAuth();
  }, [onSubmit, props.navigation]);

  const onSubmit = useCallback(async () => {
    let response;
    setDisableButton(true);
    try {
      response = await login({ variables: { email, password } });
      setDisableButton(false);
    } catch (e) {
      setErrors(e.networkError.result.errors);
      setDisableButton(false);
    }

    if (response.data.login.token) {
      try {
        await AsyncStorage.setItem('AUTH_TOKEN', response.data.login.token);
        await AsyncStorage.setItem('EMAIL', response.data.login.email);
        await AsyncStorage.setItem('USER_ID', response.data.login.user_id);
        await AsyncStorage.setItem('NAME', response.data.login.name);
        setDisableButton(false);
      } catch (e) {
        setDisableButton(false);
      }
    }
    const id = await AsyncStorage.getItem('USER_ID');

    console.log('ID!', id);

    props.navigation.navigate('NavDrawer', { screen: 'Map' });

    setDisableButton(false);
  }, [email, login, password, props.navigation]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        {/*eslint-disable-next-line react-native/no-raw-text*/}
        <Text style={[styles.header, { fontSize: hp('6') }]}>SkateSense</Text>
      </View>

      {errors.length > 0 && (
        <View>
          <Text style={styles.errors}>{errors[0].message}</Text>
        </View>
      )}

      <Input
        leftIconContainerStyle={styles.iconPadding}
        placeholder="Email"
        leftIcon={<Icon name="user" size={24} color="black" />}
        inputContainerStyle={{}}
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
        disabled={disableButton}
        loading={disableButton}
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
  errors: {
    color: 'red',
  },
});

export default Login;
