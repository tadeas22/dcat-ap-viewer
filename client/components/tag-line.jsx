import React from "react";
import {PropTypes} from "prop-types";
import {Badge} from "reactstrap";
import {Link} from "react-router";

const TagLine = ({values, size = 1}) => {
    if (values === undefined) {
        return null;
    }
    return (
        <div style={{"marginTop": "0.2em"}}>
            {values.map((item) => (
                <Badge
                    style={{
                        "marginLeft": "1em",
                        "marginBottom": "0.5em",
                        "fontSize": size + "em",
                    }}
                    color="default"
                    pill
                    key={item}>
                    {item}
                </Badge>
            ))}
        </div>
    );
};

TagLine.propTypes = {
    "values": PropTypes.arrayOf(PropTypes.string).isRequired,
    "size": PropTypes.number
};

export default TagLine;

export const LinkTagLine = ({values, size = 1}) => {
    if (values === undefined) {
        return null;
    }
    return (
        <div style={{"marginTop": "0.2em"}}>
            {values.map((item) => (
                <Link to={item.href} key={item.href}>
                    <Badge
                        style={{
                            "marginLeft": "1em",
                            "marginBottom": "0.5em",
                            "fontSize": size + "em",
                            "backgroundColor": "#014c8c",
                            "color": "#fff"
                        }}
                        pill>
                        {item.label}
                    </Badge>
                </Link>
            ))}
        </div>
    );
};

LinkTagLine.propTypes = {
    "values": PropTypes.arrayOf(PropTypes.object).isRequired,
    "size": PropTypes.number
};
