/// <reference path="../typings/jquery/jquery.d.ts"/>
export function fetch() {
  return $.ajax({
    url: '/scheduler.json',
    method: 'POST'
  });
}
