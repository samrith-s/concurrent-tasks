const actualResults: BenchmarkResults = {};

global.benchConfig = {
  taskCount: 100,
  timeout: 5,
};

global.results = {
  add(name, result) {
    actualResults[name] = result;
  },
  delete(name) {
    delete actualResults[name];
  },
  print() {
    console.table(actualResults);
  },
};
