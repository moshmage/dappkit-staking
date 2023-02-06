import Header from "@/component/ui/header";
import {ThemeProvider} from "react-bootstrap";
import WrongChain from "@/component/ui/modals/warnings/wrong-chain";

export default function Outer({children}: {children: React.ReactNode}) {
  return <ThemeProvider breakpoints={['lg', 'md', 'sm', 'xs']} minBreakpoint="xs">
    <Header />
    <WrongChain/>
    {children}
  </ThemeProvider>
}