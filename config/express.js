const bodyParser = require( "body-parser" );
const express = require( "express" );
const morgan = require( "morgan" );
const path = require( "path" );
var fs = require('fs');
const cors = require('cors');
const routes = require( "../routes/index" );
const config = require( "../config/config" );
class ExpressLoader {
  constructor () {
    const app = express();

    //cors
    var corsOptions = {
      origin: "*",
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
    }
    app.use(cors(corsOptions));

    // Setup error handling, this must be after all other middleware
    app.use( ExpressLoader.errorHandler );
    
    // Set up middleware
    app.use( morgan( "dev" ) );  
    app.use( bodyParser.urlencoded( {
      extended: true,
      limit: "50mb"
    } ) );
    app.use( bodyParser.json( { limit: "50mb" } ) );
    
    app.use('/apiv1/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/apiv1', routes);      
    
    // Start application
    this.server = app.listen( config.port, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", config.port);
    } );
  }

  get Server () {
    return this.server;
  }

  /**
   * @description Default error handler to be used with express
   * @param error Error object
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {function} Express next object
   * @returns {*}
   */
  static errorHandler ( error, req, res, next ) {
    let parsedError;

    // Attempt to gracefully parse error object
    try {
      if ( error && typeof error === "object" ) {
        parsedError = JSON.stringify( error );
      } else {
        parsedError = error;
      }
    } catch ( e ) {
      console.error( e );
    }

    // Log the original error
    console.error( parsedError );

    // If response is already sent, don't attempt to respond to client
    if ( res.headersSent ) {
      return next( error );
    }

    res.status( 400 ).json( {
      success: false,
      error
    } );
  }
}

module.exports = ExpressLoader;