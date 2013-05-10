'use strict';

var test = require("tap").test;
var moment = require("moment");

// var thingie, superEasy;

// test("make sure the thingie is a thing", function (t) {
//   t.equal(thingie, "thing", "thingie should be thing");
//   t.type(thingie, "string", "type of thingie is string");
//   t.ok(true, "this is always true");
//   t.notOk(false, "this is never true");
//   t.test("a child test", function (t) {
//     t.equal(this, superEasy, "right!?");
//     t.similar(7, 2, "ever notice 7 is kinda like 2?", {todo: true});
//     t.test("so skippable", {skip: true}, function (t) {
//       t.plan(1); // only one test in this block
//       t.ok(true, "but when the flag changes, it'll pass");
//       // no need to end, since we had a plan.
//     });
//     t.end();
//   });
//   t.ok(99, "can also skip individual assertions", {skip: true});
//   // end lets it know it's over.
//   t.end();
// });
// test("another one", function (t) {
//   t.plan(1);
//   t.ok(true, "It's ok to plan, and also end.  Watch.");
//   t.end(); // but it must match the plan!
// });

var ummon;


test('construct an instance of ummon', function(t){
  t.plan(1);
  ummon = require('..').create();
  t.ok(ummon, 'The server should exists');
});


test('Adding a task and ensure the correct order', function(t){
  t.plan(3);
  ummon.MAX_WORKERS = 0; // Don't run any task


  t.test('Create a task with a timed trigger and wait for it to add to the queue', function(t) {
    t.plan(4);
    ummon.createTask({
      "name":"hello",
      "command": "echo Hello;",
      "trigger": {
        "time": moment().add('s', 1).toDate()
      }
    });

    t.ok(ummon.tasks['default.hello'], 'There is a hello task');

    ummon.dispatcher.once('queue.new', function(run){
      t.ok(true, 'The new emitter was emited');
      t.equal(run.task.id, 'default.hello', 'The task name was hello');
    });

    setTimeout(function(){
      t.equal(ummon.queue.length(), 1, 'There is one task in the queue after 1 second');
    }, '1100');

  });

  
  t.test('Create a dependant task', function(t) {
    t.plan(1);

    ummon.createTask({
      "name": "goodbye",
      "command": "echo goodbye;",
      "trigger": {
        "after": 'hello'
      }
    });

    t.ok(ummon.tasks['default.goodbye'], 'There is a goodbye task');
  });


  t.test('Task hello is run, goodbye is queued and then run', function(t){
    t.plan(1);
    ummon.MAX_WORKERS = 5;

    // ummon.dispatcher.once('queue.new', function(task){
    //   t.ok(true, 'The new emitter was emited');
    //   t.equal(task.name, 'goodbye', 'The task name was goodbye');
    // });

    ummon.createWorkerIfReady();

    setTimeout(function(){
      t.equal(ummon.queue.length(), 0, 'The queue is now empty');
    }, '500');
  });
});


test('Test creating dependant tasks', function(t){
  t.plan(2);

  ummon.createTask({"name":"one","command": "echo one", "trigger": {"time": moment().add('s', 1).toDate()} });
  ummon.createTask({"name":"two","command": "echo two", "trigger": {"after": "default.one"} });
  ummon.createTask({"name":"twotwo","command": "echo twotwo", "trigger": {"after": "default.one"} });
  ummon.createTask({"name":"three","command": "echo three", "trigger": {"after": "default.two"} });
  ummon.createTask({"name":"four","command": "echo four", "trigger": {"after": "default.three"} });
  ummon.createTask({"name":"five","command": "echo five", "trigger": {"after": "default.four"} });
  ummon.createTask({"name":"six","command": "echo six", "trigger": {"after": "default.five"} });

  t.equal(ummon.dependencies.subject('default.one').references[1], 'default.twotwo', 'task one is referenced by two tasks');
  t.equal(ummon.dependencies.subject('default.five').dependencies[0], 'default.four', 'task five is dependant on task four');
});


test('Test updating a tasks', function(t){
  t.plan(4);

  var task = ummon.updateTask({"name":"twotwo","collection":"default","command": "echo twotwo", "trigger": {"time": moment().add('s', 1).toDate()} });

  t.equal(task.command, "echo twotwo", "The method should return a new Task");
  t.equal(ummon.dependencies.subject('default.one').references[0], 'default.two', 'The good reference remains');
  t.notOk(ummon.dependencies.subject('default.one').references[1], 'The old reference was removed');
  t.notOk(ummon.dependencies.subject('default.twotwo').dependencies[0], 'The task has no dependant tasks');
});


test('Delete a task and its dependencies', function(t){
  t.plan(2);

  ummon.deleteTask('default.five');
  t.notOk(ummon.dependencies.subject('default.four').references[0], 'Task four has no more references');
  t.notOk(ummon.dependencies.subject('default.five').dependencies[0], 'The task has no dependant tasks');
});


test('teardown', function(t){
  setImmediate(function() {
    process.exit();
  });
  t.end();
});