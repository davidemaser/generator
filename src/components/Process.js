/**
 * Created by David Maser on 15/06/2017.
 */
import {config} from './Config';
import {errors} from './Errors';
import {ajax} from './Ajax';
export const process = {
  content: function (args) {
    try {
      return new Promise(function (resolve) {
        /*
         {
         path:'',
         object:'',
         position:1,
         node:''
         }
         */
        $.ajax({
          url: args.path,
          type: config.ajax.default,
          success: function (data) {
            data = args.object !== undefined ? data[args.object] : data;
            data = args.position !== undefined ? data[args.position] : data;
            data = args.node !== undefined ? data[args.node] : data;
            resolve(data);
          }, error: function () {
            errors.alert('JSON Error', 'Unable to load JSON. Check your path parameters', true, 'ajax.process.content');
          }
        });
      });
    } catch (e) {
      errors.alert('Unknown Error', 'Unable to execute the function. Make sure arguments are passed as an object', true, 'ajax.process.content');
    }
  },
  load: function (args) {
    /*
     function collects and stores JSON data in a global object.
     The function also cleans and parses the JSON data. This
     allows you to remove specific elements from the content.
     remove parameter can be a string or array
     args format is :
     {
     path:'',
     parse:true,
     remove:['string','or','array'],
     chunk:{
     active:true,
     length:10
     },
     object:'',
     position:1,
     node:''
     }
     */
    function parseSource(src) {
      if (args.object !== undefined) {
        src = src[args.object];
      }
      if (args.position !== undefined) {
        src = src[args.position];
      }
      if (args.node !== undefined) {
        src = src[args.node];
      }
      let _data = JSON.stringify(src),
        _parse = args.parse || false;
      if (args.remove !== '' && args.remove !== undefined && args.remove !== null) {
        if (typeof args.remove === 'object') {
          for (let r in args.remove) {
            let _junk = new RegExp(args.remove[r], 'g');
            _data = _data.replace(_junk, '');
          }
        } else if (typeof args.remove !== 'object') {
          let _junk = new RegExp(args.remove, 'g');
          _data = _data.replace(_junk, '');
        }
      }
      if (_parse === true) {
        ajax.dataHolder = JSON.parse(_data);
      } else {
        ajax.dataHolder = _data;
      }
    }

    $.ajax({
      url: args.path,
      type: config.ajax.default,
      success: function (data) {
        ajax.dataHolder = data;
      }, error: function () {
        errors.alert('JSON Error', 'Unable to load JSON. Check your path parameters', true, 'ajax.process.load');
      }
    }).done(function () {
      parseSource(ajax.dataHolder);
    }).done(function () {
      args.chunk.active !== undefined && args.chunk.active === true ? ajax.chunk.set(null, args.chunk.length || 5) : false; //chunks the data if true
    });
  },
  save: function (args) {
    /*
     note : save function is the same used for an update call
     'PUT' to update
     args format :
     {
     data:'', //required
     url:'', //required
     type:'POST', //optional - default is POST
     dataType:'', //optional - default is JSON
     contentType:'',
     headers:'',
     password:'',
     save:true
     }
     */
    let _args = {};

    function getArguments() {
      $.each(args, function (key, value) {
        _args[key] = value;
      });
    }

    function executeSave(obj) {
      $.ajax({
        url: obj.url,
        type: obj.type || 'POST',
        headers: obj.headers,
        data: obj.data,
        timeout: obj.timeout || config.ajax.timeout || null,
        dataType: obj.dataType || 'json',
        contentType: obj.contentType,
        password: obj.password,
        statusCode: {
          404: function () {
            errors.alert('AJAX Save Error', 'The server responded with a 404 (page not found) error. Data has not been saved', true, 'ajax.process.save[executeSave]');
          },
          500: function () {
            errors.alert('AJAX Save Error', 'The server responded with a 500 (server error) code. Data has not been saved', true, 'ajax.process.save[executeSave]');

          }
        },
        success: function () {
        },
        error: function () {
          errors.alert('AJAX Save Error', 'The server responded with an error. Data has not been saved', true, 'ajax.process.save[executeSave]');
        }
      });
    }

    if (args !== undefined) {
      if (typeof args === 'object') {
        $.when(getArguments()).done(function () {
          executeSave(_args);
        });
      } else {
        errors.alert('Type Mismatch', 'Function was expecting an object', true, 'ajax.process.save');
      }
    } else {
      errors.alert('AJAX Save Error', 'Required arguments have not been provided', true, 'ajax.process.save');
    }
  }
}