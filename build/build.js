//JSHint Options
var options = {
    curly: true,
    immed: true,
    newcap: true,
    undef: true,
    browser: true,
    jquery: true
}

var JSHINT = require( './jshint' ).JSHINT;
var fs = require( 'fs' );

var files = fs.readFileSync( __dirname + '/files.list', 'utf8' ).split( '\n' ).filter( function( file ) {
    return file;
} ).map( function( file ) {
    return file.trim();
} );

var root = '../src/';
var debugRegExp = /\/\*DEBUG\*\/(.|\n|\r)*?\/\*DEBUG_END\*\//g;

var lintFree = true;
var res = '';
files.forEach( function( file ) {
    var source = fs.readFileSync( __dirname + '/' + root + file, 'utf8' );
    if ( JSHINT( source, options ) ) {
        res += source;
    }
    else {
        JSHINT.errors.forEach( function( error ) {
            console.log( file + ': line ' + error.line + ', col ' + error.character + ', ' + error.reason );
        } );
        lintFree = false;
    }
} );

if ( lintFree ) {
    console.log( 'Lint Free!' );
    console.log( 'Building..' );
    fs.writeFileSync( __dirname + '/final-engine-debug.js', res );
    res = res.replace( debugRegExp, '' );
    fs.writeFileSync( __dirname + '/final-engine.js', res );
}
else {
    console.log( 'Please fix these errors before building' );
}
