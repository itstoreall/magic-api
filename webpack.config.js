// const path = require('path');
// var nodeExternals = require('webpack-node-externals');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // mode: 'production',
  // entry: './src/index.ts',
  // target: 'node',
  // externals: [nodeExternals(), { knex: 'commonjs knex' }],
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: 'server.js',
  // },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.(graphql|gql)'],
    //   // modules: ['src'],
  },
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       terserOptions: {
  //         ecma: 6,
  //         mangle: true,
  //       },
  //     }),
  //   ],
  // },
  // devtool: 'cheap-module-source-map',
};
