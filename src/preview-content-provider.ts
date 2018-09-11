import path from 'path';
import * as vscode from 'vscode';
import { 
    Event,
    EventEmitter,
    ExtensionContext,
    TextDocumentContentProvider,
    Uri
} from 'vscode';

export class OrigamiDocumentContentProvider implements TextDocumentContentProvider {
    private _onDidChange = new EventEmitter<Uri>();
    private _context: ExtensionContext;

    constructor (context: ExtensionContext) {
        this._context = context;
    }

    private getResourcePath(mediaFile) : string {
        return this._context.asAbsolutePath(path.join('resources', mediaFile));
    }

    public provideTextDocumentContent(uri: Uri): string {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('Select a text editor to show Origami preview.');
            return;
        }

        let origamiName = activeEditor.document.fileName;
        let text = activeEditor.document.getText();

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
        </head>

        <body>
            <div id="canvas">${text}</div>
        </body>`;

        return content;
    }

    get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }

    public update(uri: Uri) {
        this._onDidChange.fire(uri);
    }
}