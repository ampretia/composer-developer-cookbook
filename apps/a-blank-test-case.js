
const Table = require("cli-table");
const prettyoutput = require("prettyoutput");


class ablanktest {

    constructor(){

    }
    _runTest(codeToTest){
        return this.setup()
        .then(()=>{
            return codeToTest({   });
        }).then(()=>{
            return businessNetworkConnection.disconnect();
        })     
        .catch(err => {
             // and catch any exceptions that are triggered
          console.log(err);
          console.log(err.stack);
      
          throw err;
        });;
    }

    runTest(){
        _runTest( ()=>{

            // put your test code here

        });
    }
}



