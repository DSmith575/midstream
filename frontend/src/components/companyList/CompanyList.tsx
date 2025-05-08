import type { CompanyProps } from '@/lib/interfaces'
import { useEffect, useState } from 'react'
import CompanyCard from '@/components/companyList/CompanyCard'

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
            {companies
              .filter((company) => company.city === userCity) // Filter first
              .map(
                (
                  company, // Then map over the filtered results
                ) => (
                    <div key={company.id} className={'mt-2 mx-auto'}>
                      {/* <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" onClick={() => joinCompanyHandler(company.id, userId)}>Join</button> */}
                      <>
                      <CompanyCard company={company} userId={userId} />
                      </>
                    </div>
                ),
              )}
          </div>
      )}
    </div>
  )
}

export default CompanyList
