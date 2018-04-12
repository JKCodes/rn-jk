import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        dispatch(uiStartLoading());
        fetch("https://us-central1-awesome-places-fc696.cloudfunctions.net/storeImage", {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            })
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong. Please try again");
            dispatch(uiStopLoading());
        })
        .then(res => res.json())
        .then(parsedRes => {
            const placeData = {
                name: placeName,
                location: location,
                image: parsedRes.imageUrl
            };
            return fetch("https://awesome-places-fc696.firebaseio.com/places.json", {
                method: "POST",
                body: JSON.stringify(placeData)
            })
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong. Please try again");
            dispatch(uiStopLoading());
        })
        .then(res => res.json())
        .then(parsedRes => {
            dispatch(uiStopLoading());
        })
        .catch(err => {
            console.log(err);
            alert("Unexpected error has occurred.  Please try again.");
            dispatch(uiStopLoading());
        });
    };
};

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(removePlace(key));
        fetch("https://awesome-places-fc696.firebaseio.com/places/" + key + ".json", {
            method: "DELETE"
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong.  Please try again.");
            dispatch(uiStopLoading());
        })
        .then(res=> res.json())
        .then(parsedRes => {
            console.log("done")
        })
        .catch(err => {
            console.log(err);
            alert("Unexpected error has occurred.  Please try again.");
            dispatch(uiStopLoading());
        });
    };
};

export const getPlaces = () => {
    return dispatch => {
        fetch("https://awesome-places-fc696.firebaseio.com/places.json")
        .catch(err => {
            alert("Something went wrong. ")
        })
        .then(res => res.json())
        .then(parsedRes => {
            const places = [];
            for (let key in parsedRes) {
                places.push({
                    ...parsedRes[key],
                    image: {
                        uri: parsedRes[key].image
                    },
                    key: key
                });
            }
            dispatch(setPlaces(places));
        });
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    };
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};