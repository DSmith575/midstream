type CaseStatProps = {
  label: string
  value: number | string | undefined
}

const CaseStat = ({ label, value }: CaseStatProps) => (
  <div className="flex flex-col items-center">
    <h2 className="text-xl font-bold text-muted-foreground">
      {value ?? '—'}
    </h2>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const CaseStatSection = ({
  casesCompleted,
  casesAssigned,
}: {
  casesCompleted?: number
  casesAssigned?: number
}) => {
  return (
    <section className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-6 w-full max-w-xs justify-items-center">
        <CaseStat label="Cases Completed" value={casesCompleted} />
        <CaseStat label="Cases Assigned" value={casesAssigned} />
      </div>
    </section>
  )
};

export default CaseStatSection;
