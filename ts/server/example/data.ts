import {StatementKind, Proposition, BinaryStatement, UnaryStatement} from '../lib/models/statement'
import {Answer} from '../lib/models/answer'

export const answers: Answer[] = [
  {
    id: 1,
    values: [{
      symbol: 'R',
      value: false
    }, {
        symbol: 'S',
        value: false
      }]
  },
  {
    id: 2,
    values: [{
      symbol: 'R',
      value: true
    }, {
        symbol: 'S',
        value: false
      }]
  },
  {
    id: 3,
    values: [{
      symbol: 'R',
      value: false
    }, {
        symbol: 'S',
        value: true
      }]
  },
  {
    id: 4,
    values: [{
      symbol: 'R',
      value: true
    }, {
        symbol: 'S',
        value: true
      }]
  }
]

export const premises: BinaryStatement[] = [
  {
    kind: StatementKind.AND,
    a: <Proposition>{
      kind: StatementKind.PROPOSITION,
      proposition: 'P'
    },
    b: <Proposition>{
      kind: StatementKind.PROPOSITION,
      proposition: 'Q'
    }
  },
  {
    kind: StatementKind.IMPLIES,
    a: <Proposition>{
      kind: StatementKind.PROPOSITION,
      proposition: 'S'
    },
    b: <Proposition>{
      kind: StatementKind.PROPOSITION,
      proposition: 'R'
    }
  }, {
    kind: StatementKind.IMPLIES,
    a: <Proposition>{
      kind: StatementKind.PROPOSITION,
      proposition: 'P'
    },
    b: <UnaryStatement>{
      kind: StatementKind.NEGATION,
      a: <BinaryStatement>{
        kind: StatementKind.AND,
        a: <Proposition>{
          kind: StatementKind.PROPOSITION,
          proposition: 'R'
        },
        b: <Proposition>{
          kind: StatementKind.PROPOSITION,
          proposition: 'Q'
        }
      }
    }
  }
]
