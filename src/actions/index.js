
const SHOW_CONFIG_RIGHT = "SHOW_CONFIG_RIGHT";
const FILL_CURRENT_CONFIG = "FILL_CURRENT_CONFIG";
const REMOVE_CURRENT_CONFIG = "REMOVE_CURRENT_CONFIG";
const FILL_DROPDOWN = "FILL_DROPDOWN";
const FILL_CURRENT_AGENT = "FILL_CURRENT_AGENT";
const FILL_CURRENT_SSH = "FILL_CURRENT_SSH";
const REMOVE_CURRENT_AGENT = "REMOVE_CURRENT_AGENT";
const REMOVE_CURRENT_SSH = "REMOVE_CURRENT_SSH";
const REMOVE_CURRENT_GROUP = "REMOVE_CURRENT_GROUP";
const FILL_CURRENT_GROUP = "FILL_CURRENT_GROUP";
export default {
    SHOW_CONFIG_RIGHT,
    showConfigRight: (flag) => ({
        type: SHOW_CONFIG_RIGHT,
        flag,
    }),
    FILL_DROPDOWN,
    fillDropdown: (record) => ({
        type: FILL_DROPDOWN,
        record
    }),
    FILL_CURRENT_CONFIG,
    fillCurrentConfig: (record) => ({
        type: FILL_CURRENT_CONFIG,
        record
    }),
    REMOVE_CURRENT_CONFIG,
    removeCurrentConfig: () => ({
        type: REMOVE_CURRENT_CONFIG,
    }),
    FILL_CURRENT_AGENT,
    fillCurrentAgent: (record) => ({
        type: FILL_CURRENT_AGENT,
        record
    }),
    REMOVE_CURRENT_AGENT,
    removeCurrentAgent: () => ({
        type: REMOVE_CURRENT_AGENT,
    }),
    FILL_CURRENT_SSH,
    fillCurrentSSH: (record) => ({
        type: FILL_CURRENT_SSH,
        record
    }),
    REMOVE_CURRENT_SSH,
    removeCurrentSSH: () => ({
        type: REMOVE_CURRENT_SSH,
    }),
    REMOVE_CURRENT_GROUP,
    removeCurrentGroup: () => ({
        type: REMOVE_CURRENT_GROUP,
    }),
    FILL_CURRENT_GROUP,
    fillCurrentGroup: (record) => ({
        type: FILL_CURRENT_GROUP,
        record
    }),

}