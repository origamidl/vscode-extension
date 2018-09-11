import * as path from 'path';
import * as vscode from 'vscode';

import {
    OrigamiDocumentContentProvider
} from './preview-content-provider';

export function activate(context: vscode.ExtensionContext) {
    let previewUri = vscode.Uri.parse('origami-preview://preview');

    let provider = new OrigamiDocumentContentProvider(context);
    let registration = vscode.workspace.registerTextDocumentContentProvider('origami-preview', provider);
    let editor = vscode.window.activeTextEditor;
    let _timeout: number;

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        clearTimeout(_timeout);
        _timeout = setTimeout( function () {
            if (vscode.window.activeTextEditor && e && e.document === vscode.window.activeTextEditor.document) {
                provider.update(previewUri);
            }
        }, 1000);
    });

    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        if (e) {
            provider.update(previewUri);
            editor = e;
        }
    });

    function openPreview (uri?: vscode.Uri) {
        let resource = uri;
        if (!(resource instanceof vscode.Uri)) {
            if (vscode.window.activeTextEditor) {
                resource = vscode.window.activeTextEditor.document.uri;
            }
        }

        return vscode.commands
            .executeCommand(
                'vscode.previewHtml',
                previewUri,
                vscode.ViewColumn.Two,
                'Origami Preview'
            )
            .then(
                (success) => {

                },
                (reason) => {
                    vscode.window.showErrorMessage(reason);
                }
            );
    }

    let disposable = vscode.commands.registerCommand('origami-vscode.openPreview', openPreview);
    
    context.subscriptions.push(disposable);
}