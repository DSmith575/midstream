import { StyleSheet, Text, View } from '@react-pdf/renderer'
import type { JSX } from 'react'

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    width: 14,
    fontSize: 10,
    lineHeight: 1.4,
    color: '#2d3748',
  },
  content: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
    color: '#1a202c',
  },
})

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
  nestingLevel?: number
}

export const BulletList = ({
  listItems,
  nestingLevel = 0,
}: BulletListProps) => {
  if (!listItems?.length) return null

  const indent = nestingLevel * 14

  return (
    <View style={{ ...styles.list, marginLeft: indent }}>
      {listItems.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.bullet}>{bulletUnicode(nestingLevel)}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.content}>{item.value}</Text>
            {item.nestedList?.length ? (
              <BulletList
                listItems={item.nestedList}
                nestingLevel={nestingLevel + 1}
              />
            ) : null}
          </View>
        </View>
      ))}
    </View>
  )
}
