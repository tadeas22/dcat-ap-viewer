import {fetchJsonCallback} from "../../../services/http-request";
import {graph, triples} from "./../../../services/jsonld";
import {SKOS, DCTERMS, APP, SSP} from "./../../../services/vocabulary";

export const FETCH_RELATIONSHIP_DETAIL_REQUEST = "FETCH_RELATIONSHIP_DETAIL_REQUEST";
export const FETCH_RELATIONSHIP_DETAIL_SUCCESS = "FETCH_RELATIONSHIP_DETAIL_SUCCESS";
export const RELATIONSHIP_DETAIL_UNMOUNT = "RELATIONSHIP_DETAIL_UNMOUNT";

export function fetchRelationshipDetail(iri) {
    return (dispatch, getState) => {
        dispatch(fetchRelationshipDetailRequest(iri));
        const url = "/api/v1/semantic/relationship-detail?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertData(json, iri);
            dispatch(fetchRelationshipDetailSuccess(iri, data, json));
        }, (error) => {
            // TODO Add error handling.
        });
    };
}

function convertData(jsonld, relationshipIri) {
    if (jsonld === undefined) {
        return undefined;
    }
    const relationship = graph.getByResource(jsonld, relationshipIri);
    const range = triples.resources(relationship, APP.hasParticipant)
        .map((iri) => {
            const participant = graph.getByResource(jsonld, iri);
            return {
                "@id": triples.id(participant)
            }
        });
    return {
        "range" : range
    };
}

function fetchRelationshipDetailRequest(iri) {
    return {
        "type": FETCH_RELATIONSHIP_DETAIL_REQUEST,
        "iri": iri
    }
}

function fetchRelationshipDetailSuccess(iri, data, jsonld) {
    return {
        "type": FETCH_RELATIONSHIP_DETAIL_SUCCESS,
        "iri": iri,
        "data": data,
        "jsonld": jsonld
    }
}

export function onRelationshipDetailUnmount() {
    return {
        "type": RELATIONSHIP_DETAIL_UNMOUNT
    }
}
