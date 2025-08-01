import { CompanyCard } from '@/components/companyList/CompanyCard'
import { useGetCompanyList } from '@/hooks/company/useGetCompanyList'

export const CompanyList = ({
  userId,
  userCity,
}: {
  userId: string
  userCity: string
}) => {
  const { companyList: companies, error, isError } = useGetCompanyList(userId)

  return (
    <div>
      {isError && (
        <div className="text-red-500 text-center mt-4">
          <p>{error.message}</p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      )}
      {companies && (
        <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Companies filtered by users city */}
          {companies
            .filter((company) => company.city === userCity)
            .map((company) => (
              <div key={company.id} className={'mt-2 mx-auto'}>
                <CompanyCard company={company} userId={userId} />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
