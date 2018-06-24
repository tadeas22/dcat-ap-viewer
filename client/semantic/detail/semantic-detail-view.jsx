import React from "react";
import {connect} from "react-redux";
import {Container} from "reactstrap";
import {detailSelector, datasetSelector} from "./semantic-detail-reducer";
import {fetchSsp, fetchAnnotatedDatasets} from "./semantic-detail-actions";
import {getString} from "../../application/strings";
import setPageTitle from "../../services/page-title";
import {isDataReady} from "../../services/http-request";
import {HttpRequestStatus} from "./../../application/http-request-status";
import {selectLabel, labelsSelector} from "../../services/labels/";
import {SSP} from "../../services/vocabulary";
import {DatasetsTable} from "../../components/dataset-table";
import {ObjectDetail} from "./object-detail";
import {PropertyDetail} from "./property-detail";
import {RelationshipDetail} from "./relationship-detail";
import {
    getUrl,
    SEMANTIC_DETAIL,
    SEMANTIC_QUERY
} from "../../application/navigation";

class _SemanticDetailView extends React.Component {

    componentWillMount() {
        this.props.fetchSsp();
        setPageTitle(getString("title.sematic-detail"));
    }


    render() {
        const dataEntry = this.props.data;
        if (!isDataReady(dataEntry.status)) {
            return (
                <HttpRequestStatus status={dataEntry.status}/>
            )
        }
        const data = dataEntry.data;
        const label = selectLabel(data, this.props.labels);
        setPageTitle(label);
        return (
            <Container>
                <div style={{"marginTop": "2em"}}>
                    <h3>{label}</h3>
                    <p>{selectLabel(data.glossary, this.props.labels)}</p>
                </div>
                <SemanticDetail data={data} labels={this.props.labels}/>
                <Legislation conformsTo={data["conformsTo"]}/>
                {data["@types"].includes(SSP.TypObjektu) ?
                    <div>
                        <br/>
                        <ObjectDetail iri={data["@id"]}/>
                    </div>
                    : null}
                {data["@types"].includes(SSP.TypVlastnosti) ?
                    <div>
                        <br/>
                        <PropertyDetail iri={data["@id"]}/>
                    </div>
                    : null}
                {data["@types"].includes(SSP.TypVztahu) ?
                    <div>
                        <br/>
                        <RelationshipDetail iri={data["@id"]}/>
                    </div>
                    : null}
                {isDataReady(this.props.datasets.status) ?
                    <div>
                        <br/>
                        <DatasetsTable datasets={this.props.datasets.data}
                                       labels={this.props.labels}/>
                    </div>
                    : null}
                <br/>
            </Container>
        )
    }

}

const mapStateToProps = (state, ownProps) => ({
    "data": detailSelector(state),
    "datasets": datasetSelector(state),
    "labels": labelsSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchSsp": (iri) => {
        dispatch(fetchSsp(ownProps.location.query.iri));
        dispatch(fetchAnnotatedDatasets(ownProps.location.query.iri));
    },
});

export const SemanticDetailView = connect(
    mapStateToProps,
    mapDispatchToProps
)(_SemanticDetailView);

const SemanticDetail = ({data, labels}) => {

    const tableStyle = {
        "border": "1px solid #E7E6E3",
        "width": "100%",
        "padding": "1rem",
        "marginTop": "1rem"
    };

    let nadrazenePojmy = null;
    if (data["broader"].length > 0) {
        nadrazenePojmy = (
            <div>
                Nadřazené pojmy:
                <ul>
                    {data["broader"].map((iri) => (
                        <li key={iri}>
                            <a href={semanticDetailLink(iri)}>
                                {iri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }


    return (
        <div style={tableStyle}>
            <a href={data["@id"]}>{data["@id"]}</a>
            {nadrazenePojmy}
        </div>
    );
};

function semanticDetailLink(iri) {
    return getUrl(SEMANTIC_DETAIL, {[SEMANTIC_QUERY]: iri})
}

const Legislation = ({conformsTo}) => {
    if (conformsTo === undefined || conformsTo.length === 0) {
        return null;
    }

    const tableStyle = {
        "border": "1px solid #E7E6E3",
        "width": "100%",
        "padding": "1rem",
        "marginTop": "1rem"
    };

    return (
        <div style={tableStyle}>
            Zákony:
            <ul>
                {conformsTo.map((entry) => (
                    <li key={entry["link"]}>
                        <a href={entry["link"]}>{entry["label"]}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
};

