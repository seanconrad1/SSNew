import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icon, Button } from 'react-native-elements';

const CARD_WIDTH = wp('95%');

const MapSpotCard = ({ item }) => {
  const goToSpotPage = () => {
    console.log('test');
  };

  return (
    <TouchableWithoutFeedback onPress={goToSpotPage}>
      <View style={styles.card}>
        {/* <Arrow /> */}
        {/* {item !== undefined && (
        <BookmarkButton
          spot={item}
          style={{ position: 'absolute', zIndex: 1 }}
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

        <TouchableOpacity onPress={goToSpotPage}>
          <View>
            <Image
              style={styles.cardImage}
              resizeMode="cover"
              source={require('../../assets/wollenberg.jpg')}
              onPress={() => goToSpotPage(item)}
            />
          </View>
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
  );
};

const styles = StyleSheet.create({
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
});

export default MapSpotCard;
