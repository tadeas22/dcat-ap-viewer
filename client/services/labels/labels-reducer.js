import {graph, triples} from "../jsonld";
import {SKOS, DCTERMS, RDF} from "../vocabulary";
import {FETCH_LABEL_SUCCESS} from "./labels-action"

// TODO Add round-robin for labels repository?

const initialState = {};

const reducerName = "labels";

function reducer(state = initialState, action) {
    // TODO Introduce another way how to detect jsonld data in an action.
    if (action["type"] === FETCH_LABEL_SUCCESS ||
        action["jsonld"] !== undefined) {
        return onJsonLd(state, action);
    }
    return state;
}

export default reducer = {
    "name": reducerName,
    "reducer": reducer
};

function onJsonLd(state, action) {
    const newLabels = {...state};
    addToLabels(action["jsonld"], newLabels);
    return newLabels;
}

function addToLabels(jsonld, labels) {
    const resources = graph.getResources(jsonld);
    const result = {};
    resources.forEach((entity) => {
        const iri = triples.id(entity);
        let newLabelEntry = {
            "@id": iri,
            ...labels[iri]
        };
        merge(newLabelEntry, triples.string(entity, SKOS.prefLabel));
        merge(newLabelEntry, triples.string(entity, DCTERMS.title));
        merge(newLabelEntry, triples.string(entity, RDF.label));
        labels[iri] = newLabelEntry;
    });
    return result;
}

function merge(labels, newLabels) {
    if (newLabels === undefined) {
        return;
    }
    for (let key in newLabels) {
        if (!newLabels.hasOwnProperty(key) ) {
            continue;
        }
        // TODO Introduce some form of a merging strategy.
        const filteredNewValues = filterEmpty(newLabels[key]);
        if (filteredNewValues.length > 0) {
            labels[key] = filteredNewValues;
        }
    }
}

function filterEmpty(values) {
    return values.filter(value => value != "")
}


const reducerSelector = (state) => state[reducerName];

export function labelsSelector(state) {
    return reducerSelector(state);
}
