/**
 * Created by David Maser on 14/12/16.
 *
 * This script's main purpose is to create a form
 * in a semantic html markup and register events
 * that validate input and transfer the form content
 * to a remote server as JSON
 */
var former = {
        id : 'former',
        config:{
            cache:'local',
            json:{
                root:'plugins/former/data/',
                file:'main.json',
                save:{
                    format:'POST',
                    headers:'',
                    callback:null
                }
            },
            template:{
                form:'<form id="{{former.id}}" class="{{former.class}}" name="{{former.name}}" {{form.attr}} action="{{former.action}}">{{former.items}}</form>'
            },
            requiresClosure:['select','button','textarea','fieldset'],
            childSchema:{select:'option',option:'label'}
        },
        setup:function(args){
            /*
             load arguments and params into the config
             object before calling the init function
             */
            $.when(this).done(function(){
                f.init();
            });
        },
        init:function(){
            /*
             the configuration is all set up so we can start
             doing the actual core of this function
             */
            f.get.structure();
        },
        get:{
            structure:function(){
                $.ajax({
                    url:config.json.root+config.json.file,
                    method:'GET',
                    success:function(data){
                        build.form(data);
                    },error:function(){

                    }
                })
            }
        },
        build:{
            form:function(obj){
                if(typeof obj == 'object'){
                    var _formWrapper = f.config.template.form;
                    for(var o in obj){
                        if (obj.hasOwnProperty(o)) {
                            _formWrapper = _formWrapper.replace('{{former.id}}', obj[o].id).replace('{{former.class}}', obj[o].class).replace('{{former.name}}', obj[o].name);
                            if (obj[o].attributes !== undefined && typeof obj[o].attributes == 'object') {
                                var _attrObj = obj[o].attributes;
                                var _attrString = '';
                                for (var a in _attrObj) {
                                    _attrString += a + '="' + _attrObj[a] + '" ';
                                }
                                _attrString = _attrString.trim();
                                _formWrapper = _formWrapper.replace('{{form.attr}}', _attrString);
                            } else {
                                _formWrapper = _formWrapper.replace('{{form.attr}}', '');
                            }
                            if (obj[o].action !== undefined && typeof obj[o].action == 'object') {
                                var _action = obj[o].action;
                                if (_action.type == 'json') {
                                    _formWrapper = _formWrapper.replace(' action="{{former.action}}"', '')
                                    $('body').on('submit', 'form', function () {
                                        $.ajax({
                                            url: _action.url,
                                            method: _action.method,
                                            timeout: _action.timeout,
                                            succes: function () {

                                            },
                                            error: function () {

                                            }
                                        })
                                    });
                                }
                            } else if (obj[o].action !== undefined && typeof obj[o].action !== 'object') {
                                _formWrapper = _formWrapper.replace('{{former.action}}', obj[o].action).trim();
                            } else {
                                _formWrapper = _formWrapper.replace(' action="{{former.action}}"', '')
                            }
                            /*
                             handle each item in the form as well as each
                             items options or attributes
                             */
                            if (obj[o].items !== undefined && Array.isArray(obj[o].items)) {
                                var _items = obj[o].items;
                                var _itemString = '';
                                for (var i in _items) {
                                    if (_items.hasOwnProperty(i)) {
                                        var _itemName = _items[i].name !== undefined && _items[i].name !== '' ? _items[i].name : 'fmr-'+_items[i].element + i;
                                        _itemString += _items[i].label !== undefined && typeof _items[i].label == 'object' ? '<label for="'+_itemName+'"' : '';
                                        _itemString += _items[i].label.class !== undefined && _items[i].label.class !== '' ? ' class="'+_items[i].label.class+'"' : '';
                                        if(_items[i].label !== undefined && _items[i].label.adjust !== undefined && typeof _items[i].label.adjust == 'object'){
                                            var _styleAdjust = _items[i].label.adjust;
                                            _itemString += ' style="';
                                            $.each(_styleAdjust,function(key,value){
                                                _itemString += key+':'+value+';';
                                            });
                                            _itemString += '"';
                                        }
                                        _itemString += _items[i].label !== undefined && typeof _items[i].label == 'object' ? '>' : '';
                                        _itemString += _items[i].label.text !== undefined && _items[i].label.text !== '' ? _items[i].label.text : '';
                                        _itemString += '<' + _items[i].element;
                                        _itemString += _items[i].type !== undefined && _items[i].type !== '' ? ' type="' + _items[i].type + '"' : '';
                                        _itemString += _items[i].name !== undefined && _items[i].name !== '' ? ' name="' + _itemName + '"' : ' name="' + _itemName +'"';
                                        _itemString += _items[i].class !== undefined && _items[i].class !== '' ? ' class="' + _items[i].class + '"' : '';
                                        _itemString += _items[i].id !== undefined && _items[i].id !== '' ? ' id="' + _items[i].id + '"' : '';
                                        _itemString += _items[i].value !== undefined && _items[i].value !== '' ? ' value="' + _items[i].value + '"' : '';
                                        _itemString += _items[i].placeholder !== undefined && _items[i].placeholder !== '' ? ' placeholder="' + _items[i].placeholder + '"' : '';
                                        _itemString += '>';
                                        if (_items[i].options !== undefined && _items[i].options !== null) {
                                            var _options = _items[i].options;
                                            var _optionTag = config.childSchema[_items[i].element];
                                            var _optionString = '';
                                            if (_optionTag !== undefined) {
                                                for (var op in _options) {
                                                    if (_options.hasOwnProperty(op)) {
                                                        _optionString += '<' + _optionTag + ' value="' + _options[op].value + '">';
                                                        _optionString += _options[op].label;
                                                        _optionString += '</' + _optionTag + '>'
                                                    }
                                                }
                                            }
                                        }
                                        _itemString += _optionString !== undefined && _optionString !== '' ? _optionString : '';
                                        _itemString += $.inArray(_items[i].element, config.requiresClosure) > -1 ? '</' + _items[i].element + '>' : '';
                                        _itemString += _items[i].label !== undefined && typeof _items[i].label == 'object' ? '</label>' : '';
                                    }
                                    if(_items[i].validate !== undefined && typeof _items[i].validate == 'object'){
                                        var _validators = _items[i].validate;
                                    }

                                }
                            }
                            _formWrapper = _formWrapper.replace('{{former.items}}', _itemString);
                            console.log(_formWrapper);
                            build.validators(_validators);
                        }
                    }
                }else{

                }
            },
            validators:function(text,obj){
                function hasNumber(str) {
                    return /\d/.test(str);
                }
                function isAlphanumeric(str) {
                    return /^[0-9a-zA-Z]+$/.test(str);
                }
                function hasRequiredString(str,rules) {
                    if(Array.isArray(rules)){
                        for(var r in rules){
                            if(str.indexOf(rules[r])>-1){
                                return true;
                            }
                        }
                    }
                }
                function isIdentical(a,b){
                    return a.localeCompare(b);
                }
                if(typeof obj == 'object'){
                    $.each(obj,function(key,value){
                        if(key === 'content'){
                            if(value === 'string'){
                                hasNumber(text);
                            }else if(value === 'alphanum'){
                                isAlphanumeric(text);
                            }
                        }
                        if(key === 'contains'){
                            hasRequiredString(text,value);
                        }
                        console.log(key,value);
                    });
                }
            }
        }
    } || {};
    var f = former;
    var config = former.config;
    var build = former.build;