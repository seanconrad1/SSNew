import React, { useReducer, useEffect, useState, useContext } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Header,
  Icon,
  Input,
  Button,
  ButtonGroup,
  Slider,
} from 'react-native-elements';
import { useMutation } from '@apollo/react-hooks';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import { fetchKeyForSkateSpots } from '../action.js';
import { reducer, newSpotState } from './reducer';
import NEW_SPOT_MUTATION from '../../graphql/mutations/newSpotMutation';
import GET_SPOTS from '../../graphql/queries/getSpots';
import { store } from '../../../store';
import Geolocation from '@react-native-community/geolocation';

const NewSpotPage = props => {
  const [state, dispatch] = useReducer(reducer, newSpotState);
  const [createSpot, { data }] = useMutation(NEW_SPOT_MUTATION);
  const globalState = useContext(store);

  console.log(state);

  // let latitude;
  // let longitude;

  // if (props.route.params) {
  // latitude = props.route.params.selectedLocation.latitude;
  // longitude = props.route.params.selectedLocation.longitude;
  // }

  useEffect(() => {
    if (props.route.params) {
      const latitude = props.route.params.selectedLocation.latitude;
      const longitude = props.route.params.selectedLocation.longitude;
      dispatch({ type: 'SET_LOCATION', payload: { latitude, longitude } });
    }
  }, [props.route.params]);

  // updateStreetSpotType = streetSpotType => {
  //   this.setState({ streetSpotType });
  // };
  // updateSpotContains = spotContains => {
  //   this.setState({ spotContains });
  // };

  const getPhotoFromCameraRoll = () => {
    const options = {
      title: 'Select Skatespot Photo',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    //   ImagePicker.launchCamera(options, (response) => {
    // // Same code as in above section!
    //   });
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {
          uri: response.uri.replace('file://', ''),
          isStatic: true,
        };
        const photo = {
          uri: source.uri,
          type: 'image/jpeg',
          name: response.fileName,
          data: response.data,
        };
        // Limit to 4 photos uploaded
        if (state.photo && state.photo.length === 4) {
          return null;
        }
        dispatch({ type: 'SET_PHOTO', payload: photo });
      }
    });
  };

  const approvalAlert = () => {
    Alert.alert(
      'Thanks for submitting a spot!',
      'Your spot needs to go through approval before being posted. It should be approved within a day.',
      { cancelable: false },
    );
    props.navigation.navigate('Map');
  };

  const getCurrentLocation = () => {
    if (!state.currentLocationSelected) {
      Geolocation.getCurrentPosition(position => {
        dispatch({
          type: 'SET_CURRENT_LOCATION',
          payload: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      });
    } else {
      dispatch({
        type: 'REMOVE_LOCATION',
        payload: {},
      });
    }
  };

  const onSubmit = async () => {
    dispatch({ type: 'SPOT_SUBMITED', payload: true });

    const images = state.photo.map(img => {
      return { base64: img.data };
    });

    try {
      await createSpot({
        variables: {
          spotInput: {
            name: state.name,
            description: state.description,
            kickout_level: state.kickout_level,
            location: {
              latitude: state.selectedLat,
              longitude: state.selectedLng,
            },
            owner: globalState.state.user_id,
            images,
          },
        },
        refetchQueries: ['getSpots'],
      });
    } catch (e) {
      Alert('Unable to create spot at this time.');
    }

    approvalAlert();
  };

  // const streetSpotTypebuttons = ['Street Spot', 'Skatepark', 'DIY'];
  // const streetSpotContains = [
  //   'Flatbar',
  //   'Bank',
  //   'Stair',
  //   'Ditch',
  //   'Wallride',
  //   'Drop Gap',
  //   'Flat Gap',
  //   'Ledge',
  //   'Polejam',
  //   'Manual Pad',
  //   'QP',
  // ];
  // const { streetSpotType, spotContains } = state;

  console.log(state.locationSelected);

  return (
    <View>
      <Header
        leftComponent={{
          icon: 'arrow-left',
          type: 'font-awesome',
          color: 'black',
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={{
          text: 'Create New Spot',
          style: { color: 'black', fontSize: 25, fontFamily: 'Lobster' },
        }}
        backgroundColor="white"
        containerStyle={{
          justifyContent: 'space-around',
        }}
      />

      <View style={styles.container}>
        <ScrollView>
          <View style={styles.imageBoxContainer}>
            <TouchableOpacity
              style={styles.photoBox}
              onPress={getPhotoFromCameraRoll}>
              {state.photo ? (
                <Image
                  style={[styles.photoBox, { marginTop: -5 }]}
                  source={{ uri: state.photo[0].uri }}
                />
              ) : null}
              <Text style={{ alignSelf: 'flex-end', color: 'white' }}> + </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoBox}
              onPress={getPhotoFromCameraRoll}>
              {state.photo && state.photo[1] ? (
                <Image
                  style={[styles.photoBox, { marginTop: -5 }]}
                  source={{ uri: state.photo[1].uri }}
                />
              ) : null}
              <Text style={{ alignSelf: 'flex-end', color: 'white' }}> + </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoBox}
              onPress={getPhotoFromCameraRoll}>
              {state.photo && state.photo[2] ? (
                <Image
                  style={[styles.photoBox, { marginTop: -5 }]}
                  source={{ uri: state.photo[2].uri }}
                />
              ) : null}
              <Text style={{ alignSelf: 'flex-end', color: 'white' }}> + </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoBox}
              onPress={getPhotoFromCameraRoll}>
              {state.photo && state.photo[3] ? (
                <Image
                  style={[styles.photoBox, { marginTop: -5 }]}
                  source={{ uri: state.photo[3].uri }}
                />
              ) : null}
              <Text style={{ alignSelf: 'flex-end', color: 'white' }}> + </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              buttonStyle={
                state.locationSelected
                  ? styles.spotLocationSelected
                  : styles.spotLocationButton
              }
              title="Set Spot Location"
              onPress={() => props.navigation.navigate('LocationSelectorMap')}
            />
            <Text style={{ marginLeft: 10, marginRight: 10 }}>OR</Text>
            <Button
              buttonStyle={
                state.currentLocationSelected
                  ? styles.spotLocationSelected
                  : styles.spotLocationButton
              }
              title="Use Current Location"
              onPress={getCurrentLocation}
            />
          </View>

          {state.photo ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: 10,
              }}>
              <Text>Photo Uploaded</Text>
              <Icon name="check" />
            </View>
          ) : null}

          {state.selectedLat && state.selectedLat ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: 10,
              }}>
              <Text>Location Selected</Text>
              <Icon name="check" />
            </View>
          ) : null}

          <Text style={{ color: 'red', marginBottom: -10 }}>*</Text>
          <Input
            containerStyle={{ marginTop: -10 }}
            placeholder="Spot Name"
            clearButtonMode="never"
            autoCorrect={false}
            autoFocus
            keyboardType="default"
            onChangeText={name => dispatch({ type: 'SET_NAME', payload: name })}
          />

          <Text style={{ color: 'red', marginBottom: -10 }}>*</Text>
          <Input
            containerStyle={{ marginTop: -10 }}
            placeholder="Description"
            clearButtonMode="never"
            autoCorrect={false}
            autoFocus
            keyboardType="default"
            onChangeText={description =>
              dispatch({ type: 'SET_DESCRIPTION', payload: description })
            }
          />

          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: wp('1%'),
              opacity: 0.5,
              fontSize: 17,
              marginTop: 10,
            }}>
            Kickout meter
          </Text>
          <View style={{ marginLeft: wp('1%'), width: '100%' }}>
            <Slider
              thumbTintColor="rgb(244, 2, 87)"
              style={{ width: '90%' }}
              step={1}
              maximumValue={10}
              animateTransitions={true}
              value={state.kickout}
              onValueChange={value =>
                dispatch({ type: 'SET_KICKOUT_LEVEL', payload: value })
              }
            />
          </View>

          {/* <ButtonGroup
            // onPress={this.updateStreetSpotType}
            selectedIndex={streetSpotType}
            buttons={streetSpotTypebuttons}
            containerStyle={{ height: 100 }}
            selectedButtonStyle={{ backgroundColor: 'rgb(244, 2, 87)' }}
          /> */}

          <View>
            <Button
              title="Submit"
              buttonStyle={styles.submitButton}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
  },
  imageBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoBox: {
    width: wp('21%'),
    height: wp('21%'),
    backgroundColor: 'grey',
    borderWidth: 5,
    borderColor: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  spotLocationButton: {
    width: wp('36.5'),
    backgroundColor: 'rgb(244, 2, 87)',
  },
  spotLocationSelected: {
    width: wp('30%'),
    marginLeft: wp('2'),
    backgroundColor: 'rgb(52, 235, 131)',
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
  buttonGroup: {
    height: 100,
    marginBottom: 0,
    marginTop: 0,
  },
});

export default NewSpotPage;
