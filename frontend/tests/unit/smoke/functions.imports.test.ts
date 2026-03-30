import { runImportSmokeSuite } from './runImportSmokeSuite'

const functionModules = import.meta.glob('/src/lib/functions/**/*.{ts,tsx}')

runImportSmokeSuite('lib/functions import smoke', functionModules)
