import DataLoader from 'dataloader'
import { print as printSelectionSet } from './printer'

export default class SmartDataLoader {
  constructor (batchLoadFn) {
    this.batchLoadFn = batchLoadFn
    this.loaders = {}
  }

  async load (id, info) {
    if (!id) {
      return null
    }
    let hash = printSelectionSet(info.fieldNodes[0].selectionSet)
    let loader = this.loaders[hash]
    if (!loader) {
      this.loaders[hash] = new DataLoader(ids => this.batchLoadFn(ids, info))
    }
    return this.loaders[hash].load(id)
  }

  async loadMany (id, info) {
    if (!id) {
      return null
    }
    let hash = printSelectionSet(info.fieldNodes[0].selectionSet)
    let loader = this.loaders[hash]
    if (!loader) {
      this.loaders[hash] = new DataLoader(ids => this.batchLoadFn(ids, info))
    }
    return this.loaders[hash].loadMany(id)
  }
}
