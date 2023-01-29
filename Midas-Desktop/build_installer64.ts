// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Code\app-win32-x64",
const APP_DIR = path.resolve(path.join(__dirname, 'release-builds', `win64/midas-desktop-win32-x64`));
// outputDirectory: "C:\\Users\sdkca\Code\app_installer",
const OUT_DIR = path.resolve(path.join(__dirname, 'release-builds', 'win64/installer/windows-installer-msi'));

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configure metadata
    description: 'Midas-desktop',
    exe: 'midas-desktop',
    name: 'Midas-desktop',
    manufacturer: 'Murdo',
    version: '1.0.29',
    appIconPath: path.resolve(path.join('./dist/assets', 'favicon.ico')),
    defaultInstallMode: 'perMachine',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true
    },
});

async function build() {
	await msiCreator.create();
	await msiCreator.compile();
}

build().catch(console.error);
