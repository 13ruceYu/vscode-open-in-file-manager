import * as vscode from 'vscode';

function getFileManagerName() {
  switch (process.platform) {
    case 'darwin': // macOS
      return 'Finder';
    case 'win32': // Windows
      return 'File Explorer';
    case 'linux': // Linux
      return 'File Manager';
    default:
      return 'File Manager';
  }
}

export function activate(context: vscode.ExtensionContext) {
  const fileManagerName = getFileManagerName();

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  statusBarItem.text = "$(file-symlink-directory)";
  statusBarItem.tooltip = `Reveal Workspace in ${fileManagerName}`;
  statusBarItem.command = "extension.revealWorkspaceInFileManager";
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  const revealCommand = vscode.commands.registerCommand("extension.revealWorkspaceInFileManager", () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage('No workspace folder is open.');
      return;
    }

    const workspaceUri = workspaceFolders[0].uri;

    vscode.commands.executeCommand('revealFileInOS', workspaceUri).then(
      () => {
        console.log(`Revealed workspace folder in ${fileManagerName}`);
      },
      (err) => {
        console.error(`Failed to reveal folder in ${fileManagerName}:`, err);
        vscode.window.showErrorMessage(`Failed to reveal workspace folder in ${fileManagerName}.`);
      }
    );
  });

  context.subscriptions.push(revealCommand);
}

export function deactivate() { }
