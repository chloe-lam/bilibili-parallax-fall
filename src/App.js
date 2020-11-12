import "./App.css";
import FallBanner from "./fallBanner"
import fullview from "./assets/banner/fullview.png";
function App() {
  return (
    <div className="App">
      <FallBanner ></FallBanner>
      <div className="demo-background">
        <img src={fullview} alt="full-background" />
      </div>
    </div>
  );
}

export default App;
