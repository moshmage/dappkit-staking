import GlobalEffects from "@/component/layouts/global-effects";
import '@/styles/global.scss';
export default function App({Component, pageProps}: any) {
  return <div className="bg-opacity-50 bg-light min-vh-100">
    <GlobalEffects>
      <Component {...pageProps}></Component>
    </GlobalEffects>
  </div>
}
