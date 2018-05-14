import {fetchJsonCallback} from "../../../services/http-request";
import {graph, triples} from "./../../../services/jsonld";
import {SKOS, DCTERMS, APP} from "./../../../services/vocabulary";

export const FETCH_OBJECT_DETAIL_REQUEST = "FETCH_OBJECT_DETAIL_REQUEST";
export const FETCH_OBJECT_DETAIL_SUCCESS = "FETCH_OBJECT_DETAIL_SUCCESS";
export const OBJECT_DETAIL_UNMOUNT = "OBJECT_DETAIL_UNMOUNT";

export function fetchObjectDetail(iri) {
    return (dispatch, getState) => {
        // TODO Add support for caching.
        dispatch(fetchObjectDetailRequest(iri));
        const url = "/api/v1/semantic/object-detail?iri=" +
            encodeURI(iri);
        fetchJsonCallback(url, (json) => {
            const data = convertData(json, iri);
            dispatch(fetchObjectDetailSuccess(iri, data));
        }, (error) => {
            // TODO Add error handling.
        });
    };
}

function convertData(jsonld, typeObjectIri) {
    if (jsonld === undefined) {
        return undefined;
    }

    const typeObject = graph.getByResource(jsonld, typeObjectIri);

    const propsIri = triples.resources(typeObject, APP.hasProperty);
    const props = propsIri.map((iri) => {
        const property = graph.getByResource(jsonld, iri);
        return {
            "@id": iri,
            "label": triples.string(property, SKOS.prefLabel)
        }
    });

    const relIri = triples.resources(typeObject, APP.participateInRelation);
    const rel = relIri.map((iri) => {
        const relation = graph.getByResource(jsonld, iri);
        return {
            "@id": iri,
            "label": triples.string(relation, SKOS.prefLabel)
        }
    });

    return {
        "@id": triples.id(typeObject),
        "properties": props,
        "inRelations" : rel
    }
}

function fetchObjectDetailRequest(iri) {
    return {
        "type": FETCH_OBJECT_DETAIL_REQUEST,
        "iri": iri
    }
}

function fetchObjectDetailSuccess(iri, data) {
    return {
        "type": FETCH_OBJECT_DETAIL_SUCCESS,
        "iri": iri,
        "data": data
    }
}

export function onObjectDetailUnmount() {
    return {
        "type": OBJECT_DETAIL_UNMOUNT
    }
}
