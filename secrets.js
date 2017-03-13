var fs = require('fs');
var platform = require('./routes/server_nodejs/platform.js');
var runtime = platform.configure();

var secret = {
 
    isLiveSystem : function () { return runtime.liveSystem;},
    
    
    mongodb : {   
                  connectionStr : function ()
                  { 
                    var username = "testing";
                    var password = "TestIng1";
                    var url      = "ds127429.mlab.com:27429";
                    var database = "node";
                    runtime.mongodb =  url + "/" + database;
                    return "mongodb://" + username + ":" + password  + "@" + url + "/" + database;
                  }     
              },
    
    stripeKey :  function()
    {
        // overrule the logic above  see services setStripeKey also for CLIENT
        if (runtime.liveSystem == false)
        {
            return "sk_test_?????????????????";
        }
        else
        {
            return "sk_live_?????????";  
        }
    }
};

module.exports = secret;