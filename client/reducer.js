import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import {reducer as notificationReducer} from "react-notification-system-redux";
import {datasetListReducer} from "./dataset/list/dataset-list-reducer";
import {datasetDetailReducer} from "./dataset/detail/dataset-detail-reducer";
import {organisationListReducer} from "./organisation/list/organisation-list-reducer";
import {keywordsTagCloudReducer} from "./keyword/tagcloud/keyword-tagloud-reducer"
import {reducer as loadingIndicator} from "./components/loading-indicator"
import {reducer as similarDataset} from "./dataset/detail/similar-datasets";
import {reducer as skosConcept} from "./dataset/detail/skos-concept"

// http://redux.js.org/docs/api/combineReducers.html
const reducers = combineReducers({
    "routing": routerReducer,
    "notifications": notificationReducer,
    "dataset": combineReducers({
        "list": datasetListReducer,
        "detail": datasetDetailReducer
    }),
    "organisation": combineReducers({
        "list": organisationListReducer
    }),
    [loadingIndicator.name] : loadingIndicator.reducer,
    "keywords": keywordsTagCloudReducer,
    [similarDataset.name] : similarDataset.reducer,
    [skosConcept.name] : skosConcept.reducer
});

export default reducers;
