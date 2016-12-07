/**
 * Created by David Maser.
 */
var generator = {
    accept : ['button','div','section','ul','li','nav','form','radio','checkbox','footer','header'],
    nomenclature:{
        generator:'generator-id="{{type}}-{{unit}}"'
    },
    generatorIdFormat : 'generator-id=""',
    template: {
        form:{
            button:"<button {{gen.id}} class=\"{{object.parent.class}}\">{{object.parent.content}}</button>",
            checkbox:"<input type=\"checkbox\" {{gen.id}} class=\"{{object.parent.class}}\">",
            radiobutton:"",
            input:"<input type=\"text\" {{gen.id}} class=\"{{object.parent.class}}\" />",
            textarea:"<textarea {{gen.id}} class=\"{{object.parent.class}}\">class=\"{{object.parent.content}}\"</textarea>"
        },
        layout:{
            header:"<header {{gen.id}} class=\"{{object.parent.class}}\">{{@include:layout.nav}}</header>",
            footer:"<footer {{gen.id}} class=\"{{object.parent.class}}\"></footer>",
            nav:"<nav {{gen.id}} class=\"{{object.parent.class}}\"></nav>",
            list:"<ul {{gen.id}} class=\"{{object.parent.class}}\"><li {{gen.id}} class=\"{{object.child.class}}\">{{object.child.content}}</li></ul>"
        },
        core : {}
    },
    getTemplate:function(item){
        var string = 'generator.template';
        if(item.indexOf('.')>-1){
            item = item.split('.');
            for(i in item){
                string += '.' + item[i];
            }
        }else{
            string += '.' + item;
        }
        if(eval(string) !== undefined) {
            return eval(string);
        }
    },
    makeGeneratorID:function(type,unit){
        var _string = generator.nomenclature.generator;
        return _string.replace('{{type}}',type).replace('{{unit}}',unit);
    },
    build:function(obj){
        if(typeof obj == 'object') {
            var _core = generator.core = obj.core;
            for (var i in _core) {
                var _structure = '',
                    _valid = $.inArray(_core[i].type, generator.accept),
                    _generatorID = generator.makeGeneratorID(_core[i].type,i);
                if(_core[i].template !== null && _core[i].template !== undefined){
                    var _template = generator.getTemplate(_core[i].template);
                        _template = _template.replace('{{object.parent.class}}',_core[i].class);
                        _template = _template.replace('{{object.parent.content}}',_core[i].content);
                        _template = _template.replace(/{{gen.id}}/g,_generatorID);
                    if(_template.indexOf('@include')>-1){
                        var inclusion = _template.split('@include:')[1].split('}}')[0],
                            coreReference = inclusion.split('.')[1],
                            toAdd = generator.getTemplate(inclusion),
                            toRemove = '{{@include:'+inclusion+'}}';
                        for(obj in generator.core){
                            if(generator.core[obj].type == coreReference){
                                toAdd = toAdd.replace('{{object.parent.class}}',generator.core[obj].class);
                                toAdd = toAdd.replace('{{gen.id}}',generator.makeGeneratorID(generator.core[obj].type,obj));
                            }
                        }
                        _template = _template.replace(toRemove,toAdd);
                    }
                    _structure += _template;
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
    init:function(src,template){
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
};
//new generator.init('data/demo.json'); // method using external JSON
new generator.init(
    {
        "core": [{
            "type": "button",
            "template": null,
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
            "parent": "body"
        }, {
            "type": "nav",
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
            "parent": "body"
        }]
    });