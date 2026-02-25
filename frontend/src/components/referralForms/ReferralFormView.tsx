import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/functions/functions'

interface ReferralFormViewProps {
  referralForm: any
}

export const ReferralFormView = ({ referralForm }: ReferralFormViewProps) => {
  console.log('ReferralFormView - referralForm:', referralForm)
  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm">{value || 'N/A'}</span>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge
          variant={
            referralForm.status === 'SUBMITTED' ? 'default' : 'secondary'
          }
        >
          {referralForm.status}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Created {formatDate(referralForm.createdAt)}
        </span>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="First Name"
            value={referralForm.user?.personalInformation?.firstName}
          />
          <InfoRow
            label="Last Name"
            value={referralForm.user?.personalInformation?.lastName}
          />
          <InfoRow
            label="Preferred Name"
            value={referralForm.user?.personalInformation?.preferredName}
          />
          <InfoRow
            label="Title"
            value={referralForm.user?.personalInformation?.title}
          />
          <InfoRow
            label="Gender"
            value={referralForm.user?.personalInformation?.gender}
          />
          <InfoRow
            label="Date of Birth"
            value={formatDate(
              referralForm.user?.personalInformation?.dateOfBirth,
            )}
          />
        </CardContent>
      </Card>



      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="Email"
            value={referralForm.user?.contactInformation?.email}
          />
          <InfoRow
            label="Phone"
            value={referralForm.user?.contactInformation?.phone}
          />
          <div className="sm:col-span-2">
            <InfoRow
              label="Address"
              value={`${referralForm.user?.addressInformation?.address || ''}, ${referralForm.user?.addressInformation?.suburb || ''}, ${referralForm.user?.addressInformation?.city || ''} ${referralForm.user?.addressInformation?.postCode || ''}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals & Aspirations */}
      {referralForm.goals && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goals & Aspirations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              label="Whanau/Person Goal"
              value={referralForm.goals?.whanauGoal}
            />
            <InfoRow
              label="Aspiration"
              value={referralForm.goals?.aspiration}
            />
            <InfoRow
              label="Biggest Barrier"
              value={referralForm.goals?.biggestBarrier}
            />
          </CardContent>
        </Card>
      )}

      {/* Communication Needs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Communication</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="First Language"
            value={referralForm.communication?.firstLanguage}
          />
          <InfoRow
            label="Interpreter Required"
            value={referralForm.communication?.interpreter ? 'Yes' : 'No'}
          />
          <InfoRow
            label="Cultural Support"
            value={referralForm.communication?.culturalSupport ? 'Yes' : 'No'}
          />
          <InfoRow
            label="Communication Needs"
            value={
              referralForm.communication?.communicationNeeds ? 'Yes' : 'No'
            }
          />
          {referralForm.communication?.communicationNeedsDetails && (
            <div className="sm:col-span-2">
              <InfoRow
                label="Communication Needs Details"
                value={referralForm.communication?.communicationNeedsDetails}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="Doctor Name"
            value={referralForm.medical?.doctorName}
          />
          <InfoRow
            label="Doctor Phone"
            value={referralForm.medical?.doctorPhone}
          />
          <InfoRow label="NHI Number" value={referralForm.medical?.nhiNumber} />
          <div className="sm:col-span-2">
            <InfoRow
              label="Doctor Address"
              value={`${referralForm.medical?.doctorAddress || ''}, ${referralForm.medical?.doctorSuburb || ''}, ${referralForm.medical?.doctorCity || ''}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Disability Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Disability Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow
            label="Disability Type"
            value={referralForm.disability?.disabilityType}
          />
          {referralForm.disability?.disabilityDetails && (
            <InfoRow
              label="Details"
              value={referralForm.disability?.disabilityDetails}
            />
          )}
          {referralForm.disability?.disabilitySupportDetails && (
            <InfoRow
              label="Support Details"
              value={referralForm.disability?.disabilitySupportDetails}
            />
          )}
          {referralForm.disability?.disabilityReasonForReferral && (
            <InfoRow
              label="Reason for Referral"
              value={referralForm.disability?.disabilityReasonForReferral}
            />
          )}
          {referralForm.disability?.disabilitySupportRequired && (
            <InfoRow
              label="Support Required"
              value={referralForm.disability?.disabilitySupportRequired}
            />
          )}
        </CardContent>
      </Card>

      {/* Referrer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referrer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="Name"
            value={`${referralForm.referrer?.firstName || ''} ${referralForm.referrer?.lastName || ''}`}
          />
          <InfoRow
            label="Relationship"
            value={referralForm.referrer?.relationship}
          />
          <InfoRow label="Phone" value={referralForm.referrer?.phone} />
          <InfoRow label="Email" value={referralForm.referrer?.email} />
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoRow
            label="Name"
            value={`${referralForm.emergencyContact?.firstName || ''} ${referralForm.emergencyContact?.lastName || ''}`}
          />
          <InfoRow
            label="Relationship"
            value={referralForm.emergencyContact?.relationship}
          />
          <InfoRow label="Phone" value={referralForm.emergencyContact?.phone} />
          <InfoRow label="Email" value={referralForm.emergencyContact?.email} />
        </CardContent>
      </Card>

      {/* Additional Information */}
      {referralForm.additionalInformation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              label="Safety Information"
              value={referralForm.additionalInformation?.safety}
            />
            {referralForm.additionalInformation?.otherImportantInformation && (
              <InfoRow
                label="Other Important Information"
                value={
                  referralForm.additionalInformation?.otherImportantInformation
                }
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {referralForm.notes && referralForm.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Notes ({referralForm.notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {referralForm.notes.map((note: any, index: number) => (
              <div key={note.id} className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {note.content}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(note.createdAt).toLocaleDateString('en-NZ', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {index < referralForm.notes.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Consent Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {referralForm.consent?.provideInformationConsent ? '✓' : '✗'}
            </span>
            <span className="text-sm">Provide Information Consent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {referralForm.consent?.provideSharedInformationConsent
                ? '✓'
                : '✗'}
            </span>
            <span className="text-sm">Share Information Consent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {referralForm.consent?.provideContactConsent ? '✓' : '✗'}
            </span>
            <span className="text-sm">Contact Consent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {referralForm.consent?.provideStatisticalConsent ? '✓' : '✗'}
            </span>
            <span className="text-sm">Statistical Information Consent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {referralForm.consent?.provideCorrectInformation ? '✓' : '✗'}
            </span>
            <span className="text-sm">Correct Information Provided</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
