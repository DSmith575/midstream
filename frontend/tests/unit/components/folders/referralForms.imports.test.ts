import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/referralForms/**/*.{ts,tsx}')

runImportSmokeSuite('components/referralForms import smoke', modules)
