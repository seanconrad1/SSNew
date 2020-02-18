import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CREATE_USER from '../graphql/mutations/newUserMutation';
import { useMutation } from '@apollo/react-hooks';
import { store } from '../../store';

const SignUp = props => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const globalState = useContext(store);
  const [disableButton, setDisableButton] = useState(false);
  const { dispatch } = globalState;
  const [errors, setErrors] = useState([]);

  const [
    createUser,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_USER);

  const onSubmit = async () => {
    let data;
    const obj = {
      userInput: {
        email,
        name,
        password,
      },
    };

    try {
      data = await createUser({ variables: obj });
      setErrors(e.networkError.result.errors);
      setDisableButton(false);
    } catch (e) {
      setError(e);
    }

    dispatch({
      type: 'set user',
      obj: {
        name: data.data.createUser.name,
        email: data.data.createUser.email,
        user_id: data.data.createUser.user_id,
        token: data.data.createUser.token,
        authorized: true,
      },
    });

    try {
      await AsyncStorage.setItem('AUTH_TOKEN', data.data.createUser.token);
    } catch (e) {
      return e;
    }
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    if (!error) {
      props.navigation.navigate('NavDrawer', { screen: 'Map' });
    }
  };

  {
    errors.length > 0 && (
      <View>
        <Text style={styles.errors}>{errors[0].message}</Text>
      </View>
    );
  }

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
        placeholderTextColor={'grey'}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        keyboardType="default"
        onChangeText={u => setName(u)}
        leftIconContainerStyle={styles.iconPadding}
      />

      <Input
        placeholder="Email"
        leftIcon={<Icon name="user" size={24} color="black" />}
        clearButtonMode="never"
        value={email}
        placeholderTextColor={'grey'}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        keyboardType="default"
        onChangeText={em => setEmail(em)}
        leftIconContainerStyle={styles.iconPadding}
      />

      <Input
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={'grey'}
        value={password}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={p => setPassword(p)}
        leftIconContainerStyle={styles.iconPadding}
      />

      <Input
        placeholder="Confirm password"
        autoCapitalize="none"
        value={confirmPassword}
        placeholderTextColor={'grey'}
        autoCorrect={false}
        clearButtonMode="never"
        secureTextEntry
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={confirm => setConfirmPassword(confirm)}
        leftIconContainerStyle={styles.iconPadding}
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
    fontFamily: 'Lobster',
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
  iconPadding: { paddingRight: 8 },
});

export default SignUp;
