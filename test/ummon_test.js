'use strict';

var test = require("tap").test;

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

var ummon = require('..');

var server = ummon.createServer();


//                    Construct!
// - - - - - - - - - - - - - - - - - - - - - - - - - 
test('construct an instance of ummon', function(t){
  t.plan(1);

  t.ok(server, 'The server should exists');
});

test('Add a task to the default collection', function(t){
  t.plan(1);

  server.addTask('default', 'sleep', {
    "cwd": "/var/www/website2/",
    "command": "sleep 5 && echo 'Task Finished'",
    "arguments": ["--verbose", "--env=staging"],
    "trigger": {
      "time": "*/10 * * * *"
    }
  });

  t.ok(server.collections.default.tasks.sleep, 'The server should exists');
});