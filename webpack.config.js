const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    entry: './src/main.ts',
    target: 'electron-main',
    devtool: 'source-map',
    module: {
        rules: [{
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
        }]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    }
  },
  {
    mode: 'development',
    entry: './src/client/root.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css']
    },
    module: {
      rules: [{
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
    }]
    },
    output: {
      path: __dirname + '/dist',
      filename: 'root.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
  }
];