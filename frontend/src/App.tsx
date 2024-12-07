import {NextUIProvider} from '@nextui-org/react';
import Router from '@/lib/routes/Router';

const App = () => {
  return (
    <>
    <NextUIProvider>
      <Router/>
    </NextUIProvider>
    </>
  )
}

export default App
