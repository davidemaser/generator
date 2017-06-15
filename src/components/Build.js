/**
 * Created by David Maser on 15/06/2017.
 */
import {ajax} from './Ajax';
import {helpers} from './Helpers';
import {errors} from './Errors';
import {generator} from './Generator';
import {template} from './Template';
export const build = {
  tempData: {},
  init: function (obj) {
    $.when(this.structure(obj)).done(() => {

    })
  },
  structure: function (obj) {
    /*
     @todo: this function has to be redone following an ajax first logic
     main function builds each component with the data in the
     json or using the json data and the template object together.
     Each object is assigned a unique identifier to which event
     handlers are attached if the user has specified them.
     */
    if (typeof obj === 'object') {
      let _tempDataHolder = {};
      let _core = generator.core = obj.core;
      for (let i in _core) {
        if (typeof _core[i].content === 'object') {
          let _tempObject = _core[i].content;
          for (let c in _tempObject) {
            if (_tempObject.hasOwnProperty(c)) {
              _tempDataHolder[c] = _tempObject[c];
            }
          }
          if (_core[i].id !== undefined && _core[i].id !== '') {
            let _reformat = JSON.stringify(_tempDataHolder);
            build.tempData[_core[i].id] = JSON.parse(_reformat);
          }
          let _queryObject = build.tempData[_core[i].id];
          ajax.process.content(_queryObject).then((result) => {
            console.log(result);
          }).then(structureLayout());
        } else {
          structureLayout();
        }
        function structureLayout() {
            let _validItems = [], _checkAgainst;
            let _structure = '';
            if (typeof generator.accept === 'object') {
              for (let a in generator.accept) {
                _validItems = _validItems.concat(generator.accept[a]);
              }
            } else {
              _validItems = generator.accept;
            }
            if (_core[i].type === 'component') {
              _checkAgainst = _core[i].template;
            } else {
              _checkAgainst = _core[i].type;
            }
            let _valid = $.inArray(_checkAgainst, _validItems),
              _generatorID = helpers.makeGeneratorID({type: _core[i].type, unit: i}),
              _attributes = helpers.makeAttributes(_core[i].attributes);
            if (_core[i].template !== null && _core[i].template !== undefined) {
              if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style === 'object') {
                let _styleString = '';
                $.each(_core[i].style, (key, value)  => {
                  if (key === 'type' && value === 'file') {
                    new helpers.loadStyleSheet(_core[i].style['url']);
                  } else if (key === 'type' && value === 'inline') {
                    helpers.makeInlineStyle(_core[i].style, _core[i].id);
                  } else {
                    _styleString += key + ':' + value + ';';
                  }
                });
              }
              if (typeof helpers.getTemplate({item: _core[i].template, type: _core[i].type}) === 'object') {
                /*
                 we have an object so we know we're going to build a multi-level
                 item. This means we are expecting to see a parent item and one or
                 many child objects. We have to pull the template of the
                 parent and the child and use them to iterate through the options
                 in our json
                 */
                if (typeof _core[i].options !== 'object') {
                  /*
                   since we are calling an object formatted template
                   let's make sure our options object is indeed an
                   object. If it's not, alert the user.
                   */
                  new errors.alert('Mismatch', 'The options value in the json is not an object', true, 'build');
                } else {
                  let _parent = '',
                    _child = '',
                    _baseObj = helpers.getTemplate({item: _core[i].template, type: _core[i].type});
                  let _styleString = '';
                  $.each(_baseObj, (key, value)  => {
                    if (key === 'parent') {
                      _parent = value;
                    } else if (key === 'child') {
                      _child = value;
                    }
                  });
                  let _item = '';
                  for (let o in _core[i].options) {
                    _item += _child.replace('{{core.class}}', _core[i].options[o].class !== null ? helpers.makeObjectClass(_core[i].options[o].class) : '');
                    _item = _item.replace(/{{gen.id}}/g, helpers.makeGeneratorID({
                      type: _core[i].type,
                      unit: i + '-' + o + '-child'
                    }));
                    _item = _item.replace('{{object.child.content}}', _core[i].options[o].item);
                    _item = _item.replace('{{core.value}}', helpers.makeObjectValue(_core[i].options[o].value));
                    _item = _item.replace('{{gen.type}}', helpers.makeObjectType(_core[i].type + '.' + _core[i].template + '.sub'));
                  }
                  let _result = _parent.replace('{{@inject:[%each.child%]}}', _item);
                  _result = _result.replace('{{core.id}}', _core[i].id !== null ? helpers.makeObjectID(_core[i].id) : '');
                  _result = _result.replace('{{core.class}}', _core[i].class !== null ? helpers.makeObjectClass(_core[i].class) : '');
                  _result = _result.replace('{{core.attributes}}', _attributes);
                  _result = _result.replace('{{gen.type}}', helpers.makeObjectType(_core[i].type + '.' + _core[i].template));
                  _result = _result.replace(/{{gen.id}}/g, helpers.makeGeneratorID({type: _core[i].type, unit: i}));
                  _result = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled === true ? _result.replace('{{object.parent.disabled}}', 'disabled') : _result.replace(' {{object.parent.disabled}}', '');
                  _result = _styleString !== '' && _styleString !== undefined ? _result.replace('{{gen.style}}', 'style="' + _styleString + '"') : _result.replace('{{gen.style}}', '');
                  _structure += _result;
                }
              } else {
                let _styleString = '';
                let _template = helpers.getTemplate({item: _core[i].template, type: _core[i].type});
                _template = _template.replace('{{object.parent.content}}', _core[i].content);
                _template = _template.replace(/{{gen.id}}/g, _generatorID);
                _template = _template.replace('{{gen.type}}', helpers.makeObjectType(_core[i].type + '.' + _core[i].template));
                _template = _template.replace('{{core.attributes}}', _attributes);
                _template = _template.replace(/{{object.parent.id}}/g, _core[i].id);
                _template = _template.replace('{{core.id}}', _core[i].id !== null ? helpers.makeObjectID(_core[i].id) : '');
                _template = _template.replace('{{core.class}}', _core[i].class !== null ? helpers.makeObjectClass(_core[i].class) : '');
                _template = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled === true ? _template.replace('{{object.parent.disabled}}', 'disabled') : _template.replace(' {{object.parent.disabled}}', '');
                _template = _styleString !== '' && _styleString !== undefined ? _template.replace('{{gen.style}}', 'style="' + _styleString + '"') : _template.replace('{{gen.style}}', '');
                if (_template.indexOf('@include') > -1) {
                  let _inclusion = _template.split('@include:')[1].split('}}')[0],
                    _coreReference = _inclusion.split('.')[1],
                    _toAdd = helpers.getTemplate({item: _inclusion}),
                    _toRemove = '{{@include:' + _inclusion + '}}';
                  for (obj in generator.core) {
                    if (generator.core[obj].type === _coreReference) {
                      _toAdd = _toAdd.replace(/{{object.parent.id}}/g, generator.core[obj].id);
                      _toAdd = _toAdd.replace(/{{gen.id}}/g, helpers.makeGeneratorID({
                        type: generator.core[obj].type,
                        unit: obj
                      }));
                    }
                  }
                  _template = _template.replace(_toRemove, _toAdd);
                }
                _structure += _template;
              }
            } else {
              _structure += '<' + _core[i].type + ' ' + _generatorID;
              _structure += _core[i].class !== '' && _core[i].class !== undefined ? helpers.makeObjectClass(_core[i].class) : '';
              _structure += _core[i].id !== '' && _core[i].id !== undefined ? ' id="' + _core[i].id + '"' : '';
              _structure += _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled === true ? ' disabled' : '';
              if (_core[i].attributes !== '' && _core[i].attributes !== undefined && typeof _core[i].attributes === 'object') {
                $.each(_core[i].attributes, (key, value) => {
                  if (_core[i].attributes[key] !== '' && _core[i].attributes[key] !== undefined) {
                    _structure += ' ' + key + '=' + value;
                  }
                });
              }
              if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style === 'object') {
                let _styleString = '';
                $.each(_core[i].style, (key, value) => {
                  _styleString += key + ':' + value + ';';
                });
                _structure += ' style="' + _styleString + '"';
              }
              _structure += '>';
              _structure += _core[i].content;
              _structure += '</' + _core[i].type + '>';
            }
            if (_valid > -1) {
              $(_core[i].parent).append(_structure);
              $.each(_core[i].events, (key, value) => {
                helpers.makeEventHandlers({key: key, id: _generatorID, function: value});
              });
            }
        }
      }
    }
  }
};