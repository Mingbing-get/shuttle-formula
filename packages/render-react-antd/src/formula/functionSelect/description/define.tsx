import { FunctionDescriptionDefine } from '@shuttle-formula/functions'

export interface FunctionDescriptionDefineProps
  extends FunctionDescriptionDefine {
  name: string
}

export default function Define({
  name,
  paramsList,
  result,
}: FunctionDescriptionDefineProps) {
  return (
    <div className="function-description-define">
      <span className="function-name">@{name}</span>
      <span>(</span>
      {paramsList.map((item, index) => (
        <span key={index}>
          <span className="function-params">{item}</span>
          {index !== paramsList.length - 1 && <span>,&nbsp;</span>}
        </span>
      ))}
      <span>)</span>
      <span>&nbsp;&nbsp;-&gt;&nbsp;&nbsp;</span>
      <span className="function-result">{result}</span>
    </div>
  )
}
