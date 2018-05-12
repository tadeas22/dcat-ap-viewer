import {
    FETCH_SSP_REQUEST,
    FETCH_SSP_SUCCESS,
    FETCH_ANNOTATED_DATASET_REQUEST,
    FETCH_ANNOTATED_DATASET_SUCCESS
} from "./semantic-detail-actions";
import {
    STATUS_FETCHED,
    STATUS_FETCHING,
    STATUS_INITIAL
} from "../../services/http-request";

const reducerName = "semantic-detail";

const initialState = {
    "detail": {
        "status": STATUS_INITIAL,
        "data": undefined
    },
    "datasets": {
        "status": STATUS_INITIAL,
        "data": undefined
    }
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SSP_REQUEST:
            return onSspFetchRequest(state, action);
        case FETCH_SSP_SUCCESS:
            return onSspFetchSuccess(state, action);
        case FETCH_ANNOTATED_DATASET_REQUEST:
            return onFetchAnnotatedRequest(state, action);
        case FETCH_ANNOTATED_DATASET_SUCCESS:
            return onFetchAnnotatedSuccess(state, action);
        default:
            return state;
    }
}

export default reducer = {
    "name": reducerName,
    "reducer": reducer
};

const reducerSelector = (state) => state[reducerName];

function onSspFetchRequest(state, action) {
    return {
        ...state,
        "detail": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onSspFetchSuccess(state, action) {
    return {
        ...state,
        "detail": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

function onFetchAnnotatedRequest(state, action) {
    return {
        ...state,
        "datasets": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onFetchAnnotatedSuccess(state, action) {
    return {
        ...state,
        "datasets": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

export function detailSelector(state) {
    return reducerSelector(state).detail;
}

export function datasetSelector(state) {
    return reducerSelector(state).datasets;
}
