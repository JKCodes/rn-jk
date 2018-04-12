import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        let authToken;
        dispatch(uiStartLoading());
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid token");
        })
        .then(token => {
            authToken = token;
            return fetch("https://us-central1-awesome-places-fc696.cloudfunctions.net/storeImage", {
                method: "POST",
                body: JSON.stringify({
                    image: image.base64
                }),
                headers: {
                    "Authorization": "Bearer " + authToken
                }
            });
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
            return fetch("https://awesome-places-fc696.firebaseio.com/places.json?auth=" + authToken, {
                method: "POST",
                body: JSON.stringify(placeData)
            })
        })
        .then(res => res.json())
        .then(parsedRes => {
            alert(JSON.stringify(parsedRes));
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
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid token");
        })
        .then(token => {
            dispatch(removePlace(key));
            return fetch("https://awesome-places-fc696.firebaseio.com/places/" + key + ".json?auth=" + token, {
                method: "DELETE"
            })
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
        dispatch(authGetToken())
        .catch(() => {
            alert("No valid token");
        })
        .then(token => {
            return fetch("https://awesome-places-fc696.firebaseio.com/places.json?auth=" + token);

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
        })
        .catch(err => {
            alert("Something went wrong. " + err);
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