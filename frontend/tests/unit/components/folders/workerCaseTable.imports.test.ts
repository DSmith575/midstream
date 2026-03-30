import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/workerCaseTable/**/*.{ts,tsx}')

runImportSmokeSuite('components/workerCaseTable import smoke', modules)
