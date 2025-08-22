import { Text, View } from '@react-pdf/renderer'
import { BulletList } from './BulletList'
import { styles } from './style'

import type { BulletListItem } from './BulletList'

const mapValue = (value: any) => {
  switch (typeof value) {
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'string':
      if (!isNaN(Date.parse(value))) {
        return new Date(value).toLocaleDateString()
      }
    // eslint-disable-next-line no-fallthrough
    default:
      return value as string
  }
}

interface SectionProps {
  formSection: any
  index: number
}

export const Section = ({ formSection, index }: SectionProps) => {
  return (
    <View>
      <Text style={styles.header}>
        {'\n'}Section {index + 1}: {formSection.title}
      </Text>
      <BulletList
        nestingLevel={0}
        listItems={
          Object.entries(formSection.field)
            .filter(
              ([key]) =>
                key !== 'id' &&
                key !== 'userId' &&
                key !== 'createdAt' &&
                key !== 'updatedAt',
            )
            .map(
              ([key, value]) =>
                ({
                  value: (
                    <Text>
                      <Text style={styles.boldText}>{key}: </Text>
                      <Text>{mapValue(value)}</Text>
                    </Text>
                  ),
                  nestedList: [],
                }) as BulletListItem,
            )
        }
      />
    </View>
  )
}
