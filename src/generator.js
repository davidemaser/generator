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
/*jshint funcscope:true*/
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
            dataHolder: {},
            logData: function () {
                /* @todo function in process */
                console.log(ajax.dataHolder);
            },
            chunk:{
                status:{},
                dataHolder:{},
                set:function(obj,length){
                    /*
                     Splits generator.ajax.dataHolder content into smaller chunks, defined by the user.
                     Chunks will be stored into the chunk objects own dataHolder object and can be
                     accessed by calling the object generator.ajax.chunk.dataHolder
                     */
                        obj = obj == null ? ajax.dataHolder : obj;
                        Object.defineProperty(Array.prototype, 'chunk_size', {
                            value: function (chunkSize) {
                                var array = this;
                                return [].concat.apply([],
                                    array.map(function (elem, i) {
                                        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
                                    })
                                );
                            },
                            configurable: true
                        });
                        var _obj = typeof obj == 'object' ? obj : JSON.parse(obj);
                        var _objCore = _obj.core;
                        var _chunk = [];
                        for (var o in _objCore) {
                            _chunk.push(_objCore[o]);
                        }
                        var _tempArray = _chunk.chunk_size(length);
                        var _chunkCount = 0;
                        $.each(_tempArray, function (key, value) {
                            ajax.chunk.dataHolder[key] = value;
                            _chunkCount++;
                        });
                        ajax.chunk.status['available'] = true;
                        ajax.chunk.status['chunk count'] = _chunkCount;
                },
                get:function(start,length){
                    var _available = ajax.chunk.status.available;
                    start = start || 0;
                    length = length || 0;
                    var _tempChunks = [];
                    if(_available !== undefined && _available === true) {
                        if (length !== 0 && length !== undefined) {
                            for (var i = start; i < length; i++) {
                                ajax.chunk.dataHolder[i] !== undefined ? _tempChunks.push(ajax.chunk.dataHolder[i]) : false;
                            }
                        } else {
                            for (var c in ajax.chunk.dataHolder) {
                                ajax.chunk.dataHolder[c] !== undefined ? _tempChunks.push(ajax.chunk.dataHolder[c]) : false;
                            }
                        }
                        return _tempChunks;
                    }else{
                        new errors.alert('Object Unavailable','The object you are trying to access does not exist. Run the chunk.set function',true,'ajax.chunk.get')
                    }
                }
            },
            process:{
                load: function (args) {
                    /*
                     function collects and stores JSON data in a global object.
                     The function also cleans and parses the JSON data. This
                     allows you to remove specific elements from the content.
                     remove parameter can be a string or array
                     args format is :
                     {
                        path:'',
                        parse:true,
                        remove:['string','or','array'],
                        chunk:false
                     }
                     */
                    function parseSource(src){
                        /* @todo should the parseSource function be moved to the helpers object */
                        var _data = JSON.stringify(src),
                            _parse = args.parse || false;
                        if (args.remove !== '' && args.remove !== undefined && args.remove !== null) {
                            if (typeof args.remove == 'object') {
                                for (var r in args.remove) {
                                    var _junk = new RegExp(args.remove[r], 'g');
                                    _data = _data.replace(_junk, '');
                                }
                            } else if (typeof args.remove !== 'object') {
                                _junk = new RegExp(args.remove, 'g');
                                _data = _data.replace(_junk, '');
                            }
                        }
                        if (_parse == true) {
                            ajax.dataHolder = JSON.parse(_data);
                        } else {
                            ajax.dataHolder = _data;
                        }
                    }
                    $.ajax({
                        url: args.path,
                        success: function (data) {
                            ajax.dataHolder = data;
                        }, error: function () {
                            errors.alert('JSON Error','Unable to load JSON. Check your path parameters',true,'ajax.process.load');
                        }
                    }).done(function() {
                        parseSource(ajax.dataHolder);
                    }).done(function() {
                        args.chunk == true ? ajax.chunk.set(null,5) : false; //chunks the data if true
                    });
                },
                save:function(args){
                    /*
                    note : save function is the same used for an update call
                    'PUT' to update
                    args format :
                    {
                        data:'', //required
                        url:'', //required
                        type:'POST', //optional - default is POST
                        dataType:'', //optional - default is JSON
                        contentType:'',
                        headers:'',
                        password:'',
                        save:true
                    }
                     */
                    var _args = {};
                    function getArguments(){
                        $.each(args,function(key,value){
                            _args[key] = value;
                        });
                    }
                    function executeSave(obj){
                        $.ajax({
                            url:obj.url,
                            type:obj.type || 'POST',
                            headers:obj.headers,
                            data:obj.data,
                            timeout:obj.timeout || null,
                            dataType:obj.dataType || 'json',
                            contentType:obj.contentType,
                            password:obj.password,
                            statusCode: {
                                404:function(){
                                    errors.alert('AJAX Save Error','The server responded with a 404 (page not found) error. Data has not been saved',true,'ajax.process.save[executeSave]');
                                },
                                500:function(){
                                    errors.alert('AJAX Save Error','The server responded with a 500 (server error) code. Data has not been saved',true,'ajax.process.save[executeSave]');

                                }
                            },
                            success:function(){
                            },
                            error:function(){
                                errors.alert('AJAX Save Error','The server responded with an error. Data has not been saved',true,'ajax.process.save[executeSave]');
                            }
                        });
                    }
                    if(args !== undefined){
                        if(typeof args == 'object'){
                            $.when(getArguments()).done(function(){
                                executeSave(_args);
                            });
                        }else{
                            errors.alert('Type Mismatch','Function was expecting an object',true,'ajax.process.save');
                        }
                    }else{
                        errors.alert('AJAX Save Error','Required arguments have not been provided',true,'ajax.process.save');
                    }
                }
            }
        },
        listener:{
            init:function(args){
                /*
                args format
                {
                event:'click',
                element:'',
                function:'',
                timer:5000 //optional after this value, event will be killed
                }
                 */
                if(typeof args == 'object'){
                    if(Array.isArray(args) === true){
                        for(var a in args){
                            console.log(args[a]);
                            $(args[a].element).on(args[a].event,function(){
                                eval(args[a].function);
                                if(args[a].timer !== undefined && args[a].timer !== null){
                                    window.setTimeout(function(){
                                        generator.listener.kill({event:args[a].event,element:args[a].element});
                                    },args[a].timer);
                                }
                            });
                        }
                    }else{
                        $(args.element).on(args.event,function(){
                            eval(args.function);
                        });
                        if(args.timer !== undefined && args.timer !== null){
                            window.setTimeout(function(){
                                generator.listener.kill({event:args.event,element:args.element});
                            },args.timer);
                        }
                    }
                }
            },
            kill:function(args){
                if(typeof args == 'object'){
                    if(Array.isArray(args) === true){
                        for(var a in args){
                            if(args[a].timer !== undefined && args[a].timer !== null){
                                window.setTimeout(function(){
                                    $(args[a].element).off(args[a].event);
                                },args[a].timer);
                            }else{
                                $(args[a].element).off(args[a].event);
                            }
                        }
                    }else{
                        if(args.timer !== undefined && args.timer !== null){
                            window.setTimeout(function(){
                                $(args.element).off(args.event);
                                console.warn(args.event+' event killed');
                            },args.timer);
                        }else{
                            $(args.element).off(args.event);
                            console.warn(args.event+' event killed');
                        }
                    }
                }
            }
        },
        dialogs:{
            config:{
                animate:{
                    activate:true,
                    delay:500
                },
                position:'front',
                parent:'body'
            },
            /*
            args format :
            {
                type:'modal',
                title:'string',
                message:'string',
                buttons:{
                    yes:{label:'string',action:'function'},
                    no:{label:'string',action:'function'},
                    close:{label:'string'}
                },
                animate:false
            }
             */
            alert:function(args){

            },
            confirm:function(args){
                helpers.removeDomObjects(['gen_modal','gen_confirm']);
                var _animate = args.animate !== undefined ? args.animate : this.config.animate.activate;
                var _required = ['yes','no'],
                    _options = [];
                if(typeof args == 'object'){
                    if(args.type !== undefined && args.type === 'alert'){
                        var _confirmTitle = args.title,
                            _confirmMessage = args.message,
                            _confirmButtons = args.buttons,
                            _confirm = '<div class="gen_confirm overlay" style="opacity:0">' +
                            '<div class="gen_confirm inner">' +
                            '<div class="gen_confirm title">{{confirm.title}}</div>' +
                            '<div class="gen_confirm message">{{confirm.message}}</div>' +
                            '<div class="gen_confirm buttons">{{confirm.buttons}}</div>' +
                            '</div>' +
                            '</div>';
                        _confirm = _confirm.replace('{{confirm.title}}',_confirmTitle).replace('{{confirm.message}}',_confirmMessage).replace('{{confirm.buttons}}',helpers.buildButtons(_confirmButtons,_required,_options));
                        $(this.config.parent).prepend(_confirm);
                        _animate === true ? $('.gen_confirm').animate({opacity:1},this.config.animate.delay) : $('.gen_confirm').attr('style','');
                    }
                }
            },
            modal:function(args){
                helpers.removeDomObjects(['gen_modal','gen_confirm']);
                var _animate = args.animate !== undefined ? args.animate : this.config.animate.activate;
                var _required = ['close'],
                    _options = ['yes','no'];
                if(typeof args == 'object'){
                    if(args.type !== undefined && args.type === 'modal'){
                        var _modalTitle = args.title,
                            _modalMessage = args.message,
                            _modalButtons = args.buttons,
                            _modal = '<div class="gen_modal overlay" style="opacity:0">' +
                            '<div class="gen_modal inner">' +
                            '<div class="gen_modal title">{{modal.title}}</div>' +
                            '<div class="gen_modal message">{{modal.message}}</div>' +
                            '<div class="gen_modal buttons">{{modal.buttons}}</div>' +
                            '</div>' +
                            '</div>';
                        _modal = _modal.replace('{{modal.title}}',_modalTitle).replace('{{modal.message}}',_modalMessage).replace('{{modal.buttons}}',helpers.buildButtons(_modalButtons,_required,_options));
                        $(this.config.parent).prepend(_modal).on('click','button[data-action="close"]',function(){
                            helpers.removeDomObjects('gen_modal');
                        });
                        _animate === true ? $('.gen_modal').animate({opacity:1},this.config.animate.delay) : $('.gen_modal').attr('style','');
                    }
                }
             }
        },
        helpers: {
            adoptChidren: function (parent, children) {
                if (typeof children == 'object') {
                    $.each(children, function (key, value) {
                        $(parent).append(value);
                        //@todo this has to be done soon or descoped
                    });
                }
            },
            checkObjectType:function(elem){
                if($(elem).length !== 0) {
                    return elem;
                }else if($('.'+elem).length !== 0) {
                    return '.'+elem;
                }else if($('#'+elem).length !== 0) {
                    return '#'+elem;
                }
            },
            removeDomObjects:function(obj){
                /*
                 removes a specific object or an array of objects
                 from the dom tree. There is no need to specify
                 if the object is an html tag, an ID or a class
                 as the script will check that and append the
                 proper prefix
                 */
                var _refuse = ['body','html','head'];//list of items you don't want the script to touch
                if(Array.isArray(obj) === true){
                    for(var o in obj){
                        var _object = this.checkObjectType(obj[o]);
                        $.inArray(obj[o],_refuse)  > -1 ? console.log('that item can not be removed') : $(_object).remove();
                    }
                }else{
                    _object = this.checkObjectType(obj);
                    $.inArray(obj,_refuse)  > -1 ? console.log('that item can not be removed') : $(_object).remove();
                }
            },
            buildButtons:function(param,required,options){
                var _buttonString = '';
                var _button = '<div class="button">{{gen.button}}</div>';
                if(typeof param == 'object'){
                    for(var p in param){
                        if(p !== 'close' && $.inArray(p,options) > -1){
                            var _thisButton = '<button type="'+p+'" data-action="'+param[p].action+'">'+param[p].label+'</button>';
                            _buttonString += _button.replace('{{gen.button}}',_thisButton);
                        }else if(p === 'close' && $.inArray(p,required) > -1){
                            _thisButton = '<button type="'+p+'" data-action="close">'+param[p].label+'</button>';
                            _buttonString += _button.replace('{{gen.button}}',_thisButton);
                        }
                    }
                    return _buttonString;
                }else{
                    errors.alert('Type Mismatch','The function was expecting an object but did not receive one',false,'buildButtons');
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
                        if (o !== 'type' && o !== 'url') {
                            _styleString += o + ':' + obj[o] + ';\n';
                        }
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
        index:{
        	schema:{},
        	build:function(id){
        	/*
        	function builds an index of all generator objects on the page
        	*/
        		$.each($('[generator-id]'),function(){
        			generator.index.schema[$(this).attr('generator-id')] = $(this).attr('generator-type');
        		});
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
                    //
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
                        _generatorID = helpers.makeGeneratorID(_core[i].type, i),
                        _attributes = helpers.makeAttributes(_core[i].attributes);
                    if (_core[i].template !== null && _core[i].template !== undefined) {
                        if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                            var _styleString = '',
                                _styleArray = [];
                            $.each(_core[i].style, function (key, value) {
                                if (key == 'type' && value == 'file') {
                                    new LoadStyleSheet(_core[i].style['url']);
                                } else if (key == 'type' && value == 'inline') {
                                    helpers.makeInlineStyle(_core[i].style, _core[i].id);
                                } else {
                                    _styleString += key + ':' + value + ';';
                                }
                            });
                        }
                        if (typeof helpers.getTemplate(_core[i].template, _core[i].type) == 'object') {
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
                                new errors.alert('Mismatch', 'The options value in the json is not an object',true,'build');
                            } else {
                                var _parent = '',
                                    _child = '',
                                    _baseObj = helpers.getTemplate(_core[i].template, _core[i].type);
                                $.each(_baseObj, function (key, value) {
                                    if (key == 'parent') {
                                        _parent = value;
                                    } else if (key == 'child') {
                                        _child = value;
                                    }
                                });
                                var _item = '';
                                for (var o in _core[i].options) {
                                    _item += _child.replace('{{core.class}}', _core[i].options[o].class !== null ? helpers.makeObjectClass(_core[i].options[o].class) : '');
                                    _item = _item.replace(/{{gen.id}}/g, helpers.makeGeneratorID(_core[i].type, i + '-' + o + '-child'));
                                    _item = _item.replace('{{object.child.content}}', _core[i].options[o].item);
                                    _item = _item.replace('{{core.value}}', helpers.makeObjectValue(_core[i].options[o].value));
                                    _item = _item.replace('{{gen.type}}', helpers.makeObjectType(_core[i].type + '.' + _core[i].template + '.sub'));
                                }
                                var _result = _parent.replace('{{@inject:[%each.child%]}', _item);
                                _result = _result.replace('{{core.id}}', _core[i].id !== null ? helpers.makeObjectID(_core[i].id) : '');
                                _result = _result.replace('{{core.class}}', _core[i].class !== null ? helpers.makeObjectClass(_core[i].class) : '');
                                _result = _result.replace('{{core.attributes}}', _attributes);
                                _result = _result.replace('{{gen.type}}', helpers.makeObjectType(_core[i].type + '.' + _core[i].template));
                                _result = _result.replace(/{{gen.id}}/g, helpers.makeGeneratorID(_core[i].type, i));
                                _result = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled === true ? _result.replace('{{object.parent.disabled}}', 'disabled') : _result.replace(' {{object.parent.disabled}}', '');
                                _result = _styleString !== '' && _styleString !== undefined ? _result.replace('{{gen.style}}', 'style="' + _styleString + '"') : _result.replace('{{gen.style}}', '');
                                _structure += _result;
                            }
                        } else {
                            var _template = helpers.getTemplate(_core[i].template, _core[i].type);
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
                                var _inclusion = _template.split('@include:')[1].split('}}')[0],
                                    _coreReference = _inclusion.split('.')[1],
                                    _toAdd = helpers.getTemplate(_inclusion),
                                    _toRemove = '{{@include:' + _inclusion + '}}';
                                for (obj in generator.core) {
                                    if (generator.core[obj].type == _coreReference) {
                                        _toAdd = _toAdd.replace(/{{object.parent.id}}/g, generator.core[obj].id);
                                        _toAdd = _toAdd.replace(/{{gen.id}}/g, helpers.makeGeneratorID(generator.core[obj].type, obj));
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
                            helpers.makeEventHandlers(key, _generatorID, value);
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
                if (Array.isArray(obj) === true) {
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
                            for (var e in objArray) {
                                if (objArray.hasOwnProperty(e)) {
                                    _extensionName += e === 'identifier' ? objArray[e] : '';
                                    if (e == 'parent') {
                                        _extensionFormat[e] = objArray[e];
                                    }
                                    if (e == 'child') {
                                        _extensionFormat[e] = objArray[e];
                                    }
                                    if (e == 'code') {
                                        _extensionFormat = objArray[e];
                                    }
                                }
                            }
                            if (generator.extensions[_extensionName] !== undefined && generator.extensions[_extensionName] !== '') {
                                window.alert('The extension ' + _extensionName.toUpperCase() + ' has already been registered');
                            } else {
                                generator.accept.extensions.push(_extensionName);
                                generator.extensions[_extensionName] = _extensionFormat;
                            }
                        } else {
                            new errors.alert('Type mismatch', 'An object was expected',true,'extend');
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
                            window.alert('The extension ' + _extensionName.toUpperCase() + ' has already been registered');
                        } else {
                            generator.accept.extensions.push(_extensionName);
                            generator.extensions[_extensionName] = _extensionFormat;
                        }
                    } else {
                        new errors.alert('Type mismatch', 'An object was expected',true,'extend');
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
                if(this.supported() === true){
                    var _lsItem = args.prefix === true ? generator.config.storage.prefix+args.id : args.id;
                    return localStorage.getItem(_lsItem);
                }
            },
            save:function(args) {
                if(this.supported() === true){
                    var _lsItem = args.prefix === true ? generator.config.storage.prefix+args.id : args.id;
                    localStorage.setItem(_lsItem,args.data);
                }
            },
            purge:function(args) {
                if(this.supported() === true) {
                    var _lsItem = args.prefix === true ? generator.config.storage.prefix+args.id : args.id;
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
                if (_multiple === true) {
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
                        _tempURL += _append === true ? '.' + _ext : '';
                        $.getScript(_tempURL).done(function () {
                            if (Array.isArray(_tempFunctions) === true) {
                                for (var f in _tempFunctions) {
                                    helpers.executeFunctionByName(_tempFunctions[f].call, window, _tempFunctions[f].params);
                                }
                            } else {
                                helpers.executeFunctionByName(_tempFunctions.call, window, _tempFunctions.params);
                            }
                        }).fail(function () {
                            console.log('Unable to load ' + _tempURL);
                        });
                    });
                }
            }
        },
        init: {
            rules:{
                //add any init rules here
            },
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
                        generator.build(src);
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
                    if (obj === '' || obj === undefined) {
                        obj = generator.config.extensions.src.root;
                    }
                    if (obj !== '' && obj !== null && obj !== undefined) {
                        $.ajax({
                            url: obj,
                            success: function (data) {
                                extend(data);
                            },
                            error: function () {
                                extend(obj);
                            }
                        });
                    }
                }
            },
            plugins: function (params) {
                var _multiple = Array.isArray(params);
                params = _multiple === true && params.length == 1 ? params[0] : params; //if the params are formatted as an array but only contain one object
                var _tempObject = {};
                if (_multiple === true) {
                    for (var p in params) {
                        _tempObject[params[p].plugin] = params[p];
                    }
                } else {
                    _tempObject = params;
                }
                function returnPluginParams(match) {
                    $.each(_tempObject, function (key, value) {
                        if (key === match) {
                            return value.params;
                        }
                    });
                }
                var _list = generator.plugins;
                for (var l in _list) {
                    $.each(_list[l], function (key, value) {
                        if (value.root !== undefined) {
                            var _root = value.root;
                            $.getScript(_root + 'plugin.js?p=' + key).done(function () {
                                helpers.executeFunctionByName(key + '.setup', window, [value, params]);
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
            alert:function(title, body, write, caller) {
                write === true ? errors.report(title, body, caller) : '';
                console.warn(title + ' : ' + body);
                return title + ' : ' + body;
            },
            report:function(title, body,caller) {
                var _date = new Date();
                this.log.push({
                    date:_date,
                    title:title,
                    error:body,
                    caller:caller
                });
            }
        }
    } || {},
    $g = ge = generator;
    var ajax = generator.ajax;
    var load = generator.ajax.process.load;
    var save = generator.ajax.process.save;
    var dialogs = generator.dialogs;
    var errors = generator.errors;
    var extend = generator.extend;
    var helpers = generator.helpers;
    var run = generator.init;
    var storage = generator.storage;
    var scripts = generator.scripts;
new generator.init.core('data/demo.json', false, [{plugin: 'translator', params: ['fr_FR', 1000]}]); // method using external JSON
// can also be called by new run.core....

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
 "click": "window.alert('bam bam')"
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
