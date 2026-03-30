import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/*.{ts,tsx}')

runImportSmokeSuite('components root files import smoke', modules)
