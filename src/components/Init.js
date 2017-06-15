/**
 * Created by David Maser on 15/06/2017.
 */
import {build} from './Build';
import {helpers} from './Helpers';
import {config} from './Config';
import {extend} from './Extend';
import {plugins} from './Plugins';
import {template} from './Template';
export const init = {
  rules: {
    //add any init rules here
  },
  core: function (src, extensions, params) {
    /*
     the parameter extensions allows the user to load extensions into the
     generator object before the builder script is executed. To bypass the
     loading of extensions, set the parameter to false
     i.e generator.init('data/demo.json',false)
     To load extensions when the script initialises, pass a JSON formatted
     extension string (see extend function) as the parameter. If you leave
     the string empty the extension default json source will be loaded. You
     can also pass the source of a custom json extension file by using that
     url as the parameter value
     i.e. generator.init('data/demo.json','data/extends.json')
     */
    $.when(init.plugins(params), init.extensions(extensions)).done(function () {
      if (typeof src === 'object') {
        build.init(src);
      } else {
        $.ajax({
          url: src,
          method: 'GET',
          dataType: 'json',
          success: function (data) {
            build.init(data);
          },
          error: function (e) {
            console.log('The following error occured ' + e);
          }
        });
      }
    });
    $.when(this).done(function () {
      //console.log('done')
    });
  },
  extensions: function (obj) {
    if (obj !== false) {
      if (obj === '' || obj === undefined) {
        obj = config.extensions.src.root;
      }
      if (obj !== '' && obj !== null && obj !== undefined) {
        $.ajax({
          url: obj,
          success: function (data) {
            extend(data);
          },
          error: function () {
            extend(obj);
          }
        });
      }
    }
  },
  plugins: function (params) {
    let _multiple = Array.isArray(params);
    params = _multiple === true && params.length === 1 ? params[0] : params; //if the params are formatted as an array but only contain one object
    let _tempObject = {};
    if (_multiple === true) {
      for (let p in params) {
        _tempObject[params[p].plugin] = params[p];
      }
    } else {
      _tempObject = params;
    }
    function returnPluginParams(match) {
      $.each(_tempObject, function (key, value) {
        if (key === match) {
          return value.params;
        }
      });
    }

    let _list = plugins;
    for (let l in _list) {
      $.each(_list[l], function (key, value) {
        if (value.root !== undefined) {
          let _root = value.root;
          $.getScript(_root + 'plugin.js?p=' + key).done(function () {
            helpers.executeFunctionByName(key + '.setup', window, [value, params]);
          }).fail(function () {
            console.log('Unable to load ' + key);
          });
        }
      });
    }
  }
};