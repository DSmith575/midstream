import { runImportSmokeSuite } from './runImportSmokeSuite'

const hookModules = import.meta.glob('/src/hooks/**/*.{ts,tsx}')

runImportSmokeSuite('hooks import smoke', hookModules)
