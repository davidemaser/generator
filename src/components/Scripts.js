/**
 * Created by David Maser on 15/06/2017.
 */
import {config} from './Config';
import {helpers} from './Helpers';
export const scripts = {
  load: function (obj) {
    let _append = config.scripts.extension.append;
    /*
     the obj parameter should be formatted as follows
     [
     {
     id:'demo',
     url:'demo',
     root:'string',
     extension:'string',
     //optional
     functions:[
     {
     call:'testAgain',
     params:['string','or','array']
     },
     {
     call:'test'
     }
     ]
     //end optional
     }
     ]
     */
    let _multiple = Array.isArray(obj);
    let _tempArray;
    if (_multiple === true) {
      for (let m in obj) {
        _tempArray = obj[m];
      }
    } else {
      _tempArray = obj;
    }
    if (typeof _tempArray === 'object') {
      $.each(obj, function (key) {
        let _root = obj[key].root || config.scripts.root;
        let _ext = obj[key].ext || config.scripts.extension.format;
        let _tempFunctions = obj[key].functions || null,
          _tempURL = _root + obj[key].url;
        _tempURL += _append === true ? '.' + _ext : '';
        $.getScript(_tempURL).done(function () {
          if (_tempFunctions !== null) {
            if (Array.isArray(_tempFunctions) === true) {
              for (let f in _tempFunctions) {
                helpers.executeFunctionByName(_tempFunctions[f].call, window, _tempFunctions[f].params);
              }
            } else {
              helpers.executeFunctionByName(_tempFunctions.call, window, _tempFunctions.params);
            }
          }
        }).fail(function () {
          console.log('Unable to load ' + _tempURL);
        });
      });
    }
  }
}