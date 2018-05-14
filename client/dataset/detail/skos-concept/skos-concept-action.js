import {fetchJsonCallback} from "../../../services/http-request";
import {graph, triples} from "./../../../services/jsonld";
import {SKOS, DCTERMS} from "./../../../services/vocabulary";

export const FETCH_CONCEPT_REQUEST = "FETCH_CONCEPT_REQUEST";
export const FETCH_CONCEPT_SUCCESS = "FETCH_CONCEPT_SUCCESS";
export const CONCEPT_COMPONENT_UNMOUNT = "CONCEPT_COMPONENT_UNMOUNT";

export function fetchSkosConcept(iri) {
    return (dispatch, getState) => {
        // TODO Add support for caching.
        dispatch(fetchSkosConceptRequest(iri));
        const url = "/api/v1/semantic/concept?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertData(json);
            dispatch(fetchSkosConceptSuccess(iri, data, json));
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
        "inScheme": triples.resources(concept, SKOS.inScheme),
        "conformsTo": triples.resources(concept, DCTERMS.conformsTo)
    }
}

function fetchSkosConceptRequest(iri) {
    return {
        "type": FETCH_CONCEPT_REQUEST,
        "iri": iri
    }
}

function fetchSkosConceptSuccess(iri, data, jsonld) {
    return {
        "type": FETCH_CONCEPT_SUCCESS,
        "iri": iri,
        "data": data,
        "jsonld": jsonld
    }
}

export function onComponentUnmount() {
    return {
        "type": CONCEPT_COMPONENT_UNMOUNT
    }
}
