import { Text, View } from '@react-pdf/renderer'
import type { JSX } from 'react'

const bulletUnicode = (nestingLevel: number): string => {
  switch (nestingLevel) {
    case 0:
      return '\u2022'
    case 1:
      return '\u25E6'
    default:
      return '\u25AA'
  }
}

export interface BulletListItem {
  value: JSX.Element
  nestedList: Array<BulletListItem>
}

interface BulletListProps {
  listItems: Array<BulletListItem>
  nestingLevel: number
}

export const BulletList = ({
  listItems,
  nestingLevel = 0,
}: BulletListProps) => {
  console.log('listItems: ', listItems)
  return (
    <View>
      {listItems.map((item, index) => (
        <Text key={index} style={{ paddingLeft: (nestingLevel + 1) * 30 }}>
          {'\t'.repeat(nestingLevel + 1)}
          {bulletUnicode(nestingLevel)} {item.value}
          {'\n'}
          {
            <BulletList
              listItems={item.nestedList}
              nestingLevel={nestingLevel + 1}
            />
          }
        </Text>
      ))}
    </View>
  )
}
