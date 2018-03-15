import { ADD_PLACE, DELETE_PLACE } from '../actions/actionTypes'

const initialState = {
    places: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLACE:
            return {
                ...state,
                places: state.places.concat({
                    key: Math.random(), 
                    name: action.placeName,
                    image: {
                      uri: "https://upload.wikimedia.org/wikipedia/commons/1/16/Appearance_of_sky_for_weather_forecast%2C_Dhaka%2C_Bangladesh.JPG"
                    }
                })
            };
        case DELETE_PLACE:
            return {
                ...state,
                places: state.places.filter(place => {
                    return place.key !== action.placeKey;
                })
            }
        default:
            return state;
    }
};

export default reducer;