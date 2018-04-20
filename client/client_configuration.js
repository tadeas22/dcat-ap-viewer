(function initialize() {
    const propertiesReader = require("properties-reader");
    const propertyFilePath = readProperty("configFileLocation");
    const properties = propertiesReader(propertyFilePath);

    const sparql = properties.get("virtuoso.sparql.url");
    const couchdb = properties.get("couchdb.url");

    let footerPath = properties.get("footer_file_path");
    if (footerPath === 0 || footerPath === null) {
        footerPath = undefined;
    }

    module.exports = {
        "CONST_TITLE_PREFIX": properties.get("client.title_prefix"),
        "CONST_TITLE_SUFFIX": properties.get("client.title_suffix"),
        "REPOSITORY_TYPE": isEmptyOrUnset(couchdb) ? "SPARQL" : "COUCHDB",
        "SENTRY_REPORT": isEmptyOrUnset(properties.get("sentry.url")),
        "SENTRY_URL": properties.get("sentry.url"),
        "IS_PRODUCTION_ENV":  process.env.NODE_ENV === "production",
        "GOOGLE_TAG_MANAGER_ID" : properties.get("google_tag_manager.id") || false,
        "FOOTER_FILE_PATH" : footerPath,
        "KEYWORD_CLOUD_MIN_COUNT": properties.get("client.keyword_cloud.min")
    };
})();

function readProperty(option) {
    const argument = readProgramArgument("-" + option);
    if (argument !== undefined) {
        return argument;
    } else if (process.env[option] !== undefined) {
        return process.env[option];
    } else {
        throw "Missing property/argument: " + option;
    }
}

function readProgramArgument(name) {
    let value = undefined;
    process.argv.forEach(function (val, index) {
        const line = val.split("=");
        if (line.length != 2) {
            return;
        }
        if (line[0] === name) {
            value = line[1];
        }
    });
    return value;
}

function isEmptyOrUnset(value) {
    return value === 0 || value === null || value === undefined;
}

