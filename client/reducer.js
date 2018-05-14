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
import {reducer as semanticDetail} from "./semantic/detail";
import {reducer as objectDetail} from "./semantic/detail/object-detail";
import {reducer as labels} from "./services/labels";
import {reducer as propertyDetail} from "./semantic/detail/property-detail";
import {reducer as relationshipDetail} from "./semantic/detail/relationship-detail";

// http://redux.js.org/docs/api/combineReducers.html
const reducers = combineReducers({
    "routing": routerReducer,
    "notifications": notificationReducer,
    // TODO Update for new reducer styles.
    "dataset": combineReducers({
        "list": datasetListReducer,
        "detail": datasetDetailReducer
    }),
    "organisation": combineReducers({
        "list": organisationListReducer
    }),
    "keywords": keywordsTagCloudReducer,
    [loadingIndicator.name]: loadingIndicator.reducer,
    [similarDataset.name]: similarDataset.reducer,
    [skosConcept.name]: skosConcept.reducer,
    [semanticDetail.name]: semanticDetail.reducer,
    [objectDetail.name]: objectDetail.reducer,
    [labels.name]: labels.reducer,
    [propertyDetail.name]: propertyDetail.reducer,
    [relationshipDetail.name] : relationshipDetail.reducer
});

export default reducers;
