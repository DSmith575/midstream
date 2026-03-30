import { runImportSmokeSuite } from '../../smoke/runImportSmokeSuite'

const modules = import.meta.glob('/src/components/companyList/**/*.{ts,tsx}')

runImportSmokeSuite('components/companyList import smoke', modules)
