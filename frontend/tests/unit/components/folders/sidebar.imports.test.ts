import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/sidebar/**/*.{ts,tsx}')

runImportSmokeSuite('components/sidebar import smoke', modules)
