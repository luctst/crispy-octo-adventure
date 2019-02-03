/**
 * Variables
 */
const path = require("path");
const extractCss = require("mini-css-extract-plugin");
const html = require("html-webpack-plugin");

/**
 * Export
 */
module.exports = {
    mode: "development",
    entry: ["@babel/polyfill", path.resolve(__dirname, "src", "main.js")],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        compress: true,
        port: 8080,
        open: true,
        disableHostCheck: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [extractCss.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(jpg|png|svg|jpeg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {name:"[name].[ext]",outputPath: "img/"}
                }]
            }
        ]
    },
    plugins: [
        new extractCss({
            filename: "main.css"
        }),
        new html({
            template: "./src/index.html",
            cache: true,
            minify: true
        })
    ],
};