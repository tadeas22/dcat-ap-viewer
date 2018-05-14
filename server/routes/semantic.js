const express = require("express");
const request = require("request"); // https://github.com/request/request
const configuration = require('./../server_configuration');

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
        const query = createSimilarDatasetQuery(req.query.iri);
        sparqlSelect(res, query, configuration.similarDatasets);
    }
}

// TODO Update to SPARQL select
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

function createConceptFunction() {
    return (req, res) => {
        const query = createConceptQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function createConceptQuery(iri) {
    return "CONSTRUCT { <" + iri + "> ?p ?o } WHERE {  <" + iri + "> ?p ?o . }";
}

function createConceptDetailFunction() {
    return (req, res) => {
        const query = createConceptDetailQuery(req.query.iri);
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
        sparqlSelect(res, query, configuration.similarDatasets);
    }
}

// TODO Update to SPARQL select
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
        sparqlConstruct(res, query, configuration.concepts);
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

function createPropertyDetailFunction() {
    return (req, res) => {
        const query = createPropertyDetailQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function createPropertyDetailQuery(iri) {
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
        "  ?pojem a ssp:typ-vlastnosti ;\n" +
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
        "  # seznam vlastníků vlastnosti\n" +
        "  ?vlastnik app:máVlastnost ?pojem .\n" +
        "  ?vlastnik a ?typVlastnika ;\n" +
        "    skos:prefLabel ?nazevVlastnika .\n" +
        "\n" +
        "} WHERE {\n" +
        "\n" +
        "  VALUES ?pojem { <" + iri + "> }\n" +
        "\n" +
        "  ?pojem a ssp:typ-vlastnosti ;\n" +
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
        "  ?vlastnik a ?typVlastnika ;\n" +
        "    skos:prefLabel ?nazevVlastnika .\n" +
        "  { ?pojem rdfs:domain ?vlastnik .}\n" +
        "  UNION\n" +
        "  { ?pojem rdfs:domain/owl:unionOf ?vlastnik .}\n" +
        "\n" +
        "}\n";
}

function createRelationshipDetailFunction() {
    return (req, res) => {
        const query = createRelationshipDetailQuery(req.query.iri);
        sparqlConstruct(res, query, configuration.concepts);
    }
}

function createRelationshipDetailQuery(iri) {
    return "" +
        "# ?pojem a ssp:typ-vztahu\n" +
        "\n" +
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
        "  ?pojem a ssp:typ-vztahu ;\n" +
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
        "  # seznam účastníků vztahu\n" +
        "  ?pojem app:máÚčastníka ?ucastnik .\n" +
        "  ?ucastnik a ?typUcastnika ;\n" +
        "    skos:prefLabel ?nazevUcastnika .\n" +
        "\n" +
        "} WHERE {\n" +
        "\n" +
        "  VALUES ?pojem { <" + iri + "> }\n" +
        "\n" +
        "  ?pojem a ssp:typ-vztahu ;\n" +
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
        "  ?ucastnik a ?typUcastnika ;\n" +
        "    skos:prefLabel ?nazevUcastnika .\n" +
        "  { ?pojem rdfs:domain ?ucastnik .}\n" +
        "  UNION\n" +
        "  { ?pojem rdfs:domain/owl:unionOf ?ucastnik .}\n" +
        "  UNION\n" +
        "  { ?pojem rdfs:range ?ucastnik .}\n" +
        "  UNION\n" +
        "  { ?pojem rdfs:range/owl:unionOf ?ucastnik .}\n" +
        "\n" +
        "}\n";
}
