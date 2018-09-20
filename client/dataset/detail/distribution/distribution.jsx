import React from "react";
import {getString} from "@/app-services/strings";
import {selectLabelNoIri} from "@/app-services/labels/index";
import {selectLabel} from "@/app-services/labels";
import authorship from "./terms-of-use/authorship";
import databaseAuthorship from "./terms-of-use/database-authorship";
import protectedDatabaseAuthorship
    from "./terms-of-use/protected-database-authorship";
import personalData from "./terms-of-use/personal-data";
import downloadListItem from "./access/download-list-item";
import schemaListItem from "./access/schema-list-item";
import mediaTypeItem from "./access/media-type-item";

export default class Distribution extends React.PureComponent {
    render() {
        const {labels, distribution, isLoading} = this.props;

        if (isLoading) {
            // TODO Add loading indicator !!
            return null;
        }

        const title = selectLabelNoIri(labels, distribution);

        return (
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                <div className="card p-2">
                    <div className="card-body px-2">
                        {title === undefined ?
                            <span className="sr-only">
                            {getString("unnamed_distribution")}
                            </span>
                            :
                            <h5 className="card-title">
                                {title}
                            </h5>
                        }
                        {dataFormatItem(labels, distribution)}
                    </div>
                    <div className="row">
                        <div className="col-6 pr-1">
                            {licenseColumn(distribution)}
                        </div>
                        <div className="col-6 pl-1">
                            {accessColumn(labels, distribution)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function dataFormatItem(labels, distribution) {
    const label = selectLabel(labels, distribution.format);
    if (label === undefined) {
        return null;
    }
    return (
        <h6 className="card-subtitle mb-2 text-muted">
            {label}
        </h6>
    )
}

function licenseColumn(distribution) {
    return (
        <div className="card">
            <h6 className="card-title text-muted pl-2 pt-2">
                {getString("distribution_license")}
            </h6>
            <ul className="list-group list-group-flush">
                {authorship(distribution)}
                {databaseAuthorship(distribution)}
                {protectedDatabaseAuthorship(distribution)}
                {personalData(distribution)}
            </ul>
        </div>
    )
}

function accessColumn(labels, distribution) {
    return (
        <div className="card">
            <h6 className="card-title text-muted pl-2 pt-2">
                {getString("distribution_access")}
            </h6>
            <ul className="list-group list-group-flush">
                {downloadListItem(distribution)}
                {schemaListItem(distribution)}
                {mediaTypeItem(labels, distribution)}
            </ul>
        </div>
    );
}
