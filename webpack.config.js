const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'Game',
  },
  resolve: {
    fallback: {
      fs: false
    }
  }
}