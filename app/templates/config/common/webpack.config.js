const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // html插件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 额外打包插件
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin'); // 打开浏览器插件
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const F2egameHTML = require('f2egame-html-res');
const easysprite = require('postcss-easysprites');
// const Es3ifyPlugin = require('es3ify-webpack-plugin');
const assects = require('postcss-assets');

<% if (needFangXieChi) { %>
    const HtmlWebpackInsertPlugin = require('./HtmlWebpackInsertPlugin'); // 防挟持插入
<% } %>
const isProd = process.env.NODE_ENV === 'production';
const isDaily = process.env.NODE_ENV === 'daily';


// const reportHtml = require('eslint/lib/formatters/html');

const prodJsCSSPath = "<%=prodJsCSSPath%>";
const prodImgPath = "<%=prodImgPath%>";


const watchJsCSSPath = "";
const watchImgPath = "../";

const ip = '<%=ip%>';
const port = <%=port%>;
const host = '<%=ip%>';
const devHost = `http://${host}:${port}`;


const postcssConfig = () => [
    assects({
        loadPaths: ['./src/images'],
        relative: true
    }),
    easysprite({
        spritePath: './src/sprites'
    }),
    // 雪碧图,在需要合并的url后加上#target即可，如background: url(../img/1.jpg#sprite) no-repeat;

    // unused({
    //     html: ['./*.html']
    // })
];
const getEntryJs = (jspath) => {
    const fileList = {};
    const getJSFileRecursion = (pathNode) => {
        const dirList = fs.readdirSync(pathNode);
        dirList.forEach((jsFile) => {
            if (fs.statSync(`${pathNode}/${jsFile}`).isDirectory()) {
                getJSFileRecursion(`${pathNode}/${jsFile}`);
            } else if (path.extname(jsFile) === '.js') {
                // 获取到js，开始组织数据结构
                fileList[path.basename(jsFile, '.js')] = [`${pathNode}/${jsFile}`];
            }
        });
    };
    getJSFileRecursion(jspath);
    return fileList;
};

const judgeJsCssPath = () =>
    (isProd ? prodJsCSSPath : watchJsCSSPath);
// 生产模式：线上目录；本地发布前预览：本地资源服务器目录

const judgeImgPath = () => {
    if (isProd) {
        return `${prodImgPath}/`;
    } else if (isDaily) {
        return watchImgPath;
    }
    return `${devHost}/`;
};
// 生产模式：线上目录；本地发布前预览：本地资源服务器目录

const urlLoader = {
    loader: 'url-loader',
    options: {
        limit: 1,
        name: '[path][name].[ext]' + (isProd ? '?[hash]' : ''),
        publicPath: judgeImgPath(),
        context: './src'
    }
};
const imgWebpackLoader = {
    loader: 'image-webpack-loader',
    options: {
        mozjpeg: {
            enable: isProd,
            progressive: false,
            quality: 90
        },
        optipng: {
            enable: false
        },
        pngquant: {
            enable: isProd,
            quality: '80-90'
        }

    }
}

const myLoaders = [
    {
        test: /\.html$/,
        use: {
            loader: 'html-loader',
            options: {
                minimize: false,
                attrs: ['img:src', 'li:data-src', 'img:data-src']
            }
        },
    },
    {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader', // 将所有的计算后的样式加入页面中
            use: [
                {
                    loader: 'css-loader',
                    options: { sourceMap: true } // <=
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: postcssConfig
                    }
                }, {
                    loader: 'sass-loader'
                }]// 使你能够使用类似@import和url（...）的方法实现require的功能
        })
    },
    {
        test: /\.js$/,
        use: [{
            loader: 'babel-loader'
        }, {
            loader: "eslint-loader",
            options: {
                fix: true,
                emitWarning: !isProd/**,// test:true
                outputReport: {
                    filePath: 'eslint-report.html',
                    formatter: reportHtml
                }**/
            }

        }
        ],
        exclude: /node_modules/
    },
    {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: isProd ? [urlLoader, imgWebpackLoader] : urlLoader
    }
];
let myPlugins = [
    new ExtractTextPlugin('css/[name].css'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        inject: 'true',
        hash: isProd,
        chunksSortMode: 'manual',
        chunks: ['index'], // 不同模块加载不同内容
        minify: {
            collapseWhitespace: false,
            removeAttributeQuotes: false
        }
    }),
    // new CopyWebpackPlugin([
    //     {
    //         from: path.join(__dirname, './static'),
    //         to: path.join(__dirname, './dist/static'),
    //         ignore: ['.*']
    //     }
    // ]),

    // 防挟持
    <% if (needFangXieChi) { %>
    // 防挟持
    new HtmlWebpackInsertPlugin({
        open: isProd,
        head: [
            __dirname + "/src/lib/fxc/<%=type%>_header.js"
        ],
        body: [
            __dirname + "/src/lib/fxc/<%=type%>_footer.js"
        ]
    }),
        <% } %>
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false,
            screw_ie8: false, // default关键字问题
            drop_console: isProd // 去掉console
        },
        parallel: true, // 多线程
        output: {
            comments: !isProd, // 去掉注释内容
            preamble: `/**${new Date().toLocaleString()}**/`
        }
    }),
    // new Es3ifyPlugin(),
    /* new webpack.LoaderOptionsPlugin({
        debug:true
     }),*/
    new OpenBrowserWebpackPlugin({
        url: devHost,
        browser: 'chrome'
    })
];
if (isProd) {
    myPlugins.push(new F2egameHTML({
        // ['web', 'client', '4366', 'mobile']
        product: 'client'
    }));
}
const webConfig = {
    // devtool: '#cheap-module-eval-source-map',
    devtool: isProd ? false : 'cheap-module-eval-source-map',
    entry: getEntryJs('./src/js'),
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: judgeJsCssPath(),
        filename: 'js/[name].js'
    },
    module: {
        rules: myLoaders
    },
    plugins: myPlugins,
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.css',
            '.scss',
            '.sass'
        ]
    },
    devServer: { // 开发服务器配置
        contentBase: 'dist',
        host: ip,
        port,
        inline: true,
        disableHostCheck: true
    }
};
module.exports = webConfig;
