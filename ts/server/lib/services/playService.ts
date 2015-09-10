import {Statement, StatementKind, Proposition, toString, UnaryStatement, BinaryStatement} from '../models/statement'
import {Answer} from '../models/answer'
import {mlService, mlMethod, resolve, resolveIterator, METHOD} from 'markscript-uservices'
import {variable, prefix, select} from 'speckle'
import {incrementCounter} from 'markscript-core'

@mlService('play')
export class PlayService {
  @mlMethod()
  getPremises(): Promise<Statement[]> {
    return resolveIterator(xdmp.directory('/premises/'))
  }

  @mlMethod()
  getPossibleAnswers(): Promise<Answer[]> {
    return resolveIterator(xdmp.directory('/answers/'))
  }

  @mlMethod()
  findValue(symbol: string): Promise<boolean> {
    return resolve(this._findValue(symbol))
  }

  @mlMethod({
    method: METHOD.PUT
  })
  submitAnswer(answerId: number): Promise<boolean> {
    incrementCounter('/guesses/' + answerId)

    let guess = <Answer><any>cts.doc('/answers/' + answerId).root.toObject()

    for (let i = 0; i < guess.values.length; i++) {
      let value = guess.values[i]
      if (this._findValue(value.symbol) !== value.value) {
        return resolve(false)
      }
    }
    return resolve(true)
  }

  _findValue(symbol: string): boolean {
    let value = variable('value')
    let sem = require('/MarkLogic/semantics.xqy')
    let logic = prefix('l', 'http://logic/')
    let queryResult = sem.sparql(select(value).where(logic.uri(symbol), logic.uri('is'), value).toSparql())
    if (queryResult.count !== 1) {
      return null
    } else {
      return queryResult.next().value.value.toString() === 'http://logic/true'
    }
  }
}
