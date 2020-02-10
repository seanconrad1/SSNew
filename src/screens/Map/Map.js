import React, { useEffect, useReducer, useState, useRef } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import { Icon, Button } from 'react-native-elements';
import GET_SPOTS from '../../graphql/queries/getSpots';
import { useQuery } from '@apollo/react-hooks';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import markerIcon from '../../../assets/markerIcon.png';
import { animateToUserLocation, addAnEventListener } from './utils';
import AsyncStorage from '@react-native-community/async-storage';
import { reducer, mapState } from './reducer';

const CARD_WIDTH = wp('95%');

const NewMap = props => {
  const { loading, error, data, fetchMore } = useQuery(GET_SPOTS);
  const [state, dispatch] = useReducer(reducer, mapState);
  const [mapRef, setMapRef] = useState('');
  const [flatlistRef, setFlatListRef] = useState('');
  const [regionTimeout, setRegionTimeout] = useState('');

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      const initReg = {
        initialRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.115,
          longitudeDelta: 0.1121,
        },
        geoLocationSwitch: true,
      };

      dispatch({ type: 'SET_INIT_LOCATION', payload: initReg });
    });
  }, []);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_SPOTS', payload: data.getSpots });
    }
  }, [data]);

  // This is the function to scroll
  // to the end of the spots when a new spot is created
  useEffect(() => {
    // this.scrollToNewSpot();
  }, [props.navigation]);

  useEffect(() => {
    // filter to show only spots near initial starting point
    if (state.updateCounter <= 0) {
      const area = 0.5;
      // if (state.initialRegion && state.initialRegion.latitude > 0.1) {
      //   const filteredSpots = nextProps.user.skate_spots.filter(
      //     spot =>
      //       spot.latitude < state.initialRegion.latitude + area &&
      //       spot.latitude > state.initialRegion.latitude - area &&
      //       spot.longitude < state.initialRegion.longitude + area &&
      //       spot.longitude > state.initialRegion.longitude - area &&
      //       spot.approved === true,
      //   );
      //   dispatch({ type: 'SET_SPOTS', payload: filteredSpots });
      // }
      // Animate to spot
      // addAnEventListener();
      dispatch({ type: 'UPDATE_COUNTER', payload: 1 });
    }
  }, [mapRef, state.initialRegion, state.updateCounter]);

  // const addAnEventListener = () => {
  //   state.animation.addListener(({ value }) => {
  //     let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
  //     if (index >= state.filteredSpots.length) {
  //       index = state.filteredSpots.length - 1;
  //     }
  //     if (index <= 0) {
  //       index = 0;
  //     }

  //     clearTimeout(regionTimeout);
  //     setRegionTimeout(
  //       setTimeout(() => {
  //         if (state.index !== index) {
  //           state.index = index;
  //           mapRef.animateToRegion(
  //             {
  //               latitude: state.filteredSpots[index].latitude,
  //               longitude: state.filteredSpots[index].longitude,
  //               latitudeDelta: state.region.latitudeDelta,
  //               longitudeDelta: state.region.longitudeDelta,
  //             },
  //             350,
  //           );
  //         }
  //       }, 10),
  //     );
  //   });
  // };

  const onRegionChange = region => {
    dispatch({ type: 'SET_CURRENT_REGION', payload: region });
  };

  const goToSpotPage = marker => {
    props.navigation.navigate('SpotPage', { skatespot: marker });
  };

  const onMarkerPressHandler = (marker, index) => {
    flatlistRef.getNode().scrollToIndex({ index });
  };

  const scrollToNewSpot = () => {
    // this.props.getSkateSpots();
    // setTimeout(this.myRef.getNode().scrollToEnd, 500);
    flatlistRef.getNode().scrollToEnd();
  };

  const refreshMarkers = () => {
    state.animation.removeAllListeners();

    // const setAnimatorListener = () => {
    //   state.animation.addListener(({ value }) => {
    //     let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    //     if (index >= this.state.filteredSpots.length) {
    //       index = this.state.filteredSpots.length - 1;
    //     }
    //     if (index <= 0) {
    //       index = 0;
    //     }
    //     clearTimeout(this.regionTimeout);
    //     this.regionTimeout = setTimeout(() => {
    //       if (this.index !== index) {
    //         this.index = index;
    //         this.map.animateToRegion(
    //           {
    //             latitude: this.state.filteredSpots[index].latitude,
    //             longitude: this.state.filteredSpots[index].longitude,
    //             latitudeDelta: this.state.region.latitudeDelta,
    //             longitudeDelta: this.state.region.longitudeDelta,
    //           },
    //           350,
    //         );
    //       }
    //     }, 10);
    //   });
    // };
    // const area = 0.5;
    // if (
    //   state.currentRegion &&
    //   state.currentRegion.latitude > 0.1 &&
    //   props.user.skate_spots !== undefined
    // ) {
    //   console.log(state.currentRegion.latitude, state.currentRegion.longitude);
    //   const filteredSpots = this.props.user.skate_spots.filter(
    //     spot =>
    //       spot.latitude < this.state.currentRegion.latitude + area &&
    //       spot.latitude > this.state.currentRegion.latitude - area &&
    //       spot.longitude < this.state.currentRegion.longitude + area &&
    //       spot.longitude > this.state.currentRegion.longitude - area &&
    //       spot.approved === true,
    //   );
    //   // this.setState({filteredSpots: filteredSpots})
    //   this.setState({ filteredSpots }, () => {
    //     setAnimatorListener();
    //   });
    // }
  };

  const interpolations = state.filteredSpots
    ? state.filteredSpots.map((marker, index) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          (index + 1) * CARD_WIDTH,
        ];
        const scale = state.animation.interpolate({
          inputRange,
          outputRange: [1, 2.5, 1],
          extrapolate: 'clamp',
        });
        const opacity = state.animation.interpolate({
          inputRange,
          outputRange: [10, 1, 10],
          extrapolate: 'clamp',
        });
        return { scale, opacity };
      })
    : null;

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: 'blue' }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return <Text>Error! {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation
        onMapReady={() => console.log('ready!')}
        ref={map => setMapRef(map)}
        initialRegion={state.initialRegion}
        style={{ flex: 1 }}
        // region={this.state.region}
        showsMyLocationButton
        onRegionChange={onRegionChange}>
        {state.filteredSpots.length > 0
          ? state.filteredSpots.map((marker, index) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };
              const opacityStyle = {
                opacity: interpolations[index].opacity,
              };
              return (
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: Number(marker.location.latitude),
                    longitude: Number(marker.location.longitude),
                  }}
                  title={marker.name}
                  description={marker.description}
                  style={{ width: 40, height: 40 }}
                  onPress={e => {
                    e.stopPropagation();
                    onMarkerPressHandler(marker, index);
                  }}>
                  <Animated.View style={[styles.markerWrap, opacityStyle]}>
                    <Animated.View style={[styles.marker, scaleStyle]}>
                      <Image source={markerIcon} style={styles.marker} />
                    </Animated.View>
                  </Animated.View>
                </MapView.Marker>
              );
            })
          : null}
      </MapView>

      <Callout>
        <View>
          <View>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
              <Icon
                raised
                name="bars"
                size={17}
                type="font-awesome"
                containerStyle={styles.drawerButtonContainer}
                color="rgb(244, 2, 87)"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () =>
                await AsyncStorage.setItem('AUTH_TOKEN', '')
              }>
              <Icon
                raised
                name="plus"
                size={20}
                type="font-awesome"
                containerStyle={styles.addSpotButtonContainer}
                color="rgb(244, 2, 87)"
              />
            </TouchableOpacity>
          </View>

          {/* <Button
            raised
            icon={{
              name: 'refresh',
              size: 18,
              color: 'rgb(244, 2, 87)',
              type: 'font-awesome',
              marginLeft: 5,
            }}
            title="Search this area"
            containerStyle={styles.refreshContainer}
            buttonStyle={styles.refreshButtonStyle}
            titleStyle={styles.refreshButtonTitle}
            onPress={fetchMore({
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) {
                  return prev;
                }
                console.log('HAT ARE FETCHMORE RESULTS', fetchMoreResult);
                return {
                  ...fetchMoreResult,
                  getSpots: {
                    ...fetchMoreResult.getSpots,
                  },
                };
              },
            })}
          /> */}

          <TouchableOpacity onPress={() => animateToUserLocation(mapRef)}>
            <Icon
              raised
              name="location-arrow"
              size={20}
              type="font-awesome"
              containerStyle={styles.locationButtonContainer}
              color="rgb(244, 2, 87)"
            />
          </TouchableOpacity>
        </View>
      </Callout>

      <Animated.FlatList
        horizontal
        style={styles.scrollView}
        ref={flatlist => setFlatListRef(flatlist)}
        scrollEventThrottle={1}
        snapToInterval={CARD_WIDTH + 20}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: state.animation,
                },
              },
            },
          ],
          { useNativeDriver: true },
        )}
        data={state.filteredSpots}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => this.goToSpotPage(item)}>
            <View style={styles.card}>
              {/* <Arrow /> */}
              {/* {item !== undefined && (
                  <BookmarkButton
                    spot={item}
                    style={{position: 'absolute', zIndex: 1}}
                  />
                )} */}

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `http://maps.apple.com/?daddr=${item.location.latitude},${item.location.longitude}`,
                  )
                }
                style={{ position: 'absolute', zIndex: 1 }}>
                <Icon
                  raised
                  containerStyle={{
                    position: 'relative',
                    zIndex: 1,
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                  name="directions"
                  size={15}
                  type="material-community"
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.goToSpotPage(item)}>
                {/* <View>
                    {item.avatars[0] ? (
                      <Image
                        style={styles.cardImage}
                        resizeMode="cover"
                        source={{
                          uri: `http://${environment.BASE_URL}${item.avatars[0].url}`,
                        }}
                        onPress={() => this.goToSpotPage(item)}
                      />
                    ) : null}
                  </View> */}
              </TouchableOpacity>
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  scrollView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: -5,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: hp('40%'),
    padding: 10,
    elevation: 1,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  cardImage: {
    position: 'absolute',
    zIndex: 20,
    borderRadius: 20,
    flex: 4,
    width: wp('90%'),
    height: hp('32%'),
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: hp('2%'),
    marginTop: hp('32%'),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    // borderRadius: 4,
    // backgroundColor: "rgba(244, 2, 87, .9)",
  },
  locationButtonContainer: {
    position: 'absolute',
    marginLeft: wp('80%'),
    marginTop: hp('50%'),
  },
  refreshContainer: {
    position: 'absolute',
    paddingTop: 0,
    marginLeft: wp('53%'),
    marginTop: hp('6%'),
  },
  refreshButtonStyle: {
    backgroundColor: 'white',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('20%'),
  },
  refreshButtonTitle: {
    color: 'rgb(244, 2, 87)',
    marginRight: 10,
    fontSize: wp('4'),
  },
  addSpotButtonContainer: {
    position: 'absolute',
    paddingTop: 0,
    marginLeft: wp('3%'),
    marginTop: hp('50%'),
  },
  drawerButtonContainer: {
    position: 'absolute',
    marginLeft: wp('3%'),
    marginTop: hp('5%'),
  },
});

export default NewMap;
