
var mocha = require('mocha');
var { endSpan, startSpan } = require('./instrumentation');
module.exports = OtelReporter;

function OtelReporter(runner) {

    mocha.reporters.Base.call(this, runner);

    runner.on('test', function(test) {
        startSpan(test);
    });

    runner.on('retry', function(test, err) {
        endSpan(test, err);
    });

    runner.on('pass', function(test) {
        endSpan(test);
    });

    runner.on('fail', function(test, err) {
        endSpan(test, err);
    });

}