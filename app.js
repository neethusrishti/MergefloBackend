const config = require( "./config/config" );
const mongoose = require( "mongoose" );
const ExpressLoader = require( "./config/express" );
new ExpressLoader(); 
const mongooseOptions = {    
    useNewUrlParser: true,  
    useUnifiedTopology: true     
  };
// Connect to the DB an initialize the app if successful
mongoose.connect(config.dbUrl, mongooseOptions, err => {
  if(err) throw err;
  console.log('Connected to MongoDB!!!')
  });  
  mongoose.connection.on("error", error => { console.error({error})
   // tells you whether or not the connection to mongodb was successful 
}); 
