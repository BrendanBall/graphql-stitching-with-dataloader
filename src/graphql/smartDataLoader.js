import DataLoader from 'dataloader'
import { print as printSelectionSet } from './printer'

export default class SmartDataLoader {
  constructor (batchLoadFn) {
    this.batchLoadFn = batchLoadFn
    this.loaders = {}
  }

  async load (id, selectionSet) {
    if (!id) {
      return null
    }
    let hash = printSelectionSet(selectionSet)
    let loader = this.loaders[hash]
    if (!loader) {
      this.loaders[hash] = new DataLoader(ids => this.batchLoadFn(ids, selectionSet))
    }
    return this.loaders[hash].load(id)
  }

  async loadMany (id, selectionSet) {
    if (!id) {
      return null
    }
    let hash = printSelectionSet(selectionSet)
    let loader = this.loaders[hash]
    if (!loader) {
      this.loaders[hash] = new DataLoader(ids => this.batchLoadFn(ids, selectionSet))
    }
    return this.loaders[hash].loadMany(id)
  }
}
