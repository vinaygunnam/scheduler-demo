var role_helpers_1 = require('./role-helpers');
var transform_helpers_1 = require('./transform-helpers');
function search(template, workWindows) {
    if (template && workWindows && workWindows.length) {
        var buckets = role_helpers_1.groupByRole(workWindows.map(transform_helpers_1.prepareResourceWindow));
        buckets.technicians = role_helpers_1.sortByStart(buckets.technicians);
        buckets.advisors = role_helpers_1.sortByStart(buckets.advisors);
        buckets.valets = role_helpers_1.sortByStart(buckets.valets);
        buckets.managers = role_helpers_1.sortByStart(buckets.managers);
        template.resources = template.resources
            .sort(function (prev, next) { return (prev.sequence > next.sequence) ? 1 : -1; });
        return role_helpers_1.findResources(template, buckets);
    }
}
exports.search = search;
