import type { StaticTokenParse } from '../type'

import * as operatorParse from './operator'
import { NumberTokenParse } from './numberTokenParse'
import { BooleanTokenParse } from './booleanTokenParse'
import { SpaceTokenParse } from './spaceTokenParse'
import { TableTokenParse } from './tableTokenParse'
import { WrapTokenParse } from './wrapTokenParse'

interface AnalysisInstance {
  useTokenParse: (TokenParse: StaticTokenParse<string>) => void
}

export default function useAllTokenParse(instance: AnalysisInstance) {
  instance.useTokenParse(SpaceTokenParse)
  instance.useTokenParse(TableTokenParse)
  instance.useTokenParse(WrapTokenParse)

  Object.values(operatorParse).forEach((parse) => {
    instance.useTokenParse(parse)
  })
  instance.useTokenParse(NumberTokenParse)
  instance.useTokenParse(BooleanTokenParse)
}
