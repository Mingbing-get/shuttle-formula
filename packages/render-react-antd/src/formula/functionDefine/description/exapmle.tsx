import Tip from './tip'

export interface FunctionDescriptionExample {
  tip?: string
  name: string
  params: string[]
  result: string
}

export default function Example({ tip, name, params, result }: FunctionDescriptionExample) {
  return (
    <div className="function-description-example">
      {tip && <Tip detail={tip} />}
      <div className="function-example-use">
        <span className="function-name">@{name}</span>
        <span>(</span>
        {params.map((item, index) => (
          <span key={index}>
            <span className="function-params">{item}</span>
            {index !== params.length - 1 && <span>,&nbsp;</span>}
          </span>
        ))}
        <span>)</span>
      </div>
      <div className="function-example-result">
        <span>返回值: </span>
        <span className="function-result">{result}</span>
      </div>
    </div>
  )
}
