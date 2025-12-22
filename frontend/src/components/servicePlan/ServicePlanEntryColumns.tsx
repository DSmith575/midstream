import type { ColumnDef } from '@tanstack/react-table'

export const ServicePlanEntryColumns: Array<ColumnDef<any>> = [
  {
    accessorKey: 'serviceCategory.serviceName',
    header: 'Service Category',
  },
  {
    accessorFn: (row) => (row.allocatedMinutes / 60).toFixed(1),
    header: 'Hours',
  },
  {
    accessorFn: (row) =>
      row.serviceCategory.flexibleHours ? 'Flexible' : 'Fixed',
    header: 'Fixed/Flexible',
  },
  {
    accessorFn: (row) => row.comments.length,
    header: 'Comments',
  },
]
