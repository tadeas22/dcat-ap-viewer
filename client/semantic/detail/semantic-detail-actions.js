import {fetchJsonCallback} from "../../services/http-request";
import {RDF, DCTERMS, SKOS, SSP} from "../../services/vocabulary";
import {graph, triples} from "../../services/jsonld";
import {
    addLoaderStatusOn,
    addLoaderStatusOff
} from "../../components/loading-indicator";
import {
    FETCH_SIMILAR_REQUEST,
    FETCH_SIMILAR_SUCCESS
} from "../../dataset/detail/similar-datasets/similar-datasets-actions";

export const FETCH_SSP_REQUEST = "FETCH_SSP_REQUEST";
export const FETCH_SSP_SUCCESS = "FETCH_SSP_SUCCESS";

export const FETCH_ANNOTATED_DATASET_REQUEST =
    "FETCH_ANNOTATED_DATASET_REQUEST";
export const FETCH_ANNOTATED_DATASET_SUCCESS =
    "FETCH_ANNOTATED_DATASET_SUCCESS";

export function fetchSsp(iri) {
    return (dispatch) => {
        dispatch(fetchSspRequest(iri));
        const url = "/api/v1/resource/semantic/concept-detail?iri=" + encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertData(json);
            dispatch(fetchSspSuccess(iri, data));
        }, (error) => {
            // TODO Add error handling.
        });
    };
}

function convertData(jsonld) {
    if (jsonld === undefined) {
        return undefined;
    }
    const concept = graph.getByType(jsonld, SKOS.Concept);
    return {
        "@id": triples.id(concept),
        "@types": triples.type(concept),
        "label": triples.string(concept, SKOS.prefLabel),
        "inScheme": triples.resources(concept, SKOS.inScheme),
        "conformsTo": triples.resources(concept, DCTERMS.conformsTo),
        "glossary": convertGlossary(jsonld)
    }
}

function convertGlossary(jsonld) {
    const glossary = graph.getByType(jsonld, SSP.Glosar);
    if (glossary === undefined) {
        return {};
    }
    return {
        "@id": triples.id(glossary),
        "label": triples.string(glossary, RDF.label),
    }
}

function fetchSspRequest(iri) {
    return addLoaderStatusOn({
        "type": FETCH_SSP_REQUEST,
        "iri": iri
    });
}

function fetchSspSuccess(iri, data) {
    return addLoaderStatusOff({
        "type": FETCH_SSP_SUCCESS,
        "iri": iri,
        "data": data
    });
}


export function fetchAnnotatedDatasets(iri) {
    return (dispatch) => {
        dispatch(fetchAnnotatedDatasetsRequest());
        const url = "/api/v1/resource/semantic/annotated-datasets?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertResponseToData(json);
            dispatch(fetchAnnotatedDatasetsSuccess(data));
        }, (error) => {
            // TODO Error handling.
        });
    };
}

function fetchAnnotatedDatasetsRequest() {
    return {
        "type": FETCH_ANNOTATED_DATASET_REQUEST
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

function getOrDefault(value, predicate, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    } else {
        return value[predicate];
    }
}

function fetchAnnotatedDatasetsSuccess(data) {
    return {
        "type": FETCH_ANNOTATED_DATASET_SUCCESS,
        "data": data
    };
}