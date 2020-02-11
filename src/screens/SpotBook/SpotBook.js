import React, { useState, useContext, useReducer, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  RefreshControl,
  Share,
} from 'react-native';
import { Header, Icon, Card, Button, Divider } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js';
import GET_MY_SPOTS from '../../graphql/queries/getMySpots';
import { useQuery } from '@apollo/react-hooks';
import { store } from '../../../store';
import { reducer, spotBookState } from './reducer';
import SpotCard from '../../components/SpotCard';
import SpotsButtonGroup from '../../components/SpotsButtonGroup';

console.disableYellowBox = true;

const SpotBook = props => {
  const globalState = useContext(store);
  const [state, dispatch] = useReducer(reducer, spotBookState);
  const user_id = globalState.state.user_id;
  const { loading, error, data } = useQuery(GET_MY_SPOTS, {
    variables: { user_id },
  });
  const [tab, setTab] = useState(0);
  const [term, setTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_SPOTS', payload: data.getUserCreatedSpots });
    }
  }, [data]);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    console.log('Error retrieving data');
    return <Text>An error occured</Text>;
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.user.user.skate_spots !== this.props.user.user.skate_spots) {
  //     const bookmarks = this.props.user.user.skate_spots.reverse();
  //     let submitted = this.props.user.skate_spots.filter(
  //       spot => spot.user_id === this.props.user.user.id
  //     );
  //     submitted = submitted.reverse();

  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState({ bookmarkedSpots: bookmarks, submittedSpots: submitted });
  //   }
  // }

  const onRefresh = () => {
    console.log('REFRESHING');
    setRefreshing(true);

    setRefreshing(false);
  };

  const onSearchChange = e => setTerm(e);

  const onChangeTab = e => setTab(e);

  // unBookmark = id => {
  //   console.log('BOOkMARK ID?', id);
  //   const bookMarkObjects = this.props.user.user.bookmarks;
  //   const obj = bookMarkObjects.filter(bookmark => bookmark.skate_spot_id === id);
  //   const bookmarkID = obj[0].id;

  //   const fetchToUnbookmarkSpot = key => {
  //     fetch(`http://${environment.BASE_URL}/api/v1/bookmarks/${bookmarkID}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${key}`,
  //       },
  //     })
  //       .then(r => r.json())
  //       .then(response =>
  //         this.setState({
  //           bookmarkedSpots: this.state.bookmarkedSpots.filter(bookmark => bookmark.id !== id),
  //         })
  //       );
  //   };

  //   deviceStorage.loadJWT('jwt').then(val => fetchToUnbookmarkSpot(val));
  // };

  // unBookmarkAlertMsg = id => {
  //   Alert.alert(
  //     'Unbookmarking spot',
  //     'Are you sure you want to unbookmark this spot?',
  //     [
  //       { text: 'Yes', onPress: () => this.unBookmark(id) },
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };

  return (
    <View>
      <Header
        leftComponent={{
          icon: 'menu',
          color: 'black',
          onPress: () => props.navigation.openDrawer(),
        }}
        centerComponent={{
          text: 'My Spots',
          style: { color: 'black', fontSize: 25, fontFamily: 'Lobster' },
        }}
        backgroundColor="white"
      />

      <TextInput
        style={styles.search}
        placeholder="Search"
        returnKeyType="search"
        onChangeText={value => onSearchChange(value)}
      />

      <SpotsButtonGroup onChangeTab={onChangeTab} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {tab === 0
          ? state.mySpots.map((spot, i) => (
              <SpotCard key={i} spot={spot} navigation={props.navigation} />
            ))
          : null}
      </ScrollView>
    </View>
  );
};

export default SpotBook;

const styles = StyleSheet.create({
  search: {
    marginLeft: wp('10%'),
    borderColor: 'black',
    borderRadius: 30,
    width: wp('100%'),
    height: hp('5%'),
    marginBottom: '1%',
    fontSize: 20,
  },
  unBookmarkButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: hp('5.5'),
    width: wp('30%'),
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    padding: 0,
  },
});
