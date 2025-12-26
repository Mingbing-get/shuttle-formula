import type CalculateExpression from '../instance'

import ConstComputer from './constComputer'
import FunctionComputer from './functionComputer'
import ExpressionComputer from './expressionComputer'
import VariableComputer from './variableComputer'
import DotComputer from './dotComputer'

export default function useAllComputer(manager: CalculateExpression) {
  manager.useComputer(new ConstComputer())
  manager.useComputer(new FunctionComputer())
  manager.useComputer(new ExpressionComputer())
  manager.useComputer(new VariableComputer())
  manager.useComputer(new DotComputer())
}
