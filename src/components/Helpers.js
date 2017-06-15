/**
 * Created by David Maser on 14/06/2017.
 */
import {ajax} from './Ajax';
import {errors} from './Errors';
import {generator} from './Generator';
import {template} from './Template';
export const helpers = {
  addAndRemoveParams: function (args, obj) {
    /*
     args format is :
     {
     object:'body',
     class:{
     add:['string','or','array'],
     rem:['other','values']
     },
     attr:{
     add:[{'data-href':'this'},{'data-high-time':'this'},{'data-bridge':'this'}],
     rem:[{'data-href':'this',value:'that'}]
     }
     }
     */
    obj = obj || args.object;
    for (let a in args) {
      if (args.hasOwnProperty(a)) {
        switch (a) {
          case 'class':
            let value = args[a];
            if (typeof value === 'object') {
              for (let c in value) {
                switch (c) {
                  case 'add':
                    if (Array.isArray(value[c])) {
                      let array = value[c];
                      for (let ar in array) {
                        $(obj).addClass(array[ar]);
                      }
                    } else {
                      $(obj).addClass(value[c]);
                    }
                    break;
                  case 'rem':
                    if (Array.isArray(value[c])) {
                      let array = value[c];
                      for (let ar in array) {
                        $(obj).removeClass(array[ar]);
                      }
                    } else {
                      $(obj).removeClass(value[c]);
                    }
                    break;
                }
              }
            } else {
              //args[a]
            }
            break;
          case 'attr':
            let attr = args[a];
            if (typeof value === 'object') {
              for (let o in attr) {
                switch (o) {
                  case 'add':
                    if (Array.isArray(attr[o])) {
                      let array = attr[o];
                      for (let ar in array) {
                        //expects object
                        $.each(array[ar], function (key, value) {
                          $(obj).attr(key, value);
                        });
                      }
                    } else {
                      if (typeof attr[o] === 'object') {
                        $.each(attr[o], function (key, value) {
                          $(obj).attr(key, value);
                        });
                      } else {
                        //attr[o]
                      }
                    }
                    break;
                  case 'rem':
                    if (Array.isArray(attr[o])) {
                      let array = attr[o];
                      for (let ar in array) {
                        //expects object
                        $.each(array[ar], function (key, value) {
                          $(obj).removeAttr(key);
                        });
                      }
                    } else {
                      if (typeof attr[o] === 'object') {
                        $.each(attr[o], function (key, value) {
                          $(obj).removeAttr(key);
                        });
                      } else {
                        //attr[o]
                      }
                    }
                    break;
                }
              }
            }
            break;
          case 'css':
            attr = args[a];
            if (typeof value === 'object') {
              for (o in attr) {
                switch (o) {
                  case 'add':
                    if (Array.isArray(attr[o])) {
                      let array = attr[o];
                      for (let ar in array) {
                        //expects object
                        $.each(array[ar], function (key, value) {
                          $(obj).css(key, value);
                        });
                      }
                    } else {
                      if (typeof attr[o] === 'object') {
                        $.each(attr[o], function (key, value) {
                          $(obj).css(key, value);
                        });
                      } else {
                        //attr[o]
                      }
                    }
                    break;
                  case 'rem':
                    if (Array.isArray(attr[o])) {
                      let array = attr[o];
                      for (let ar in array) {
                        //expects object
                        $.each(array[ar], function (key, value) {
                          $(obj).css(key);
                        });
                      }
                    } else {
                      if (typeof attr[o] === 'object') {
                        $.each(attr[o], function (key, value) {
                          $(obj).css(key);
                        });
                      } else {
                        //attr[o]
                      }
                    }
                    break;
                }
              }
            }
            break;
        }
      }
    }
  },
  adoptChidren: function (args) {
    /*
     args format is:
     {
     parent:'string',
     child:'string' or object
     }
     */
    if (typeof args.children === 'object') {
      $.each(args.children, function (key, value) {
        $(args.parent).append(value);
        //@todo this has to be done soon or descoped
      });
    } else {
      $(args.parent).append(args.child);
    }
  },
  loadStyleSheet: function (link) {
    $('<link/>', {rel: 'stylesheet', href: link}).appendTo('head');
  },
  loadScript: function (link) {
    $.getScript(link, function () {
      //
    });
  },
  checkObjectType: function (elem) {
    if ($(elem).length !== 0) {
      return elem;
    } else if ($('.' + elem).length !== 0) {
      return '.' + elem;
    } else if ($('#' + elem).length !== 0) {
      return '#' + elem;
    }
  },
  checkAjaxRequired: function (obj) {
    /*path:'',
     parse:true,
     remove:['string','or','array'],
     chunk:false*/
    function markTargetItem(param) {

    }

    function createAjaxCall(param) {
      $.when(ajax.process.load(param)).done(function () {
        let _dataSource = ajax.dataHolder;
      })
    }

    if (obj.indexOf('ajax') > 1) {

    }
  },
  removeDomObjects: function (obj) {
    /*
     removes a specific object or an array of objects
     from the dom tree. There is no need to specify
     if the object is an html tag, an ID or a class
     as the script will check that and append the
     proper prefix
     */
    let _refuse = ['body', 'html', 'head'];//list of items you don't want the script to touch
    if (Array.isArray(obj) === true) {
      for (let o in obj) {
        let _object = this.checkObjectType(obj[o]);
        $.inArray(obj[o], _refuse) > -1 ? console.log('that item can not be removed') : $(_object).remove();
      }
    } else {
      let _object = this.checkObjectType(obj);
      $.inArray(obj, _refuse) > -1 ? console.log('that item can not be removed') : $(_object).remove();
    }
  },
  buildButtons: function (args) {
    /*
     args format is:
     {
     param:object,
     required:object,
     options:array
     }
     */
    let _buttonString = '';
    let _button = '<div class="button">{{gen.button}}</div>';
    if (typeof args.param === 'object') {
      for (let p in args.param) {
        if (p !== 'close' && $.inArray(p, args.options) > -1) {
          let _thisButton = '<button type="' + p + '" data-action="' + args.param[p].action + '">' + args.param[p].label + '</button>';
          _buttonString += _button.replace('{{gen.button}}', _thisButton);
        } else if (p === 'close' && $.inArray(p, args.required) > -1) {
          let _thisButton = '<button type="' + p + '" data-action="close">' + args.param[p].label + '</button>';
          _buttonString += _button.replace('{{gen.button}}', _thisButton);
        }
      }
      return _buttonString;
    } else {
      errors.alert('Type Mismatch', 'The function was expecting an object but did not receive one', false, 'buildButtons');
    }
  },
  delayExecution: function (obj) {
    /*
     format :
     {
     delay:1,
     callback:'string'
     }
     */
    window.setTimeout(obj.callback(), obj.delay);
  },
  destroyEventHandlers: function (obj) {
    /*
     format :
     {
     object:'string',
     event:'string'
     }
     */
    $(obj.object).unbind(obj.event);
  },
  executeFunctionByName: function (functionName, context) {
    let args = [].slice.call(arguments).splice(2);
    let namespaces = functionName.split(".");
    let func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  },
  getTemplate: function (args) {
    /*
     args format is:
     {
     item:'string',
     type:'string'
     }
     gets the type of template object from the JSON and
     extracts the template string from the template
     object
     */
    let _string = '';
    switch (args.type) {
      case 'object':
        _string = generator.nomenclature.template;
        break;
      case 'component':
        _string = generator.nomenclature.component;
        break;
      case 'widget':
        _string = generator.nomenclature.widget;
        break;
    }
    if (args.item.indexOf('.') > -1) {
      args.item = args.item.split('.');
      for (let i in args.item) {
        _string += '.' + args.item[i];
      }
    } else {
      _string += '.' + args.item;
    }
    if (eval(_string) !== undefined) {
      return eval(_string);
    }
  },
  makeGeneratorID: function (args) {
    /*
     args format is:
     {
     type:'string',
     unit:'string'
     }
     returns a unique generator id. Each object
     has a generator ID.
     */
    let _string = generator.nomenclature.generator;
    return _string.replace('{{type}}', args.type).replace('{{unit}}', args.unit);
  },
  makeObjectClass: function (val) {
    /*
     check if the object has an CLASS and returns it in
     a presentable format
     */
    let _string = '';
    if (val !== null && val !== undefined && val !== '') {
      if (typeof val === 'object') {
        for (let v in val) {
          _string += val[v] + ' ';
        }
      } else {
        _string = val;
      }
    }
    return 'class="' + _string.trim() + '"';
  },
  makeObjectID: function (val) {
    /*
     check if the object has an ID and returns it in
     a presentable format
     */
    if (val !== null && val !== undefined && val !== '') {
      return 'id="' + val + '"';
    } else {
      return '';
    }
  },
  makeObjectValue: function (val) {
    /*
     check if the object has a value and returns it in
     a presentable format
     */
    if (val !== null && val !== undefined && val !== '') {
      return 'value="' + val + '"';
    } else {
      return '';
    }
  },
  makeObjectType: function (val) {
    /*
     returns the object type in a generator-type
     string. generator-type is useful for styling
     and event handling
     */
    if (val !== null && val !== undefined && val !== '') {
      return 'generator-type="' + val + '"';
    } else {
      return '';
    }
  },
  makeAttributes: function (obj) {
    /*
     check if the object has attributes and returns it in
     a presentable format
     */
    let _string = '';
    if (typeof obj === 'object') {
      $.each(obj, function (key, value) {
        if (value !== '' && value !== undefined && value !== null) {
          _string += key + '="' + value + '" ';
        }
      });
    } else {
      _string = obj;
    }
    return _string;
  },
  makeInlineStyle: function (args) {
    /*
     args format is:
     {
     obj:object,
     parent:'string'
     }
     instead of using inline styles, the generator
     object's CSS attributes can be written to a
     style attribute that is appended to the head.
     It is also possible to include an external CSS
     file :: see LoadStyleSheet in the generator core
     */
    let _styleString = '<style type="text/css">\n';
    if (typeof args.obj === 'object') {
      _styleString += '#' + args.parent + '{\n';
      for (let o in args.obj) {
        if (o !== 'type' && o !== 'url') {
          _styleString += o + ':' + args.obj[o] + ';\n';
        }
      }
      _styleString += '}\n';
      _styleString += '</style>';
    }
    $(_styleString).appendTo('head');

  },
  makeEventHandlers: function (args) {
    /*
     args format is :
     {
     key:'string',
     id:'string',
     function:'string'
     }
     binds an event handler to a page object
     using the objects generator-id
     */
    $('body').on(args.key, '[' + args.id + ']', function () {
      eval(args.val);
    });
  },
  switchParent: function (item, parent) {
    let _item = $(item).detach();
    $(parent).append(_item);
  },
  serializePageContent: function (args) {
    /*
     args format is:
     {
     item:'string',
     type:'string'
     }
     item can be formatted as a class, an ID, a selector (i.e. :input) or a tag (i.e. form)
     */
    return args.type === 'array' ? $(args.item).serialize() : $(args.item).serializeArray();
  }
};