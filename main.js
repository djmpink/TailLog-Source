const {webSocketServer} = require('./node/WebSocketServer');
const {webServer} = require('./node/WebServer');
const {termSSH} = require('./node/TermSSH');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const app = electron.app;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
console.log("===========Application Start===========");

//客户端启动设置，窗口菜单，启动后端服务等
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 960, height: 800});

    // and load the index.html of the app.
    const pkg = require('./package.json'); // 引用package.json
    //判断是否是开发模式
    if (pkg.DEV) {
        win.loadURL("http://localhost:3000/");
        // 打开窗口的调试工具
        win.webContents.openDevTools();
    } else {
        // 加载应用的 index.html
        win.loadURL('file://' + __dirname + '/build/index.html');
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

//菜单设置
let template = [{
    label: '编辑',
    submenu: [{
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
    }, {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
    }, {
        type: 'separator'
    }, {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    }, {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }, {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }, {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
    }]
}, {
    label: '查看',
    submenu: [{
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                // 重载之后, 刷新并关闭所有的次要窗体
                if (focusedWindow.id === 1) {
                    BrowserWindow.getAllWindows().forEach(function (win) {
                        if (win.id > 1) {
                            win.close()
                        }
                    })
                }
                focusedWindow.reload()
            }
        }
    }, {
        label: '切换全屏',
        accelerator: (function () {
            if (process.platform === 'darwin') {
                return 'Ctrl+Command+F'
            } else {
                return 'F11'
            }
        })(),
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
        }
    }, {
        type: 'separator'
    }, {
        label: '开发者工具',
        accelerator: (function () {
            if (process.platform === 'darwin') {
                return 'Alt+Command+I'
            } else {
                return 'Ctrl+Shift+I'
            }
        })(),
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        }
    }]
}, {
    label: '窗口',
    role: 'window',
    submenu: [{
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
    }, {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
    }, {
        type: 'separator'
    }, {
        label: '重新打开窗口',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click: function () {
            app.emit('activate')
        }
    }]
}, {
    label: '帮助',
    role: 'help',
    submenu: [{
        label: '使用说明',
        click: function () {
            electron.shell.openExternal('http://www.taillog.cn/help.html')
        }
    }, {
        type: 'separator'
    }, {
        label: '开发者',
        click: function (item, focusedWindow) {
            if (focusedWindow) {
                const options = {
                    type: 'info',
                    title: '开发者',
                    buttons: ['关闭'],
                    message: '左小岸\n' +
                    'github：https://github.com/djmpink \n' +
                    '博客：https://www.7player.cn',
                };
                electron.dialog.showMessageBox(focusedWindow, options, function () {
                })
            }
        }
    }]
}];

function addUpdateMenuItems(items, position) {
    if (process.mas) return

    const version = electron.app.getVersion()
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: '正在检查更新',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: '检查更新',
        visible: false,
        key: 'checkForUpdate',
        click: function () {
            require('electron').autoUpdater.checkForUpdates()
        }
    }, {
        label: '重启并安装更新',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: function () {
            require('electron').autoUpdater.quitAndInstall()
        }
    }];

    items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu();
    if (!menu) return;

    let reopenMenuItem;
    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    });
    return reopenMenuItem
}

if (process.platform === 'darwin') {
    const name = electron.app.getName()
    template.unshift({
        label: name,
        submenu: [{
            label: `关于 ${name}`,
            role: 'about'
        }, {
            type: 'separator'
        }, {
            label: '服务',
            role: 'services',
            submenu: []
        }, {
            type: 'separator'
        }, {
            label: `隐藏 ${name}`,
            accelerator: 'Command+H',
            role: 'hide'
        }, {
            label: '隐藏其它',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
        }, {
            label: '显示全部',
            role: 'unhide'
        }, {
            type: 'separator'
        }, {
            label: '退出',
            accelerator: 'Command+Q',
            click: function () {
                app.quit()
            }
        }]
    });

    // 窗口菜单.
    template[3].submenu.push({
        type: 'separator'
    }, {
        label: '前置所有',
        role: 'front'
    });

    addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu;
    addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', function () {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)
});

app.on('browser-window-created', function () {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = false
});

app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = true
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//启动本地后端服务
webServer();//启动后台web服务
webSocketServer();//启动连接SSH服务器websocket服务
termSSH();//启动终端工具websocket服务
