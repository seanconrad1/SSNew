import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, AsyncStorage } from 'react-native';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NEW_BOOKMARK_MUTATION from '../graphql/mutations/newBookmarkMutation';
import DELETE_BOOKMARK_MUTATION from '../graphql/mutations/deleteBookmarkMutation';

import GET_BOOKMARKS from '../graphql/queries/getBookmarks';

const BookmarkButton = ({ spot }) => {
  const [bookmarked, setBookmark] = useState(false);
  const [user_id, setUserID] = useState();

  useEffect(() => {
    const getID = async () => {
      const id = await AsyncStorage.getItem('USER_ID');
      setUserID(id);
    };

    getID();
  }, []);

  console.log(user_id);

  const {
    loading: loading2,
    error: error2,
    data: bookmarks,
    refetch,
  } = useQuery(GET_BOOKMARKS, {
    variables: { user_id },
  });

  const [createBookmark] = useMutation(NEW_BOOKMARK_MUTATION, {
    variables: {
      bookmarkInput: {
        user_id,
        spot_id: spot._id,
      },
    },
    onCompleted: refetch,
    awaitRefetchQueries: true,
  });
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK_MUTATION, {
    variables: {
      bookmarkInput: {
        user_id: user_id,
        spot_id: spot._id,
      },
    },
    onCompleted: refetch,
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    console.log('useEffect running');
    checkIfUserBookmarkedSpot();
  }, [checkIfUserBookmarkedSpot, bookmarks]);

  const checkIfUserBookmarkedSpot = useCallback(() => {
    console.log('CHECKING!');
    if (bookmarks && !loading2) {
      const isBookmarked = bookmarks.getUser.bookmarks.find(
        bmark => bmark._id === spot._id,
      );
      if (isBookmarked) {
        setBookmark(true);
      } else {
        setBookmark(false);
      }
      return null;
    }
  }, [bookmarks, loading2, spot._id]);

  const bookmarkSpot = async () => {
    await createBookmark();
    checkIfUserBookmarkedSpot();
  };

  const unBookmarkSpot = async () => {
    await deleteBookmark();
    checkIfUserBookmarkedSpot();
  };
  if (bookmarks) {
    console.log('MY BOOKMARKS:', bookmarks.getUser.bookmarks);
  }

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
