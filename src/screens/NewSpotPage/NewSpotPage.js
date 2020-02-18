import React, { useReducer, useEffect, useState, useContext } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  AsyncStorage,
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
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

const NewSpotPage = props => {
  const [state, dispatch] = useReducer(reducer, newSpotState);
  const [createSpot, { data }] = useMutation(NEW_SPOT_MUTATION);
  const [user_id, setUserID] = useState();
  const globalState = useContext(store);

  useEffect(() => {
    const getID = async () => {
      const id = await AsyncStorage.getItem('USER_ID');
      setUserID(id);
    };

    getID();
  }, []);

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

  const resize = photos => {
    ImageResizer.createResizedImage(photos.uri, 350, 280, 'JPEG', 300)
      .then(res => {
        // response.uri is the URI of the new image that can now be displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image
        RNFS.readFile(res.path, 'base64')
          .then(respo => {
            const photo = {
              path: res.path,
              uri: res.uri,
              data: respo,
            };
            if (state.photo && state.photo.length === 4) {
              return null;
            }
            dispatch({ type: 'SET_PHOTO', payload: photo });
          })
          .catch(err => {
            console.log(err);
          });
        // // Limit to 4 photos uploaded
      })
      .catch(err => {
        console.log(err);
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
      });
  };

  const getPhotoFromCameraRoll = () => {
    ImagePicker.showImagePicker(response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        resize(response);

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  };

  const approvalAlert = () => {
    Alert.alert(
      'Thanks for submitting a spot!',
      'Your spot needs to go through approval before being posted. It should be approved within a day.',
      [
        {
          text: 'OK',
          onPress: () =>
            props.navigation.navigate('NavDrawer', { screen: 'Map' }),
        },
      ],
      { cancelable: false },
    );
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
