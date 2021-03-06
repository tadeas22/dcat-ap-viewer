const DCTERMS_PREFIX = "http://purl.org/dc/terms/";
export const DCTERMS = {
    "modified": DCTERMS_PREFIX + "modified",
    "accrualPeriodicity": DCTERMS_PREFIX + "accrualPeriodicity",
    "description" : DCTERMS_PREFIX + "description",
    "issued" : DCTERMS_PREFIX + "issued",
    "publisher" : DCTERMS_PREFIX + "publisher",
    "spatial" : DCTERMS_PREFIX + "spatial",
    "title" : DCTERMS_PREFIX + "title",
    "temporal" : DCTERMS_PREFIX + "temporal",
    "format" : DCTERMS_PREFIX + "format",
    "license" : DCTERMS_PREFIX + "license",
    "accessRights": DCTERMS_PREFIX + "accessRights",
    "conformsTo": DCTERMS_PREFIX + "conformsTo",
    "hasVersion": DCTERMS_PREFIX + "hasVersion",
    "identifier": DCTERMS_PREFIX + "identifier",
    "isVersionOf": DCTERMS_PREFIX + "isVersionOf",
    "language": DCTERMS_PREFIX + "language",
    "provenance": DCTERMS_PREFIX + "provenance",
    "relation": DCTERMS_PREFIX + "relation",
    "source": DCTERMS_PREFIX + "source",
    "type": DCTERMS_PREFIX + "type",
    "rights": DCTERMS_PREFIX + "rights"
};

const DCAT_PREFIX = "http://www.w3.org/ns/dcat#";
export const DCAT = {
    "Dataset": DCAT_PREFIX + "Dataset",
    "Distribution": DCAT_PREFIX + "Distribution",
    "keyword": DCAT_PREFIX + "keyword",
    "contactPoint": DCAT_PREFIX + "contactPoint",
    "distribution": DCAT_PREFIX + "distribution",
    "theme": DCAT_PREFIX + "theme",
    "landingPage": DCAT_PREFIX + "landingPage",
    "byteSize": DCAT_PREFIX + "byteSize",
    "downloadURL": DCAT_PREFIX + "downloadURL",
    "mediaType": DCAT_PREFIX + "mediaType",
    "issued": DCAT_PREFIX + "issued",
    "CatalogRecord" : DCAT_PREFIX + "CatalogRecord",
    "Catalog": DCAT_PREFIX + "Catalog",
    "accessURL": DCAT_PREFIX + "accessURL"
};

const FOAF_PREFIX = "http://xmlns.com/foaf/0.1/";
export const FOAF  = {
    "page" : FOAF_PREFIX + "page",
    "name": FOAF_PREFIX + "name"
};

const ADMS_PREFIX = "http://www.w3.org/ns/adms#";
export const ADMS = {
    "identifier" : ADMS_PREFIX + "identifier",
    "sample" : ADMS_PREFIX + "sample",
    "versionNotes" : ADMS_PREFIX + "versionNotes",
    "status" : ADMS_PREFIX + "status"
};

const OWL_PREFIX = "http://www.w3.org/2002/07/owl#";
export const OWL = {
    "versionInfo" : OWL_PREFIX + "versionInfo"
};

const SPDX_PREFIX = "http://spdx.org/rdf/terms#";
export const SPDX = {
    "checksum" : SPDX_PREFIX + "checksum"
};

const VCARD_PREFIX = "http://www.w3.org/2006/vcard/ns#";
export const VCARD = {
    "fn" : VCARD_PREFIX + "fn",
    "hasEmail" : VCARD_PREFIX + "hasEmail"
};

const SCHEMA_PREFIX = "http://schema.org/";
export const SCHEMA = {
    "startDate" : SCHEMA_PREFIX + "startDate",
    "endDate" : SCHEMA_PREFIX + "endDate"
};

const SKOS_PREFIX = "http://www.w3.org/2004/02/skos/core#";
export const SKOS = {
    "prefLabel": SKOS_PREFIX + "prefLabel",
    "inScheme": SKOS_PREFIX + "inScheme"
};

export const RDF = {
    "type" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
};

export const EUA = {
    "dataTheme" : "http://publications.europa.eu/resource/authority/data-theme"
};

const RDFS_PREFIX = "http://www.w3.org/2000/01/rdf-schema#";
export const RDFS = {
    "label": RDFS_PREFIX + "label"
};

const DCELEMENTS_PREFIX = "http://purl.org/dc/elements/1.1/";
export const DCELEMENTS = {
    "source": DCELEMENTS_PREFIX + "source"
};
