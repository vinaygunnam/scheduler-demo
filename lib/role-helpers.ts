import { ResourceWindow, Buckets, Template, ResourceComboResult,
ResourceType, ResourceValidationResult } from './interfaces';
export function groupByRole(workWindows: ResourceWindow[]) {
  let buckets: Buckets = {
    technicians: [],
    advisors: [],
    managers: [],
    valets: []
  };

  if (workWindows && workWindows.length) {
    workWindows.forEach((workWindow) => {
      let roles = ['technician', 'advisor', 'valet', 'manager'];
      roles.forEach((role) => {
        if (workWindow && workWindow.roles
          && workWindow.roles.indexOf(ResourceType[role]) > -1) {
          buckets[`${role}s`].push(workWindow);
        }
      });
    });
  }

  return buckets;
}

export function sortByStart(workWindows: ResourceWindow[]) {
  if (workWindows && workWindows.length) {
    return workWindows.sort((prev, next) => prev.start > next.start ? 1 : -1);
  } else {
    return workWindows;
  }
}

export function findResources(template: Template, buckets: Buckets,
  roundId: number = 1): ResourceComboResult {
  console.log(`Finding resources ... Resource level ${roundId}`);
  if (template && template.resources && template.resources.length) {
    if (buckets) {
      // process the first resource
      let resourceNeeded = template.resources[0];

      // find the right bucket by resource type
      let roleBucket = <ResourceWindow[]>buckets[`${ResourceType[resourceNeeded.role]}s`];

      // loop through the windows in the bucket
      if (roleBucket && roleBucket.length) {
        for (let i = 0; i < roleBucket.length; i++) {
          let currentResource = roleBucket[i];
          let validationResult: ResourceValidationResult
              = validateWindow(currentResource, template.start, template.end, resourceNeeded.duration);

          if (validationResult && validationResult.isValid && (currentResource.roundId || 0) < roundId) {
            currentResource.roundId = roundId;

            // block the current resource
            currentResource.blocked = true;

            console.log('Matched resource: ', currentResource);

            let remainingResources = template.resources.slice(1);
            if (remainingResources.length) {
              let isSequential = resourceNeeded.sequence !== remainingResources[0].sequence;
              let result: ResourceComboResult;
              if (isSequential) {
                let newTemplate: Template = {
                  start: validationResult.endOfWork,
                  end: template.end,
                  resources: remainingResources
                };

                result = findResources(newTemplate, buckets, roundId + 1);
              } else {
                let newTemplate: Template = {
                  start: template.start,
                  end: template.end,
                  resources: remainingResources
                };

                result = findResources(newTemplate, buckets, roundId + 1);
              }
              let comboResult: ResourceComboResult;
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
                // unblock the blocked resource
                currentResource.blocked = false;

                // look for another resource
                return findResources(template, buckets, roundId);
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

export function validateWindow(openWindow: ResourceWindow, start: number,
  end: number, duration: number): ResourceValidationResult {
    if (openWindow && !openWindow.blocked) {
      // window must be within timeframe
      if (openWindow.start >= start) {
        let workEndsAt = openWindow.start + (duration * 60);
        if (workEndsAt <= end && workEndsAt <= openWindow.end) {
          // mark this window as "blocked"
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
    }
}

export function findResource(roundId: number, start: number, end: number,
  duration: number, role: ResourceType, buckets: Buckets) {
  if (buckets) {
    let roleBucket = <ResourceWindow[]>buckets[`${ResourceType[role]}s`];
    if (roleBucket && roleBucket.length) {
      for (let i = 0; i < roleBucket.length; i++) {
        let openWindow = roleBucket[i];
        if (openWindow && !openWindow.blocked && (openWindow.roundId || 0) !== roundId) {
          // mark this window as "visited"
          openWindow.roundId = roundId;

          // window must be within timeframe
          if (openWindow.start >= start) {
            let workEndsAt = openWindow.start + (duration * 60);
            if (workEndsAt <= end && workEndsAt <= openWindow.end) {
              // mark this window as "blocked"
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
