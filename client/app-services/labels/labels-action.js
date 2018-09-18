import {fetchJson} from "@/app-services/http-request";

export const FETCH_LABEL_SUCCESS = "FETCH_LABEL_SUCCESS";

export const fetchLabel = (iri) => {
    const url = "./api/v1/resource/codelist?iri=" + encodeURI(iri);
    return (dispatch) => {
        // TODO Use caching.
        fetchJson(url).then((data) => {
            const jsonld = normalizeJsonLd(data.json);
            dispatch(fetchLabelSuccess(jsonld));
        }).catch((error) => {
            console.warn("Codelist request failed for: ", iri,
                " error:" , error);
        });
    }
};

// TODO Extract to another layer.
function normalizeJsonLd(data) {
    if (REPOSITORY_TYPE === "COUCHDB") {
        return {"@graph": data["jsonld"]};
    } else {
        return data;
    }
}

function fetchLabelSuccess(jsonld) {
    return {
        "type": FETCH_LABEL_SUCCESS,
        "jsonld": jsonld
    }
}