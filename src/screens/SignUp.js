import React, {useReducer, useState, useEffect, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import {Input, Button, ThemeProvider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CREATE_USER from '../graphql/mutations/newUserMutation';
import {useMutation} from '@apollo/react-hooks';
import {UserContext} from '../../App';

// import { withNavigation } from 'react-navigation';

const SignUp = props => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const user = useContext(UserContext);

  console.log('WHAT DIS', user);

  const [
    createUser,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(CREATE_USER);

  const onSubmit = () => {
    const obj = {
      userInput: {
        email,
        name,
        password,
      },
    };
    // createUser({variables: obj});

    user.setUser({
      name: 'Sean',
      email: 'seanrad@gmail.com',
      token: '123124',
      authorized: true,
      setUser: user.setUser,
    });

    console.log(user);

    // setEmail('');
    // setPassword('');
    // setName('');
    // setConfirmPassword('');
  };

  console.log('ERROR', mutationError);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Animated.Text style={styles.header}>Signup</Animated.Text>
      </View>

      <Input
        placeholder="Name"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        value={name}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        keyboardType="default"
        onChangeText={u => setName(u)}
        leftIconContainerStyle={{paddingRight: 8}}
      />

      <Input
        placeholder="Email"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        value={email}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        keyboardType="default"
        onChangeText={em => setEmail(em)}
        leftIconContainerStyle={{paddingRight: 8}}
      />

      <Input
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={p => setPassword(p)}
        leftIconContainerStyle={{paddingRight: 8}}
      />

      <Input
        placeholder="Confirm password"
        autoCapitalize="none"
        value={confirmPassword}
        autoCorrect={false}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={confirm => setConfirmPassword(confirm)}
        leftIconContainerStyle={{paddingRight: 8}}
      />

      <Button
        icon={<Icon name="arrow-right" size={15} color="white" />}
        title="Submit"
        buttonStyle={styles.button}
        onPress={() => onSubmit()}
        disabled={mutationLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    // fontFamily: 'Lobster',
    fontSize: 50,
    fontWeight: 'bold',
    // marginBottom: 80
  },
  error: {
    color: 'red',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'rgb(244, 2, 87)',
    width: 300,
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 20,
  },
});

export default SignUp;
