import React, { useState, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NEW_BOOKMARK_MUTATION from '../graphql/mutations/newBookmarkMutation';
import { store } from '../../store';

const BookmarkButton = ({ spot }) => {
  const [bookmarked, setBookmark] = useState(false);
  const [createBookmark, loading, error] = useMutation(NEW_BOOKMARK_MUTATION);
  const globalState = useContext(store);

  // const [spotID, setSpotID] = useState(item._id);
  // currentUserid: this.props.user.user.id,

  // const checkIfUserBookmarkedSpot = () => {
  //   // debugger
  //   const data = this.props.user.user ? this.props.user.user.bookmarks : null;
  //   if (data !== null) {
  //     const bookmarked = data.find(
  //       bookmarks => bookmarks.skate_spot_id === this.state.spotID,
  //     );
  //     if (bookmarked) {
  //       return this.setState({
  //         bookmarked: true,
  //         currentBookmarkid: bookmarked.id,
  //       });
  //     }
  //     return null;
  //   }
  // };

  const bookmarkSpot = () => {
    createBookmark({
      // refetchQueries: ['']
      variables: {
        bookmarkInput: {
          user_id: globalState.state.user_id,
          spot_id: spot._id,
        },
      },
    });
    console.log('bookmark spot!');
  };

  const unBookmarkSpot = () => {
    // debugger
  };

  return (
    <TouchableOpacity style={{ position: 'absolute', zIndex: 1 }}>
      {!bookmarked ? (
        <Icon
          raised
          containerStyle={{
            position: 'absolute',
            marginLeft: wp('80%'),
            marginTop: hp('1%'),
          }}
          name="bookmark"
          size={15}
          type="font-awesome"
          color="black"
          onPress={bookmarkSpot}
        />
      ) : (
        <Icon
          raised
          containerStyle={{
            position: 'absolute',
            marginLeft: wp('80%'),
            marginTop: hp('1%'),
          }}
          name="bookmark"
          size={15}
          type="font-awesome"
          color="rgb(244, 2, 87)"
          onPress={unBookmarkSpot}
        />
      )}
    </TouchableOpacity>
  );
};

export default BookmarkButton;
