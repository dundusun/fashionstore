import HomePage from "./HomePage";
import aemData from "./data/aemData.json"; // ← static file!

function App() {
  return (
    <div>
      <HomePage data={aemData} />
    </div>
  );
}

export default App;