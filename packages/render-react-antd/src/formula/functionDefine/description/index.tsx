import './index.scss'

import Define, { FunctionDescriptionDefine } from './define'
import Tip from './tip'
import Example, { FunctionDescriptionExample } from './exapmle'

interface Props {
  define: FunctionDescriptionDefine
  detail: string
  examples: Omit<FunctionDescriptionExample, 'name' | 'functionKey'>[]
}

export default function FunctionDescription({ define, detail, examples }: Props) {
  return (
    <div className="function-description">
      <Define {...define} />
      <Tip detail={detail} />
      <div className="function-description-line" />
      {examples.map((example, index) => (
        <Example
          key={index}
          name={define.name}
          {...example}
        />
      ))}
    </div>
  )
}
