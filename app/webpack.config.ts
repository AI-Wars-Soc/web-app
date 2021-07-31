const path = require("path");
//const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const tsTypeCheckerPlugin = new ForkTsCheckerWebpackPlugin({
    async: false,
    eslint: {
        files: ["./src/**.tsx"],
    },
});

const miniCss = new MiniCssExtractPlugin();

module.exports  = {
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        filename: "[name].bundle.js",
        chunkFilename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    plugins: [htmlPlugin, tsTypeCheckerPlugin, miniCss],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        //options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
};
