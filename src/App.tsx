import SearchBox from "./components/Searchbox/index";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="page">
        <h2>NPM Package Comparator</h2>
        <SearchBox />
      </div>
    </QueryClientProvider>
  );
}

export default App;
