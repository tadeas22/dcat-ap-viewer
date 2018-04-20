const express = require("express");
const request = require("request"); // https://github.com/request/request
const configuration = require('./../server_configuration');

(function initialize() {
    const router = express.Router();

    router.get("/dataset", createFetchDatasetsFunction());
    router.get("/distribution", createFetchDistributionsFunction());
    router.get("/codelist", createFetchCodeListFunction());
    router.get("/static", createStaticFunction());

    // TODO Move to service layer ?
    router.get("/semantic/similar-datasets", createSimilarDatasetFunction());
    router.get("/semantic/concept", createConceptDetailFunction());

    module.exports = router;
})();

function createFetchDatasetsFunction() {
    if (configuration.repository == "COUCHDB") {
        return fetchDatasetsCouchdb;
    } else {
        return fetchDatasetsSparql;
    }
}

function fetchDatasetsCouchdb(req, res) {
    const datasetIri = req.query.iri;
    queryDataFromCouchDB("datasets", res, datasetIri);
}

function queryDataFromCouchDB(database, res, id) {
    // TODO Update response content-type.
    // TODO Add error handling.
    const url = configuration.couchdb.url + "/"
        + database + "/" + encodeURIComponent(id);
    request.get({"url": url}).on("error", (error) => {
        handleError(res, error);
    }).pipe(res);
}

function handleError(res, error) {
    // TODO Improve logging and error handling #38.
    console.log("Request failed: ", error);
    res.status(500).json({
        "error": "service_request_failed"
    });
}

function fetchDatasetsSparql(req, res) {
    const datasetIri = req.query.iri;
    const sparql = createDatasetSparqlQuery(datasetIri);
    queryDataFromSparql(res, sparql, configuration.sparql.url);
}

function createDatasetSparqlQuery(iri) {
    let query = "" +
        "PREFIX dcat: <http://www.w3.org/ns/dcat#> " +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX dcterms: <http://purl.org/dc/terms/> " +
        "PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
        "PREFIX schema: <http://schema.org/> " +
        "PREFIX vcard: <http://www.w3.org/2006/vcard/ns#> " +
        "PREFIX void: <http://rdfs.org/ns/void#> " +
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
        "PREFIX adms: <http://www.w3.org/ns/adms#> " +
        "PREFIX spdx: <http://spdx.org/rdf/terms#> " +
        "PREFIX org: <http://www.w3.org/ns/org#> " +
        "" +
        "CONSTRUCT { " +
        "?Dataset ?p ?o .  " +
        "  " +
        "?cp vcard:fn ?cpfn ; " +
        "  vcard:hasEmail ?cpemail .  " +
        " " +
        "?publisher a foaf:Agent; " +
        "  foaf:name ?name .  " +
        "?temporal schema:startDate ?temporalStart ; " +
        "  schema:endDate ?temporalEnd . " +
        "" +
        "?primaryTopic a dcat:CatalogRecord ; " +
        "  foaf:primaryTopic ?Dataset ; " +
        "  dcterms:source ?source ." +
        "} WHERE {  ";

    // TODO Prepare template on start instead on every query
    if (configuration.sparql.profile === "SINGLE-GRAPH") {
        query += "GRAPH ?g { "
    }

    query += "?Dataset ?p ?o . " +
        "" +
        "OPTIONAL { ?Dataset dcterms:modified ?modified . } " +
        "OPTIONAL { ?Dataset dcterms:accrualPeriodicity ?accrualPeriodicity . } " +
        "OPTIONAL { ?Dataset dcterms:issued ?issued . } " +
        "OPTIONAL { ?Dataset dcterms:language ?language . } " +
        "OPTIONAL { ?Dataset dcterms:identifier ?identifier . } " +
        "OPTIONAL { ?Dataset dcterms:type ?type . } " +
        "OPTIONAL { ?Dataset foaf:page ?page . } " +
        "OPTIONAL { ?Dataset dcat:theme ?theme . } " +
        "OPTIONAL { ?Dataset dcat:landingPage ?landingPage . } " +
        "OPTIONAL { ?Dataset dcat:keyword ?keyword . } " +
        "OPTIONAL {  " +
        "  ?Dataset dcat:contactPoint ?cp .  " +
        "  ?cp vcard:fn ?cpfn ; " +
        "    vcard:hasEmail ?cpemail .  " +
        "} " +
        "OPTIONAL { " +
        "  ?Dataset dcterms:publisher ?publisher .  " +
        "  ?publisher a foaf:Agent; " +
        "    foaf:name ?name .  " +
        "} " +
        "OPTIONAL { " +
        "  ?Dataset dcterms:temporal ?temporal . " +
        "  ?temporal schema:startDate ?temporalStart ; " +
        "    schema:endDate ?temporalEnd . " +
        "} " +
        "OPTIONAL { " +
        "  ?primaryTopic a dcat:CatalogRecord ; " +
        "    foaf:primaryTopic ?Dataset ; " +
        "    dcterms:source ?source ." +
        "} ";

    if (configuration.sparql.profile === "SINGLE-GRAPH") {
        query += "} "
    }

    query += "VALUES (?Dataset) { (<" + iri + ">) } " +
        "} ";

    return query;
}

function queryDataFromSparql(res, sparql, endpoint) {
    const url = endpoint + "?" +
        "format=application%2Fx-json%2Bld&" +
        "timeout=0&" +
        "query=" + encodeURIComponent(sparql);
    request.get({"url": url}).on("error", (error) => {
        handleError(res, error);
    }).pipe(res);
}

function createFetchDistributionsFunction() {
    if (configuration.repository == "COUCHDB") {
        return fetchDistributionsCouchdb;
    } else {
        return fetchDistributionsSparql;
    }
}

function fetchDistributionsCouchdb(req, res) {
    const distributionIri = req.query.iri;
    queryDataFromCouchDB("distributions", res, distributionIri);
}

function fetchDistributionsSparql(req, res) {
    const distributionIri = req.query.iri;
    const sparql = createDistributionSparqlQuery(distributionIri);
    queryDataFromSparql(res, sparql, configuration.sparql.url);
}

function createDistributionSparqlQuery(iri) {
    return "" +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX dcterms: <http://purl.org/dc/terms/> " +
        "" +
        "CONSTRUCT { " +
        "   <" + iri + "> ?p ?o . " +
        "   <" + iri + "> dcterms:format ?format . " +
        "   ?format skos:prefLabel ?formatLabel. " +
        "} WHERE { " +
        "   <" + iri + "> ?p ?o . " +
        "OPTIONAL { " +
        "   <" + iri + "> dcterms:format ?format . " +
        "   ?format skos:prefLabel ?formatLabel. " +
        "} " +
        "}";
}

function createFetchCodeListFunction() {
    if (configuration.repository == "COUCHDB") {
        return fetchCodeListCouchdb;
    } else {
        // TODO Provide implementation #39.
        return (req, res) => {
            res.status(500);
            res.json({"error": "missing_support"});
        }
    }
}

function fetchCodeListCouchdb(req, res) {
    const itemIri = req.query.iri;
    queryDataFromCouchDB("codelists", res, itemIri);
}

function createStaticFunction() {
    if (configuration.repository == "COUCHDB") {
        return fetchStaticCouchdb;
    } else {
        // TODO Provide implementation #39.
        return (req, res) => {
            res.status(500);
            res.json({"error": "missing_support"});
        }
    }
}

function fetchStaticCouchdb(req, res) {
    const itemId = req.query.id;
    queryDataFromCouchDB("static", res, itemId);
}

function createSimilarDatasetFunction() {
    return (req, res) => {
        const query = createSimilarDatasetQuery(req.query.iri);
        queryDataFromSparqlSelect(res, query, configuration.similarDatasets);
    }
}

function createSimilarDatasetQuery(iri) {
    return "" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "PREFIX dcat: <http://www.w3.org/ns/dcat#> " +
        "PREFIX z-sgov-pojem: <https://ssp.opendata.cz/slovník/základní/pojem/> " +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        " " +
        "SELECT DISTINCT ?dataset ?title ?publisher ?publisherLabel WHERE { " +
        " " +
        "  { " +
        "    ?pojem1 skos:inScheme ?glosář . " +
        "    ?pojem2 skos:inScheme ?glosář . " +
        "    ?glosář a z-sgov-pojem:legislativní-struktura . " +
        "    FILTER(?pojem1 > ?pojem2) " +
        "  } UNION { " +
        "     ?pojem1 skos:inScheme ?glosář1 . " +
        "     ?pojem2 skos:inScheme ?glosář2 . " +
        "     ?glosář1 a z-sgov-pojem:legislativní-struktura . " +
        "     ?glosář2 a z-sgov-pojem:legislativní-struktura . " +
        "     ?glosář1 owl:imports+ ?glosář2 . " +
        "  } " +
        " " +
        "  <" + iri + "> dcat:theme ?pojem1 . " +
        "  ?dataset dcat:theme ?pojem2 . " +
        "" +
        "  OPTIONAL { ?dataset dcterms:title ?title. } " +
        "  OPTIONAL { ?dataset dcterms:publisher ?publisher. } " +
        "  OPTIONAL { ?publisher skos:prefLabel ?publisherLabel. }" +
        "" +
        " FILTER(<" + iri + "> != ?dataset) " +
        "}";
}

function queryDataFromSparqlSelect(res, sparql, endpoint) {
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

function createConceptDetailFunction() {
    return (req, res) => {
        const query = createConceptDetailQuery(req.query.iri);
        queryDataFromSparql(res, query, configuration.concepts);
    }
}

function createConceptDetailQuery(iri) {
    return "CONSTRUCT { <" + iri +"> ?p ?o } WHERE {  <" + iri +"> ?p ?o . }";
}