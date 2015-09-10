import {mlService, mlEvent, mlMethod, AbstractMLService, Doc, resolve} from 'markscript-uservices'
import {Observable} from 'uservices'
import {Counter} from 'markscript-core'

export interface Results {
  [answerId: number]: number
}

export type ResultUpdates = [number, number]

@mlService('results')
export class ResultsService extends AbstractMLService {
  @mlEvent({
    scope: '/guesses/'
  })
  updateResults(): Observable<ResultUpdates> {
    return this.observableFactory().map(function(value: Doc<Counter>) {
      return [parseInt(value.uri.substring('/guesses/'.length)), value.content.root.count]
    })
  }

  @mlMethod()
  getResults(): Promise<Results> {
    let docs = <cts.ValueIterator<Counter>>xdmp.directory('/guesses/')
    let results: Results = {}
    while (true) {
      var item = docs.next()
      if (item.done) {
        break
      }
      results[parseInt(item.value.baseURI.substring('/guesses/'.length))] = item.value.root.count
    }

    return resolve(results)
  }
}
