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
        widget:['clock']
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
    core : {},
    getTemplate:function(item,type){
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
    makeGeneratorID:function(type,unit){
        var _string = this.nomenclature.generator;
        return _string.replace('{{type}}',type).replace('{{unit}}',unit);
    },
    makeObjectClass:function(val){
        if(val !== null && val !== undefined && val !== '') {
            return 'class="' + val + '"';
        }else{
            return '';
        }
    },
    makeObjectID:function(val){
        if(val !== null && val !== undefined && val !== '') {
            return 'id="' + val + '"';
        }else{
            return '';
        }
    },
    makeObjectValue:function(val){
        if(val !== null && val !== undefined && val !== '') {
            return 'value="' + val + '"';
        }else{
            return '';
        }
    }, 
    makeObjectType:function(val){
        if(val !== null && val !== undefined && val !== '') {
            return 'generator-type="' + val + '"';
        }else{
            return '';
        }
    },
    makeAttributes:function(obj){
        /*
        check if the object has attributes and return it in
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
        var _styleString = '<style type="text/css">\n';
        if(typeof obj == 'object'){
            _styleString += '#'+parent+'{\n';
            for(var o in obj){
                if(o !== 'type' && o !== 'url')
                    _styleString += o+':'+obj[o]+';\n';
            }
            _styleString += '}\n'
        _styleString += '</style>';
        }
        $(_styleString).appendTo('head');

    },
    makeEventHandlers:function(key,id,val){
        $('body').on(key, '[' + id + ']', function () {
            eval(val);
        });
    },
    build:function(obj){
        function FormatException(title,body){
            return title+' : '+body;
        }
        function LoadStyleSheet(link){
            $('<link/>', {rel: 'stylesheet', href: link}).appendTo('head');
        }
        if(typeof obj == 'object') {
            var _core = generator.core = obj.core;
            for (var i in _core) {
                var _structure = '';
                if(typeof generator.accept == 'object'){
                    var _validItems = [];
                    for(a in generator.accept){
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
                    _generatorID = generator.makeGeneratorID(_core[i].type,i),
                    _attributes = generator.makeAttributes(_core[i].attributes);
                console.log(_valid);
                if(_core[i].template !== null && _core[i].template !== undefined){
                    if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                        var _styleString = '',
                            _styleArray = [];
                        $.each(_core[i].style, function (key, value) {
                            if(key == 'type' && value == 'file'){
                                LoadStyleSheet(_core[i].style['url']);
                            }else if(key == 'type' && value == 'inline'){
                                generator.makeInlineStyle(_core[i].style,_core[i].id);
                            }else {
                                _styleString += key + ':' + value + ';';
                            }
                        });
                    }
                    if(typeof generator.getTemplate(_core[i].template,_core[i].type) == 'object'){
                        /*
                        we have an object so we know we're going to build a select
                        or list item. This means we are expecting to see a parent
                        item and a child object. We have to pull the template of the
                        parent and the child and use them to iterate through the options
                        in our json
                         */
                        if(typeof _core[i].options !== 'object'){
                            throw new FormatException('Mismatch','The options value in the json is not an object');
                        }else {
                            var parent = '';
                            var child = '';
                            var baseObj = generator.getTemplate(_core[i].template,_core[i].type);
                            $.each(baseObj, function (key, value) {
                                if (key == 'parent') {
                                    parent = value;
                                } else if (key == 'child') {
                                    child = value;
                                }
                            });
                            var item = '';
                            for(var o in _core[i].options){
                                item += child.replace('{{core.class}}',_core[i].options[o].class !== null ? generator.makeObjectClass(_core[i].options[o].class) : '');
                                item = item.replace(/{{gen.id}}/g,generator.makeGeneratorID(_core[i].type,i+'-'+o+'-child'));
                                item = item.replace('{{object.child.content}}',_core[i].options[o].item);
                                item = item.replace('{{core.value}}',generator.makeObjectValue(_core[i].options[o].value));
                                item = item.replace('{{gen.type}}',generator.makeObjectType(_core[i].type+'.'+_core[i].template+'.sub'));
                            }
                            var result = parent.replace('{{@inject:[%each.child%]}',item);
                            result = result.replace('{{core.id}}',_core[i].id !== null ? generator.makeObjectID(_core[i].id) : '');
                            result = result.replace('{{core.class}}',_core[i].id !== null ? generator.makeObjectClass(_core[i].class) : '');
                            result = result.replace('{{core.attributes}}',_attributes);
                            result = result.replace('{{gen.type}}',generator.makeObjectType(_core[i].type+'.'+_core[i].template));
                            result = result.replace(/{{gen.id}}/g,generator.makeGeneratorID(_core[i].type,i));
                            result = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? result.replace('{{object.parent.disabled}}','disabled') : result.replace(' {{object.parent.disabled}}','');
                            result = _styleString !== '' && _styleString !== undefined ? result.replace('{{gen.style}}','style="' + _styleString + '"') : result.replace('{{gen.style}}','');
                            _structure += result;
                        }
                    }else {
                        var _template = generator.getTemplate(_core[i].template,_core[i].type);
                        _template = _template.replace('{{object.parent.content}}', _core[i].content);
                        _template = _template.replace(/{{gen.id}}/g, _generatorID);
                        _template = _template.replace('{{gen.type}}',generator.makeObjectType(_core[i].type+'.'+_core[i].template));
                        _template = _template.replace('{{core.attributes}}',_attributes);
                        _template = _template.replace(/{{object.parent.id}}/g,_core[i].id);
                        _template = _template.replace('{{core.id}}',_core[i].id !== null ? generator.makeObjectID(_core[i].id) : '');
                        _template = _template.replace('{{core.class}}',_core[i].class !== null ? generator.makeObjectClass(_core[i].class) : '');
                        _template = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? _template.replace('{{object.parent.disabled}}','disabled') : _template.replace(' {{object.parent.disabled}}','');
                        _template = _styleString !== '' && _styleString !== undefined ? _template.replace('{{gen.style}}','style="' + _styleString + '"') : _template.replace('{{gen.style}}','')
                        if (_template.indexOf('@include') > -1) {
                            var inclusion = _template.split('@include:')[1].split('}}')[0],
                                coreReference = inclusion.split('.')[1],
                                toAdd = generator.getTemplate(inclusion),
                                toRemove = '{{@include:' + inclusion + '}}';
                            for (obj in generator.core) {
                                if (generator.core[obj].type == coreReference) {
                                    toAdd = toAdd.replace(/{{object.parent.id}}/g,generator.core[obj].id);
                                    toAdd = toAdd.replace(/{{gen.id}}/g, generator.makeGeneratorID(generator.core[obj].type, obj));
                                }
                            }
                            _template = _template.replace(toRemove, toAdd);
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
                            generator.makeEventHandlers(key,_generatorID,value);
                        });
                    }
            }
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
            })
        }
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