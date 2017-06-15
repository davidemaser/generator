/**
 * Created by David Maser on 15/06/2017.
 */
export const errors = {
    log:[],
    alert:function(title, body, write, caller) {
    write === true ? errors.report(title, body, caller) : '';
    console.warn(title + ' : ' + body);
    return title + ' : ' + body;
  },
  report:function(title, body,caller) {
  let _date = new Date();
  this.log.push({
    date:_date,
    title:title,
    error:body,
    caller:caller
  });
}
}