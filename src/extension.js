import * as path from 'path';
import * as vscode from 'vscode';

import {
    OrigamiDocumentContentProvider
} from './preview-content-provider';

export function activate(context) {
    let previewUri = vscode.Uri.parse('origami-preview://preview');

    let provider = new OrigamiDocumentContentProvider(context);
    let registration = vscode.workspace.registerTextDocumentContentProvider('origami-preview', provider);
    let editor = vscode.window.activeTextEditor;
    let _timeout;

    vscode.workspace.onDidChangeTextDocument((e) => {
        clearTimeout(_timeout);
        _timeout = setTimeout( function () {
            if (vscode.window.activeTextEditor && e && e.document === vscode.window.activeTextEditor.document) {
                provider.update(previewUri);
            }
        }, 1000);
    });

    vscode.window.onDidChangeActiveTextEditor((e) => {
        if (e) {
            provider.update(previewUri);
            editor = e;
        }
    });

    function openPreview (uri) {
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