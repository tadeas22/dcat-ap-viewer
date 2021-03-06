import React from "react";
import {connect} from "react-redux";
import {statusSelector, catalogsSelector} from "./catalog-list-reducer";
import {fetchCatalogList} from "./catalog-list-actions";
import {CatalogList} from "./catalog-list";

import {isDataReady} from "@/app-services/http-request";
import {HttpRequestStatus} from "@/app-ui/http-request-status";
import {CATALOG_LIST_URL} from "@/app/navigation";
import {getString} from "@/app-services/strings";
import HeadLinks from "@/app-ui/head-links";

class _CatalogsViewContainer extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        if (isDataReady(this.props.status)) {
            return (
                <React.Fragment>
                    <HeadLinks title={getString("catalogs")}
                               url={CATALOG_LIST_URL}/>
                    <CatalogList catalogs={this.props.catalogs}/>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <HeadLinks title={getString("catalogs")}
                               url={CATALOG_LIST_URL}/>
                    <HttpRequestStatus status={this.props.status}/>
                </React.Fragment>
            )
        }
    }

    componentWillUnmount() {

    }

}

const mapStateToProps = (state, ownProps) => ({
    "status": statusSelector(state),
    "catalogs": catalogsSelector(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchData": () => dispatch(fetchCatalogList())
});

export const CatalogsViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(_CatalogsViewContainer);
