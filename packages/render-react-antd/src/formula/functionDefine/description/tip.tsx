interface Props {
  detail: string
}

export default function Tip({ detail }: Props) {
  return <span className="function-description-tip">{detail}</span>
}
