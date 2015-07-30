/// <reference path="../typings/jquery/jquery.d.ts"/>
function fetch() {
    return $.ajax({
        url: '/scheduler.json',
        method: 'POST'
    });
}
exports.fetch = fetch;
