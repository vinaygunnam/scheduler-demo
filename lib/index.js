var open_windows_1 = require('./open-windows');
var template_1 = require('./template');
var search_1 = require('./search');
open_windows_1.fetch()
    .then(function (data) {
    var result = search_1.search(template_1.default, data);
    console.log(result);
});
