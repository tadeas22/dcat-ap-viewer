import React from "react";
import {connect} from "react-redux";
import {
    fetchDataset,
    fetchDistribution,
    setDistributionPageIndex
} from "./dataset-detail-actions";
import {Container} from "reactstrap";
import DistributionList from "./distribution-list";
import TagLine from "../../components/tag-line";
import DatasetPropertyTable from "./dataset-property-table";

class DatasetDetailViewComponent extends React.Component {

    componentWillMount() {
        this.props.fetchDataset(this.props.location.query.url);
    }

    render() {
        const dataset = this.props.dataset;
        const distributions = this.props.distributions;
        const ui = this.props.ui;

        if (dataset.status === "uninitialized") {
            return (
                <Container>
                    There are no data ...
                </Container>
            )
        }

        if (dataset.status === "fetching") {
            return (
                <Container>
                    Loading ...
                </Container>
            )
        }

        return (
            <Container>
                <div style={{"marginTop": "2em"}}>
                    <h3>{dataset.title}</h3>
                    <p>{dataset.description}</p>
                    <TagLine values={dataset.keyword}/>
                </div>
                <div style={{"marginTop": "2em"}}>
                    <h4>Vlastnosti</h4>
                    <DatasetPropertyTable dataset={dataset}/>
                </div>
                <div style={{"marginTop": "2em"}}>
                    <DistributionList
                        keys={dataset.distribution}
                        values={distributions}
                        fetchDistribution={this.props.fetchDistribution}
                        setPage={this.props.setDistributionPageIndex}
                        page={ui.distributionsPageIndex}
                    />
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    "ui": state.dataset.detail.ui,
    "dataset": state.dataset.detail.dataset,
    "distributions": state.dataset.detail.distributions
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchDataset": (iri) => {
        dispatch(fetchDataset(iri));
    },
    "fetchDistribution": (iri) => {
        dispatch(fetchDistribution(iri));
    },
    "setDistributionPageIndex": (page) => {
        dispatch(setDistributionPageIndex(page));
    }
});

export const DatasetDetailView = connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetDetailViewComponent);
