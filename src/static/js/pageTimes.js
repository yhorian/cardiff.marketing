// Get the PerformanceNavigationTiming object for the page
const performanceEntries = performance.getEntriesByType('navigation');
const performanceNavigationTiming = performanceEntries[0];

// Calculate the FCP in seconds
const fcp = (performance.timing.responseStart - performance.timing.navigationStart) || performanceNavigationTiming.fcp;;

// Calculate the LCP in seconds
const lcp = (performance.timing.domComplete - performance.timing.navigationStart) || performanceNavigationTiming.lcp;

// Calculate the TTI in seconds
const tti = (performance.timing.domInteractive - performance.timing.navigationStart) || performanceNavigationTiming.tti;

// Calculate the FID in milliseconds (using the First Input Delay polyfill)
const fid = performanceNavigationTiming.firstInputDelay || performanceNavigationTiming.fid;

// Calculate the total page load time in seconds
const loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) || (performanceNavigationTiming.loadEventEnd - performanceNavigationTiming.navigationStart);

// Show the FCP, LCP, TTI, FID, and load time to the user
console.log(`First Contentful Paint: ${fcp}s`);
console.log(`Largest Contentful Paint: ${lcp}s`);
console.log(`Time to interaction: ${tti}s`);
console.log(`First Input Delay: ${fid}ms`);
console.log(`Total page load time: ${loadTime}s`);