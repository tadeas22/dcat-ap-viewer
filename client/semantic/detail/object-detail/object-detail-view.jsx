import React from "react";
import {connect} from "react-redux";
import {fetchObjectDetail, onObjectDetailUnmount} from "./object-detail-action";
import {dataSelector} from "./object-detail-reducer";
import {isDataReady} from "../../../services/http-request";
import {LoaderIndicator} from "../../../components/loading-indicator"
import {selectLabel} from "./../../../services/labels";
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

        if (!isDataReady(this.props.data.status)) {
            return (
                <LoaderIndicator/>
            )
        }

        const tableStyle = {
            "border": "1px solid #E7E6E3",
            "width": "100%",
            "padding": "1rem",
            "marginTop": "1rem"
        };

        const listStyle = {
            "marginBottom": "0"
        };

        const data = this.props.data.data;
        console.log(">", data);

        return (
            <div style={tableStyle}>
                Detail sémantického objektu:
                <br/>
                Vlastnosti:
                <ul style={listStyle}>
                    {data.properties.map((entry) => (
                        <li key={entry["@id"]}>
                            <a href={this.semanticDetailLink(entry["@id"])}>
                                {selectLabel(entry["label"])}
                            </a>
                        </li>
                    ))}
                </ul>
                Je ve vztahu:
                <ul style={listStyle}>
                    {data.inRelations.map((entry) => (
                        <li key={entry["@id"]}>
                            <a href={this.semanticDetailLink(entry["@id"])}>
                                {selectLabel(entry["label"])}
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
        return getUrl(SEMANTIC_DETAIL, {SEMANTIC_QUERY: iri})
    }

}

const mapStateToProps = (state, ownProps) => ({
    "data": dataSelector(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetch": () => dispatch(fetchObjectDetail(ownProps.iri)),
    "unmount": () => dispatch(onObjectDetailUnmount)
});

export const ObjectDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(_ObjectDetail);



