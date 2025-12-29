# Shuttle Formula Functions

本包提供了一系列用于公式计算的函数，支持多种数据类型和操作。函数分为以下几个类别：

## 文本函数

| 函数名      | 中文名称     | 参数类型                     | 返回值类型     |
| ----------- | ------------ | ---------------------------- | -------------- |
| len         | 获取长度     | `string` \| `array`          | `number`       |
| reverse     | 翻转         | `string` \| `array`          | 与输入类型相同 |
| mergeString | 合并字符串   | `string`                     | `string`       |
| contains    | 是否包含     | `string`, `string`           | `boolean`      |
| stringIndex | 查找文本位置 | `string`, `string`           | `number`       |
| subString   | 获取子串     | `string`, `number`, `number` | `string`       |
| lower       | 转小写       | `string`                     | `string`       |
| upper       | 转大写       | `string`                     | `string`       |
| repeat      | 重复文本     | `string`, `number`           | `string`       |
| trim        | 删除头尾空格 | `string`                     | `string`       |
| replace     | 替换         | `string`, `string`, `string` | `string`       |
| replaceAll  | 替换所有     | `string`, `string`, `string` | `string`       |

## 日期函数

| 函数名         | 中文名称     | 参数类型                           | 返回值类型        |
| -------------- | ------------ | ---------------------------------- | ----------------- |
| nowDate        | 当前日期     | 无                                 | `custom-date`     |
| now            | 当前日期时间 | 无                                 | `custom-datetime` |
| formatDate     | 格式化时间   | `custom-date` \| `custom-datetime` | `string`          |
| getTime        | 获取时间戳   | `custom-date`                      | `custom-datetime` |
| addYear        | 加年         | `custom-date`                      | 与输入类型相同    |
| addMonth       | 加月         | `custom-date`                      | 与输入类型相同    |
| addDay         | 加天         | `custom-date`                      | 与输入类型相同    |
| addHour        | 加小时       | `custom-datetime`, `number`        | 与输入类型相同    |
| addMinute      | 加分钟       | `custom-datetime`, `number`        | 与输入类型相同    |
| addSecond      | 加秒         | `custom-datetime`, `number`        | 与输入类型相同    |
| addMilliSecond | 加毫秒       | `custom-datetime`, `number`        | 与输入类型相同    |
| getYear        | 获取年       | `custom-date`                      | `custom-datetime` |
| getMonth       | 获取月       | `custom-date`                      | `custom-datetime` |
| getDay         | 获取日       | `custom-date`                      | `custom-datetime` |
| getHour        | 获取小时     | `custom-datetime`                  | `number`          |
| getMinute      | 获取分钟     | `custom-datetime`                  | `number`          |
| getSecond      | 获取秒       | `custom-datetime`                  | `number`          |
| getMilliSecond | 获取毫秒     | `custom-datetime`                  | `number`          |
| setYear        | 设置年       | `custom-date`                      | 与输入类型相同    |
| setMonth       | 设置月       | `custom-date`                      | 与输入类型相同    |
| setDay         | 设置日       | `custom-date`                      | 与输入类型相同    |
| setHour        | 设置小时     | `custom-datetime`, `number`        | 与输入类型相同    |
| setMinute      | 设置分钟     | `custom-datetime`, `number`        | 与输入类型相同    |
| setSecond      | 设置秒       | `custom-datetime`, `number`        | 与输入类型相同    |
| setMilliSecond | 设置毫秒     | `custom-datetime`, `number`        | 与输入类型相同    |

## 对象函数

| 函数名       | 中文名称       | 参数类型           | 返回值类型           |
| ------------ | -------------- | ------------------ | -------------------- |
| createObject | 创建对象       | `string`, `any`    | `object`             |
| keys         | 获取键名       | `object`           | `array<string>`      |
| getValue     | 获取指定键的值 | `object`, `string` | 对象中对应键的值类型 |
| mergeObject  | 合并对象       | `object`           | `object`             |

## 数组函数

| 函数名        | 中文名称     | 参数类型                    | 返回值类型     |
| ------------- | ------------ | --------------------------- | -------------- |
| createArray   | 创建数组     | `any`                       | `array`        |
| arrayContains | 数组是否包含 | `array`, `any`              | `boolean`      |
| len           | 获取长度     | `string`                    | `number`       |
| mergeArray    | 合并数组     | `array`                     | `array`        |
| arrayGet      | 数组获取值   | `array`, `number`           | 数组项类型     |
| reverse       | 翻转         | `string`                    | 与输入类型相同 |
| subArray      | 获取子数组   | `array`, `number`, `number` | 与输入类型相同 |
| sort          | 数组排序     | `array`, `boolean`          | `array`        |
| substract     | 数组差集     | `array`, `array`            | `array`        |
| arraySum      | 数组和       | `array`                     | `number`       |
| arrayAvg      | 数组均值     | `array`                     | `number`       |
| arrayMin      | 数组最小值   | `array`                     | `number`       |
| arrayMax      | 数组最大值   | `array`                     | `number`       |
| unique        | 数组去重     | `array`                     | `array`        |
| hasAllOf      | 是否全部包含 | `array`, `array`            | `array`        |
| hasAnyOf      | 是否存在交集 | `array`, `array`            | `array`        |

## 类型转换

| 函数名       | 中文名称       | 参数类型                                                                                 | 返回值类型        |
| ------------ | -------------- | ---------------------------------------------------------------------------------------- | ----------------- |
| anyToString  | 转为字符串     | `boolean` \| `number` \| `string` \| `custom-date` \| `custom-datetime` \| `custom-enum` | `string`          |
| toNumber     | 转为数字       | `number` \| `string` \| `boolean`                                                        | `number`          |
| toJsonString | 转为json字符串 | `array` \| `object`                                                                      | `string`          |
| toDate       | 转为日期       | `string` \| `number` \| `custom-datetime`                                                | `custom-date`     |
| toDateTime   | 转为日期时间   | `string` \| `number` \| `custom-date`                                                    | `custom-datetime` |

## 数学函数

| 函数名    | 中文名称     | 参数类型           | 返回值类型 |
| --------- | ------------ | ------------------ | ---------- |
| round     | 四舍五入     | `number`           | `number`   |
| random    | 随机数       | 无                 | `number`   |
| roundDown | 向下取整     | `number`           | `number`   |
| roundUp   | 向上取整     | `number`           | `number`   |
| abs       | 绝对值       | `number`           | `number`   |
| avg       | 平均值       | `number`           | `number`   |
| sum       | 求和         | `number`           | `number`   |
| max       | 最大值       | `number`           | `number`   |
| min       | 最小值       | `number`           | `number`   |
| log       | 计算对数     | `number`, `number` | `number`   |
| logE      | 自然对数     | `number`           | `number`   |
| mod       | 取余         | `number`, `number` | `number`   |
| power     | 计算幂       | `number`, `number` | `number`   |
| powerE    | 自然底数求幂 | `number`           | `number`   |
| sqrt      | 开方         | `number`           | `number`   |

## 逻辑函数

| 函数名     | 中文名称   | 参数类型                | 返回值类型     |
| ---------- | ---------- | ----------------------- | -------------- |
| if         | 如果       | `any`, `boolean`, `any` | 与输入类型相同 |
| isBlank    | 是否为空   | `any`                   | `boolean`      |
| isNotBlank | 是否不为空 | `any`                   | `boolean`      |
| equals     | 是否相等   | `any`                   | `boolean`      |
