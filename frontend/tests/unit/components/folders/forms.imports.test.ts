import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/forms/**/*.{ts,tsx}')

runImportSmokeSuite('components/forms import smoke', modules)
