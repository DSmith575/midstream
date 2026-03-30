import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/card/**/*.{ts,tsx}')

runImportSmokeSuite('components/card import smoke', modules)
