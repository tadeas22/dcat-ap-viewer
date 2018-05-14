import {fetchLabel as _fetchLabel} from "./labels-action";
import {
    default as _reducer,
    labelsSelector as _labelsSelector
} from "./labels-reducer";
import {
    selectLabel as _selectLabel,
    selectLabels as _selectLabels,
    selectString as _selectString
} from "./labels-api";

export const fetchLabel = _fetchLabel;
export const reducer = _reducer;
export const selectLabel = _selectLabel;
export const selectLabels = _selectLabels;
export const labelsSelector = _labelsSelector;
// TODO Remove and use selectLabel only.
export const selectString = _selectString;
