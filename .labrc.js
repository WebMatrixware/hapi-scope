module.exports = {
  assert: '@hapi/code',
  coverage: true,
  colors: true,
  lint: true,
  output: ['stdout', './coverage/test_output.html', './coverage/test_output.lcov'],
  reporter: ['console', 'html', 'lcov'],
  threshold: 100,
  verbose: true
};