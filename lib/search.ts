import { Template, ResourceWindow, ResourceComboResult, WindowInfo } from './interfaces';
import { groupByRole, sortByStart, findResources } from './role-helpers';
import { prepareResourceWindow } from './transform-helpers';

export function search(template: Template, workWindows: WindowInfo[]): ResourceComboResult {
  if (template && workWindows && workWindows.length) {
    let buckets = groupByRole(workWindows.map(prepareResourceWindow));

    // sort each bucket by start
    buckets.technicians = sortByStart(buckets.technicians);
    buckets.advisors = sortByStart(buckets.advisors);
    buckets.valets = sortByStart(buckets.valets);
    buckets.managers = sortByStart(buckets.managers);

    // sort the required resources by sequence
    template.resources = template.resources
                          .sort((prev, next) => (prev.sequence>next.sequence)?1:-1);

    // do the search
    return findResources(template, buckets);
  }
}
