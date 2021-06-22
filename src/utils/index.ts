
/**
 * Get unique key values from an array of objects.
 * 
 * @param array items
 * @param string keyName
 * @returns array
 */
export const getUniqueKeyValues = (items: Array<object>, keyName: string): Array<string> => {
  const uniqueValues: Array<string> = []

  items.forEach((item: any) => {
    if (!uniqueValues.includes(item[keyName])) {
      uniqueValues.push(item[keyName])
    }
  })

  return uniqueValues.sort((a: any, b: any) => (a < b ? -1 : (a > b ? 1 : 0)))
}
