import { useState } from "react";
import { Button } from "./components/ui/button";
import Gmap from "./gmap";
import { cn } from "./lib/utils";
import { setMode } from "./map-slice";
import { useAppDispatch } from "./store";

function App() {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const openMap = () => {
    setOpen(true);
  };

  const handleSetOriginClick = () => {
    openMap();
    dispatch(setMode("origin"));
  };

  const handleSetDestinationClick = () => {
    openMap();
    dispatch(setMode("destination"));
  };

  const handleMapClose = () => {
    setOpen(false);
    dispatch(setMode(undefined));
  };

  return (
    <div className="container grid gap-5 py-20">
      <Button onClick={handleSetOriginClick}>Set origin</Button>
      <Button onClick={handleSetDestinationClick}>Set destination</Button>

      <div className={cn("fixed top-0 left-0", !open && "h-0 overflow-hidden")}>
        <Gmap onClose={handleMapClose} />
      </div>
    </div>
  );
}

export default App;
