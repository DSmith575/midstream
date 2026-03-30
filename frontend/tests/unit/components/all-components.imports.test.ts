import { runImportSmokeSuite } from '../smoke/runImportSmokeSuite'

const componentModules = import.meta.glob('/src/components/**/*.{ts,tsx}')

runImportSmokeSuite('all components import smoke', componentModules)
