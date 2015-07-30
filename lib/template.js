/// <reference path="../typings/moment/moment.d.ts"/>
var interfaces_1 = require('./interfaces');
var template = {
    start: parseInt(moment(new Date(2015, 6, 30, 9)).format('X'), 10),
    end: parseInt(moment(new Date(2015, 7, 8, 17)).format('X'), 10),
    resources: [
        {
            sequence: 1,
            role: interfaces_1.ResourceType.technician,
            duration: 120
        },
        {
            sequence: 1,
            role: interfaces_1.ResourceType.advisor,
            duration: 120
        },
        {
            sequence: 1,
            role: interfaces_1.ResourceType.valet,
            duration: 180
        }
    ]
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = template;
