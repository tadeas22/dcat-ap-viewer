import {
    FETCH_RELATIONSHIP_DETAIL_REQUEST,
    FETCH_RELATIONSHIP_DETAIL_SUCCESS,
    RELATIONSHIP_DETAIL_UNMOUNT
} from "./relationship-detail-action";
import {
    STATUS_FETCHING,
    STATUS_FETCHED,
    STATUS_INITIAL
} from "./../../../services/http-request";


const reducerName = "relationship-detail";

const initialState = {
    "status": STATUS_INITIAL
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_RELATIONSHIP_DETAIL_REQUEST:
            return onRelationshipDetailFetchRequest(state, action);
        case FETCH_RELATIONSHIP_DETAIL_SUCCESS:
            return onRelationshipDetailFetchSuccess(state, action);
        case RELATIONSHIP_DETAIL_UNMOUNT:
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

function onRelationshipDetailFetchRequest(state, action) {
    return {
        "status": STATUS_FETCHING,
        "data": undefined
    };
}

function onRelationshipDetailFetchSuccess(state, action) {
    return {
        "status": STATUS_FETCHED,
        "data": action.data
    };
}

const reducerSelector = (state) => state[reducerName];

export function dataSelector(state) {
    return reducerSelector(state);
}

