/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var open_windows_1 = __webpack_require__(1);
	var template_1 = __webpack_require__(2);
	var search_1 = __webpack_require__(4);
	open_windows_1.fetch().then(function (data) {
	    var result = search_1.search(template_1['default'], data);
	    console.log(result);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	/// <reference path="../typings/jquery/jquery.d.ts"/>
	'use strict';

	function fetch() {
	    return $.ajax({
	        url: '/scheduler.json',
	        method: 'POST'
	    });
	}
	exports.fetch = fetch;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../typings/moment/moment.d.ts"/>
	'use strict';

	var interfaces_1 = __webpack_require__(3);
	var template = {
	    start: parseInt(moment(new Date(2015, 6, 30, 9)).format('X'), 10),
	    end: parseInt(moment(new Date(2015, 7, 8, 17)).format('X'), 10),
	    resources: [{
	        sequence: 1,
	        role: interfaces_1.ResourceType.technician,
	        duration: 120
	    }, {
	        sequence: 1,
	        role: interfaces_1.ResourceType.advisor,
	        duration: 120
	    }, {
	        sequence: 1,
	        role: interfaces_1.ResourceType.valet,
	        duration: 180
	    }]
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports['default'] = template;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	(function (ResourceType) {
	    ResourceType[ResourceType["technician"] = 0] = "technician";
	    ResourceType[ResourceType["advisor"] = 1] = "advisor";
	    ResourceType[ResourceType["valet"] = 2] = "valet";
	    ResourceType[ResourceType["manager"] = 3] = "manager";
	})(exports.ResourceType || (exports.ResourceType = {}));
	var ResourceType = exports.ResourceType;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var role_helpers_1 = __webpack_require__(5);
	var transform_helpers_1 = __webpack_require__(6);
	function search(template, workWindows) {
	    if (template && workWindows && workWindows.length) {
	        var buckets = role_helpers_1.groupByRole(workWindows.map(transform_helpers_1.prepareResourceWindow));
	        buckets.technicians = role_helpers_1.sortByStart(buckets.technicians);
	        buckets.advisors = role_helpers_1.sortByStart(buckets.advisors);
	        buckets.valets = role_helpers_1.sortByStart(buckets.valets);
	        buckets.managers = role_helpers_1.sortByStart(buckets.managers);
	        template.resources = template.resources.sort(function (prev, next) {
	            return prev.sequence > next.sequence ? 1 : -1;
	        });
	        return role_helpers_1.findResources(template, buckets);
	    }
	}
	exports.search = search;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var interfaces_1 = __webpack_require__(3);
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
	                if (workWindow && workWindow.roles && workWindow.roles.indexOf(interfaces_1.ResourceType[role]) > -1) {
	                    buckets[role + "s"].push(workWindow);
	                }
	            });
	        });
	    }
	    return buckets;
	}
	exports.groupByRole = groupByRole;
	function sortByStart(workWindows) {
	    if (workWindows && workWindows.length) {
	        return workWindows.sort(function (prev, next) {
	            return prev.start > next.start ? 1 : -1;
	        });
	    } else {
	        return workWindows;
	    }
	}
	exports.sortByStart = sortByStart;
	function findResources(_x, _x2, _x3) {
	    var _again = true;

	    _function: while (_again) {
	        var template = _x,
	            buckets = _x2,
	            roundId = _x3;
	        resourceNeeded = roleBucket = i = currentResource = validationResult = remainingResources = isSequential = result = newTemplate = newTemplate = comboResult = undefined;
	        _again = false;

	        if (roundId === void 0) {
	            roundId = 1;
	        }
	        console.log("Finding resources ... Resource level " + roundId);
	        if (template && template.resources && template.resources.length) {
	            if (buckets) {
	                var resourceNeeded = template.resources[0];
	                var roleBucket = buckets[interfaces_1.ResourceType[resourceNeeded.role] + "s"];
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
	                                } else {
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
	                                } else {
	                                    comboResult = {
	                                        resources: [currentResource],
	                                        requirementsMet: false
	                                    };
	                                }
	                                if (comboResult.requirementsMet) {
	                                    return comboResult;
	                                } else {
	                                    currentResource.blocked = false;
	                                    _x = template;
	                                    _x2 = buckets;
	                                    _x3 = roundId;
	                                    _again = true;
	                                    continue _function;
	                                }
	                            } else {
	                                return {
	                                    resources: [currentResource],
	                                    requirementsMet: true
	                                };
	                            }
	                        } else {
	                            return {
	                                resources: null,
	                                requirementsMet: false
	                            };
	                        }
	                    }
	                } else {
	                    return {
	                        resources: null,
	                        requirementsMet: false
	                    };
	                }
	            } else {
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
	}
	exports.findResources = findResources;
	function validateWindow(openWindow, start, end, duration) {
	    if (openWindow && !openWindow.blocked) {
	        if (openWindow.start >= start) {
	            var workEndsAt = openWindow.start + duration * 60;
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
	        var roleBucket = buckets[interfaces_1.ResourceType[role] + "s"];
	        if (roleBucket && roleBucket.length) {
	            for (var i = 0; i < roleBucket.length; i++) {
	                var openWindow = roleBucket[i];
	                if (openWindow && !openWindow.blocked && (openWindow.roundId || 0) !== roundId) {
	                    openWindow.roundId = roundId;
	                    if (openWindow.start >= start) {
	                        var workEndsAt = openWindow.start + duration * 60;
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var interfaces_1 = __webpack_require__(3);
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

/***/ }
/******/ ]);