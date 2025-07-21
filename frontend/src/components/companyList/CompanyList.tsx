import type { CompanyProps } from '@/lib/interfaces'
import { useEffect, useState } from 'react'
import {CompanyCard} from '@/components/companyList/CompanyCard'

const apiKey = import.meta.env.VITE_API_BACKEND_URL

const CompanyList = ({ userId, userCity}: { userId: string, userCity: string }) => {
  const [companies, setCompanies] = useState<CompanyProps[]>([])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${apiKey}company/getCompanyList`) // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setCompanies(data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <div>
      {companies && (
        <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Companies filtered by users city */}
            {companies
              .filter((company) => company.city === userCity)
              .map(
                (
                  company,
                ) => (
                    <div key={company.id} className={'mt-2 mx-auto'}>
                      <CompanyCard company={company} userId={userId} />
                    </div>
                ),
              )}
          </div>
      )}
    </div>
  )
}

export { CompanyList };