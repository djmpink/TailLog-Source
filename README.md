# 简介

[TailLog](http://taillog.cn/) 是一款实时日志查看监控工具。

![](images/config.png)


通过一次配置，即可便捷查看和监控本地或远程的日志信息（类似命令"tail"，实时展示并跟踪日志信息）。

同时提供搜索，高亮等辅助等功能，方便快速定位异常，让你更专注于程序开发与维护。
![](images/log.jpg)


### 更多信息请查看

[TailLog官网](http://taillog.cn/)

[Github](https://github.com/djmpink/TailLog)

[《独立开发一款产品是怎样的体验》](http://7player.cn/2018/06/20/%E7%8B%AC%E7%AB%8B%E5%BC%80%E5%8F%91%E4%B8%80%E6%AC%BE%E4%BA%A7%E5%93%81%E6%98%AF%E6%80%8E%E6%A0%B7%E7%9A%84%E4%BD%93%E9%AA%8C/)

QQ交流群：455735429

# 工程结构与原理
![](images/taillog.png)

# 源码部署与运行
## 环境
如果你是一位专业的前端开发工程师，我想你已经具备了常用且必要的开发环境，可以直接跳过该部分，了解开发调试相关内容即可。
如果十分不幸遇到环境问题，可以尝试在这里找到答案。

* 主要会涉及的工具与环境：
    * Node.js
    * python2
    * electron
* 注意，下文虽然描述上采用的npm，实际上个人更推荐使用yarn    
* 在开发或部署过程中，有一些注意事项或建议，可以更好的使用本工程：
    * npm加速 [可选，推荐]
    
        * 通用的npm加速： 
        `npm config set registry=https://registry.npm.taobao.org` 
        
        * electron加速： 
        `npm config -g set ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`
       
    * Windows环境
    
        因为win上没有C相关编译环境（linux系环境可忽略），而该工程需要安装node-sass，该模块需要编译环境

        你可以通过以下命令设置node-sass的已编译好的文件[推荐]，或者参考后文提到的编译环境部分来设置本地的编译环境
        
        `npm config set sass-binary-site=http://npm.taobao.org/mirrors/node-sass`
   
   * Mac环境
        
        如果需要在Mac系统编译打包Windows系统的应用程序，则需要安装wine 
                
    * 如果执行报node-sass相关错误，请确保:
        1. 以上步骤的配置的sass-binary-site项是否正确
        2. [不推荐]如果你不想通过配置sass-binary-site的方式，需要保证本地需要有相关编译环境： win上可以考虑使用
        [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) 或安装VS 2015，但是这两者至少都是2G以上的空间占用，并且非常耗时
    
    * electron环境
        * 请全局安装electron：正常情况下应该直接执行`npm i -g electron`或`yarn global add electron`，但是因为国内环境问题，可以参考上文的electron加速部分设置后重新执行
        ，或者参考[electron官网的安装章节](https://github.com/electron/electron/blob/master/docs/tutorial/installation.md) ，
        否则参考下面的步骤（以win为例）[不推荐]， 注意，以下方案当前时间节点上已经不能保证是否OK：
        
        1. 使用[淘宝镜像](https://npm.taobao.org/mirrors/electron/) 找到适合自己的版本：
            
            下载[v2.0.2-win32-x64](https://npm.taobao.org/mirrors/electron/2.0.2/electron-v2.0.2-win32-x64.zip) 即可
        
        2. 解压文件夹并将electron.exe的目录设置到环境变量中：
            * 在C盘根目录下建立electron文件夹，将刚才下载的zip包解压后放置到该目录下
            * 找到其下的electron.exe对应的目录（本例中对应的目录是c:/electron/），将其加入到环境变量PATH中
              （对于不知道如何设置环境变量的同学请参考[百度经验](https://jingyan.baidu.com/article/8ebacdf02d3c2949f65cd5d0.html) ）
            * 设置完成后，你在任何新打开的cmd窗口中运行electron都能正常显示electron的窗口了，若不能，请检查前面是否设置不正确

    * 其他错误请提issue或者加入QQ群455735429

## 开发调试
如下命令均在项目根目录下执行。
### install

     npm i

### 编译

     npm run build
         
### 浏览器运行
1. 第一个命令行窗口启动前端代码: `npm start`
2. 第二个命令行窗口启动node端: `node scripts/main`    
    
### 客户端（electron）运行

1. package.json中设置：`"DEV": true,`， 注意，请确保该参数是true，否则会加载build/index.html
2. 第一个命令行窗口执行：`npm start`
3. 第二个命令行窗口执行：`npm run et`

## 打包成客户端
1. package.json中设置：`"DEV": false,`
2. 命令行执行：`npm run build`
3. 打包
    * mac:
        1. 执行 `npm run mac-pack`，该命令将在./app/下生成对应的文件夹和.app文件
    第一次打包会有点慢，因为会下载对应的electron的包，速度太慢请参考上文的electron加速部分
        2. 执行`npm run mac-dmg` (如果没有安装electron-installer-dmg请先执行`npm i -g electron-installer-dmg`)，该命令将在./app/下生成对应的.dmg文件
        3. mac上也可以直接执行`npm run mac-full`执行完以上的步骤2-3
    * win:
        1. 执行 `npm run win-pack`
        2. 第一次打包会有点慢，因为会下载对应的electron的包，速度太慢请参考上文的electron加速部分

4. 打包完成后在当前项目根目录app/下可以看到打包后的文件

## 其他注意事项
* 如果要在mac上打包win，你需要参考[electron-packager Building Windows apps from non-Windows platforms](https://github.com/electron-userland/electron-packager#user-content-building-windows-apps-from-non-windows-platforms) 章节，主要是需要安装wine
* 再次提醒，由于国内环境下载electron可能会很卡，可以考虑设置淘宝镜像，具体设置如下
    1.  执行`npm config set ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`
    2.  再执行 `npm run win-pack`或者`npm run mac-pack`等命令

## 目录结构
    * app APP的生成目录（如果没有生成过，则不存在）
    * build 前端代码打包路径（如果没有生成过，则不存在）
    * node 后端项目主目录
    * public 静态资源
    * scripts 脚本目录
    * src 前端主目录
        * components：组件
        * routers：路由，页面
        * Config：日志源配置页
        * Login：登录页
        * Logs：日志详情页
        * utils：公共方法
        * reducers
        * action
        * index.scss:通用样式
     * main.js 后端主入口   

## 升级日志
* 升级react/react-dom到17.0.1; node-sass到4.14.1；antd到4.7.3；react-router到5.2.0；react-redux到7.2.2等最新版本
* 重新采用当前最新的create-react-app进行程序打包，同时使用craco做少量配置
* 更新相关配置，使其适配当前最新的electron版本（10.1.5）
    * 注意，因为最新版（10.1.5）打包后大小比之前大，package.json中的还是保留了老版本2.0.2的打包，实测发现，在win上打包并采用WinRAR进行压缩
    （压缩方式选择最好，后缀名使用.rar），前者大约是60.5M，后者大约是40M
    * 如果需要用其他版本打包，可以自行修改package.json中pack脚本的参数，理论上支持最新版和2.0.2的版本，如果其他版本有问题，欢迎通过上面的QQ群方式联系 
* 调整package.json中dependencies和devDependencies，其中devDependencies不会在electron-packager中被打包进来
* 优化了打包文件的大小和打包的时间，去除了不少不必要的打包内容
  
  
## 开发注意事项
* 当前打包脚本中应该排除掉/src部分，由于在mac上过滤掉`/src/`会导致报错，暂时不过滤，大约有1M+的源代码会被打包进去
* 后续新增的依赖上，node端的请加入到dependencies,前端请加入到devDependencies中，究其原因是，前端最终是需要打包到build中的，
所以前端相关的最终都没有必要放dependencies中，因为electron-packager最终打包时只会打入dependencies的部分


## Developers

[七号球员](http://7player.cn/)

[CoolGuy](https://github.com/coolguy001tv/)


## todo list
* privateKey 登录 （目前已经实现可以测试OK，不过没有正常记录相关信息）
* win上直接复制路径时会有特殊字符\8234，考虑如何去掉

