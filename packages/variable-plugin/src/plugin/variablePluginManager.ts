import {
  WithDynamicVariable,
  GetDynamicObjectByPath,
  GetDynamicDefineAndValueByPath,
  WithDynamicVariableObject,
} from '@shuttle-formula/render'
import { VariablePlugin } from '../type'

import BooleanPlugin from './booleanPlugin'
import DateTimePlugin from './datetimePlugin'
import DatePlugin from './datePlugin'
import NumberPlugin from './numberPlugin'
import StringPlugin from './stringPlugin'
import ArrayPlugin from './arrayPlugin'
import ObjectPlugin from './objectPlugin'

class VariablePluginManager {
  private plugins: VariablePlugin.Instance<VariablePlugin.Define>[] = []

  use<T extends VariablePlugin.Define>(plugin: VariablePlugin.Instance<T>) {
    this.plugins.push(plugin as VariablePlugin.Instance<any>)

    return this
  }

  get(define: VariablePlugin.Define) {
    const plugin = this.plugins.find((plugin) => plugin.is(define))

    if (!plugin) {
      throw new Error(`Plugin not found for define ${define.type}`)
    }

    return plugin
  }

  recordToFormula(recordDefine: Record<string, VariablePlugin.Define>) {
    const formula: Record<string, WithDynamicVariable> = {}

    for (const key in recordDefine) {
      formula[key] = this.toFormula(recordDefine[key])
    }

    return formula
  }

  toFormula(define: VariablePlugin.Define) {
    const plugin = this.get(define)

    return plugin.toFormula(define)
  }

  createGetDynamicObjectByPath(): GetDynamicObjectByPath {
    return (path: string[], dynamicObjectDefine: WithDynamicVariableObject) => {
      try {
        const define = dynamicObjectDefine.extra
        const plugin = this.get(define)

        return plugin.onDynamicDefine?.(define)
      } catch (error) {}
    }
  }

  createGetDynamicDefineAndValueByPath(): GetDynamicDefineAndValueByPath {
    return async (
      path: string[],
      dynamicObjectDefine: WithDynamicVariableObject,
      dynamicValue: any,
    ) => {
      try {
        const define = dynamicObjectDefine.extra
        const plugin = this.get(define)

        return {
          define: await plugin.onDynamicDefine?.(define),
          value: await plugin.onDynamicValue?.(define, dynamicValue),
        }
      } catch (error) {}
    }
  }

  createAccept(defines: VariablePlugin.Define[], exclude?: boolean) {
    const plugins = defines.map((define) => ({
      plugin: this.get(define),
      define,
    }))

    const defineLables = defines
      .map((define) => define.label || define.type)
      .join('、')

    return (returnType: WithDynamicVariable) => {
      const inDefine = plugins.some((plugin) =>
        plugin.plugin.accept(returnType, plugin.define),
      )

      if (!exclude && !inDefine) {
        return `仅支持类型: ${defineLables}`
      }

      if (exclude && inDefine) {
        return `不支持类型: ${defineLables}`
      }
    }
  }
}

const variablePluginManager = new VariablePluginManager()
variablePluginManager.use(new BooleanPlugin())
variablePluginManager.use(new DateTimePlugin())
variablePluginManager.use(new DatePlugin())
variablePluginManager.use(new NumberPlugin())
variablePluginManager.use(new StringPlugin())
variablePluginManager.use(new ArrayPlugin())
variablePluginManager.use(new ObjectPlugin())

export default variablePluginManager
