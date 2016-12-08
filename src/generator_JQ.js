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
    accept : {
        object:['object','button','div','section','ul','li','list','nav','form','radio','select','checkbox','footer','header','textarea'],
        component:['box','banner','gutter','card','gallery','hero'],
        widget:['clock'],
        extensions:{}
    },
    nomenclature:{
        generator:"generator-id=\"{{type}}-{{unit}}\"",
        template:"generator.template",
        component:"generator.component",
        widget:"generator.widget"
    },
    template: {
        form:{
            button:"<button {{core.id}} {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} {{gen.style}}>{{object.parent.content}}</button>",
            checkbox:"<label for=\"{{object.parent.id}}\"><input {{core.id}} type=\"checkbox\" {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}}>{{object.parent.content}}</label>",
            radiobutton:"<input type=\"radiobutton\" {{gen.id}} {{core.class}} {{core.attributes}}>",
            input:"<input type=\"text\" {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} />",
            textarea:"<textarea {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}>{{object.parent.content}}</textarea>",
            select:{
                parent:"<select {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}</select>",
                child : "<option {{gen.id}} {{gen.type}} {{core.value}}>{{object.child.content}}</option>"

            }
        },
        layout: {
            header: "<header {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}>{{@include:layout.nav}}</header>",
            footer: "<footer {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}></footer>",
            nav: "<nav {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}></nav>",
            list: {
                parent: "<ul {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}</ul>",
                child:"<li {{gen.id}} {{gen.type}} {{core.class}}>{{object.child.content}}</li>"

            }
        }
    },
    component: {
        banner: {
            parent:"<section {{core.id}} {{gen.id}} {{gen.type}} {{core.class}}>{{@inject:[%each.child%]}</section>",
            child:"<div {{gen.id}} {{gen.type}} {{core.class}}>{{object.child.content}}</div>"
        },
        gutter:"",
        card:"",
        badge:""
    },
    extensions: {},
    core : {},
    getTemplate:function(item,type){
        /*
        gets the type of template object from the JSON and
        extracts the template string from the template
        object
         */
        switch(type){
            case 'object':
                var _string = this.nomenclature.template;
                break;
            case 'component':
                _string = this.nomenclature.component;
                break;
            case 'widget':
                _string = this.nomenclature.widget;
                break;
        }
        if(item.indexOf('.')>-1){
            item = item.split('.');
            for(var i in item){
                _string += '.' + item[i];
            }
        }else{
            _string += '.' + item;
        }
        if(eval(_string) !== undefined) {
            return eval(_string);
        }
    },
    helpers:{
        makeGeneratorID:function(type,unit){
            /*
             returns a unique generator id. Each object
             has a generator ID.
             */
            var _string = generator.nomenclature.generator;
            return _string.replace('{{type}}',type).replace('{{unit}}',unit);
        },
        makeObjectClass:function(val){
            /*
             check if the object has an CLASS and returns it in
             a presentable format
             */
            if(val !== null && val !== undefined && val !== '') {
                return 'class="' + val + '"';
            }else{
                return '';
            }
        },
        makeObjectID:function(val){
            /*
             check if the object has an ID and returns it in
             a presentable format
             */
            if(val !== null && val !== undefined && val !== '') {
                return 'id="' + val + '"';
            }else{
                return '';
            }
        },
        makeObjectValue:function(val){
            /*
             check if the object has a value and returns it in
             a presentable format
             */
            if(val !== null && val !== undefined && val !== '') {
                return 'value="' + val + '"';
            }else{
                return '';
            }
        },
        makeObjectType:function(val){
            /*
             returns the object type in a generator-type
             string. generator-type is useful for styling
             and event handling
             */
            if(val !== null && val !== undefined && val !== '') {
                return 'generator-type="' + val + '"';
            }else{
                return '';
            }
        },
        makeAttributes:function(obj){
            /*
             check if the object has attributes and returns it in
             a presentable format
             */
            var _string = '';
            $.each(obj,function(key,value){
                if(value !== '' && value !== undefined && value !== null) {
                    _string += key + '="' + value + '" ';
                }
            });
            return _string;
        },
        makeInlineStyle:function(obj,parent){
            /*
            instead of using inline styles, the generator
            object's CSS attributes can be written to a
            style attribute that is appended to the head.
            It is also possible to include an external CSS
            file :: see LoadStyleSheet in the generator core
             */
            var _styleString = '<style type="text/css">\n';
            if(typeof obj == 'object'){
                _styleString += '#'+parent+'{\n';
                for(var o in obj){
                    if(o !== 'type' && o !== 'url')
                        _styleString += o+':'+obj[o]+';\n';
                }
                _styleString += '}\n';
                _styleString += '</style>';
            }
            $(_styleString).appendTo('head');

        },
        makeEventHandlers:function(key,id,val){
            /*
            binds an event handler to a page object
            using the objects generator-id
             */
            $('body').on(key, '[' + id + ']', function () {
                eval(val);
            });
        }
    },
    build:function(obj){
        /*
        main function builds each component with the data in the
        json or using the json data and the template object together.
        Each object is assigned a unique identifier to which event
        handlers are attached if the user has specified them.
         */
        function LoadStyleSheet(link){
            $('<link/>', {rel: 'stylesheet', href: link}).appendTo('head');
        }
        function LoadScript(link){
            $.getScript(link, function() {
                script.init();
            });
        }
        if(typeof obj == 'object') {
            var _core = generator.core = obj.core;
            for (var i in _core) {
                var _structure = '';
                if(typeof generator.accept == 'object'){
                    var _validItems = [];
                    for(var a in generator.accept){
                        _validItems = _validItems.concat(generator.accept[a]);
                    }
                }else{
                    _validItems = generator.accept;
                }
                if(_core[i].type == 'component'){
                    var _checkAgainst = _core[i].template;
                }else{
                    _checkAgainst = _core[i].type;
                }
                var _valid = $.inArray(_checkAgainst,_validItems),
                    _generatorID = generator.helpers.makeGeneratorID(_core[i].type,i),
                    _attributes = generator.helpers.makeAttributes(_core[i].attributes);
                if(_core[i].template !== null && _core[i].template !== undefined){
                    if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                        var _styleString = '',
                            _styleArray = [];
                        $.each(_core[i].style, function (key, value) {
                            if(key == 'type' && value == 'file'){
                                LoadStyleSheet(_core[i].style['url']);
                            }else if(key == 'type' && value == 'inline'){
                                generator.helpers.makeInlineStyle(_core[i].style,_core[i].id);
                            }else {
                                _styleString += key + ':' + value + ';';
                            }
                        });
                    }
                    if(typeof generator.getTemplate(_core[i].template,_core[i].type) == 'object'){
                        /*
                        we have an object so we know we're going to build a multi-level
                        item. This means we are expecting to see a parent item and one or
                        many child objects. We have to pull the template of the
                        parent and the child and use them to iterate through the options
                        in our json
                         */
                        if(typeof _core[i].options !== 'object'){
                            /*
                            since we are calling an object formatted template
                            let's make sure our options object is indeed an
                            object. If it's not, alert the user.
                             */
                            throw new generator.formatException('Mismatch','The options value in the json is not an object');
                        }else {
                            var _parent = '',
                                _child = '',
                                _baseObj = generator.getTemplate(_core[i].template,_core[i].type);
                            $.each(_baseObj, function (key, value) {
                                if (key == 'parent') {
                                    _parent = value;
                                } else if (key == 'child') {
                                    _child = value;
                                }
                            });
                            var _item = '';
                            for(var o in _core[i].options){
                                _item += _child.replace('{{core.class}}',_core[i].options[o].class !== null ? generator.helpers.makeObjectClass(_core[i].options[o].class) : '');
                                _item = _item.replace(/{{gen.id}}/g,generator.helpers.makeGeneratorID(_core[i].type,i+'-'+o+'-child'));
                                _item = _item.replace('{{object.child.content}}',_core[i].options[o].item);
                                _item = _item.replace('{{core.value}}',generator.helpers.makeObjectValue(_core[i].options[o].value));
                                _item = _item.replace('{{gen.type}}',generator.helpers.makeObjectType(_core[i].type+'.'+_core[i].template+'.sub'));
                            }
                            var _result = _parent.replace('{{@inject:[%each.child%]}',_item);
                            _result = _result.replace('{{core.id}}',_core[i].id !== null ? generator.helpers.makeObjectID(_core[i].id) : '');
                            _result = _result.replace('{{core.class}}',_core[i].id !== null ? generator.helpers.makeObjectClass(_core[i].class) : '');
                            _result = _result.replace('{{core.attributes}}',_attributes);
                            _result = _result.replace('{{gen.type}}',generator.helpers.makeObjectType(_core[i].type+'.'+_core[i].template));
                            _result = _result.replace(/{{gen.id}}/g,generator.helpers.makeGeneratorID(_core[i].type,i));
                            _result = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? result.replace('{{object.parent.disabled}}','disabled') : _result.replace(' {{object.parent.disabled}}','');
                            _result = _styleString !== '' && _styleString !== undefined ? _result.replace('{{gen.style}}','style="' + _styleString + '"') : _result.replace('{{gen.style}}','');
                            _structure += _result;
                        }
                    }else {
                        var _template = generator.getTemplate(_core[i].template,_core[i].type);
                        _template = _template.replace('{{object.parent.content}}', _core[i].content);
                        _template = _template.replace(/{{gen.id}}/g, _generatorID);
                        _template = _template.replace('{{gen.type}}',generator.helpers.makeObjectType(_core[i].type+'.'+_core[i].template));
                        _template = _template.replace('{{core.attributes}}',_attributes);
                        _template = _template.replace(/{{object.parent.id}}/g,_core[i].id);
                        _template = _template.replace('{{core.id}}',_core[i].id !== null ? generator.helpers.makeObjectID(_core[i].id) : '');
                        _template = _template.replace('{{core.class}}',_core[i].class !== null ? generator.helpers.makeObjectClass(_core[i].class) : '');
                        _template = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? _template.replace('{{object.parent.disabled}}','disabled') : _template.replace(' {{object.parent.disabled}}','');
                        _template = _styleString !== '' && _styleString !== undefined ? _template.replace('{{gen.style}}','style="' + _styleString + '"') : _template.replace('{{gen.style}}','')
                        if (_template.indexOf('@include') > -1) {
                            var _inclusion = _template.split('@include:')[1].split('}}')[0],
                                _coreReference = _inclusion.split('.')[1],
                                _toAdd = generator.getTemplate(_inclusion),
                                _toRemove = '{{@include:' + _inclusion + '}}';
                            for (obj in generator.core) {
                                if (generator.core[obj].type == _coreReference) {
                                    _toAdd = _toAdd.replace(/{{object.parent.id}}/g,generator.core[obj].id);
                                    _toAdd = _toAdd.replace(/{{gen.id}}/g, generator.helpers.makeGeneratorID(generator.core[obj].type, obj));
                                }
                            }
                            _template = _template.replace(_toRemove, _toAdd);
                        }
                        _structure += _template;
                    }
                }else {
                    _structure += '<' + _core[i].type + ' ' + _generatorID;
                    _structure += _core[i].class !== '' && _core[i].class !== undefined ? ' class="' + _core[i].class + '"' : '';
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
                            generator.helpers.makeEventHandlers(key,_generatorID,value);
                        });
                    }
            }
        }
    },
    extend:function(obj){
        var _extensionsLength = generator.extensions.length;
        if(typeof obj == 'object'){
            var objStructure = '',
                dup = true;
            $.each(obj,function(key,value){
                objStructure += key == 'name' ? value+':{\n' : '';
                objStructure += key == 'identifier' ? value+':' : '';
                if(key == 'code'){
                    objStructure += '"'+value+'"';
                    dup = false;
                }else{
                    if(key == 'parent'){
                        objStructure += '{\n';
                        objStructure += key+': "'+value+'",\n';
                    }
                    if(key == 'child'){
                        objStructure += key+': "'+value+'"';
                    }
                }
            });
            objStructure += '\n}';
            if(dup == true){
                objStructure += '\n}';
            }
            if(_extensionsLength > 0){
                objStructure += ',';
            }
            console.log(objStructure);
            generator.accept.extensions += objStructure;
            generator.extensions += objStructure;
            /*var extension = {
                name:"name",
                identifier:"blocks",
                parent:"<div {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}</div>",
                child:"<div></div>",
                acceptEvents:true
            }*/
        }else{
            throw new generator.formatException('Type mismatch','An object was expected')
        }
    },
    init:function(src){
        if(typeof src == 'object'){
            generator.build(src)
        }else{
            $.ajax({
                url:src,
                method:'GET',
                dataType:'json',
                success:function(data){
                    generator.build(data);
                },
                error:function(e){
                    console.log('The following error occured '+e);
                }
            });
        }
    },
    formatException: function (title, body) {
        return title + ' : ' + body;
    }
} || {};
new generator.init('data/demo.json'); // method using external JSON
/*new generator.init(
    {
        "core": [{
            "type": "ul",
            "template": "layout.list",
            "class": "boo",
            "id": "casas",
            "disabled": false,
            "attributes": {
                "data-href": "",
                "data-prop": ""
            },
            "content": "Click Me",
            "style": {
                "background": "#fff",
                "border-right": "1px solid #000"
            },
            "events": {
                "click": "console.log('this')"
            },
            "options":[
                {
                    "item":"sdfsdfsdf",
                    "value":"",
                    "class":""
                },
                {
                    "item":"bloobaloo",
                    "value":"sdfsdf",
                    "class":""
                }
            ],
            "parent": "body"
        }, {
            "type": "button",
            "template": null,
            "class": "boo",
            "id": "casas",
            "disabled": false,
            "attributes": {
                "data-href": "",
                "data-prop": ""
            },
            "content": "Don't Click Me",
            "style": {
                "background": "#fff",
                "border-right": "1px solid #000"
            },
            "events": {
                "click": "console.log('sdfsdfsdf')"
            },
            "options":{

            },
            "parent": "body"
        }]
    });
    */