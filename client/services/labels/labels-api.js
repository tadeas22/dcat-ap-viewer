import {getLanguage} from "../../application/navigation";

export const selectLabel = (resource, labelState) => {
    const labels = selectLabels(resource, labelState);
    if (labels.length > 1) {
        console.warn("Using only one label for:", value, "->", labels[0]);
    }
    return labels[0];
};

export const selectLabels = (resource, labelState) => {
    const languages = getLanguagePreferences();
    const labels = selectLabelFromState(resource, labelState, languages);
    return labels;
};

function selectLabelFromState(resource, labelState, languages) {
    if (resource === undefined) {
        console.trace("Label for undefined resource requested.");
        return [];
    }
    if (typeof(resource) === "object") {
        resource = resource["@id"];
    }
    const strings = labelState[resource];
    if (strings === undefined) {
        return [resource];
    }
    return selectString(strings, languages);
}

export function selectString(value, languages) {
    for (let index in languages) {
        if (!languages.hasOwnProperty(index)) {
            continue;
        }
        const lang = languages[index];
        const labels = value[lang];
        if (labels === undefined) {
            continue;
        }
        return labels;
    }
    const anyLanguageLabel = selectAnyLanguageLabel(value);
    if (anyLanguageLabel) {
        return anyLanguageLabel;
    }
    return [value["@id"]];
}

function selectAnyLanguageLabel(value) {
    const keys = Object.keys(value);
    for (let index in keys) {
        const key = keys[index];
        if (key !== "@id") {
            return value[key];
        }
    }
}


function getLanguagePreferences() {
    return [
        getLanguage(), "en", ""
    ]
}
