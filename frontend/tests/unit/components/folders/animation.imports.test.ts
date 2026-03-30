import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/animation/**/*.{ts,tsx}')

runImportSmokeSuite('components/animation import smoke', modules)
