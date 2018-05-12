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
    router.get("/semantic/concept", createConceptFunction());
    router.get("/semantic/concept-detail", createConceptDetailFunction());
    router.get("/semantic/annotated-datasets",
        createAnnotatedDatasetsFunction());
    router.get("/semantic/object-detail",
        createObjectDetailFunction());

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
    console.error("Request failed: ", error);
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

function createConceptFunction() {
    return (req, res) => {
        const query = createConceptQuery(req.query.iri);
        queryDataFromSparql(res, query, configuration.concepts);
    }
}

function createConceptQuery(iri) {
    return "CONSTRUCT { <" + iri + "> ?p ?o } WHERE {  <" + iri + "> ?p ?o . }";
}

function createConceptDetailFunction() {
    return (req, res) => {
        const query = createConceptDetailQuery(req.query.iri);
        queryDataFromSparql(res, query, configuration.concepts);
    }
}

function createConceptDetailQuery(iri) {
    return "CONSTRUCT { " +
        "<" + iri + "> ?p ?o . ?scheme ?sp ?so . ?ct ?ctp ?cto." +
        "} WHERE {  " +
        "<" + iri + "> ?p ?o . " +
        "<" + iri + "> <http://www.w3.org/2004/02/skos/core#inScheme> ?scheme . " +
        "?scheme a <https://ssp.opendata.cz/slovník/základní/pojem/glosář> ; " +
        "  ?sp ?so. " +
        "OPTIONAL {" +
        "  <" + iri + "> <http://purl.org/dc/terms/conformsTo> ?ct . " +
        "  ?ct ?ctp ?cto. " +
        "}" +
        "}";
}

function createAnnotatedDatasetsFunction() {
    return (req, res) => {
        const query = createAnnotatedDatasetsQuery(req.query.iri);
        queryDataFromSparqlSelect(res, query, configuration.similarDatasets);
    }
}

function createAnnotatedDatasetsQuery(iri) {
    return "" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "PREFIX dcat: <http://www.w3.org/ns/dcat#> " +
        "PREFIX z-sgov-pojem: <https://ssp.opendata.cz/slovník/základní/pojem/> " +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        " " +
        "SELECT DISTINCT ?dataset ?title ?publisher ?publisherLabel WHERE { " +
        " " +
        "  ?dataset dcat:theme <" + iri + "> . " +
        "" +
        "  OPTIONAL { ?dataset dcterms:title ?title. } " +
        "  OPTIONAL { ?dataset dcterms:publisher ?publisher. } " +
        "  OPTIONAL { ?publisher skos:prefLabel ?publisherLabel. }" +
        "" +
        " FILTER(<" + iri + "> != ?dataset) " +
        "}";
}

function createObjectDetailFunction() {
    return (req, res) => {
        const query = createObjectDetailQuery(req.query.iri);
        queryDataFromSparql(res, query, configuration.concepts);
    }
}

function createObjectDetailQuery(iri) {
    return "" +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n" +
        "PREFIX dct: <http://purl.org/dc/terms/>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
        "PREFIX dcat: <http://www.w3.org/ns/dcat#>\n" +
        "\n" +
        "PREFIX ssp: <https://ssp.opendata.cz/slovník/základní/pojem/>\n" +
        "PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>\n" +
        "\n" +
        "CONSTRUCT {\n" +
        "\n" +
        "  # název pojmu\n" +
        "  ?pojem a ssp:typ-objektu ;\n" +
        "    skos:prefLabel ?nazevPojmu .\n" +
        "\n" +
        "  # link na zakonyprolidi.cz\n" +
        "  ?pojem dct:conformsTo ?zakonESbirka .\n" +
        "  ?zakonESbirka rdfs:seeAlso ?zakonProLidi .\n" +
        "\n" +
        "  # název glosáře\n" +
        "  ?pojem skos:inScheme ?glosar .\n" +
        "  ?glosar rdfs:label ?glosarNazev .\n" +
        "\n" +
        "  # nadřazený pojem\n" +
        "  ?pojem rdfs:subClassOf ?nadrazenyPojem .\n" +
        "  ?nadrazenyPojem a ssp:typ-objektu ;\n" +
        "    skos:prefLabel ?nazevNadrazenehoPojmu .\n" +
        "\n" +
        "  # seznam vlastností\n" +
        "  ?pojem app:máVlastnost ?vlastnost .\n" +
        "  ?vlastnost a ssp:typ-vlastnosti ;\n" +
        "    skos:prefLabel ?nazevVlastnosti .\n" +
        "\n" +
        "  # seznam vztahů\n" +
        "  ?pojem app:účastníSeVztahu ?vztah .\n" +
        "  ?vztah a ssp:typ-vztahu ;\n" +
        "    skos:prefLabel ?nazevVztahu .\n" +
        "\n" +
        "} WHERE {\n" +
        "\n" +
        "  VALUES ?pojem {<" + iri + ">}\n" +
        "\n" +
        "  ?pojem a ssp:typ-objektu ;\n" +
        "    skos:prefLabel ?nazevPojmu ;\n" +
        "    skos:inScheme ?glosar .\n" +
        "\n" +
        "  ?glosar rdfs:label ?glosarNazev .\n" +
        "\n" +
        "  OPTIONAL {\n" +
        "    ?pojem dct:conformsTo ?zakonESbirka .\n" +
        "    ?zakonESbirka rdfs:seeAlso ?zakonProLidi .\n" +
        "  }\n" +
        "\n" +
        "  OPTIONAL {\n" +
        "    ?pojem rdfs:subClassOf ?nadrazenyPojem ;\n" +
        "      skos:prefLabel ?nazevNadrazenehoPojmu .\n" +
        "  }\n" +
        "\n" +
        "  OPTIONAL {\n" +
        "\n" +
        "    ?vlastnost a ssp:typ-vlastnosti ;\n" +
        "      skos:prefLabel ?nazevVlastnosti .\n" +
        "    { ?vlastnost rdfs:domain ?pojem .}\n" +
        "    UNION\n" +
        "    { ?vlastnost rdfs:domain/owl:unionOf ?pojem .}\n" +
        "\n" +
        "  }\n" +
        "\n" +
        "  OPTIONAL {\n" +
        "\n" +
        "    ?vztah a ssp:typ-vztahu ;\n" +
        "      skos:prefLabel ?nazevVztahu .\n" +
        "\n" +
        "    { ?vztah rdfs:domain ?pojem . }\n" +
        "    UNION\n" +
        "    { ?vztah rdfs:domain/owl:unionOf ?pojem .}\n" +
        "    UNION\n" +
        "    { ?vztah rdfs:range ?pojem . }\n" +
        "    UNION\n" +
        "    { ?vztah rdfs:range/owl:unionOf ?pojem .}\n" +
        "\n" +
        "  }\n" +
        "\n" +
        "}\n"
}