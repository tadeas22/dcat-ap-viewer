import {
    FETCH_CONCEPT_REQUEST,
    FETCH_CONCEPT_SUCCESS,
    CONCEPT_COMPONENT_UNMOUNT
} from "./skos-concept-action";
import {
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../../../services/http-request";


// TODO Filter concepts here instead of components.

const reducerName = "skos-concepts";

const initialState = {};

function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CONCEPT_REQUEST:
            return onConceptFetchRequest(state, action);
        case FETCH_CONCEPT_SUCCESS:
            return onConceptFetchSuccess(state, action);
        case CONCEPT_COMPONENT_UNMOUNT:
            return {};
        default:
            return state
    }
}

export default reducer = {
    "name": reducerName,
    "reducer": reducer
};

function onConceptFetchRequest(state, action) {
    return {
        ...state,
        [action.iri]: {
            "status": STATUS_FETCHING,
            "data": []
        }
    };
}

function onConceptFetchSuccess(state, action) {
    return {
        ...state,
        [action.iri]: {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

const reducerSelector = (state) => state[reducerName];

export function conceptsSelector(state) {
    return reducerSelector(state);
}

