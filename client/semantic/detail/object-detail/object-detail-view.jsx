import React from "react";
import {connect} from "react-redux";
import {fetchObjectDetail, onObjectDetailUnmount} from "./object-detail-action";
import {dataSelector} from "./object-detail-reducer";
import {isDataReady} from "../../../services/http-request";
import {LoaderIndicator} from "../../../components/loading-indicator"
import {selectLabel, labelsSelector} from "./../../../services/labels/";
import {
    SEMANTIC_DETAIL,
    SEMANTIC_QUERY,
    getUrl
} from "./../../../application/navigation";

class _ObjectDetail extends React.Component {

    componentDidMount() {
        this.props.fetch();
    }

    render() {
        const dataEntry = this.props.data;

        if (!isDataReady(dataEntry.status)) {
            return null;
        }

        const divStyle = {
            "border": "1px solid #E7E6E3",
            "width": "100%",
            "padding": "1rem"
        };

        const listStyle = {
            "marginBottom": "0"
        };

        const data = dataEntry.data;

        return (
            <div style={divStyle}>
                Vlastnosti:
                <ul style={listStyle}>
                    {data.properties.map((entry) => (
                        <li key={entry["@id"]}>
                            <a href={this.semanticDetailLink(entry["@id"])}>
                                {selectLabel(entry, this.props.labels)}
                            </a>
                        </li>
                    ))}
                </ul>
                Je ve vztahu:
                <ul style={listStyle}>
                    {data.domain.map((entry) => (
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
    "fetch": () => dispatch(fetchObjectDetail(ownProps.iri)),
    "unmount": () => dispatch(onObjectDetailUnmount)
});

export const ObjectDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(_ObjectDetail);



