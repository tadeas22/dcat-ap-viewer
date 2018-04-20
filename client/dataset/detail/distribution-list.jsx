import React from "react";
import {Table} from "reactstrap";
import Paginator from "../../components/paginator";
import {getString} from "../../application/strings";
import {selectLabel} from "./../../services/labels";
import {isStatusLoading, isStatusFailed} from "./../../services/http-request";

class DistributionRow extends React.Component {

    componentWillMount() {
        const dist = this.props.distribution;
        if (dist == undefined) {
            this.props.fetchDistribution(this.props.iri);
        }
    }

    render() {
        const dist_entity = this.props.distribution;

        // TODO Introduce some general handling of fetching - DAO. Children can be wrapped as a properties.
        if (dist_entity === undefined || isStatusLoading(dist_entity.status)) {
            return (
                <tr>
                    <td colSpan={3}>
                        {getString("s.fetching")}
                    </td>
                </tr>
            )
        } else if (isStatusFailed(dist_entity.status)) {
            return (
                <tr>
                    <td colSpan={3}>
                        {getString("s.fetch_failed")}
                    </td>
                </tr>
            )
        }


        let title = dist_entity.title;
        // TODO Move to helper class.
        if (title === undefined || title.length === 0) {
            title = getString("s.unnamed_distribution");
        }

        // TODO Handle multiple values.
        let url;
        if (dist_entity.downloadURL === undefined ||
            dist_entity.downloadURL.length === 0) {
            if (dist_entity.accessURL === undefined ||
                dist_entity.accessURL.length === 0) {
                // TODO Handle missing URL - ie. invalid data.
                console.log("Invalid distribution,", dist_entity);
                return null;
            } else {
                url = dist_entity.accessURL[0];
            }
        } else {
            url = dist_entity.downloadURL[0];
        }

        let formatLabel;
        if (dist_entity.format === undefined) {
            formatLabel = undefined;
        } else {
            formatLabel = selectLabel(dist_entity.format);
        }

        return (
            <tr>
                <td>
                    <a href={url} rel="nofollow" className="distribution-link">
                        {title}
                        </a>
                </td>
                <td>
                    {dist_entity.format !== undefined &&
                    <a href={dist_entity.format.iri} rel="nofollow">
                        {formatLabel}
                        </a>
                    }
                </td>
                <td>
                    {dist_entity.conformsTo !== undefined &&
                    <a href={dist_entity.conformsTo} rel="nofollow">
                        {dist_entity.conformsTo}
                        </a>
                    }
                </td>
                <td>
                    {dist_entity.license !== undefined &&
                    <a href={dist_entity.license} rel="nofollow">
                        {dist_entity.license}
                        </a>
                    }
                </td>
            </tr>
        )
    }
}

class DistributionList extends React.Component {

    render() {
        const distributionIris = this.props.keys;
        if (distributionIris === undefined) {
            return (
                <div></div>
            )
        }

        const distributions = this.props.values;
        let rows = [];
        const iterStart = this.props.pageIndex * this.props.pageSize;
        const iterEnd = Math.min(
            (this.props.pageIndex + 1) * this.props.pageSize,
            this.props.keys.length);

        for (let index = iterStart; index < iterEnd; ++index) {
            const key = this.props.keys[index];
            const distribution = distributions[key];
            rows.push((
                <DistributionRow
                    key={key}
                    iri={key}
                    distribution={distribution}
                    fetchDistribution={this.props.fetchDistribution}
                />
            ));
        }

        return (
            <div>
                <h4>{getString("s.distribution")}</h4>
                <Table>
                    <thead>
                    <tr>
                        <th>{getString("s.file")}</th>
                        <th>{getString("s.format")}</th>
                        <th>{getString("s.structure")}</th>
                        <th>{getString("s.licence")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
                <Paginator
                    recordsCount={this.props.keys.length}
                    pageIndex={this.props.pageIndex}
                    pageSize={this.props.pageSize}
                    onIndexChange={this.props.setPage}
                    onSizeChange={this.props.setPageSize}
                />
            </div>
        );
    }

}

export default DistributionList;