import './index.scss'

import {
  FunctionDescriptionDefine,
  FunctionDescriptionExample,
} from '@shuttle-formula/functions'
import Define from './define'
import Tip from './tip'
import Example from './exapmle'

interface Props {
  name: string
  define: FunctionDescriptionDefine
  detail: string
  examples: FunctionDescriptionExample[]
}

export default function FunctionDescription({
  name,
  define,
  detail,
  examples,
}: Props) {
  return (
    <div className="function-description">
      <Define {...define} name={name} />
      <Tip detail={detail} />
      <div className="function-description-line" />
      {examples.map((example, index) => (
        <Example key={index} {...example} name={name} />
      ))}
    </div>
  )
}
