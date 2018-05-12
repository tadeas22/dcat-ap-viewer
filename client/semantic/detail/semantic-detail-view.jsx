import React from "react";
import {connect} from "react-redux";
import {Container} from "reactstrap";
import {detailSelector, datasetSelector} from "./semantic-detail-reducer";
import {fetchSsp, fetchAnnotatedDatasets} from "./semantic-detail-actions";
import {getString} from "../../application/strings";
import setPageTitle from "../../services/page-title";
import {isDataReady} from "../../services/http-request";
import {HttpRequestStatus} from "./../../application/http-request-status";
import {selectLabel} from "../../services/labels";
import {SSP} from "../../services/vocabulary";
import {DatasetsTable} from "../../components/dataset-table";
import {ObjectDetail} from "./object-detail";

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
        const label = selectLabel(data.label);
        setPageTitle(label);
        return (
            <Container>
                <div style={{"marginTop": "2em"}}>
                    <h3>{label}</h3>
                    <p>{selectLabel(data.glossary.label)}</p>
                </div>
                {data["@id"]}
                <Legislation conformsTo={data["conformsTo"]}/>
                {data["@types"].includes(SSP.TypOjektu) ?
                    <div>
                        <br/>
                        <ObjectDetail iri={data["@id"]}/>
                    </div>
                    : null}
                {data["@types"].includes(SSP.TypVlastnosti) ?
                    <div>
                        <br/>
                        <Vlastnost/>
                    </div>
                    : null}
                {data["@types"].includes(SSP.TypVztahu) ?
                    <div>
                        <br/>
                        <Vztah/>
                    </div>
                    : null}
                {isDataReady(this.props.datasets.status) ?
                    <div>
                        <br/>
                        <DatasetsTable datasets={this.props.datasets.data}/>
                    </div>
                    : null}
                <br/>
            </Container>
        )
    }

}

const mapStateToProps = (state, ownProps) => ({
    "data": detailSelector(state),
    "datasets": datasetSelector(state)
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


class Vlastnost extends React.Component {
    render() {
        // TODO
        return null;
    }
}

class Vztah extends React.Component {
    render() {
        // TODO
        return null;
    }
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
            {
                conformsTo.map((link) => (
                    <div key={link}>
                        <a href={link}>{link}</a>
                    </div>
                ))
            }
        </div>
    )
};

/*

POJMY:

https://ssp.opendata.cz/describe/?url=https%3A%2F%2Fssp.opendata.cz%2Fslovn%C3%ADk%2Flegislativn%C3%AD%2Fp%C5%99edpis%2F247%2F1995%2Fpojem%2FMinisterstvo-vnitra

https://ssp.opendata.cz/slovn%C3%ADk/legislativn%C3%AD/p%C5%99edpis/247/1995/pojem/n%C3%A1zev-politick%C3%A9-strany-politick%C3%A9ho-hnut%C3%AD-nebo-koalice

https://ssp.opendata.cz/describe/?url=https%3A%2F%2Fssp.opendata.cz%2Fslovn%C3%ADk%2Flegislativn%C3%AD%2Fp%C5%99edpis%2F111%2F2009%2Fpojem%2Fje-evidov%C3%A1na

LOCALHOST:

http://localhost:3000/ssp?iri=https%3A%2F%2Fssp.opendata.cz%2Fslovn%C3%ADk%2Flegislativn%C3%AD%2Fp%C5%99edpis%2F247%2F1995%2Fpojem%2Fn%C3%A1zev-politick%C3%A9-strany-politick%C3%A9ho-hnut%C3%AD-nebo-koalice

http://localhost:3000/ssp?iri=https%3A%2F%2Fssp.opendata.cz%2Fslovn%C3%ADk%2Flegislativn%C3%AD%2Fp%C5%99edpis%2F247%2F1995%2Fpojem%2FMinisterstvo-vnitra

 */