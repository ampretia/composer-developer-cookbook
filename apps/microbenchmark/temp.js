const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');
  
  function someFunction() {
    console.log('hello world');
  }
  
  const wrapped = performance.timerify(someFunction);
  
  const obs = new PerformanceObserver((list) => {
    console.log(list.getEntries()[0].duration);
    
  });
  obs.observe({ entryTypes: ['function'] });
  
  // A performance timeline entry will be created
  for (let i=0; i<10;i++){
    wrapped();
  }

  obs.disconnect();
    performance.clearFunctions();