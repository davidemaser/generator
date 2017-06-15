/**
 * Created by David Maser on 15/06/2017.
 */
import {errors} from './Errors';
export function extend(obj) {
  /*
   format is the following SIMPLE EXTENSION :
   # {
   #  identifier:"your_extension_name",
   #  code:"your extension code"
   # }
   NESTED EXTENSION
   # {
   #  identifier:"your_extension_name",
   #  parent:"parent code",
   #  child:"nested child node"
   }
   */
  try {
    if (Array.isArray(obj) === true) {
      /*
       if the user is registering an array of extensions
       let's loop through the array and register them
       all at once
       */
      for (let a in obj) {
        let objArray = obj[a];
        if (typeof obj === 'object') {
          let _extensionName = '',
            _extensionFormat = {};
          for (let e in objArray) {
            if (objArray.hasOwnProperty(e)) {
              _extensionName += e === 'identifier' ? objArray[e] : '';
              if (e === 'parent') {
                _extensionFormat[e] = objArray[e];
              }
              if (e === 'child') {
                _extensionFormat[e] = objArray[e];
              }
              if (e === 'code') {
                _extensionFormat = objArray[e];
              }
            }
          }
          if (generator.extensions[_extensionName] !== undefined && generator.extensions[_extensionName] !== '') {
            window.alert('The extension ' + _extensionName.toUpperCase() + ' has already been registered');
          } else {
            generator.accept.extensions.push(_extensionName);
            generator.extensions[_extensionName] = _extensionFormat;
          }
        } else {
          new errors.alert('Type mismatch', 'An object was expected', true, 'extend');
        }
      }
    } else {
      if (typeof obj === 'object') {
        let _extensionName = '';
        let _extensionFormat = {};
        for (let p in obj) {
          if (obj.hasOwnProperty(p)) {
            _extensionName += p === 'identifier' ? obj[p] : '';
            if (p === 'parent') {
              _extensionFormat[p] = obj[p];
            }
            if (p === 'child') {
              _extensionFormat[p] = obj[p];
            }
            if (p === 'code') {
              _extensionFormat = obj[p];
            }
          }
        }
        if (generator.extensions[_extensionName] !== undefined && generator.extensions[_extensionName] !== '') {
          window.alert('The extension ' + _extensionName.toUpperCase() + ' has already been registered');
        } else {
          generator.accept.extensions.push(_extensionName);
          generator.extensions[_extensionName] = _extensionFormat;
        }
      } else {
        new errors.alert('Type mismatch', 'An object was expected', true, 'extend');
      }
    }
  } catch (e) {
    //
  }
}