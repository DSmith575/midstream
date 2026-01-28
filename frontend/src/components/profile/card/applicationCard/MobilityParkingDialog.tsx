import { useState } from 'react'
import { Car } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MobilityParkingDialogProps {
  referralForm: any
  disabled?: boolean
}

export const MobilityParkingDialog = ({
  referralForm,
  disabled,
}: MobilityParkingDialogProps) => {
  const [open, setOpen] = useState(false)

  // Pre-fill data from referral form
  const personalInfo = referralForm?.user?.personalInformation
  const contactInfo = referralForm?.user?.contactInformation
  const addressInfo = referralForm?.user?.addressInformation
  const disabilityInfo = referralForm?.disability

  // Extract mobility-related information from documents and notes
  const extractMobilityInfo = () => {
    const mobilityDetails: string[] = []
    
    // Add disability details if available
    if (disabilityInfo?.disabilityDetails) {
      mobilityDetails.push(disabilityInfo.disabilityDetails)
    }

    // Add transcribed content from documents
    if (referralForm?.documents && referralForm.documents.length > 0) {
      referralForm.documents.forEach((doc: any) => {
        if (doc.transcribedContent) {
          mobilityDetails.push(doc.transcribedContent)
        }
      })
    }

    // Add relevant notes
    if (referralForm?.notes && referralForm.notes.length > 0) {
      referralForm.notes.forEach((note: any) => {
        if (note.content) {
          mobilityDetails.push(note.content)
        }
      })
    }

    return mobilityDetails.join('\n\n')
  }

  const [formData, setFormData] = useState({
    // Applicant Details
    firstName: personalInfo?.firstName || '',
    lastName: personalInfo?.lastName || '',
    dateOfBirth: personalInfo?.dateOfBirth || '',
    email: contactInfo?.email || '',
    phone: contactInfo?.phone || '',
    address: addressInfo?.address || '',
    suburb: addressInfo?.suburb || '',
    city: addressInfo?.city || '',
    postCode: addressInfo?.postCode || '',
    
    // Medical Condition
    medicalCondition: disabilityInfo?.disabilityType || '',
    mobilityImpairmentDetails: extractMobilityInfo(),
    permanentDisability: 'Yes',
    temporaryDuration: '',
    
    // Mobility Aids
    usesWheelchair: '',
    usesWalker: '',
    usesCrutches: '',
    usesOtherAid: '',
    otherAidDetails: '',
    
    // Walking Ability
    walkingDistance: '',
    requiresAssistance: '',
    
    // Medical Practitioner
    practitionerName: referralForm?.medical?.doctorName || '',
    practitionerAddress: referralForm?.medical?.doctorAddress || '',
    practitionerPhone: referralForm?.medical?.doctorPhone || '',
    practitionerRegistration: '',
    
    // Vehicle Information
    vehicleRegistration: '',
    vehicleMake: '',
    vehicleModel: '',
    
    // Declaration
    applicantSignature: '',
    applicationDate: new Date().toISOString().split('T')[0],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    console.log('Mobility Parking Form Data:', formData)
    // TODO: Implement PDF generation or API submission
    alert('Mobility parking form submitted! (Implementation pending)')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          size="sm"
          variant="outline"
          className="border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950"
        >
          <Car className="h-4 w-4" />
          Mobility Parking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mobility Parking Permit Application</DialogTitle>
          <DialogDescription>
            Complete the form below to apply for a mobility parking permit. Some
            fields have been pre-filled from the referral form.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Applicant Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Applicant Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={
                    formData.dateOfBirth
                      ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Residential Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb</Label>
                <Input
                  id="suburb"
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postCode">Post Code *</Label>
                <Input
                  id="postCode"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Condition */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Medical Condition
            </h3>
            <div className="space-y-2">
              <Label htmlFor="medicalCondition">Medical Condition / Disability *</Label>
              <Input
                id="medicalCondition"
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobilityImpairmentDetails">
                Details of Mobility Impairment *
              </Label>
              <Textarea
                id="mobilityImpairmentDetails"
                name="mobilityImpairmentDetails"
                value={formData.mobilityImpairmentDetails}
                onChange={handleChange}
                placeholder="Describe how your condition affects your mobility..."
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permanentDisability">Is this disability permanent? *</Label>
                <Select
                  value={formData.permanentDisability}
                  onValueChange={(value) =>
                    handleSelectChange('permanentDisability', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No (Temporary)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.permanentDisability === 'No' && (
                <div className="space-y-2">
                  <Label htmlFor="temporaryDuration">Expected Duration</Label>
                  <Input
                    id="temporaryDuration"
                    name="temporaryDuration"
                    value={formData.temporaryDuration}
                    onChange={handleChange}
                    placeholder="e.g., 6 months"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobility Aids */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Mobility Aids Used
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usesWheelchair">Do you use a wheelchair?</Label>
                <Select
                  value={formData.usesWheelchair}
                  onValueChange={(value) => handleSelectChange('usesWheelchair', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usesWalker">Do you use a walker/frame?</Label>
                <Select
                  value={formData.usesWalker}
                  onValueChange={(value) => handleSelectChange('usesWalker', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usesCrutches">Do you use crutches/canes?</Label>
                <Select
                  value={formData.usesCrutches}
                  onValueChange={(value) => handleSelectChange('usesCrutches', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usesOtherAid">Other mobility aid?</Label>
                <Select
                  value={formData.usesOtherAid}
                  onValueChange={(value) => handleSelectChange('usesOtherAid', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.usesOtherAid === 'Yes' && (
              <div className="space-y-2">
                <Label htmlFor="otherAidDetails">Please specify other aid</Label>
                <Input
                  id="otherAidDetails"
                  name="otherAidDetails"
                  value={formData.otherAidDetails}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Walking Ability */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Walking Ability
            </h3>
            <div className="space-y-2">
              <Label htmlFor="walkingDistance">
                Maximum distance you can walk without severe discomfort *
              </Label>
              <Select
                value={formData.walkingDistance}
                onValueChange={(value) => handleSelectChange('walkingDistance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-50m">Less than 50 meters</SelectItem>
                  <SelectItem value="50-100m">50-100 meters</SelectItem>
                  <SelectItem value="100-200m">100-200 meters</SelectItem>
                  <SelectItem value="more-than-200m">More than 200 meters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiresAssistance">
                Do you require physical assistance when walking?
              </Label>
              <Select
                value={formData.requiresAssistance}
                onValueChange={(value) => handleSelectChange('requiresAssistance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Always">Always</SelectItem>
                  <SelectItem value="Sometimes">Sometimes</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Medical Practitioner Certification */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Medical Practitioner Certification
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="practitionerName">Practitioner Name *</Label>
                <Input
                  id="practitionerName"
                  name="practitionerName"
                  value={formData.practitionerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practitionerPhone">Practitioner Phone *</Label>
                <Input
                  id="practitionerPhone"
                  name="practitionerPhone"
                  value={formData.practitionerPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="practitionerAddress">Practice Address *</Label>
              <Input
                id="practitionerAddress"
                name="practitionerAddress"
                value={formData.practitionerAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="practitionerRegistration">
                Medical Registration Number *
              </Label>
              <Input
                id="practitionerRegistration"
                name="practitionerRegistration"
                value={formData.practitionerRegistration}
                onChange={handleChange}
                placeholder="Medical Council Registration Number"
                required
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Vehicle Details
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleRegistration">Registration Number *</Label>
                <Input
                  id="vehicleRegistration"
                  name="vehicleRegistration"
                  value={formData.vehicleRegistration}
                  onChange={handleChange}
                  placeholder="ABC123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleMake">Make</Label>
                <Input
                  id="vehicleMake"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                  placeholder="e.g., Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g., Corolla"
                />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Declaration
            </h3>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                I declare that the information provided in this application is true and
                correct. I understand that providing false or misleading information is an
                offense and may result in penalties. I consent to the verification of the
                information provided with my medical practitioner.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicantSignature">Full Name (as signature) *</Label>
                <Input
                  id="applicantSignature"
                  name="applicantSignature"
                  value={formData.applicantSignature}
                  onChange={handleChange}
                  placeholder="Type your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationDate">Date *</Label>
                <Input
                  id="applicationDate"
                  name="applicationDate"
                  type="date"
                  value={formData.applicationDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700">
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
