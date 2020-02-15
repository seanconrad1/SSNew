export const spotBookState = {
  mySpots: [],
  bookmarkedSpots: [],
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_SPOTS':
      return { ...state, mySpots: action.payload };
    case 'SET_BOOKMARKS':
      return { ...state, bookmarkedSpots: action.payload };

    default:
      throw new Error();
  }
}
