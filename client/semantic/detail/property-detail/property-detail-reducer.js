import {
    FETCH_PROPERTY_DETAIL_REQUEST,
    FETCH_PROPERTY_DETAIL_SUCCESS,
    PROPERTY_DETAIL_UNMOUNT
} from "./property-detail-action";
import {
    STATUS_FETCHING,
    STATUS_FETCHED,
    STATUS_INITIAL
} from "./../../../services/http-request";


const reducerName = "property-detail";

const initialState = {
    "status": STATUS_INITIAL
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_PROPERTY_DETAIL_REQUEST:
            return onPropertyDetailFetchRequest(state, action);
        case FETCH_PROPERTY_DETAIL_SUCCESS:
            return onPropertyDetailFetchSuccess(state, action);
        case PROPERTY_DETAIL_UNMOUNT:
            return {
                "status": STATUS_INITIAL
            };
        default:
            return state
    }
}

export default reducer = {
    "name": reducerName,
    "reducer": reducer
};

function onPropertyDetailFetchRequest(state, action) {
    return {
        "status": STATUS_FETCHING,
        "data": undefined
    };
}

function onPropertyDetailFetchSuccess(state, action) {
    return {
        "status": STATUS_FETCHED,
        "data": action.data
    };
}

const reducerSelector = (state) => state[reducerName];

export function dataSelector(state) {
    return reducerSelector(state);
}

