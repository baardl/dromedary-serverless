'use strict'



// install NPM
//
// return: promise
module.exports.installNpm = function (destDirectory) {
    console.log("Installing npm into '" + destDirectory + "'");
    return exec('cp -r '+__dirname+'/node_modules ' + destDirectory, {cwd: destDirectory});
}

// run npm install
//
// return: promise
module.exports.runNpm = function (packageDirectory, subcommand) {
    console.log("Running 'npm "+subcommand+"' in '"+packageDirectory+"'");
    var env = {};
    env['HOME']= '/tmp';
    return exec('node '+packageDirectory+'/node_modules/npm/bin/npm-cli.js '+subcommand, {cwd: packageDirectory, env: env});
}

// run gulp
//
// return: promise
function runGulp(packageDirectory, task, env) {
    console.log("Running gulp task '" + task + "' in '"+packageDirectory+"'");
    // clone the env, append npm to path
    for (var e in process.env) env[e] = process.env[e];
    env['PATH'] += (':'+packageDirectory+'/node_modules/.bin/');
    env['PREFIX'] = packageDirectory+'/global-prefix';
    env['HOME']= '/tmp';
    return exec('node '+packageDirectory+'/node_modules/gulp/bin/gulp.js --no-color '+task,{cwd: packageDirectory, env: env});
}


// run shell script
//
function exec(command,options,env) {
  console.log("Exec command: " + command + ", options: " + JSON.stringify(options) + ", env: " + JSON.stringify(env));
    return new Promise(function (resolve, reject) {
        var child = childProcess.exec(command,options);

        var lastMessage = ""
        child.stdout.on('data', function(data) {
            lastMessage = data.toString('utf-8');
            process.stdout.write(data);
        });
        child.stderr.on('data', function(data) {
            lastMessage = data.toString('utf-8');
            process.stderr.write(data);
        });
        child.on('close', function (code) {
            if(!code) {
                resolve(true);
            } else {
                reject("Error("+code+") - "+lastMessage);
            }
        });
    });
}
