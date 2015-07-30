/// <reference path="../typings/moment/moment.d.ts"/>
import { Template, ResourceType } from './interfaces';

let template: Template = {
  start: parseInt(moment(new Date(2015, 6, 30, 9)).format('X'), 10),
  end: parseInt(moment(new Date(2015, 7, 8, 17)).format('X'), 10),
  resources: [
    {
      sequence: 1,
      role: ResourceType.technician,
      duration: 120
    },
    {
      sequence: 1,
      role: ResourceType.advisor,
      duration: 120
    },
    {
      sequence: 1,
      role: ResourceType.valet,
      duration: 180
    }
  ]
};

export default template;
