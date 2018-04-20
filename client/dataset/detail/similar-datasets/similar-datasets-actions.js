import {fetchJsonCallback} from "../../../services/http-request";

export const FETCH_SIMILAR_REQUEST = "FETCH_SIMILAR_REQUEST";
export const FETCH_SIMILAR_SUCCESS = "FETCH_SIMILAR_SUCCESS";
export const FETCH_SIMILAR_FAILED = "FETCH_SIMILAR_FAILED";

export function fetchSimilarDatasets(iri) {
    // return fetchSimilarDatasetsSuccess(convertResponseToData(responseStub));
    return (dispatch) => {
        dispatch(fetchSimilarDatasetsRequest());
        const url = "/api/v1/resource/semantic/similar-datasets?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertResponseToData(json);
            dispatch(fetchSimilarDatasetsSuccess(data));
        }, (error) => {
            dispatch(fetchSimilarDatasetsFailed(error));
        });
    };
}

function fetchSimilarDatasetsRequest() {
    return {
        "type": FETCH_SIMILAR_REQUEST
    };
}

function convertResponseToData(json) {
    return json.results.bindings.map((binding) => ({
        "@id": binding["dataset"]["value"],
        "title": getOrDefault(binding["title"], "value", ""),
        "publisher": getOrDefault(binding["publisher"], "value", ""),
        "publisherLabel": getOrDefault(binding["publisherLabel"], "value", "")
    }));
}

function getOrDefault(value, predicate, defaultValue){
    if (value === undefined) {
        return defaultValue;
    } else {
        return value[predicate];
    }
}

function fetchSimilarDatasetsSuccess(data) {
    return {
        "type": FETCH_SIMILAR_SUCCESS,
        "data": data
    };
}

function fetchSimilarDatasetsFailed(error) {
    return {
        "type": FETCH_SIMILAR_FAILED,
        "error": error
    };
}
