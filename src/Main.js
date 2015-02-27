var remote = require('remote');
if (localStorage.getItem('settings.width') && localStorage.getItem('settings.height')) {
  remote.getCurrentWindow().setSize(parseInt(localStorage.getItem('settings.width')), parseInt(localStorage.getItem('settings.height')));
  remote.getCurrentWindow().center();
}

window.addEventListener('resize', function () {
<<<<<<< HEAD
  localStorage.setItem('settings.width', window.outerWidth);
  localStorage.setItem('settings.height', window.outerHeight);
=======
  localStorage.setItem('settings.width', window.innerWidth);
  localStorage.setItem('settings.height', window.innerHeight);
>>>>>>> master
});

require.main.paths.splice(0, 0, process.env.NODE_PATH);
var app = remote.require('app');
var React = require('react');
var fs = require('fs');
var path = require('path');
var docker = require('./Docker');
var router = require('./router');
var machine = require('./DockerMachine');
var ContainerStore = require('./ContainerStore');
var SetupStore = require('./SetupStore');
var metrics = require('./Metrics');

var MenuTemplate = require('./MenuTemplate');
var Menu = remote.require('menu');
var menu = Menu.buildFromTemplate(MenuTemplate);
Menu.setApplicationMenu(menu);

var settingsjson;
try {
  settingsjson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'settings.json'), 'utf8'));
} catch (err) {
  settingsjson = {};
}

if (process.env.NODE_ENV === 'development') {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://localhost:35729/livereload.js';
  head.appendChild(script);
}

var bugsnag = require('bugsnag-js');
bugsnag.apiKey = settingsjson.bugsnag;
bugsnag.autoNotify = true;
bugsnag.releaseStage = process.env.NODE_ENV === 'development' ? 'development' : 'production';
bugsnag.notifyReleaseStages = ['production'];
bugsnag.appVersion = app.getVersion();
bugsnag.metaData = {
  beta: !!settingsjson.beta
};

bugsnag.beforeNotify = function(payload) {
  var re = new RegExp(process.cwd().replace(' ', '\\s').replace('(','\\(').replace(')','\\)'), 'g');
  payload.stacktrace = payload.stacktrace.replace(re, '<redacted codedir>');
  payload.context = payload.context.replace(re, '<redacted codedir>');
  payload.file = payload.file.replace(re, '<redacted codedir>');
  payload.url = '<redacted url>';
};

document.onkeydown = function (e) {
  e = e || window.event;
  var doPrevent;
  if (e.keyCode === 8) {
    var d = e.srcElement || e.target;
    if (d.tagName.toUpperCase() === 'INPUT' || d.tagName.toUpperCase() === 'TEXTAREA') {
      doPrevent = d.readOnly || d.disabled;
    } else {
      doPrevent = true;
    }
  } else {
    doPrevent = false;
  }
  if (doPrevent) {
    e.preventDefault();
  }
};

setInterval(function () {
  metrics.track('app heartbeat');
}, 14400000);

router.run(Handler => React.render(<Handler/>, document.body));
<<<<<<< HEAD
SetupStore.run().then(machine.info).then(machine => {
  docker.setup(machine.url, machine.name);
=======
SetupStore.run().then(boot2docker.ip).then(ip => {
  docker.setHost(ip);
>>>>>>> master
  ContainerStore.init(function (err) {
    if (err) { console.log(err); }
    router.transitionTo('containers');
  });
}).catch(err => {
  console.log(err);
  console.log(err.stack);
  bugsnag.notify(err);
});
