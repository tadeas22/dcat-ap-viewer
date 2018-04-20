import React from "react";
import {connect} from "react-redux";
import {fetchSimilarDatasets} from "./similar-datasets-actions";
import {similarSelector} from "./similar-datasets-reducer";
import {isDataReady} from "./../../../services/http-request";
import {LoaderIndicator} from "./../../../components/loading-indicator";
import {Link} from "react-router";
import {
    getUrl,
    DATASET_DETAIL_URL,
    DATASET_QUERY,
    DATASET_LIST_URL,
    PUBLISHER_QUERY
} from "./../../../application/navigation";

class _SimilarDatasets extends React.Component {

    componentWillMount() {
        this.props.fetch();
    }

    render() {

        if (!isDataReady(this.props.similar.status)) {
            return (
                <LoaderIndicator/>
            )
        }

        const tableStyle = {
            "border": "1px solid #E7E6E3",
            "width": "100%"
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
            <div>
                <table style={tableStyle}>
                    <tbody>
                    {this.props.similar.data.map((dataset) => (
                        <tr key={dataset["@id"]}>
                            <td style={labelStyle}>
                                <Link to={this.getDatasetUrl(dataset["@id"])}>
                                    {dataset["title"]}
                                </Link>
                            </td>
                            <td style={providerStyle}>
                                <a href={this.getPublisherUrl(dataset["publisher"])}
                                   target="_blank">
                                    {dataset["publisherLabel"]}
                                </a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    getDatasetUrl(iri) {
        return getUrl(DATASET_DETAIL_URL, {
            [DATASET_QUERY]: iri
        });
    }

    getPublisherUrl(publisherLabel) {
        return getUrl(DATASET_LIST_URL, {
            [PUBLISHER_QUERY]: publisherLabel
        });
    }

}

const mapStateToProps = (state, ownProps) => ({
    "similar": similarSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetch": () => {
        dispatch(fetchSimilarDatasets(ownProps.datasetIri));
    }
});

export const SimilarDatasets = connect(
    mapStateToProps,
    mapDispatchToProps
)(_SimilarDatasets);