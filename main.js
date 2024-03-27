const vscode = require('vscode');
const axios = require('axios');
const cheerio = require('cheerio');

function activate(context) {
    let disposable = vscode.commands.registerCommand('amathron.showOpenWrtPackageDescription', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const wordPattern = /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\s]+)/g;
        const position = editor.selection.active;

        const wordRange = editor.document.getWordRangeAtPosition(position, wordPattern);
        if (!wordRange) {
            return;
        }

        const packageName = editor.document.getText(wordRange);
        try {
            const response = await axios.get(`https://pkgs.staging.openwrt.org/packages?name=${packageName}`);
            const $ = cheerio.load(response.data);
            const packageDescription = $('.package a').attr('aria-label');
            vscode.window.showInformationMessage(packageDescription || "Package description not found.");
        } catch (error) {
            vscode.window.showErrorMessage("Failed to fetch package description.");
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
