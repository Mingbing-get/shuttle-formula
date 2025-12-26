import type SyntaxCheck from '../instance'

import ConstChecker from './constChecker'
import ExpressionChecker from './expressionChecker'
import FunctionChecker from './functionChecker'
import VariableChecker from './variableChecker'
import DotChecker from './dotChecker'
import UnknownChecker from './unknownChecker'

export default function useAllChecker(manager: SyntaxCheck) {
  manager.useChecker(new ConstChecker())
  manager.useChecker(new ExpressionChecker())
  manager.useChecker(new FunctionChecker())
  manager.useChecker(new VariableChecker())
  manager.useChecker(new DotChecker())
  manager.useChecker(new UnknownChecker())
}
