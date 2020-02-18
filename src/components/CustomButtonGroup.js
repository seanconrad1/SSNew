import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CustomButtonGroup = ({ button }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  console.log('GETINGN HERE?/');

  const handleOnClick = () => {
    // if (selectedItems.includes(button)) {
    //   setSelectedItems(selectedItems.filter(i => i !== button));
    // } else {
    setSelectedItems([...selectedItems, button]);
    // }
  };

  console.log(selectedItems);

  return (
    <TouchableOpacity onPress={handleOnClick} style={styles.button}>
      <Text style={styles.buttonText}>{button}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    width: wp('29.5%'),
    height: 50,
    color: 'blue',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 5,
  },
  buttonText: {
    color: 'black',
  },
});

export default CustomButtonGroup;
