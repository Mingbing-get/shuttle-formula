interface Props {
  tip?: string
}

export default function ErrorTipRender({ tip }: Props) {
  if (!tip) return

  return <div className="variable-render-error">{tip}</div>
}
