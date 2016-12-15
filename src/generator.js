/**
 * Created by David Maser.
 * Refer to the license file here
 * https://github.com/davidemaser/generator/blob/master/LICENSE
 * before using or sharing this code
 *
 * If you would like to collaborate on this project, visit
 * https://github.com/davidemaser/generator and make a pull
 * request
 */
var generator = {
        accept: {
            object: ['object', 'button', 'div', 'section', 'ul', 'li', 'list', 'nav', 'form', 'radio', 'select', 'checkbox', 'footer', 'header', 'textarea'],
            component: ['box', 'banner', 'gutter', 'card', 'gallery', 'hero'],
            widget: ['clock'],
            extensions: []
        },
        component: {
            banner: {
                parent: "<section {{core.id}} {{gen.id}} {{gen.type}} {{core.class}}>{{@inject:[%each.child%]}</section>",
                child: "<div {{gen.id}} {{gen.type}} {{core.class}}>{{object.child.content}}</div>"
            },
            gutter: "",
            card: "",
            badge: ""
        },
        config: {
            extensions: {
                src: {
                    root: 'data/extensions/index.json',
                    exists: false
                },
                enable: true
            },
            helpers: {
                scope: 'global',
                extend: false
            },
            scripts: {
                root: 'lib/src/',
                extension: {
                    format: 'js',
                    append: true
                },
                onload: false,
                cache: true
            },
            storage: {
                allow: true,
                type: 'local',
                persist: true,
                flush: 'function',
                prefix:'GEN-'
            }
        },
        core: {},
        extensions: {},
        nomenclature: {
            generator: "generator-id=\"{{type}}-{{unit}}\"",
            template: "generator.template",
            component: "generator.component",
            widget: "generator.widget",
            extension: "generator.extension",
            data: "generator.data"
        },
        plugins: [
            {
                translator: {
                    activate: true,
                    observe: 'tr',
                    languages: ['en_EN', 'fr_FR'],
                    root: 'plugins/translator/',
                    format: 'json'
                }
            }
        ],
        template: {
            form: {
                button: "<button {{core.id}} {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} {{gen.style}}>{{object.parent.content}}</button>",
                checkbox: "<label for=\"{{object.parent.id}}\"><input {{core.id}} type=\"checkbox\" {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}}>{{object.parent.content}}</label>",
                radiobutton: "<input type=\"radiobutton\" {{gen.id}} {{core.class}} {{core.attributes}}>",
                input: "<input type=\"text\" {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} />",
                textarea: "<textarea {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}>{{object.parent.content}}</textarea>",
                select: {
                    parent: "<select {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}</select>",
                    child: "<option {{gen.id}} {{gen.type}} {{core.value}} {{core.class}}>{{object.child.content}}</option>"

                }
            },
            layout: {
                header: "<header {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}>{{@include:layout.nav}}</header>",
                footer: "<footer {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}></footer>",
                nav: "<nav {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}></nav>",
                list: {
                    parent: "<ul {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}</ul>",
                    child: "<li {{gen.id}} {{gen.type}} {{core.class}}>{{object.child.content}}</li>"

                }
            }
        },
        ajax: {
            DataHolder: {},
            logData: function () {
                console.log(generator.ajax.DataHolder);
            },
            dataToObject: function (arr, obj, callback) {
                /*
                 function takes parameter arr in the form of an array and
                 calls the dataCleanAndParse function to collect and store
                 data. The parameters in the arr array correspond to the
                 parameters required by dataCleanAndParse. The collected
                 data is then input into the object (obj)
                 # arr array schema
                 # ['json.file',boolean,'array or string',callback.function]
                 # callback is optional
                 */
                var ins = arr || null;
                if (ins !== null) {
                    if (ins[3] !== undefined && ins[3] !== null && ins[3] !== '') {
                        ins[3] = ins[3]
                    } else {
                        ins[3] = null;
                    }
                    $.when(generator.ajax.dataCleanAndParse(ins[0], ins[1], ins[2], ins[3])).done(function () {
                        callback;
                    });
                }
            },
            dataCleanAndParse: function (path, parse, remove, callback) {
                /*
                 function collects and stores JSON data in a global object.
                 The function also cleans and parses the JSON data. This
                 allows you to remove specific elements from the content.
                 remove parameter can be a string or array
                 */
                $.when($.ajax({
                    url: path,
                    success: function (data) {
                        generator.ajax.DataHolder = data;
                    }, error: function () {
                        console.log('unable to load JSON')
                    }
                })).done(function () {
                    var _data = JSON.stringify(generator.ajax.DataHolder),
                        _parse = parse || false;
                    if (remove !== '' && remove !== undefined && remove !== null) {
                        if (typeof remove == 'object' && remove !== undefined && remove !== null && remove !== '') {
                            for (var r in remove) {
                                var _junk = new RegExp(remove[r], 'g');
                                _data = _data.replace(_junk, '');
                            }
                        } else if (typeof remove !== 'object' && remove !== undefined && remove !== null && remove !== '') {
                            _junk = new RegExp(remove, 'g');
                            _data = _data.replace(_junk, '');
                        }
                    }
                    if (_parse == true) {
                        _data = JSON.parse(_data);
                    }
                    return _data;
                });
                callback();
            }
        },
        helpers: {
            adoptChidren: function (parent, children) {
                if (typeof children == 'object') {
                    $.each(children, function (key, value) {
                        $(parent).append(value);
                        //@todo this has to be done soon or descoped
                    })
                }
            },
            delayExecution: function (delay, callback) {
                window.setTimeout(callback(), delay);
            },
            destroyEventHandlers: function (obj, event) {
                $(obj).unbind(event);
            },
            executeFunctionByName: function (functionName, context) {
                var args = [].slice.call(arguments).splice(2);
                var namespaces = functionName.split(".");
                var func = namespaces.pop();
                for (var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            },
            getTemplate: function (item, type) {
                /*
                 gets the type of template object from the JSON and
                 extracts the template string from the template
                 object
                 */
                switch (type) {
                    case 'object':
                        var _string = generator.nomenclature.template;
                        break;
                    case 'component':
                        _string = generator.nomenclature.component;
                        break;
                    case 'widget':
                        _string = generator.nomenclature.widget;
                        break;
                }
                if (item.indexOf('.') > -1) {
                    item = item.split('.');
                    for (var i in item) {
                        _string += '.' + item[i];
                    }
                } else {
                    _string += '.' + item;
                }
                if (eval(_string) !== undefined) {
                    return eval(_string);
                }
            },
            makeGeneratorID: function (type, unit) {
                /*
                 returns a unique generator id. Each object
                 has a generator ID.
                 */
                var _string = generator.nomenclature.generator;
                return _string.replace('{{type}}', type).replace('{{unit}}', unit);
            },
            makeObjectClass: function (val) {
                /*
                 check if the object has an CLASS and returns it in
                 a presentable format
                 */
                var _string = '';
                if (val !== null && val !== undefined && val !== '') {
                    if (typeof val == 'object') {
                        for (var v in val) {
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
                var _string = '';
                if (typeof obj == 'object') {
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
            makeInlineStyle: function (obj, parent) {
                /*
                 instead of using inline styles, the generator
                 object's CSS attributes can be written to a
                 style attribute that is appended to the head.
                 It is also possible to include an external CSS
                 file :: see LoadStyleSheet in the generator core
                 */
                var _styleString = '<style type="text/css">\n';
                if (typeof obj == 'object') {
                    _styleString += '#' + parent + '{\n';
                    for (var o in obj) {
                        if (o !== 'type' && o !== 'url')
                            _styleString += o + ':' + obj[o] + ';\n';
                    }
                    _styleString += '}\n';
                    _styleString += '</style>';
                }
                $(_styleString).appendTo('head');

            },
            makeEventHandlers: function (key, id, val) {
                /*
                 binds an event handler to a page object
                 using the objects generator-id
                 */
                $('body').on(key, '[' + id + ']', function () {
                    eval(val);
                });
            },
            switchParent: function (item, parent) {
                var _item = $(item).detach();
                $(parent).append(_item);
            }
        },
        build: function (obj) {
            /*
             main function builds each component with the data in the
             json or using the json data and the template object together.
             Each object is assigned a unique identifier to which event
             handlers are attached if the user has specified them.
             */
            function LoadStyleSheet(link) {
                $('<link/>', {rel: 'stylesheet', href: link}).appendTo('head');
            }

            function LoadScript(link) {
                $.getScript(link, function () {
                    script.init();
                });
            }

            if (typeof obj == 'object') {
                var _core = generator.core = obj.core;
                for (var i in _core) {
                    var _structure = '';
                    if (typeof generator.accept == 'object') {
                        var _validItems = [];
                        for (var a in generator.accept) {
                            _validItems = _validItems.concat(generator.accept[a]);
                        }
                    } else {
                        _validItems = generator.accept;
                    }
                    if (_core[i].type == 'component') {
                        var _checkAgainst = _core[i].template;
                    } else {
                        _checkAgainst = _core[i].type;
                    }
                    var _valid = $.inArray(_checkAgainst, _validItems),
                        _generatorID = generator.helpers.makeGeneratorID(_core[i].type, i),
                        _attributes = generator.helpers.makeAttributes(_core[i].attributes);
                    if (_core[i].template !== null && _core[i].template !== undefined) {
                        if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                            var _styleString = '',
                                _styleArray = [];
                            $.each(_core[i].style, function (key, value) {
                                if (key == 'type' && value == 'file') {
                                    LoadStyleSheet(_core[i].style['url']);
                                } else if (key == 'type' && value == 'inline') {
                                    generator.helpers.makeInlineStyle(_core[i].style, _core[i].id);
                                } else {
                                    _styleString += key + ':' + value + ';';
                                }
                            });
                        }
                        if (typeof generator.helpers.getTemplate(_core[i].template, _core[i].type) == 'object') {
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
                                new generator.errors.alert('Mismatch', 'The options value in the json is not an object',true);
                            } else {
                                var _parent = '',
                                    _child = '',
                                    _baseObj = generator.helpers.getTemplate(_core[i].template, _core[i].type);
                                $.each(_baseObj, function (key, value) {
                                    if (key == 'parent') {
                                        _parent = value;
                                    } else if (key == 'child') {
                                        _child = value;
                                    }
                                });
                                var _item = '';
                                for (var o in _core[i].options) {
                                    _item += _child.replace('{{core.class}}', _core[i].options[o].class !== null ? generator.helpers.makeObjectClass(_core[i].options[o].class) : '');
                                    _item = _item.replace(/{{gen.id}}/g, generator.helpers.makeGeneratorID(_core[i].type, i + '-' + o + '-child'));
                                    _item = _item.replace('{{object.child.content}}', _core[i].options[o].item);
                                    _item = _item.replace('{{core.value}}', generator.helpers.makeObjectValue(_core[i].options[o].value));
                                    _item = _item.replace('{{gen.type}}', generator.helpers.makeObjectType(_core[i].type + '.' + _core[i].template + '.sub'));
                                }
                                var _result = _parent.replace('{{@inject:[%each.child%]}', _item);
                                _result = _result.replace('{{core.id}}', _core[i].id !== null ? generator.helpers.makeObjectID(_core[i].id) : '');
                                _result = _result.replace('{{core.class}}', _core[i].class !== null ? generator.helpers.makeObjectClass(_core[i].class) : '');
                                _result = _result.replace('{{core.attributes}}', _attributes);
                                _result = _result.replace('{{gen.type}}', generator.helpers.makeObjectType(_core[i].type + '.' + _core[i].template));
                                _result = _result.replace(/{{gen.id}}/g, generator.helpers.makeGeneratorID(_core[i].type, i));
                                _result = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? result.replace('{{object.parent.disabled}}', 'disabled') : _result.replace(' {{object.parent.disabled}}', '');
                                _result = _styleString !== '' && _styleString !== undefined ? _result.replace('{{gen.style}}', 'style="' + _styleString + '"') : _result.replace('{{gen.style}}', '');
                                _structure += _result;
                            }
                        } else {
                            var _template = generator.helpers.getTemplate(_core[i].template, _core[i].type);
                            _template = _template.replace('{{object.parent.content}}', _core[i].content);
                            _template = _template.replace(/{{gen.id}}/g, _generatorID);
                            _template = _template.replace('{{gen.type}}', generator.helpers.makeObjectType(_core[i].type + '.' + _core[i].template));
                            _template = _template.replace('{{core.attributes}}', _attributes);
                            _template = _template.replace(/{{object.parent.id}}/g, _core[i].id);
                            _template = _template.replace('{{core.id}}', _core[i].id !== null ? generator.helpers.makeObjectID(_core[i].id) : '');
                            _template = _template.replace('{{core.class}}', _core[i].class !== null ? generator.helpers.makeObjectClass(_core[i].class) : '');
                            _template = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? _template.replace('{{object.parent.disabled}}', 'disabled') : _template.replace(' {{object.parent.disabled}}', '');
                            _template = _styleString !== '' && _styleString !== undefined ? _template.replace('{{gen.style}}', 'style="' + _styleString + '"') : _template.replace('{{gen.style}}', '')
                            if (_template.indexOf('@include') > -1) {
                                var _inclusion = _template.split('@include:')[1].split('}}')[0],
                                    _coreReference = _inclusion.split('.')[1],
                                    _toAdd = generator.helpers.getTemplate(_inclusion),
                                    _toRemove = '{{@include:' + _inclusion + '}}';
                                for (obj in generator.core) {
                                    if (generator.core[obj].type == _coreReference) {
                                        _toAdd = _toAdd.replace(/{{object.parent.id}}/g, generator.core[obj].id);
                                        _toAdd = _toAdd.replace(/{{gen.id}}/g, generator.helpers.makeGeneratorID(generator.core[obj].type, obj));
                                    }
                                }
                                _template = _template.replace(_toRemove, _toAdd);
                            }
                            _structure += _template;
                        }
                    } else {
                        _structure += '<' + _core[i].type + ' ' + _generatorID;
                        _structure += _core[i].class !== '' && _core[i].class !== undefined ? generator.helpers.makeObjectClass(_core[i].class) : '';
                        _structure += _core[i].id !== '' && _core[i].id !== undefined ? ' id="' + _core[i].id + '"' : '';
                        _structure += _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? ' disabled' : '';
                        if (_core[i].attributes !== '' && _core[i].attributes !== undefined && typeof _core[i].attributes == 'object') {
                            $.each(_core[i].attributes, function (key, value) {
                                if (_core[i].attributes[key] !== '' && _core[i].attributes[key] !== undefined) {
                                    _structure += ' ' + key + '=' + value;
                                }
                            });
                        }
                        if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                            _styleString = '';
                            $.each(_core[i].style, function (key, value) {
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
                        $.each(_core[i].events, function (key, value) {
                            generator.helpers.makeEventHandlers(key, _generatorID, value);
                        });
                    }
                }
            }
        },
        extend: function (obj) {
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
                if (Array.isArray(obj) == true) {
                    /*
                     if the user is registering an array of extensions
                     let's loop through the array and register them
                     all at once
                     */
                    for (var a in obj) {
                        var objArray = obj[a];
                        if (typeof obj == 'object') {
                            var _extensionName = '',
                                _extensionFormat = {};
                            for (var p in objArray) {
                                if (objArray.hasOwnProperty(p)) {
                                    _extensionName += p === 'identifier' ? objArray[p] : '';
                                    if (p == 'parent') {
                                        _extensionFormat[p] = objArray[p];
                                    }
                                    if (p == 'child') {
                                        _extensionFormat[p] = objArray[p];
                                    }
                                    if (p == 'code') {
                                        _extensionFormat = objArray[p];
                                    }
                                }
                            }
                            if (generator.extensions[_extensionName] !== undefined && generator.extensions[_extensionName] !== '') {
                                alert('The extension ' + _extensionName.toUpperCase() + ' has already been registered');
                            } else {
                                generator.accept.extensions.push(_extensionName);
                                generator.extensions[_extensionName] = _extensionFormat;
                            }
                        } else {
                            new generator.errors.alert('Type mismatch', 'An object was expected',true)
                        }
                    }
                } else {
                    if (typeof obj == 'object') {
                        _extensionName = '';
                        _extensionFormat = {};
                        for (var p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                _extensionName += p === 'identifier' ? obj[p] : '';
                                if (p == 'parent') {
                                    _extensionFormat[p] = obj[p];
                                }
                                if (p == 'child') {
                                    _extensionFormat[p] = obj[p];
                                }
                                if (p == 'code') {
                                    _extensionFormat = obj[p];
                                }
                            }
                        }
                        if (generator.extensions[_extensionName] !== undefined && generator.extensions[_extensionName] !== '') {
                            alert('The extension ' + _extensionName.toUpperCase() + ' has already been registered');
                        } else {
                            generator.accept.extensions.push(_extensionName);
                            generator.extensions[_extensionName] = _extensionFormat;
                        }
                    } else {
                        new generator.errors.alert('Type mismatch', 'An object was expected',true)
                    }
                }
            } catch (e) {
                //
            }
        },
        storage: {
            /*
             args format
             {
             id:'', //required
             index:'',
             data:'json',
             prefix:true, //required
             parse:false
             }
             */
            supported:function(){
                return typeof(Storage) !== 'undefined';
            },
            load:function(args) {
                if(this.supported() == true){
                    var _lsItem = args.prefix == true ? generator.config.storage.prefix+args.id : args.id;
                    return localStorage.getItem(_lsItem);
                }
            },
            save:function(args) {
                if(this.supported() == true){
                    var _lsItem = args.prefix == true ? generator.config.storage.prefix+args.id : args.id;
                    localStorage.setItem(_lsItem,args.data);
                }
            },
            purge:function(args) {
                if(this.supported() == true) {
                    var _lsItem = args.prefix == true ? generator.config.storage.prefix+args.id : args.id;
                    localStorage.removeItem(_lsItem);
                }
            }
        },
        scripts:{
            load: function (obj, root, ext) {
                var _root = root || generator.config.scripts.root;
                var _ext = ext || generator.config.scripts.extension.format;
                var _append = generator.config.scripts.extension.append;
                /*
                 the obj parameter should be formatted as follows
                 [{
                 id:'demo',url:'demo',
                 functions:[
                 {call:'testAgain',
                 params:['string','or','array']
                 },{call:'test'}
                 ]}]
                 */
                var _multiple = Array.isArray(obj);
                if (_multiple == true) {
                    for (var m in obj) {
                        var _tempArray = obj[m];
                    }
                } else {
                    _tempArray = obj;
                }
                if (typeof _tempArray == 'object') {
                    $.each(obj, function (key) {
                        var _tempFunctions = obj[key].functions,
                            _tempURL = _root + obj[key].url;
                        _tempURL += _append == true ? '.' + _ext : '';
                        $.getScript(_tempURL).done(function () {
                            if (Array.isArray(_tempFunctions) == true) {
                                for (var f in _tempFunctions) {
                                    generator.helpers.executeFunctionByName(_tempFunctions[f].call, window, _tempFunctions[f].params);
                                }
                            } else {
                                generator.helpers.executeFunctionByName(_tempFunctions.call, window, _tempFunctions.params);
                            }
                        }).fail(function () {
                            console.log('Unable to load ' + _tempURL);
                        });
                    })
                }
            }
        },
        init: {
            rules:[],
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
                $.when(generator.init.plugins(params), generator.init.extensions(extensions)).done(function () {
                    if (typeof src == 'object') {
                        generator.build(src)
                    } else {
                        $.ajax({
                            url: src,
                            method: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                generator.build(data);
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
                    if (obj == '' || obj == undefined) {
                        obj = generator.config.extensions.src.root;
                    }
                    if (obj !== '' && obj !== null && obj !== undefined) {
                        $.ajax({
                            url: obj,
                            success: function (data) {
                                generator.extend(data);
                            },
                            error: function () {
                                generator.extend(obj);
                            }
                        })
                    }
                }
            },
            plugins: function (params) {
                var _multiple = Array.isArray(params);
                params = _multiple == true && params.length == 1 ? params[0] : params; //if the params are formatted as an array but only contain one object
                var _tempObject = {};
                if (_multiple == true) {
                    for (p in params) {
                        _tempObject[params[p].plugin] = params[p];
                    }
                } else {
                    _tempObject = params;
                }
                function executeFunctionByName(functionName, context) {
                    var args = [].slice.call(arguments).splice(2);
                    var namespaces = functionName.split(".");
                    var func = namespaces.pop();
                    for (var i = 0; i < namespaces.length; i++) {
                        context = context[namespaces[i]];
                    }
                    return context[func].apply(context, args);
                }

                function returnPluginParams(match) {
                    $.each(_tempObject, function (key, value) {
                        if (key === match) {
                            return value.params;
                        }
                    })
                }

                var _list = generator.plugins;
                for (var p in _list) {
                    $.each(_list[p], function (key, value) {
                        if (value.root !== undefined) {
                            var _root = value.root;
                            $.getScript(_root + 'plugin.js?p=' + key).done(function () {
                                executeFunctionByName(key + '.setup', window, [value, params]);
                            }).fail(function () {
                                console.log('Unable to load ' + key);
                            });
                        }
                    });
                }
            }
        },
        errors:{
            log:[],
            alert:function(title, body, write) {
                write == true ? this.report(title, body) : '';
                return title + ' : ' + body;
            },
            report:function(title, body) {
                var _date = new Date();
                this.log.push({
                    date:_date,
                    title:title,
                    error:body
                });
            }
        }
    } || {};
new generator.init.core('data/demo.json', false, [{plugin: 'translator', params: ['fr_FR', 1000]}]); // method using external JSON

/*new generator.init(
 {
 "core": [
 {
 "type": "object",
 "template": "layout.list",
 "class": "boo",
 "id": "casas",
 "disabled": false,
 "attributes": {
 "data-href": "my-link",
 "data-prop": "negative"
 },
 "content": "Click Me",
 "style": {
 "background": "#fff",
 "border-right": "1px solid #000"
 },
 "events": {
 "click": "console.log('this')"
 },
 "options": [
 {
 "item": "sdfsdfsdf",
 "value": "",
 "class": ""
 },
 {
 "item": "bloobaloo",
 "value": "sdfsdf",
 "class": ""
 }
 ],
 "parent": "body"
 },
 {
 "type":"object",
 "template":"form.textarea",
 "id":"formText",
 "content":"default text",
 "attributes": {
 "rows": 10,
 "cols": 10
 },
 "parent": "body"
 },
 {
 "type": "object",
 "template": "form.button",
 "class": "boo",
 "id": "casas",
 "disabled": false,
 "attributes": {
 "data-href": "",
 "data-prop": ""
 },
 "content": "Don't Click Me",
 "style": null,
 "events": {
 "click": "console.log('sdfsdfsdf')"
 },
 "options": {
 },
 "parent": "body"
 },
 {
 "type": "component",
 "template": "banner",
 "class": null,
 "id": "casas",
 "disabled": false,
 "attributes": {
 "data-href": "",
 "data-prop": ""
 },
 "content": "Don't Click Me",
 "style": {
 "type":"inline",
 "background": "#fff",
 "border-right": "1px solid #000"
 },
 "events": {
 "click": "alert('bam bam')"
 },
 "options": [
 {
 "item": "sdfsdfsdf",
 "value": "",
 "class": "this"
 },
 {
 "item": "bloobaloo",
 "value": "sdfsdf",
 "class": ""
 }
 ],
 "parent": "body"
 }
 ]
 },false);*/
