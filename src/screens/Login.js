import React, {useReducer, useState, useEffect, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';

import {UserContext} from '../../App';

import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useQuery} from '@apollo/react-hooks';
import USERS_FETCH from '../graphql/queries/getUsers';

const FONT_SIZE_BIG = hp('8');
const FONT_SIZE_SMALL = hp('6');

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fontSizeBig, setFontSizeBig] = useState(new Animated.Value(hp('8')));
  const [keyboardWillShowSub, setKeyboardWillShowSub] = useState('');
  const [keyboardWillHideSub, setKeyboardWillHideSub] = useState('');
  const user = useContext(UserContext);
  console.log(user);

  // useEffect(() => {
  //   setKeyboardWillShowSub(
  //     Keyboard.addListener('keyboardWillShow', keyboardWillShowSub),
  //   );
  //   setKeyboardWillHideSub(
  //     Keyboard.addListener('keyboardWillHide', keyboardWillHideSub),
  //   );
  //   onSubmit();
  // }, [
  //   keyboardWillHide,
  //   keyboardWillHideSub,
  //   keyboardWillShow,
  //   keyboardWillShowSub,
  // ]);

  // useEffect(() => {
  //   return () => {
  //     setKeyboardWillShowSub(keyboardWillShowSub.remove());
  //     setKeyboardWillHideSub(keyboardWillHideSub.remove());
  //   };
  // }, [keyboardWillHideSub, keyboardWillShowSub]);
  // //
  // const keyboardWillShow = event => {
  //   Animated.timing(fontSizeBig, {
  //     duration: event.duration,
  //     toValue: FONT_SIZE_SMALL,
  //   }).start();
  // };

  // const keyboardWillHide = event => {
  //   Animated.timing(fontSizeBig, {
  //     duration: event.duration,
  //     toValue: FONT_SIZE_BIG,
  //   }).start();
  // };

  const onSubmit = () => {
    console.log('Login button');
  };

  const {loading, error, data} = useQuery(USERS_FETCH);

  // this.props.navigation.navigate('Map')

  if (loading) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text>Loading...</Text>
      </KeyboardAvoidingView>
    );
  }
  if (error) {
    console.log(error);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text>Error :(</Text>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        {/*eslint-disable-next-line react-native/no-raw-text*/}
        <Animated.Text style={[styles.header, {fontSize: fontSizeBig}]}>
          SkateSense
        </Animated.Text>
      </View>

      <View>
        {/* <Text style={{ color: 'red' }}>{this.props.error ? this.props.error : null}</Text> */}
      </View>

      <Input
        leftIconContainerStyle={{paddingRight: 8}}
        placeholder="Username"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        keyboardType="default"
        onChangeText={username => setUsername(username)}
      />

      <Input
        leftIconContainerStyle={{paddingRight: 10}}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={password => setPassword(password)}
      />

      <Button
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Submit"
        buttonStyle={styles.submitButton}
        onPress={() => onSubmit()}
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
    backgroundColor: 'rgb(40, 44, 52)',
  },
  header: {
    fontFamily: 'Times New Roman',
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
});

export default Login;
