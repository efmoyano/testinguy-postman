const path = require("path");
const async = require("async");
const newman = require("newman");

const PARALLEL_RUN_COUNT = process.env.PARALLEL_RUN_COUNT || 1;

const ITERATIONS_COUNT = process.env.ITERATIONS_COUNT || 1;

const parametersForTestRun = {
  collection: path.join(__dirname, "postman/TestingUY.postman_collection.json"),
  environment: path.join(__dirname, "postman/Development.postman_environment.json"),
  iterationCount: ITERATIONS_COUNT,
  reporters: ["cli"],
};

parallelCollectionRun = function (done) {
  newman.run(parametersForTestRun, done);
};

let commands = [];
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
  commands.push(parallelCollectionRun);
}

async.parallel(commands, (err, results) => {
  err && console.error(err);

  results.forEach(function (result) {
    var failures = result.run.failures;
    console.info(
      failures.length
        ? JSON.stringify(failures.failures, null, 2)
        : `${result.collection.name} ran successfully.`
    );
  });
});
