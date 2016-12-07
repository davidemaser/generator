/**
 * Created by David Maser.
 */
var generator = {
    accept : ['button','div','section','ul','li','nav','form','radio','checkbox','footer','header'],
    templates: {
        "form":{
            "button":"<button class=\"{{object.parent.class}}\">{{object.parent.content}}</button>",
            "checkbox":"",
            "radiobutton":"",
            "radiogroup":"",
            "input":"<input type=\"text\" class=\"{{object.parent.class}}\" />",
            "textarea":"<textarea class=\"{{object.parent.class}}\">class=\"{{object.parent.content}}\"</textarea>"
        },
        "layout":{
            "header":"",
            "footer":"",
            "nav":"",
            "list":"<ul class=\"{{object.parent.class}}\"><li class=\"{{object.child.class}}\">{{object.child.label}}</li></ul>"
        }
    },
    build:function(obj){
        if(typeof obj == 'object') {
            var _core = obj.core;
            for (var i in _core) {
                var _valid = $.inArray(_core[i].type,generator.accept);
                var _generatorID = _core[i].type+'-'+i;
                var _structure = '<'+_core[i].type+' generator-id="core-'+_generatorID+'"';

                _structure += _core[i].class !== '' && _core[i].class !== undefined ? ' class="'+_core[i].class+'"' : '';
                _structure += _core[i].id !== '' && _core[i].id !== undefined ? ' id="'+_core[i].id+'"' : '';
                _structure += _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? ' disabled' : '';
                if (_core[i].attributes !== '' && _core[i].attributes !== undefined && typeof _core[i].attributes == 'object') {
                    $.each(_core[i].attributes, function( key, value ) {
                        if (_core[i].attributes[key] !== '' && _core[i].attributes[key] !== undefined) {
                            _structure += ' '+key+'='+value;
                        }
                    });
                }
                if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                    var _styleString = '';
                    $.each(_core[i].style, function( key, value ) {
                        if (_core[i].style !== '' && _core[i].style !== undefined) {
                            _styleString += key + ':' +value+';';
                        }
                    });
                    _structure += ' style="'+_styleString+'"';
                }
                _structure += '>';
                _structure += _core[i].content;
                _structure += '</'+_core[i].type+'>';
                if(_valid > -1){
                    $(_core[i].parent).append(_structure);
                    $.each(_core[i].events, function( key, value ) {
                        $('body').on(key,'[generator-id="core-'+_generatorID+'"]',function(){
                            eval(value);
                        });
                    });
                }

            }
        }
    },
    init:function(src){
        if(src == 'object'){
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
new generator.init('data/demo.json'); // method using external JSON
/*new generator.build(
{
    "core": [{
    "type": "button",
    "template":null,
    "class":"boo",
    "id":"first",
    "disabled":false,
    "attributes":{
        "data-href":"",
        "data-prop":""
    },
    "content":"Click Me",
    "style":{
        "background":"#fff",
        "border-right":"1px solid #000",
        "color":"#000"
    },
    "events":{
        "click":"console.log('this')"
    },
    "parent":"body"
},{
        "type": "button",
        "template":null,
        "class":"boo",
        "id":"second",
        "disabled":false,
        "attributes":{
            "data-href":"",
            "data-prop":""
        },
        "content":"Don't Click Me",
        "style":{
            "background":"#fff",
            "border-right":"1px solid #000",
            "color":"#000"
        },
        "events":{
            "click":"console.log('sdfsdfsdf')"
        },
        "p/*new generator.build(
{
    "core": [{
    "type": "button",
    "template":null,
    "class":"boo",
    "id":"first",
    "disabled":false,
    "attributes":{
        "data-href":"",
        "data-prop":""
    },
    "content":"Click Me",
    "style":{
        "background":"#fff",
        "border-right":"1px solid #000",
        "color":"#000"
    },
    "events":{
        "click":"console.log('this')"
    },
    "parent":"body"
},{
        "type": "button",
        "template":null,
        "class":"boo",
        "id":"second",
        "disabled":false,
        "attributes":{
            "data-href":"",
            "data-prop":""
        },
        "carent":"body"
    }]
});*/