###Generator Objects, Methods and Functions

Below is a comprehensive list of generator objects, methods and functions. Use this guide to understand how to build and execute generator commands. See below for a list of aliases that allow you to call specific methods and functions using a pseudo shorthand identifier.

NOTE: private functions are not described in this document

####accept {object - generator.accept}

The accept object contains all tags or component types that are accepted by the generator template builder. Before building objects, the template builder will check for a correspondence in the child object's array.

The accept object has 4 child objects: 

- object - refers to HTML elements 
- components - refers to built in UI components
- widget - refers to built in UI widget
- extensions - refers to extensions added by the user.

####component {object - generator.component}

The component object includes a list of component templates. Components are similar to templates.

####config {object - generator.config - alias: conf}

The config object contains all configuration parameters for generator functions and methods. You can add to the config items.

####core {object - generator.core}

The core object is essentially a data placeholder for core objects and definitions. Certain methods store data in the core object in order to ensure that all generator objects can access the data. 

####extensions {object - generator.extensions}

The extensions object is a configuration object for any third party extension added to generator. The extensions object is deprecated and will be replaced by the plugin object. 

####nomenclature {object - generator.nomenclature}

The nomenclature object is a simple element that contains models for certain generator elements. 

####plugins {object - generator.plugins}

The plugin object contains an array of plugins that will be loaded when generator loads. See the plugin section in the readme file for more information on this object's format as well as writing and adding your plugins. 

####template {object - generator.template - alias: template}

The template object is where all the generator template objects reside. To build more templates or extend existing ones, add the element's definitions and parameters here. Template object structure is defined below.

```
category_name:{
                    element:"<element code {{generator tags}}"></element>",
                    complex_element:{
                        parent:"<element code"></element>,
                        child:"<element code"></element>
                    }
               }
```

Explore the template object to get a better understanding of the semantics and structure.

####ajax {object - generator.ajax - alias: ajax or a}

#####=>dataHolder {object - generator.ajax.dataHolder}

The dataHolder object is a data placeholder that caches json data and returns it to a caller

#####=>logData {function - generator.ajax.logData()}

A utility function that prints to console the content of the ajax.dataHolder object. 

```
ajax.logData()
```

#####=>chunk {object - generator.ajax.chunk}

Chunk is an ajax utility object that breaks large data into smaller, more manageable chunks of data. 

- ######status {object - generator.ajax.chunk.status}

The chunk.status object is a simple feature that contains information about the chunked data objects. 

- ######dataHolder {object - generator.ajax.chunk.dataHolder}

The chunk.dataHolder is a placeholder for data that is returned by the chunk functions.

- ######set {function - generator.ajax.chunk.set(obj,length)}

```
ajax.chunk.set(object,10)
```. This code will take the object passed as a parameter and split it into 10 chunks. The chunks can be accessed by calling the dataHolder ```ajax.chunk.dataHolder``` or by using the chunk.get function.

- ######get {function - generator.ajax.chunk.get(start,length)}

```
ajax.chunk.get(0,10)
``` This code will return all data chunks from entry 0 to entry 10. Chunks can be paginated using the ajax.paginate function. 

#####=>process {object - generator.ajax.process}

- ######content {function - generator.ajax.process.content(args)}

```
ajax.process.content(args)
``` This code will query a datasource, return a json object and place the returned data into the object that called it. The arguments for this function are the following.

```
{
    path:'path/to/json',
    object:'root_json_object', //(i.e. data.object)
    position:1, //optional : if returned json is an array, you can specify which item to return (i.e. data.object[5])
    node:'' //optional : if only a specific element is required, call it by key (i.e. data.object[5].keyName)
}
```

The ajax call is executed within a promise object. If the ajax call was successful and data is returned, the promise will resolve a success and return the result of the ajax query. The following function will print the result of the query to console when it has finished succesfully.

```
ajax.process.content({path:'path/file.json',object:'core',position:2,node:'template'})
    .then(function (result) {
        console.log(result);
    })
```

- ######load {function - generator.ajax.process.content(args)}

```
ajax.process.load(args)
```
This code will query a datasource, return a json formatted string and store that data in the dataHolder object. Optionally you can pass the data to the chunk function, remove specific elements from the json using the remove arguments and parse the data into JSON format. The arguments for this function are as follows.

```
{
    path:'path/to/json',
    parse:true, //boolean 
    remove:['string','or','array'], //optional : remove content from the json string
    chunk:{ //optional : convert the returned data into smaller chunks
        active:true,
        length:10
    },
    object:'root_json_object', //(i.e. data.object)
    position:1, //optional : if returned json is an array, you can specify which item to return (i.e. data.object[5])
    node:'' //optional : if only a specific element is required, call it by key (i.e. data.object[5].keyName)
}
```

This function can be placed in a jQuery $.when().done() statement to ensure that all other functions are deferred to when the function has completed. The following snippet illustrates this function.

```
$.when(ajax.process.load({
                             path:'path/to/json',
                             parse:true,
                             remove:['this','word','and','that','word'],
                             chunk:{
                                 active:true,
                                 length:5
                             },
                             object:'root_json_object', 
                             position:1, 
                             node:''
                         }))
.done(function(){someOtherFunction();});
```

Once this function has executed, the returned data can be accessed by calling the ajax.dataHolder object or, if the data was chunked, by calling the ajax.chunk.dataHolder object. To check if any data chunks exists, call ajax.chunk.status.available. It will return true if chunked data is found. 

- ######save {function - generator.ajax.process.content(args)}

#####=>paginate {object - generator.ajax.paginate}

- ######init {function - generator.ajax.paginate.init(args)}

####listener {object - generator.listener}

#####=>mutate {function - generator.listener.mutate(args)}
#####=>init {function - generator.listener.init(args)}
#####=>kill {function - generator.listener.kill(args)}

####dialogs {object - generator.dialogs - alias: dialogs or d}

#####=>config {object - generator.dialogs.config}
#####=>alert {function - generator.dialogs.alert(args)}
#####=>confirm {function - generator.dialogs.confirm(args)}
#####=>modal {function - generator.dialogs.modal(args)}

####helpers {object - generator.helpers - alias: helpers or h}

#####=>adoptChidren {function - generator.helpers.adoptChidren(parent,children)}
#####=>loadStyleSheet {function - generator.helpers.loadStyleSheet(link)}
#####=>loadScript {function - generator.helpers.loadScript(link)}
#####=>checkObjectType {function - generator.helpers.checkObjectType(elem)}
#####=>checkAjaxRequired {function - generator.helpers.checkAjaxRequired(obj)}
#####=>removeDomObjects {function - generator.helpers.removeDomObjects(obj)}
#####=>buildButtons {function - generator.helpers.buildButtons(param,required,options)}
#####=>delayExecution {function - generator.helpers.delayExecution(obj)}
#####=>destroyEventHandlers {function - generator.helpers.destroyEventHandlers(obj)}
#####=>executeFunctionByName {function - generator.helpers.executeFunctionByName(functionName, context)}
#####=>getTemplate {function - generator.helpers.getTemplate(item,type)}
#####=>makeGeneratorID {function - generator.helpers.makeGeneratorID(type,unit)}
#####=>makeObjectClass {function - generator.helpers.makeObjectClass(val)}
#####=>makeObjectID {function - generator.helpers.makeObjectID(val)}
#####=>makeObjectValue {function - generator.helpers.makeObjectValue(val)}
#####=>makeObjectType {function - generator.helpers.makeObjectType(val)}
#####=>makeAttributes {function - generator.helpers.makeAttributes(obj)}
#####=>makeInlineStyle {function - generator.helpers.makeInlineStyle(obj,parent)}
#####=>makeEventHandlers {function - generator.helpers.makeEventHandlers(key, id, val)}
#####=>switchParent {function - generator.helpers.switchParent(item, parent)}

####index {object - generator.index}

#####=>tempData {object - generator.index.tempData}
#####=>init {function - generator.index.init(id)}

####build {object - generator.build - alias: build}

#####=>tempData {object - generator.build.tempData}
#####=>init {function - generator.build.init(obj)}
#####=>structure {function - generator.build.structure(obj)}

####extend {function - generator.extend(obj) - alias: extend}

####storage {object - generator.storage - alias: storage or s}

#####=>supported {function - generator.storage.supported()}
#####=>load {function - generator.storage.load(args)}
#####=>save {function - generator.storage.save(args)}
#####=>purge {function - generator.storage.purge(args)}

####scripts {object - generator.scripts}

#####=>load {function - generator.scripts.load(obj)}

####init {object - generator.init - alias: run}

#####=>rules {object - generator.init.rules}
#####=>core {function - generator.init.core(src, extensions, params)}
#####=>extensions {function - generator.init.extensions(obj)}
#####=>plugins {function - generator.init.plugins(params)}

####errors {object - generator.errors - alias: errors or e}

#####=>log {object - generator.errors.log}
#####=>alert {function - generator.errors.alert(title, body, write, caller)}
#####=>report {function - generator.errors.report(title, body, caller)}
