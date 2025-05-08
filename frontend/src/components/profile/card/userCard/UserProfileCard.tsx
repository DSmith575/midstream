import type { UserProfileProps } from '@/lib/interfaces'
import PersonalInformation from '@/components/profile/card/userCard/UserProfilePersonal'
import AddressInformation from '@/components/profile/card/userCard/UserProfileAddress'
import ContactInformation from '@/components/profile/card/userCard/UserProfileContact'
import CaseStatSection from '@/components/card/caseStat/CaseStat'
import { Button } from '@/components/ui/button'
import { UserCog } from 'lucide-react'
import { roleConstants } from '@/lib/constants'

interface CardProps {
  userProfile?: UserProfileProps
}

const UserProfileCard = ({ userProfile }: CardProps) => {
  if (
    !userProfile?.personalInformation ||
    !userProfile?.addressInformation ||
    !userProfile?.contactInformation
  ) {
    return null
  }
  const {
    personalInformation,
    addressInformation,
    contactInformation,
    casesCompleted,
    casesAssigned,
    role,
    company
  } = userProfile

  return (
    <main className="w-full min-h-[300px] col-span-1 max-h-[300px] rounded-2xl bg-white shadow-lg  mx-auto p-6 sm:p-8 space-y-6 relative">
      {/* Cog Button */}
      <section className="absolute right-4 top-4 z-10">
        <Button
          size="icon"
          variant="outline"
          className="hover:bg-blue-500 hover:text-white text-blue-600"
        >
          <UserCog className="w-6 h-6" />
        </Button>
      </section>

      {/* Personal Info */}
      <section className="flex flex-col items-center">
        <PersonalInformation personalInfo={personalInformation} />
      </section>

      <hr className="border-gray-200" />

      {/* Address Info */}
      <section className="flex flex-col items-center">
        <AddressInformation addressInfo={addressInformation} />
      </section>

      <hr className="border-gray-200" />

      {/* Contact Info */}
      <section className="flex flex-col items-center">
        <ContactInformation contactInfo={contactInformation} />
      </section>
      <section className="absolute left-4 top-4 z-10">
        <p>{role}</p>
        <p>{company && company.name}</p>
      </section>

      {/* Cases Summary */}
      {role === roleConstants.worker && (
        <section className="flex flex-col items-center">
          <CaseStatSection
            casesCompleted={casesCompleted}
            casesAssigned={casesAssigned}
          />
        </section>
      )}
    </main>
  )
}

export default UserProfileCard
