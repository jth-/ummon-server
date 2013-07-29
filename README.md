# ummon-server

[![NPM version](https://badge.fury.io/js/ummon-server.png)](http://badge.fury.io/js/ummon-server) [![Build Status](https://secure.travis-ci.org/punkave/ummon-server.png?branch=master)](http://travis-ci.org/punkave/ummon-server) [![Dependency Status](https://gemnasium.com/punkave/ummon-server.png)](https://gemnasium.com/punkave/ummon-server)

**Documentation to come soon. Heavy development in process.**

Ummon is node.js application for managing, queuing, running and monitoring externally running tasks. Think of it as a hybrid of Jenkins, Resque & Cron

## Goals of this project

* The top priority of ummon is to properly saturate the resources available on the server to run tasks
* To provide a clear and easily digestible history of task runs
* To provide an easy overview and management of a collection of tasks that need to run on a regular basis
* To setup intelligent task dependancies (ie: run taskB only after taskA successfully completes)

## Glossary

* **Task** The core unit. Tasks are information about work that needs to be executed: The command, its working directory, when it should run, etc
* **Collection** A collection is a grouping of tasks. By default there is one but you can arbitrarily group tasks in collections to simplify logging and structure
* **Queue** The staging area of tasks that have been triggered to run. Tasks will be run FIFO
* **Run** An instance of a Task. A task is added to the queue as a run. Runs are also kept as historical artifacts
* **Worker** The worker is what runs that commands and handles communicating back to ummon about their status. Technically, think of a worker as a thin wrapper around child_process.spawn

# Installation and Setup

To setup ummon-server on a linux server, complete the following:

1. `sudo npm install -g ummon-server bunyan`
2. Configure init script and install it in init dir
3. Setup config
4. Start app

## License
Copyright (c) 2013 P'unk Avenue
Licensed under the MIT license.
