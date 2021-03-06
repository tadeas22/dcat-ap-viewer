import React from "react";
import {connect} from "react-redux";
import {
    fetchDistribution
} from "./distribution-action";
import {
    distributionDataSelector,
    distributionStatusSelector
} from "./distribution-reducer";
import {isDataReady} from "@/app-services/http-request";
import {labelsSelector} from "@/app-services/labels/index";
import Distribution from "./distribution";

class _DistributionContainer extends React.Component {

    componentWillMount() {
        // TODO Add check for loading already loaded (loading) data.
        if (this.props.distribution === undefined) {
            this.props.fetchData();
        }
    }

    render() {
        // TODO Add support for loading error.
        if (!isDataReady(this.props.status)) {
            return (
                <Distribution
                    isLoading={true}
                    labels={this.props.labels}/>
            )
        }
        return (
            <Distribution
                isLoading={false}
                labels={this.props.labels}
                distribution={this.props.distribution}/>
        )
    }

}

const mapStateToProps = (state, ownProps) => ({
    "status": distributionStatusSelector(state, ownProps.iri),
    "distribution": distributionDataSelector(state, ownProps.iri),
    "labels": labelsSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchData": () => dispatch(fetchDistribution(ownProps.iri))
});

export const DistributionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(_DistributionContainer);
