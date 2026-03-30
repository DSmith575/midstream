import { runImportSmokeSuite } from './runImportSmokeSuite'

const componentModules = import.meta.glob('/src/components/**/*.{ts,tsx}')

runImportSmokeSuite('components import smoke', componentModules)
