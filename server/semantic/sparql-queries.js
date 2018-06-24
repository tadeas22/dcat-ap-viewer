function similarDatasetQuery(iri) {
    return `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX z-sgov-pojem: <https://ssp.opendata.cz/slovník/základní/pojem/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT DISTINCT ?dataset ?title ?publisher ?publisherLabel WHERE { 
  {
    ?pojem1 skos:inScheme ?glosář .
    ?pojem2 skos:inScheme ?glosář .
    ?glosář a z-sgov-pojem:legislativní-struktura .
    FILTER(?pojem1 > ?pojem2)
  } UNION {
    ?pojem1 skos:inScheme ?glosář1 .
    ?pojem2 skos:inScheme ?glosář2 .
    ?glosář1 a z-sgov-pojem:legislativní-struktura .
    ?glosář2 a z-sgov-pojem:legislativní-struktura .
    ?glosář1 owl:imports+ ?glosář2 .
  }
  
  <` + iri + `> dcat:theme ?pojem1 .
  ?dataset dcat:theme ?pojem2 .
  
  OPTIONAL { ?dataset dcterms:title ?title. }
  OPTIONAL { ?dataset dcterms:publisher ?publisher. }
  OPTIONAL { ?publisher skos:prefLabel ?publisherLabel. }
  
  FILTER(<` + iri + `> != ?dataset)
  
}`;
}

function conceptDetailQuery(iri) {
    return `
CONSTRUCT {
  <` + iri + `> ?p ?o . ?scheme ?sp ?so . ?ct ?ctp ?cto.
} WHERE {
  <` + iri + `> ?p ?o .
  <` + iri + `> <http://www.w3.org/2004/02/skos/core#inScheme> ?scheme .
  ?scheme a <https://ssp.opendata.cz/slovník/základní/pojem/glosář> ;
    ?sp ?so.
  OPTIONAL {
    <` + iri + `>  <http://purl.org/dc/terms/conformsTo> ?ct .
    ?ct ?ctp ?cto.
  }
}`;
}

function annotatedDatasetsQuery(iri) {
    return `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?dataset ?title ?publisher ?publisherLabel WHERE {

  ?dataset dcat:theme <` + iri + `> .
 
  OPTIONAL { ?dataset dcterms:title ?title. }
  OPTIONAL { ?dataset dcterms:publisher ?publisher. }
  OPTIONAL { ?publisher skos:prefLabel ?publisherLabel. }
 
  FILTER ( <` + iri + `> != ?dataset )
}`
}

function objectDetailQuery(iri) {
    return `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

PREFIX ssp: <https://ssp.opendata.cz/slovník/základní/pojem/>
PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>

CONSTRUCT {

  # název pojmu
  ?pojem a ssp:typ-objektu ;
    skos:prefLabel ?nazevPojmu .

  # link na zakonyprolidi.cz
  ?pojem dct:conformsTo ?zakonESbirka .
  ?zakonESbirka rdfs:seeAlso ?zakonProLidi .

  # název glosáře
  ?pojem skos:inScheme ?glosar .
  ?glosar rdfs:label ?glosarNazev .

  # nadřazený pojem
  ?pojem rdfs:subClassOf ?nadrazenyPojem .
  ?nadrazenyPojem a ssp:typ-objektu ;
    skos:prefLabel ?nazevNadrazenehoPojmu .

  # seznam vlastností
  ?pojem app:máVlastnost ?vlastnost .
  ?vlastnost a ssp:typ-vlastnosti ;
    skos:prefLabel ?nazevVlastnosti .

  # seznam vztahů
  ?pojem app:účastníSeVztahu ?vztah .
  ?vztah a ssp:typ-vztahu ;
    skos:prefLabel ?nazevVztahu .

} WHERE {

  VALUES ?pojem {<` + iri + `>}

  ?pojem a ssp:typ-objektu ;
    skos:prefLabel ?nazevPojmu ;
    skos:inScheme ?glosar .

  ?glosar rdfs:label ?glosarNazev .

  OPTIONAL {
    ?pojem dct:conformsTo ?zakonESbirka .
    ?zakonESbirka rdfs:seeAlso ?zakonProLidi .
  }

  OPTIONAL {
    ?pojem skos:broader ?nadrazenyPojem ;
      skos:prefLabel ?nazevNadrazenehoPojmu .
  }

  OPTIONAL {

    ?vlastnost a ssp:typ-vlastnosti ;
      skos:prefLabel ?nazevVlastnosti .
    { ?vlastnost rdfs:domain ?pojem .}
    UNION
    { ?vlastnost rdfs:domain/owl:unionOf ?pojem .}

  }

  OPTIONAL {

    ?vztah a ssp:typ-vztahu ;
      skos:prefLabel ?nazevVztahu .

    { ?vztah rdfs:domain ?pojem . }
    UNION
    { ?vztah rdfs:domain/owl:unionOf ?pojem .}
    UNION
    { ?vztah rdfs:range ?pojem . }
    UNION
    { ?vztah rdfs:range/owl:unionOf ?pojem .}

  }
}`;
}

function propertyDetailQuery(iri) {
    return `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

PREFIX ssp: <https://ssp.opendata.cz/slovník/základní/pojem/>
PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>

CONSTRUCT {

  # název pojmu
  ?pojem a ssp:typ-vlastnosti ;
    skos:prefLabel ?nazevPojmu .

  # link na zakonyprolidi.cz
  ?pojem dct:conformsTo ?zakonESbirka .
  ?zakonESbirka rdfs:seeAlso ?zakonProLidi .

  # název glosáře
  ?pojem skos:inScheme ?glosar .
  ?glosar rdfs:label ?glosarNazev .

  # nadřazený pojem
  ?pojem rdfs:subClassOf ?nadrazenyPojem .
  ?nadrazenyPojem a ssp:typ-objektu ;
    skos:prefLabel ?nazevNadrazenehoPojmu .

  # seznam vlastníků vlastnosti
  ?vlastnik app:máVlastnost ?pojem .
  ?vlastnik a ?typVlastnika ;
    skos:prefLabel ?nazevVlastnika .

} WHERE {

  VALUES ?pojem { <` + iri + `> }

  ?pojem a ssp:typ-vlastnosti ;
    skos:prefLabel ?nazevPojmu ;
    skos:inScheme ?glosar .

  ?glosar rdfs:label ?glosarNazev .

  OPTIONAL {
    ?pojem dct:conformsTo ?zakonESbirka .
    ?zakonESbirka rdfs:seeAlso ?zakonProLidi .
  }

  OPTIONAL {
    ?pojem skos:broader ?nadrazenyPojem ;
      skos:prefLabel ?nazevNadrazenehoPojmu .
  }

  ?vlastnik a ?typVlastnika ;
    skos:prefLabel ?nazevVlastnika .
  { ?pojem rdfs:domain ?vlastnik .}
  UNION
  { ?pojem rdfs:domain/owl:unionOf ?vlastnik .}

}`;
}

function relationshipDetailQuery(iri) {
    return `
# ?pojem a ssp:typ-objektu

PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

PREFIX ssp: <https://ssp.opendata.cz/slovník/základní/pojem/>
PREFIX app: <https://skod.opendata.cz/slovník/aplikační/>

CONSTRUCT {

  # název pojmu
  ?pojem a ssp:typ-vztahu ;
    skos:prefLabel ?nazevPojmu .

  # link na zakonyprolidi.cz
  ?pojem dct:conformsTo ?zakonESbirka .
  ?zakonESbirka rdfs:seeAlso ?zakonProLidi .

  # název glosáře
  ?pojem skos:inScheme ?glosar .
  ?glosar rdfs:label ?glosarNazev .

  # nadřazený pojem
  ?pojem rdfs:subClassOf ?nadrazenyPojem .
  ?nadrazenyPojem a ssp:typ-objektu ;
    skos:prefLabel ?nazevNadrazenehoPojmu .

  # seznam účastníků vztahu
  ?pojem app:máÚčastníka ?ucastnik .
  ?ucastnik a ?typUcastnika ;
    skos:prefLabel ?nazevUcastnika .

} WHERE {

  VALUES ?pojem { <` + iri + `> }

  ?pojem a ssp:typ-vztahu ;
    skos:prefLabel ?nazevPojmu ;
    skos:inScheme ?glosar .

  ?glosar rdfs:label ?glosarNazev .

  OPTIONAL {
    ?pojem dct:conformsTo ?zakonESbirka .
    ?zakonESbirka rdfs:seeAlso ?zakonProLidi .
  }

  OPTIONAL {
    ?pojem skos:broader ?nadrazenyPojem ;
      skos:prefLabel ?nazevNadrazenehoPojmu .
  }

  ?ucastnik a ?typUcastnika ;
    skos:prefLabel ?nazevUcastnika .
  { ?pojem rdfs:domain ?ucastnik .}
  UNION
  { ?pojem rdfs:domain/owl:unionOf ?ucastnik .}
  UNION
  { ?pojem rdfs:range ?ucastnik .}
  UNION
  { ?pojem rdfs:range/owl:unionOf ?ucastnik .}

}`;
}

function conceptQuery(iri) {
    return "CONSTRUCT { <" + iri + "> ?p ?o } WHERE {  <" + iri + "> ?p ?o . }";
}

module.exports = {
    "similarDatasetQuery": similarDatasetQuery,
    "conceptDetailQuery": conceptDetailQuery,
    "annotatedDatasetsQuery": annotatedDatasetsQuery,
    "objectDetailQuery": objectDetailQuery,
    "propertyDetailQuery": propertyDetailQuery,
    "relationshipDetailQuery": relationshipDetailQuery,
    "conceptQuery" : conceptQuery
};

