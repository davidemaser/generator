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
            }
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
            requiresClosure:['select'],
            form:function(obj){
                if(typeof obj == 'object'){
                    var _formWrapper = f.config.template.form;
                    for(var o in obj){
                        _formWrapper = _formWrapper.replace('{{former.id}}',obj[o].id).replace('{{former.class}}',obj[o].class).replace('{{former.name}}',obj[o].name);
                        if(obj[o].attributes !== undefined && typeof obj[o].attributes == 'object'){
                            var _attrObj = obj[o].attributes;
                            var _attrString = '';
                            for(var a in _attrObj){
                                _attrString += a+'="'+_attrObj[a]+'" ';
                            }
                            _attrString = _attrString.trim();
                            _formWrapper = _formWrapper.replace('{{form.attr}}',_attrString);
                        }else{
                            _formWrapper = _formWrapper.replace('{{form.attr}}','');
                        }
                        if(obj[o].action !== undefined && typeof obj[o].action == 'object'){
                            var _action = obj[o].action;
                                        if (_action.type == 'json') {
                                            _formWrapper = _formWrapper.replace(' action="{{former.action}}"','')
                                            $('body').on('submit', 'form', function () {
                                                $.ajax({
                                                    url:_action.url,
                                                    method:_action.method,
                                                    timeout:_action.timeout,
                                                    succes:function(){

                                                    },
                                                    error:function(){

                                                    }
                                                })
                                            });
                                        }
                        }else if(obj[o].action !== undefined && typeof obj[o].action !== 'object'){
                            _formWrapper = _formWrapper.replace('{{former.action}}',obj[o].action).trim();
                        }else{
                            _formWrapper = _formWrapper.replace(' action="{{former.action}}"','')
                        }
                        /*
                        handle each item in the form as well as each
                        items options or attributes
                         */
                        if(obj[o].items !== undefined && Array.isArray(obj[o].items)){
                            var _items = obj[o].items;
                            var _itemString = '';
                            var nil = undefined = '';
                            for(var i in _items){
                                _itemString += '<'+_items[i].element;
                                _itemString += _items[i].type !== undefined && _items[i].type !== '' ? ' type="'+_items[i].type+'"' : '';
                                _itemString += _items[i].name !== undefined && _items[i].name !== '' ? ' name="'+_items[i].name+'"' : '';
                                _itemString += _items[i].class !== undefined && _items[i].class !== '' ? ' class="'+_items[i].class+'"' : '';
                                _itemString += _items[i].id !== undefined && _items[i].id !== '' ? ' id="'+_items[i].id+'"' : '';
                                _itemString += _items[i].value !== undefined && _items[i].value !== '' ? ' value="'+_items[i].value+'"' : '';
                                _itemString += _items[i].placeholder !== undefined && _items[i].placeholder !== '' ? ' placeholder="'+_items[i].placeholder+'"' : '';
                                _itemString += '>';
                                if($.inArray(_items[i].element,build.requiresClosure)>-1){
                                    _itemString += '</'+_items[i].element+'>';
                                }
                                console.log(_items[i],_itemString,$.inArray(_items[i].element,build.requiresClosure))
                            }
                        }
                        console.log(_formWrapper);
                    }
                }else{

                }
            }
        }
    } || {};
    var f = former;
    var config = former.config;
    var build = former.build;