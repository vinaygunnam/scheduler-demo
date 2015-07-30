var interfaces_1 = require('./interfaces');
function groupByRole(workWindows) {
    var buckets = {
        technicians: [],
        advisors: [],
        managers: [],
        valets: []
    };
    if (workWindows && workWindows.length) {
        workWindows.forEach(function (workWindow) {
            var roles = ['technician', 'advisor', 'valet', 'manager'];
            roles.forEach(function (role) {
                if (workWindow && workWindow.roles
                    && workWindow.roles.indexOf(interfaces_1.ResourceType[role]) > -1) {
                    buckets[(role + "s")].push(workWindow);
                }
            });
        });
    }
    return buckets;
}
exports.groupByRole = groupByRole;
function sortByStart(workWindows) {
    if (workWindows && workWindows.length) {
        return workWindows.sort(function (prev, next) { return prev.start > next.start ? 1 : -1; });
    }
    else {
        return workWindows;
    }
}
exports.sortByStart = sortByStart;
function findResources(template, buckets, roundId) {
    if (roundId === void 0) { roundId = 1; }
    console.log("Finding resources ... Resource level " + roundId);
    if (template && template.resources && template.resources.length) {
        if (buckets) {
            var resourceNeeded = template.resources[0];
            var roleBucket = buckets[(interfaces_1.ResourceType[resourceNeeded.role] + "s")];
            if (roleBucket && roleBucket.length) {
                for (var i = 0; i < roleBucket.length; i++) {
                    var currentResource = roleBucket[i];
                    var validationResult = validateWindow(currentResource, template.start, template.end, resourceNeeded.duration);
                    if (validationResult && validationResult.isValid && (currentResource.roundId || 0) < roundId) {
                        currentResource.roundId = roundId;
                        currentResource.blocked = true;
                        console.log('Matched resource: ', currentResource);
                        var remainingResources = template.resources.slice(1);
                        if (remainingResources.length) {
                            var isSequential = resourceNeeded.sequence !== remainingResources[0].sequence;
                            var result = void 0;
                            if (isSequential) {
                                var newTemplate = {
                                    start: validationResult.endOfWork,
                                    end: template.end,
                                    resources: remainingResources
                                };
                                result = findResources(newTemplate, buckets, roundId + 1);
                            }
                            else {
                                var newTemplate = {
                                    start: template.start,
                                    end: template.end,
                                    resources: remainingResources
                                };
                                result = findResources(newTemplate, buckets, roundId + 1);
                            }
                            var comboResult = void 0;
                            if (result) {
                                comboResult = {
                                    resources: [currentResource].concat(result.resources),
                                    requirementsMet: result.requirementsMet
                                };
                            }
                            else {
                                comboResult = {
                                    resources: [currentResource],
                                    requirementsMet: false
                                };
                            }
                            if (comboResult.requirementsMet) {
                                return comboResult;
                            }
                            else {
                                currentResource.blocked = false;
                                return findResources(template, buckets, roundId);
                            }
                        }
                        else {
                            return {
                                resources: [currentResource],
                                requirementsMet: true
                            };
                        }
                    }
                    else {
                        return {
                            resources: null,
                            requirementsMet: false
                        };
                    }
                }
            }
            else {
                return {
                    resources: null,
                    requirementsMet: false
                };
            }
        }
        else {
            return {
                resources: null,
                requirementsMet: false
            };
        }
    }
    return {
        resources: null,
        requirementsMet: true
    };
}
exports.findResources = findResources;
function validateWindow(openWindow, start, end, duration) {
    if (openWindow && !openWindow.blocked) {
        if (openWindow.start >= start) {
            var workEndsAt = openWindow.start + (duration * 60);
            if (workEndsAt <= end && workEndsAt <= openWindow.end) {
                openWindow.blocked = true;
                return {
                    isValid: true,
                    endOfWork: workEndsAt
                };
            }
        }
    }
    return {
        isValid: false,
        endOfWork: null
    };
}
exports.validateWindow = validateWindow;
function findResource(roundId, start, end, duration, role, buckets) {
    if (buckets) {
        var roleBucket = buckets[(interfaces_1.ResourceType[role] + "s")];
        if (roleBucket && roleBucket.length) {
            for (var i = 0; i < roleBucket.length; i++) {
                var openWindow = roleBucket[i];
                if (openWindow && !openWindow.blocked && (openWindow.roundId || 0) !== roundId) {
                    openWindow.roundId = roundId;
                    if (openWindow.start >= start) {
                        var workEndsAt = openWindow.start + (duration * 60);
                        if (workEndsAt <= end && workEndsAt <= openWindow.end) {
                            openWindow.blocked = true;
                            return {
                                resource: openWindow,
                                endOfWork: workEndsAt
                            };
                        }
                    }
                }
            }
        }
    }
    return null;
}
exports.findResource = findResource;
