var interfaces_1 = require('./interfaces');
function prepareResourceWindow(workerWindow) {
    if (workerWindow) {
        return {
            start: workerWindow.start,
            startText: workerWindow.startText,
            end: workerWindow.end,
            endText: workerWindow.endText,
            roles: workerWindow.roles.map(getResourceType),
            id: workerWindow.guid
        };
    }
}
exports.prepareResourceWindow = prepareResourceWindow;
function getResourceType(role) {
    if (role) {
        return interfaces_1.ResourceType[role];
    }
}
exports.getResourceType = getResourceType;
