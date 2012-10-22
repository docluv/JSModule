;

//Example JavaScript Module based on the jQuery pattern
//It is wrapped within an anymous enclosure
(function(window, undefined) {

    //this is ultimately the object used to create the global variable
    //it is set at the end of the module
    //I use jsModule as an example name, you can do a replace all to name it 
    //what every suites your needs.
    var jsModule = function(customSettings) {

        //return the object created by the init method (defined later).
        //notice we are calling the jsModule init method from the object's protype alias.
        //The customSettings parameter is passed to the init method. Remember to pass
        //any parameters along to the init method.
        return new jsModule.fn.init(customSettings);
    };

    //Create an alias to the module's prototype
    //create the object's members in the protype definition.
    jsModule.fn = jsModule.prototype = {
        
        //hmm what is this for?
        //well combined with the following init definition we 
        constructor: jsModule,

        //gets everything started and returns a reference to the object.
        //notice it was called from the jsModule function definition above.
        init: function(customSettings) {

            //here I had a delima. I want to show how to merge a custom settings object
            //but I don't wan to rely on jQuery, Underscore or something else for this example.
            //so I decided to show you what it would look like with a jQuery dependancy.

            //this.settings = $.extend({}, this.settings, customSettings);

            //and then just a simple little way to override the default settings.
            //I do encourage merging the values though.
            if(customSettings){
                this.settings = customSettings;    
            }
            
            //you can set values in the object's init method, good for items with no definition
            this.exampleVar = 0;

            //This is actually where jQuery select the DOM element(s) you are looking for and encapsulates them.

            //return a reference to itself so you can chain things later!
            return this;
        },

        //I think this is just good practice ;)
        version: "0.0.1",

        //methods & other members go here
        exampleVar: undefined,

        //you can add as many members as you like, be they functions or just variables.
        exampleFunc: function(){
            alert(this.exampleVar);

            //to make it chainable you need to return a reference to your object's instance.
            //you do not have to make your methods chainable, but it is a nice feature.
            return this;

            //remmeber the method should have a reference to this, which is a reference to the current jsModule instance.
            //If you call other methods that do not belong to your instance then you should create a refernece to this.
            //typically I do soemthing like this at the top of my methods:
            // var that = this;
            //then inside the other method I can refence the object's instance I want to call other methods.
            //A common example would be a callback method from a jQuery object or using something like jQuery's each to iterrate over arrays.

        },

        //returns the value of the settings.prop1 variable.
        getProp1: function(){

            //just smart to check if the object still exist, otherwise you will get a nasty exception making your app break :(
            if(!this.settings){
                return undefined;
            }

            return this.settings.prop1;
        },

        //yes you can create chile objects
        settings: {
            prop1: "Sample Module"
        }

    };

    // Give the init function the jsModule prototype for later instantiation
    jsModule.fn.init.prototype = jsModule.fn;

    //create the global object used to create new instances of jsModule
    return (window.jsModule = jsModule);

})(window);

//Now you can access members like this:
var jsm = jsModule();

jsm.exampleFunc();
alert(jsm.getProp1);


//You can extend your module by addin new members to the object's protoype like so:

jsModule.fn.extensionMethod = function() {

        var that = this;
        
        //do soemthing here
        

        return that; //if you want to chain.
};

//now you can do this:

var jsm1 = jsModule();
jsm1.extensionMethod();

//and because you returned a this reference you can even do this!
jsm1.extensionMethod().exampleFunc();

//If you want to create a child module, you can do that as well.
//Think of this like a jQuery Plugin
(function (jsModule, window, undefined) {

    //the child module is just another function with members
    jsModule.fn.ChildModule = function(){

        //this of this like the that = this I mentioned above.
        var jsModule = this,
        
        ChildModule = {

            //public members

            _count: 50,
            
            foo : function(var1){

	            //do something

                return jsModule;

            }
            
        };

        //return a reference to the ChildModule function object.

        return ChildModule;

    };

} (jsModule, window));

//you can now create a new instance of the child object like so:
var child = jsModule(/*any params you need*/).ChileModule(/*any params you need*/);

//or 

var jsm2 = jsModule(),
    child2 = jsm2.ChildModule(/*any params you need*/);

//Then you can call foo
child2.foo("hello world!");

//or heck you could even do this if you really wanted:
jsModule(/*any params you need*/).ChildModule(/*any params you need*/).foo("hello world!");


