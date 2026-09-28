const mon = require("mongoose");

async function connectdb(){
    try{
    await mon.connect(process.env.MON_URI);
    console.log("Database is connected succefully");
    }
    catch(err){
        console.log("Error in connecting");
        process.exit(1);
    }
}

module.exports = connectdb;