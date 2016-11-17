module.exports = {
  entry: './resources/assets/js/index.jsx',
  output: {
    filename: 'public/js/built/index.js',
  },
  module: {
    loaders: [
      {
        test: /.jsx$/,
        loader: 'babel-loader',
        exclude: ['node_modules', 'bower_components'],
        query: {
          presets: ['es2015', 'react'],
        }
      },
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css', 'sass' ],
      },
      {
        test: /\.css$/,
        loaders: [ 'style', 'css', 'sass' ],
      }
    ]
  },
}
