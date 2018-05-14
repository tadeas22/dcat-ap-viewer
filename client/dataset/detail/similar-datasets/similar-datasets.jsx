import React from "react";
import {connect} from "react-redux";
import {fetchSimilarDatasets} from "./similar-datasets-actions";
import {similarSelector} from "./similar-datasets-reducer";
import {isDataReady} from "./../../../services/http-request";
import {LoaderIndicator} from "./../../../components/loading-indicator";
import {DatasetsTable} from "../../../components/dataset-table";
import {labelsSelector} from "../../../services/labels/";

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
        return (
            <DatasetsTable
                datasets={this.props.similar.data}
                labels={this.props.labels}/>
        );
    }

}

const mapStateToProps = (state, ownProps) => ({
    "similar": similarSelector(state),
    "labels": labelsSelector(state)
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