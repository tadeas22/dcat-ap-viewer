import {
    FETCH_DATASET_REQUEST,
    FETCH_DATASET_SUCCESS,
    FETCH_DATASET_FAILED,
    FETCH_DISTRIBUTION_REQUEST,
    FETCH_DISTRIBUTION_SUCCESS,
    FETCH_DISTRIBUTION_FAILED,
    SET_DISTRIBUTION_PAGE_INDEX,
    SET_DISTRIBUTION_PAGE_SIZE
} from "./dataset-detail-actions";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../../services/http-request";

const initialState = {
    // TODO Extract UI to another reducer.
    "ui": {
        "distributionsPageIndex": 0,
        "distributionsPageSize": 10
    },
    "dataset": {
        // TODO Change to entity, so status is not mixed with other properties.
        "status": STATUS_INITIAL
    },
    "distributions": {},
};

// TODO Extract state transforming functions.
export const datasetDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DATASET_REQUEST:
            return onDatasetRequest(state, action);
        case FETCH_DATASET_SUCCESS:
            return onDatasetRequestSuccess(state, action);
        case FETCH_DATASET_FAILED:
            return onDatasetRequestFailed(state, action);
        case FETCH_DISTRIBUTION_REQUEST:
            return onDistributionRequest(state, action);
        case FETCH_DISTRIBUTION_SUCCESS:
            return onDistributionRequestSuccess(state, action);
        case FETCH_DISTRIBUTION_FAILED:
            return onDistributionRequestFailed(state, action);
        case SET_DISTRIBUTION_PAGE_INDEX:
            return onSetDistributionPage(state, action);
        case SET_DISTRIBUTION_PAGE_SIZE:
            return onSetDistributionPageSize(state, action);
        default:
            return state
    }
};

function onDatasetRequest(state, action) {
    return {
        ...state,
        "dataset": {
            "@id": action.iri,
            "status": STATUS_FETCHING
        }
    };
}

function onDatasetRequestSuccess(state, action) {
    return {
        ...state,
        "dataset": {
            ...action.data,
            "status": STATUS_FETCHED
        }
    };
}

function onDatasetRequestFailed(state, action) {
    return {
        ...state,
        "dataset": {
            ...action.data,
            "status": action.error.status
        }
    };
}

function onDistributionRequest(state, action) {
    return {
        ...state,
        "distributions": copyAndAdd(state.distributions, action.iri, {
            ...action.data,
            "status": STATUS_FETCHING
        })
    };
}

function copyAndAdd(dictionary, key, item) {
    const copy = {...dictionary};
    copy[key] = item;
    return copy;
}

function onDistributionRequestSuccess(state, action) {
    return {
        ...state,
        "distributions": copyAndAdd(state.distributions, action.iri,
            {
                ...action.data,
                "status": STATUS_FETCHED
            })
    };
}

function onDistributionRequestFailed(state, action) {
    return {
        ...state,
        "distributions": copyAndAdd(state.distributions, action.iri,
            {
                "status": action.error.status
            })
    };
}

function onSetDistributionPage(state, action) {
    return {
        ...state,
        "ui": {
            ...state.ui,
            "distributionsPageIndex": action.page
        }
    };
}

function onSetDistributionPageSize(state, action) {
    return {
        ...state,
        "ui": {
            ...state.ui,
            "distributionsPageIndex": 0,
            "distributionsPageSize": action.size
        }
    };
}

// TODO Add selectors.

const selector = (state) => state["dataset"]["detail"];

export function themesSelector(state) {
    const dataset = selector(state).dataset;
    if (dataset === undefined ||
        dataset["themes"] === undefined) {
        return [];
    }
    // TODO Add implementation.
    return dataset["themes"].map((theme) => theme["@id"]);
}
