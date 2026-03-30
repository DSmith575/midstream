import { runImportSmokeSuite } from './runImportSmokeSuite'

const apiModules = import.meta.glob('/src/lib/api/**/*.{ts,tsx}')

runImportSmokeSuite('lib/api import smoke', apiModules)
