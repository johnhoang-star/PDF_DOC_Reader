module.exports = function override(config, env) {
  console.log("React app rewired works!")
  config.resolve.fallback = {
  	"stream": require.resolve("stream-browserify")
          };
  return config;
};