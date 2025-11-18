import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { DataProvider } from "@/context/DataContext";

export default function App({ Component, pageProps }) {
  return <Provider>
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  </Provider>
}
