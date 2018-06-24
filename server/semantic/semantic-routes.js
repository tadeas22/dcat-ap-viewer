const express = require("express");
const request = require("request"); // https://github.com/request/request
const configuration = require("../server_configuration");
const queries = require("./sparql-queries");

(function initialize() {
    const router = express.Router();

    router.get("/similar-datasets", createSimilarDatasetFunction());
    router.get("/concept", createConceptFunction());
    router.get("/concept-detail", createConceptDetailFunction());
    router.get("/annotated-datasets", createAnnotatedDatasetsFunction());
    router.get("/object-detail", createObjectDetailFunction());
    router.get("/property-detail", createPropertyDetailFunction());
    router.get("/relationship-detail", createRelationshipDetailFunction());

    module.exports = router;
})();


function createSimilarDatasetFunction() {
    return (req, res) => {
        const query = queries.similarDatasetQuery(req.query.iri);
        sparqlSelect(res, query, configuration.similarDatasets);
    }
}


function sparqlSelect(res, sparql, endpoint) {
    const url = endpoint + "?" +
        "format=application%2Fsparql-results%2Bjson&" +
        "timeout=0&" +
        "query=" + encodeURIComponent(sparql);
    request.get({
        "url": url
    }).on("error", (error) => {
        handleError(res, error);
    }).pipe(res);
}

function handleError(res, error) {
    // TODO Improve logging and error handling #38.
    console.error("Request failed: ", error);
    res.status(500).json({
        "error": "service_request_failed"
    });
}

function createConceptFunction() {
    return (req, res) => {
        const query = queries.conceptQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function createConceptDetailFunction() {
    return (req, res) => {
        const query = queries.conceptDetailQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function sparqlConstruct(res, sparql, endpoint) {
    const url = endpoint + "?" +
        "format=application%2Fx-json%2Bld&" +
        "timeout=0&" +
        "query=" + encodeURIComponent(sparql);
    request.get({"url": url}).on("error", (error) => {
        handleError(res, error);
    }).pipe(res);
}

function createAnnotatedDatasetsFunction() {
    return (req, res) => {
        const query = queries.annotatedDatasetsQuery(req.query.iri);
        sparqlSelect(res, query, configuration.similarDatasets);
    }
}

function createObjectDetailFunction() {
    return (req, res) => {
        const query = queries.objectDetailQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function createPropertyDetailFunction() {
    return (req, res) => {
        const query = queries.propertyDetailQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function createRelationshipDetailFunction() {
    return (req, res) => {
        const query = queries.relationshipDetailQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}
