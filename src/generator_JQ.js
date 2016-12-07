/**
 * Created by David Maser.
 */
var generator = {
    accept : ['button','div','section','ul','li','list','nav','form','radio','select','checkbox','footer','header'],
    nomenclature:{
        generator:"generator-id=\"{{type}}-{{unit}}\"",
        template:"generator.template"
    },
    template: {
        form:{
            button:"<button {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}>{{object.parent.content}}</button>",
            checkbox:"<label for=\"{{object.parent.id}}\"><input id=\"{{object.parent.id}}\" type=\"checkbox\" {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.disabled}} {{object.parent.attributes}}>{{object.parent.content}}</label>",
            radiobutton:"<input type=\"radiobutton\" {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}>",
            input:"<input type=\"text\" {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}} />",
            textarea:"<textarea {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}>{{object.parent.content}}</textarea>",
            select:{
                parent:"<select {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.disabled}} {{object.parent.attributes}}>{{@inject:[%each.child%]}</select>",
                child : "<option {{gen.id}} value=\"{{object.child.value}}\">{{object.child.content}}</option>"

            }
        },
        layout: {
            header: "<header {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}>{{@include:layout.nav}}</header>",
            footer: "<footer {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}></footer>",
            nav: "<nav {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}></nav>",
            list: {
                parent: "<ul {{gen.id}} class=\"{{object.parent.class}}\" {{object.parent.attributes}}>{{@inject:[%each.child%]}</ul>",
                child:"<li {{gen.id}} class=\"{{object.child.class}}\">{{object.child.content}}</li>"

            }
        },
        core : {}
    },
    getTemplate:function(item){
        var _string = this.nomenclature.template;
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
    buildAttributes:function(obj){
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
    build:function(obj){
        function FormatException(title,body){
            return title+' : '+body;
        }
        if(typeof obj == 'object') {
            var _core = generator.core = obj.core;
            for (var i in _core) {
                var _structure = '',
                    _valid = $.inArray(_core[i].type, this.accept),
                    _generatorID = generator.makeGeneratorID(_core[i].type,i),
                    _attributes = generator.buildAttributes(_core[i].attributes);
                if(_core[i].template !== null && _core[i].template !== undefined){
                    if(typeof generator.getTemplate(_core[i].template) == 'object'){
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
                            var baseObj = generator.getTemplate(_core[i].template);
                            $.each(baseObj, function (key, value) {
                                if (key == 'parent') {
                                    parent = value;
                                } else if (key == 'child') {
                                    child = value;
                                }
                            });
                            var item = '';
                            for(var o in _core[i].options){
                                item += child.replace('{{object.child.class}}',_core[i].options[o].class);
                                item = item.replace(/{{gen.id}}/g,generator.makeGeneratorID(_core[i].type,i+'-'+o+'-child'));
                                item = item.replace('{{object.child.content}}',_core[i].options[o].item);
                                item = item.replace('{{object.child.value}}',_core[i].options[o].value);
                            }
                            var result = parent.replace('{{@inject:[%each.child%]}',item);
                            result = result.replace('{{object.parent.class}}',_core[i].class);
                            result = result.replace('{{object.parent.attributes}}',_attributes);
                            result = result.replace(/{{gen.id}}/g,generator.makeGeneratorID(_core[i].type,i+'-'+o));
                            result = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? result.replace('{{object.parent.disabled}}','disabled') : result.replace(' {{object.parent.disabled}}','');
                            _structure += result;
                        }
                    }else {
                        var _template = generator.getTemplate(_core[i].template);
                        _template = _template.replace('{{object.parent.class}}', _core[i].class);
                        _template = _template.replace('{{object.parent.content}}', _core[i].content);
                        _template = _template.replace(/{{gen.id}}/g, _generatorID);
                        _template = _template.replace('{{object.parent.attributes}}',_attributes);
                        _template = _template.replace(/{{object.parent.id}}/g,_core[i].id);
                        _template = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? _template.replace('{{object.parent.disabled}}','disabled') : _template.replace(' {{object.parent.disabled}}','');

                        if (_template.indexOf('@include') > -1) {
                            var inclusion = _template.split('@include:')[1].split('}}')[0],
                                coreReference = inclusion.split('.')[1],
                                toAdd = generator.getTemplate(inclusion),
                                toRemove = '{{@include:' + inclusion + '}}';
                            for (obj in generator.core) {
                                if (generator.core[obj].type == coreReference) {
                                    toAdd = toAdd.replace('{{object.parent.class}}', generator.core[obj].class);
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
                        var _styleString = '';
                        $.each(_core[i].style, function (key, value) {
                            if (_core[i].style !== '' && _core[i].style !== undefined) {
                                _styleString += key + ':' + value + ';';
                            }
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
                            $('body').on(key, '[' + _generatorID + ']', function () {
                                eval(value);
                            });
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