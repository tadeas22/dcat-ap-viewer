import React from "react";
import {connect} from "react-redux";
import {fetchRelationshipDetail, onRelationshipDetailUnmount} from "./relationship-detail-action";
import {dataSelector} from "./relationship-detail-reducer";
import {isDataReady} from "../../../services/http-request";
import {LoaderIndicator} from "../../../components/loading-indicator"
import {selectLabel, labelsSelector} from "./../../../services/labels/";
import {
    SEMANTIC_DETAIL,
    SEMANTIC_QUERY,
    getUrl
} from "./../../../application/navigation";

class _RelationshipDetail extends React.Component {

    componentDidMount() {
        this.props.fetch();
    }

    render() {

        if (!isDataReady(this.props.data.status)) {
            return (
                <LoaderIndicator/>
            )
        }

        const divStyle = {
            "border": "1px solid #E7E6E3",
            "width": "100%",
            "padding": "1rem"
        };

        const listStyle = {
            "marginBottom": "0"
        };

        const data = this.props.data.data;

        return (
            <div style={divStyle}>
                Účastníci vztahu:
                <ul style={listStyle}>
                    {data.range.map((entry) => (
                        <li key={entry["@id"]}>
                            <a href={this.semanticDetailLink(entry["@id"])}>
                                {selectLabel(entry, this.props.labels)}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.unmount();
    }

    semanticDetailLink(iri) {
        return getUrl(SEMANTIC_DETAIL, {[SEMANTIC_QUERY]: iri})
    }

}

const mapStateToProps = (state, ownProps) => ({
    "data": dataSelector(state),
    "labels": labelsSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetch": () => dispatch(fetchRelationshipDetail(ownProps.iri)),
    "unmount": () => dispatch(onRelationshipDetailUnmount)
});

export const RelationshipDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(_RelationshipDetail);



