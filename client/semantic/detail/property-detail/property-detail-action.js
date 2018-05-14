import {fetchJsonCallback} from "../../../services/http-request";
import {graph, triples} from "./../../../services/jsonld";
import {SKOS, DCTERMS, APP, SSP} from "./../../../services/vocabulary";

export const FETCH_PROPERTY_DETAIL_REQUEST = "FETCH_PROPERTY_DETAIL_REQUEST";
export const FETCH_PROPERTY_DETAIL_SUCCESS = "FETCH_PROPERTY_DETAIL_SUCCESS";
export const PROPERTY_DETAIL_UNMOUNT = "PROPERTY_DETAIL_UNMOUNT";

export function fetchPropertyDetail(iri) {
    return (dispatch, getState) => {
        dispatch(fetchPropertyDetailRequest(iri));
        const url = "/api/v1/semantic/property-detail?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertData(json);
            dispatch(fetchPropertyDetailSuccess(iri, data, json));
        }, (error) => {
            // TODO Add error handling.
        });
    };
}

function convertData(jsonld) {

    if (jsonld === undefined) {
        return undefined;
    }

    const objects = graph.getAllByType(jsonld, SSP.TypObjektu);
    // TODO Check that they contains reference to the property's iri.
    return {
        "usedBy": objects.map((entry) => ({
            "@id": triples.id(entry)
        }))
    }
}

function fetchPropertyDetailRequest(iri) {
    return {
        "type": FETCH_PROPERTY_DETAIL_REQUEST,
        "iri": iri
    }
}

function fetchPropertyDetailSuccess(iri, data, jsonld) {
    return {
        "type": FETCH_PROPERTY_DETAIL_SUCCESS,
        "iri": iri,
        "data": data,
        "jsonld": jsonld
    }
}

export function onPropertyDetailUnmount() {
    return {
        "type": PROPERTY_DETAIL_UNMOUNT
    }
}
