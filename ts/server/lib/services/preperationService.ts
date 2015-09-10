import {Statement, StatementKind, Proposition, toString, UnaryStatement, BinaryStatement} from '../models/statement'
import {Answer} from '../models/answer'
import {mlService, mlMethod, resolve, METHOD} from 'markscript-uservices'
import {createCounter, deleteAll, deleteGraph} from 'markscript-core'

@mlService('preperation')
export class PreperationService {
  @mlMethod({
    method: METHOD.PUT
  })
  clear(): Promise<boolean> {
    deleteAll('/answers')
    deleteAll('/premises')
    deleteAll('/guesses')
    deleteGraph()
    return resolve(true)
  }

  @mlMethod({
    method: METHOD.PUT
  })
  loadAnswers(answers: Answer[]): Promise<boolean> {
    answers.forEach(function(answer) {
      xdmp.documentInsert(`/answers/${answer.id}`, answer)
      createCounter(`/guesses/${answer.id}`)
    })
    return resolve(true)
  }

  @mlMethod({
    method: METHOD.PUT
  })
  loadPremises(premises: Statement[]): Promise<boolean> {
    let sem = require('/MarkLogic/semantics.xqy')
    premises.forEach(function(premise) {
      let str = processStatement(premise)
      sem.rdfInsert(
        sem.triple(
          sem.iri(`http://logic/${str}`),
          sem.iri('http://logic/is'),
          sem.iri(`http://logic/true`)))
      xdmp.documentInsert(`/premises/${str}`, premise)
    })

    function processStatement(statement: Statement): string {
      let str = toString(statement)
      switch (statement.kind) {
        case StatementKind.NEGATION:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/not'),
              sem.iri(`http://logic/${processStatement((<UnaryStatement>statement).a) }`)))
          break
        case StatementKind.AND:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/and'),
              sem.iri(`http://logic/${processStatement((<BinaryStatement>statement).a) }`)))
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/and'),
              sem.iri(`http://logic/${processStatement((<BinaryStatement>statement).b) }`)))
          break
        case StatementKind.OR:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/or'),
              sem.iri(`http://logic/${processStatement((<BinaryStatement>statement).a) }`)))
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/or'),
              sem.iri(`http://logic/${processStatement((<BinaryStatement>statement).b) }`)))
          break
        case StatementKind.IMPLIES:
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/leftImplies'),
              sem.iri(`http://logic/${processStatement((<BinaryStatement>statement).a) }`)))
          sem.rdfInsert(
            sem.triple(
              sem.iri(`http://logic/${str}`),
              sem.iri('http://logic/rightImplies'),
              sem.iri(`http://logic/${processStatement((<BinaryStatement>statement).b) }`)))
          break
      }
      return str
    }
    return resolve(true)
  }
}
