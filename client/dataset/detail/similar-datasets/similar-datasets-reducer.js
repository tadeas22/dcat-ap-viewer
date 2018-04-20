import {
    FETCH_SIMILAR_REQUEST,
    FETCH_SIMILAR_SUCCESS
} from "./similar-datasets-actions";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../../../services/http-request";

// TODO Add support for clean up.

const reducerName = "similar-datasets";

const initialState = {
    "status": STATUS_INITIAL,
    "data": []
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SIMILAR_REQUEST:
            return onSimilarDatasetRequest(state, action);
        case FETCH_SIMILAR_SUCCESS:
            return onSimilarDatasetSuccess(state, action);
        default:
            return state
    }
}

export default reducer = {
    "name": reducerName,
    "reducer": reducer
};


function onSimilarDatasetRequest(state, action) {
    return {
        "status": STATUS_FETCHING,
        "data": []
    };
}

function onSimilarDatasetSuccess(state, action) {
    return {
        "status": STATUS_FETCHED,
        "data": action.data
    };
}

const reducerSelector = (state) => state[reducerName];

export function similarSelector(state) {
    return reducerSelector(state);
}

