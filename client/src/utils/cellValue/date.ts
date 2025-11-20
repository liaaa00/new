import dayjs from "dayjs/esm/index.js"
import customParseFormat from "dayjs/plugin/customParseFormat"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { type IDateTimeField, FieldType } from "@lark-base-open/js-sdk"
import { defineTranslator } from "./cell"
import type { fieldMap } from "@/types/types"

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)

export const dateDefaultFormat = "YYYY/MM/DD"

// 支持多种常见日期格式
const commonDateFormats = [
  "YYYY/MM/DD",
  "YYYY-MM-DD",
  "YYYY/M/D",
  "YYYY-M-D",
  "MM/DD/YYYY",
  "M/D/YYYY",
  "DD/MM/YYYY",
  "D/M/YYYY",
  "YYYY年MM月DD日",
  "YYYY年M月D日",
]

export async function normalization(
  value: string,
  config?: fieldMap["config"],
) {
  const { format = dateDefaultFormat } = config || {}

  // 先尝试用户指定的格式
  let parsed = dayjs(value, format, true)
  if (parsed.isValid()) {
    return parsed.valueOf()
  }

  // 如果用户指定格式失败，尝试常见格式
  for (const fmt of commonDateFormats) {
    parsed = dayjs(value, fmt, true)
    if (parsed.isValid()) {
      return parsed.valueOf()
    }
  }

  // 最后尝试自动解析
  parsed = dayjs(value)
  return parsed.valueOf()
}

/**
 * Get dateTime cell
 *
 * @param value
 * @param field
 * @param config
 * @returns
 */
async function dateTime(
  value: string,
  field: IDateTimeField,
  config?: fieldMap["config"],
) {
  const v = await normalization(value, config)
  return await field.createCell(v)
}

export const DateTimeTranslator = defineTranslator({
  fieldType: FieldType.DateTime,
  translate: dateTime,
  normalization,
  name: "DateTime",
})
