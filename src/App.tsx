import { Toaster } from "react-hot-toast";
import Router from "./router";
import { AppProvider } from "@/providers/app-provider";
import { globalStyles } from "@/theme/global";

globalStyles();

function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: { fontSize: "14px", maxWidth: "360px", borderRadius: "12px" },
        }}
      />
      <Router />
    </AppProvider>
  );
}

export default App;
