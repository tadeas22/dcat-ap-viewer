import React from "react";
import {Link} from "react-router";
import {
    getUrl,
    DATASET_DETAIL_URL,
    DATASET_QUERY,
    DATASET_LIST_URL,
    PUBLISHER_QUERY
} from "../application/navigation";
import {selectLabel} from "../services/labels/";

export const DatasetsTable = ({datasets, labels}) => {

    const divStyle = {
        "border": "1px solid #E7E6E3",
        "width": "100%",
        "padding": "0.5rem"
    };

    const tableStyle = {
        "border": "1px solid #E7E6E3",
        "margin": "1rem"
    };

    const labelStyle = {
        "border": "1px solid #E7E6E3",
        "width": "60%",
        "paddingLeft": "1rem"
    };

    const providerStyle = {
        "border": "1px solid #E7E6E3",
        "width": "40%",
        "paddingLeft": "1rem"
    };

    return (
        <div style={divStyle}>
            Související datové sady:<br/>
            <table style={tableStyle}>
                <tbody>
                {datasets.map((dataset) => (
                    <tr key={dataset["@id"]}>
                        <td style={labelStyle}>
                            <Link to={datasetUrl(dataset["@id"])}>
                                {selectLabel(dataset, labels)}
                            </Link>
                        </td>
                        <td style={providerStyle}>
                            <a href={publisherUrl(dataset["publisher"])}
                               target="_blank">
                                {selectLabel(dataset["publisher"], labels)}
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};


function datasetUrl(iri) {
    return getUrl(DATASET_DETAIL_URL, {
        [DATASET_QUERY]: iri
    });
}

function publisherUrl(publisherLabel) {
    return getUrl(DATASET_LIST_URL, {
        [PUBLISHER_QUERY]: publisherLabel
    });
}

// TODO Add property specification with: datasets, labels