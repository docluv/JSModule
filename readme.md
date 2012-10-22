Let's face it jQuery is the leading gateway drug that brings developers to the wonderful world of modern web application development with JavaScript. As you move along with jQuery you can't help but start creating your own plugins which leads to full blown AJAX applications. This means you need to create modules, libraries and other class like structures. I have read many articles on different patterns over the past 4 or 5 years and tried several techniques. All eventually felt like they were lacking at some point or another.

I kept thinking jQuery got things right, why else would it be so successful? So I decided I wanted to understand jQuery at a deeper level and try to follow its example. Finally this past Spring I cracked the nut and started making my own libraries fashioned after jQuery. Today I want to review some of what I have learned from that adventure and the 6 months or so since I started putting this into practice.

I have posted a reference module, with comments, on GitHub for you to check out.

Examining jQuery
The obvious choice is to dig into the source code, but let's face it unless you really understand JavaScript you are going to be lost, I felt that way. But Paul Irish posted a couple of great videos on things he learned by examining the jQuery source code, 10 and 11 things I learned from the jQuery source. So that is where I really felt like I got some traction, so I recommend you set aside a couple of hours this week and learn some things.

After watching those videos a few times I started grasping what was actually happening inside jQuery and how I might do the same. So here is what I distilled from examining the source code and Paul's videos.

jQuery uses the new operator to create a new object, but to the outside this is transparent. Its hidden inside the module's call. That's a bit odd to describe so let's just look at the code. I am calling my example module jsModule and it is a function. So it is declared like this:

    var jsModule = function( customSettings ) {
        return new jsModule.fn.init( customSettings );
    };

It returns a new instance of the jsModule prototype. Hence a new object without the consumer of your module having to write new. Personally I never realized jQuery utilized a new object I guess I sort of thought everything was sort of static. 

Let's look at the init method. In my example I am passing in a parameter, customSettings, it then gets passed along to the init function. First let me say your module is not required to have any parameters and it is not limited to one. But you do need to pass any parameters along to the init method to apply them.

So where is the init method actually defined? It is defined in the object's prototype, which is aliased to jsModule.fn. You could actually get by without doing the alias, but for consistency sake I like to keep the fn alias, it is shorter after all. 

jsModule.fn = jsModule.prototype = {
//object members go here
}

So the fn member is an alias to prototype which is set to a JavaScript Object. Inside that object are your module's public members. Which brings me back to the object's init method. It is called in the module's constructor, I think that is what it should be called because it is the method you execute when you want a new instance of the module (I am not a language geek so bear with me here). The init function looks like the following:

init: function( customSettings ) {
     if( customSettings ){
          this.settings = customSettings;   
     }
     this.exampleVar = 0;
     return this;
},

The init method takes the parameters and sets them up as needed. In this case I am just setting the object's settings to the passed value if one was provided. Normally I would merge the values, but I did not want to use the jQuery extend method and I did not want to get into how you would do that, so I am doing something simple here. After that I am setting exampleVar to an initial value of 0. 

The balance of the prototype object contains other functions, variables and child objects. These are my examples, there is no limit as to how many you can define, just remember they are members of a JavaScript object and should be separated by a comma. One thing I want to point out is if you want it your methods to be chainable you need to return a reference to this, which is the jsModule instance you are working with. This is how jQuery is chainable and how you can achieve this feature in your module.

version: "0.0.1",
exampleVar: undefined,
exampleFunc: function(){

    alert(this.exampleVar);
    return this;
},
getProp1: function(){
    if(!this.settings){
return undefined;
    }
    return this.settings.prop1;
},
settings: {
    prop1: "Sample Module"
}

The last part of the module is where the object's prototype is set equal to the init function's prototype, sort of a circular reference. But somehow it works. I am still working on how to explain it, it has made sense to me at times. But just run with it.

jsModule.fn.init.prototype = jsModule.fn;

The last line sets the module variable equal to a global variable. You do this because you have defined your module in an anonymous enclosure, which means none of this would be available outside the closure's scope without making it a global variable.
return (window.jsModule = jsModule);

To use your module you can simply write code like the following, which should be familiar to anyone who has written against jQuery.

//Now you can access members like this:
var jsm = jsModule();
jsm.exampleFunc();
alert(jsm.getProp1);

But Wait There is More: How to Extend Your Module
Plugins are one of the reasons jQuery is so popular, it is extremely easy to extend or add new functionality to the core library. You can do the same. Remember the fn alias is the object's prototype. You can simply add new members to the prototype or fn member. The following is an example, again remember to return a reference to this if you want it to be chainable.

jsModule.fn.extensionMethod = function() {
        var that = this;
        //do something here
        return that; //if you want to chain.
};

Now you can do the following:

//now you can do this:
var jsm1 = jsModule();
jsm1.extensionMethod();

But Wait There is Even More, Child Modules!
Let's take the concept of extensions and plugins to another level by creating a child module. I have used this when I have created a core module with a flexible set of application pieces that depend on the core object. Again this is a function, but it contains a child JavaScript object with a set of member functions and variables. 

jsModule.fn.ChildModule = function(){
   var jsModule = this,
   ChildModule = {
       _count: 50,
       foo : function( var1 ){
              //do something
              return jsModule;
       }
   };
    return ChildModule;
};

Now you can do something like the following:

//you can now create a new instance of the child object like so:
var child = jsModule(/*any params you need*/).ChildModule(/*any params you need*/);
//or
var jsm2 = jsModule(),
    child2 = jsm2.ChildModule(/*any params you need*/);
//Then you can call foo
child2.foo("hello world!");
//or heck you could even do this if you really wanted:
jsModule(/*any params you need*/).ChildModule(/*any params you need*/).foo("hello world!");

Conclusion
By following the jQuery module pattern (something I call it) you can create libraries that are extensible and fairly easy for many developers to use. They should feel at home with your module because it follows a familiar pattern popularized by jQuery's broad use. One thing I worry about is developers wrongly assuming it depends on jQuery, which your module does not have to do. It can utilize jQuery if you want, but it does not have to. The pattern is extremely easy to implement, extend and scale. This is good because I hate hard things and my project always require something to be extended.
