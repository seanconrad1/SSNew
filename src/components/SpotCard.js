import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableWithoutFeedback,
  Share,
  Alert,
} from 'react-native';
import { Icon, Card, Divider } from 'react-native-elements';
import { findDistance } from '../utils/helpers';

const SpotCard = ({ spot, navigation }) => {
  const [distanceFrom, setDistanceFrom] = useState('');

  findDistance(setDistanceFrom, spot);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${spot.name}`,
        url: `http://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteSpot = id => {
    // delete spot
  };

  const deleteAlertMsg = id => {
    Alert.alert(
      'Deleting spot',
      'Are you sure you want to delete this spot?',
      [
        { text: 'Yes', onPress: () => deleteSpot(id) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('SpotPage', {
          skatespot: spot,
        });
      }}>
      <Card
        key={spot.id}
        title={spot.name}
        image={require('../../assets/wollenberg.jpg')}
        containerStyle={styles.spot}>
        <Text
          style={{
            marginBottom: 40,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Text style={{ fontWeight: 'bold' }}>About: </Text>
          <Text>{spot.description}</Text>
          <Text style={{ fontWeight: 'bold' }}>Distance: </Text>
          {distanceFrom && <Text>{distanceFrom.toFixed(2)}mi</Text>}
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.iconContainer}>
          <Icon
            raised
            name="directions"
            size={17}
            type="material-community"
            color="black"
            onPress={() =>
              Linking.openURL(
                `http://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}`,
              )
            }
          />
          <Icon
            raised
            name="trash"
            type="font-awesome"
            size={17}
            color="rgb(244, 2, 87)"
            onPress={() => deleteAlertMsg(spot.id)}
          />
          <Icon
            raised
            name="share"
            type="material-community"
            size={17}
            color="rgb(244, 2, 87)"
            onPress={() => onShare(spot)}
          />
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  spot: {
    padding: 0,
    borderRadius: 20,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // lastSpot: {
  //   paddingBottom: 100,
  //   borderRadius: 20,
  //   shadowOpacity: 0.75,
  //   shadowRadius: 3,
  //   shadowColor: 'grey',
  //   shadowOffset: { height: 1, width: 1 },
  // },
});

export default SpotCard;
