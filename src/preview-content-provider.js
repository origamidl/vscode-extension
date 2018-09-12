import * as path from 'path';
import * as vscode from 'vscode';
import { 
    Event,
    EventEmitter,
    ExtensionContext,
    TextDocumentContentProvider,
    Uri
} from 'vscode';

export class OrigamiDocumentContentProvider {

    constructor (context) {
        this._context = context;

        this._onDidChange = new EventEmitter();
    }

    provideTextDocumentContent(uri) {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('Select a text editor to show Origami preview.');
            return;
        }

        let origamiName = activeEditor.document.fileName;
        let text = activeEditor.document.getText();

        let scriptName = require.resolve('@origami-dsl/webgl/dist/browser');

        const content = `
        <head>
            <style>
                html, body, #canvas {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                #canvas {
                    background-color: orange;
                }
            </style>
            <script src="file://${scriptName}"></script>
        </head>
        <body>
            <script type="application/origami">${text}</script>
        </body>`;

        return content;
    }

    onDidChange() {
        return this._onDidChange.event;
    }

    update(uri) {
        this._onDidChange.fire(uri);
    }
}