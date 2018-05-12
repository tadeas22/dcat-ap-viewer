import React from "react";
import {connect} from "react-redux";
import {fetchSkosConcept, onComponentUnmount} from "./skos-concept-action";
import {conceptsSelector} from "./skos-concept-reducer";
import {LinkTagLine} from "./../../../components/tag-line";
import {STATUS_FETCHED} from "./../../../services/http-request";
import {LoaderIndicator} from "./../../../components/loading-indicator";
import {selectLabel} from "./../../../services/labels";
import {
    getUrl,
    SEMANTIC_DETAIL,
    SEMANTIC_QUERY
} from "./../../../application/navigation";

class _SkosConcepts extends React.Component {

    componentDidMount() {
        this.props.concepts.forEach((iri) => this.props.fetch(iri));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.concepts.length === nextProps.concepts.length) {
            return;
        }
        nextProps.concepts.forEach((iri) => this.props.fetch(iri));
    }

    render() {
        if (this.props.data === undefined) {
            return (
                <LoaderIndicator/>
            )
        }

        const scheme = "https://ssp.opendata.cz/slovník/legislativní/předpis/247/1995/glosář";

        const filteredConcepts = Object.values(this.props.data)
            .filter((entity) => entity.status === STATUS_FETCHED)
            .filter((entity) => entity.data !== undefined)
            .filter((entity) => entity.data.inScheme.includes(scheme))
            .map((entity) => ({
                "@id": entity.data["@id"],
                "label": selectLabel(entity.data["label"]),
                "conformsTo": entity.data["conformsTo"]
            }));

        const groups = this.groupByConformsTo(filteredConcepts);

        return (
            <div>
                {Object.keys(groups).map((key) => {
                    const value = groups[key];
                    // TODO Use IRI to label translation mechanism.
                    return (
                        <div key={key}>
                            <LinkTagLine
                                values={value.data.map((entity) => ({
                                    "label": entity["label"],
                                    "href": getUrl(SEMANTIC_DETAIL, {[SEMANTIC_QUERY]: entity["@id"]})
                                }))}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }

    groupByConformsTo(themes) {
        const groups = {
            "": {
                "data": [],
                "conformsTo": []
            }
        };
        themes.forEach(theme => {
            const conformsTo = theme["conformsTo"];
            if (conformsTo === undefined || conformsTo.length == 0) {
                groups[""].data.push(theme);
                return;
            }
            let key = "";
            conformsTo.sort().forEach((iri) => {
                key += iri;
            });
            if (groups[key] === undefined) {
                groups[key] = {
                    "data": [],
                    "conformsTo": conformsTo
                }
            }
            groups[key].data.push(theme);
        });
        return groups;
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

}

const mapStateToProps = (state, ownProps) => ({
    "data": conceptsSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetch": (iri) => dispatch(fetchSkosConcept(iri)),
    "onUnmount": () => dispatch(onComponentUnmount())
});

export const SkosConcepts = connect(
    mapStateToProps,
    mapDispatchToProps
)(_SkosConcepts);



