import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebPackPlugin from "html-webpack-plugin";

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const tsTypeCheckerPlugin = new ForkTsCheckerWebpackPlugin({
    async: false,
    eslint: {
        files: "./src/**/*.(ts|js)x?",
    },
});

const config: webpack.Configuration = {
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [htmlPlugin, tsTypeCheckerPlugin],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
        ],
    },
};

export default config;
