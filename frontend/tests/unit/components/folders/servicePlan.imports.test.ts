import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/servicePlan/**/*.{ts,tsx}')

runImportSmokeSuite('components/servicePlan import smoke', modules)
