import {register} from "@/app/register.js";
import reducer from "./dataset-detail-reducer";
import {DatasetDetailContainer} from "./dataset-detail-container";
import {DATASET_DETAIL_URL} from "@/app/navigation";

register({
    "reducer": reducer.reducer,
    "name": reducer.name,
    "url": [DATASET_DETAIL_URL],
    "component": DatasetDetailContainer,
    "strings": {
        "cs": {
            "documentation": "Dokumentace"
            , "contact_point": "Kontaktní bod"
            , "frequency": "Periodicita aktualizace"
            , "documentation_download": "Zobrazit dokumentaci"
            , "spatial": "Územní pokrytí"
            , "temporal": "Časové pokrytí"
            , "dataset_topic": "Téma datové sady"
            , "topic": "EuroVoc Témata"
            , "unnamed_distribution": "Distribuce"
            , "download": "Stáhnout"
            , "schema": "Schéma"
            , "licence": "Podmínky užití"
        },
        "en": {
            "documentation": "Documentation"
            , "contact_point": "Contact point"
            , "frequency": "Frequency"
            , "documentation_download": "Show documentation"
            , "spatial": "Spatial coverage"
            , "temporal": "Temporal coverage"
            , "dataset_topic": "Dataset Theme"
            , "topic": "Dataset Theme"
            , "unnamed_distribution": "Distribution"
            , "download": "Download"
            , "schema": "Schema"
            , "licence": "Licence"
        }
    }
});
