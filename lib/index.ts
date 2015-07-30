import { fetch } from './open-windows';
import template from './template';
import { search } from './search';
fetch()
  .then((data) => {
    let result = search(template, data);
    console.log(result);
  });
