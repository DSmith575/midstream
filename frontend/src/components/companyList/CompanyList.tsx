import { CompanyCard } from '@/components/companyList/CompanyCard'
import { Spinner } from '@/components/spinner/Spinner'
import { useGetCompanyList } from '@/hooks/company/useGetCompanyList'
import { Building2 } from 'lucide-react'

export const CompanyList = ({
  userId,
  // userCity,
}: {
  userId: string
  // userCity: string
}) => {
  const { companyList: companies, error, isError, isLoading } = useGetCompanyList(userId)

  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-xl shadow-primary/10">
      <div className="flex items-start justify-between gap-4 border-b border-border/70 px-6 py-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Nearby Companies
          </p>
          <h2 className="text-xl font-semibold text-foreground">Find and join your provider</h2>
          <p className="text-sm text-muted-foreground">Browse available companies and request to join.</p>
        </div>
        <span className="hidden md:inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
          <Building2 className="h-6 w-6" />
        </span>
      </div>

      <div className="px-6 py-5">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card/80 p-8 text-center">
            <p className="text-destructive font-semibold">{error.message}</p>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </div>
        )}

        {companies && companies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies
              // .filter((company) => company.city === userCity)
              .map((company) => (
                <div key={company.id} className="">
                  <CompanyCard company={company} userId={userId} />
                </div>
              ))}
          </div>
        ) : (
          !isLoading && !isError && (
            <div className="rounded-xl border border-dashed border-border/70 bg-card/70 p-6 text-center text-sm text-muted-foreground">
              No companies available yet. Try adjusting filters or check back later.
            </div>
          )
        )}
      </div>
    </section>
  )
}
