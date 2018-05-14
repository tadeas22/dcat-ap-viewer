import {
    FETCH_OBJECT_DETAIL_REQUEST,
    FETCH_OBJECT_DETAIL_SUCCESS,
    OBJECT_DETAIL_UNMOUNT
} from "./object-detail-action";
import {
    STATUS_FETCHING,
    STATUS_FETCHED,
    STATUS_INITIAL
} from "./../../../services/http-request";


const reducerName = "object-detail";

const initialState = {
    "status": STATUS_INITIAL
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_OBJECT_DETAIL_REQUEST:
            return onObjectDetailFetchRequest(state, action);
        case FETCH_OBJECT_DETAIL_SUCCESS:
            return onObjectDetailFetchSuccess(state, action);
        case OBJECT_DETAIL_UNMOUNT:
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

function onObjectDetailFetchRequest(state, action) {
    return {
        "status": STATUS_FETCHING,
        "data": undefined
    };
}

function onObjectDetailFetchSuccess(state, action) {
    return {
        "status": STATUS_FETCHED,
        "data": action.data
    };
}

const reducerSelector = (state) => state[reducerName];

export function dataSelector(state) {
    return reducerSelector(state);
}

