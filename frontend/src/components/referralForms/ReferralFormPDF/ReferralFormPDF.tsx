import { Document, Page, Text, View } from '@react-pdf/renderer'
import { styles } from './style'
import { Section } from './Section'

import { generateFormSections } from '@/lib/functions/formFunctions'

interface ReferralFormPDFProps {
  referralForm: any
}

export const ReferralFormPDF = ({ referralForm }: ReferralFormPDFProps) => {
  const formSections = generateFormSections(referralForm, {
    excludeKeys: ['assignedToWorker', 'documents'],
  })
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>Referral Form</Text>
        </View>
        {formSections.map((section, index) => (
          <Section formSection={section} index={index} />
        ))}
      </Page>
    </Document>
  )
}
