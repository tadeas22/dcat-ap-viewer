import {fetchJsonCallback} from "../../../services/http-request";
import {DCTERMS} from "../../../services/vocabulary";

export const FETCH_SIMILAR_REQUEST = "FETCH_SIMILAR_REQUEST";
export const FETCH_SIMILAR_SUCCESS = "FETCH_SIMILAR_SUCCESS";
export const FETCH_SIMILAR_FAILED = "FETCH_SIMILAR_FAILED";

export function fetchSimilarDatasets(iri) {
    return (dispatch) => {
        dispatch(fetchSimilarDatasetsRequest());
        const url = "/api/v1/semantic/similar-datasets?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertResponseToData(json);
            const jsonld = convertResponseToJsonLd(json);
            dispatch(fetchSimilarDatasetsSuccess(data, jsonld));
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
        "publisher": getOrDefault(binding["publisher"], "value", "")
    }));
}

function convertResponseToJsonLd(json) {
    const entries = [];

    json.results.bindings.map((binding) => {
        const title = getOrDefault(binding["title"], "value", "");
        entries.push({
            "@id": binding["dataset"]["value"],
            [DCTERMS.title]: title
        });
        const publisher = getOrDefault(binding["publisher"], "value", "");
        const publisherLabel = getOrDefault(binding["publisherLabel"], "value", "");
        if (publisher !== undefined && publisherLabel !== undefined) {
            entries.push({
                "@id": publisher,
                [DCTERMS.title]: publisherLabel
            });
        }
    });

    return {
        "@graph": entries
    }
}

function getOrDefault(value, predicate, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    } else {
        return value[predicate];
    }
}

function fetchSimilarDatasetsSuccess(data, jsonld) {
    return {
        "type": FETCH_SIMILAR_SUCCESS,
        "data": data,
        "jsonld": jsonld
    };
}

function fetchSimilarDatasetsFailed(error) {
    return {
        "type": FETCH_SIMILAR_FAILED,
        "error": error
    };
}
