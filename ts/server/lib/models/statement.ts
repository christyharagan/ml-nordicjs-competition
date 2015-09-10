export enum StatementKind {
  PROPOSITION,
  NEGATION,
  AND,
  OR,
  IMPLIES
}

export interface Statement {
  kind: StatementKind
}

export interface Proposition extends Statement {
  proposition: string
}

export interface UnaryStatement extends Statement {
  a: Statement
}

export interface BinaryStatement extends Statement {
  a: Statement
  b: Statement
}

export function toString(statement: Statement) {
  switch (statement.kind) {
    case StatementKind.PROPOSITION:
      return (<Proposition>statement).proposition
    case StatementKind.NEGATION:
      return 'NOT_' + toString((<UnaryStatement>statement).a)
    case StatementKind.AND:
      return 'AND_' + toString((<BinaryStatement>statement).a) + '_' + toString((<BinaryStatement>statement).b)
    case StatementKind.OR:
      return 'OR_' + toString((<BinaryStatement>statement).a) + '_' + toString((<BinaryStatement>statement).b)
    case StatementKind.IMPLIES:
      return 'IMPLIES_' + toString((<BinaryStatement>statement).a) + '_' + toString((<BinaryStatement>statement).b)
  }
}
