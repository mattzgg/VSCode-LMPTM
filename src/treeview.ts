import { Browser } from './browser'
import { Event, EventEmitter, ThemeIcon, TreeDataProvider, TreeItem, window } from 'vscode'
import { Entry } from './interfaces'

export class TreeviewProvider implements TreeDataProvider<Entry> {
  public static tvProvider: TreeviewProvider

  private _onDidChangeTreeData: EventEmitter<null> = new EventEmitter<null>()
  readonly onDidChangeTreeData: Event<null> = this._onDidChangeTreeData.event

  private browser: Browser | undefined

  public static create() {
    const treeDataProvider = new TreeviewProvider()
    window.createTreeView('LMPTM', { treeDataProvider })
    // const tv = window.createTreeView('LMPTM', { treeDataProvider })
    // tv.onDidChangeSelection(({ selection }) => {})
    this.tvProvider = treeDataProvider
  }

  public static refresh() {
    this.tvProvider.refresh()
  }

  constructor() {
    this.browser = Browser.activeBrowser
  }

  getTreeItem(element: Entry): TreeItem {
    return this.getItem(element)
  }

  async getChildren(): Promise<Entry[] | undefined> {
    if (!this.browser) return
    const details = this.browser.getPagesStatus()
    if (!details) return
    return details
  }

  private getItem(element: Entry) {
    // console.debug(element)

    return new TabItem(element)
  }

  refresh(): void {
    this.browser = Browser.activeBrowser
    this._onDidChangeTreeData.fire(null)
    // console.debug('refresh')
  }
}

class TabItem extends TreeItem {
  constructor(e: Entry) {
    const { title, state } = e
    super(title)
    this.iconPath = state === 'playing' ? new ThemeIcon('debug-pause') : new ThemeIcon('debug-start')
    this.command = { title: 'click', command: 'lmptm.click', arguments: [e] }
  }
}
