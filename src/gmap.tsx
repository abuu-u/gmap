import {
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { debounce } from "./lib/utils";
import {
  fetchCenter,
  Location,
  selectCenter,
  selectDestination,
  selectMode,
  selectOrigin,
  setDestination,
  setOrigin,
} from "./map-slice";
import { useAppDispatch, useAppSelector } from "./store";

interface Properties {
  onClose: () => void;
}

const DEFAULT_ZOOM = 12;

const Gmap: FC<Properties> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const center = useAppSelector(selectCenter);
  const origin = useAppSelector(selectOrigin);
  const destination = useAppSelector(selectDestination);
  const mode = useAppSelector(selectMode);
  const prevMode = useRef(mode);

  const mapCenter = useRef<Location>();

  const map = useMap();

  const delayedHandleMapCenterChanged = useMemo(
    () =>
      debounce((event: MapCameraChangedEvent) => {
        mapCenter.current = event.detail.center;

        if (mode === "origin") {
          dispatch(setOrigin(mapCenter.current));

          return;
        }

        if (mode === "destination") {
          dispatch(setDestination(mapCenter.current));

          return;
        }
      }, 300),
    [dispatch, mode]
  );

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (mode !== prevMode.current) prevMode.current = mode;
  }, [mode]);

  useEffect(() => {
    if (mode === "origin") {
      if (origin) map?.setCenter(origin);
    }

    if (mode === "destination") {
      if (destination) map?.setCenter(destination);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, mode]);

  useEffect(() => {
    if (!center) dispatch(fetchCenter());
  }, [center, dispatch]);

  return (
    <main className="w-screen h-screen relative grid place-items-center">
      {center ? (
        <>
          <div className="absolute z-10 top-4 left-4 right-4">
            <Input placeholder="Search" />
          </div>

          <svg
            className="absolute z-10 -translate-y-1/2 w-9"
            viewBox="0 0 24 24"
          >
            <path
              fill="#292D32"
              d="M20.6 8.4c-1-4.6-5-6.7-8.6-6.7a8.6 8.6 0 0 0-8.6 6.7c-1.2 5.2 2 9.6 4.8 12.3a5.4 5.4 0 0 0 7.6 0c2.8-2.7 6-7 4.8-12.3Zm-8.6 5a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.3Z"
            ></path>
          </svg>

          <Map
            className="w-full h-full"
            defaultCenter={center}
            defaultZoom={DEFAULT_ZOOM}
            mapId={"DEMO_MAP_ID"}
            onCenterChanged={delayedHandleMapCenterChanged}
            reuseMaps
            disableDefaultUI
          >
            {mode !== "origin" && origin && (
              <AdvancedMarker position={origin} />
            )}

            {mode !== "destination" && destination && (
              <AdvancedMarker position={destination} />
            )}

            <Directions origin={origin} destination={destination} />
          </Map>

          <div className="grid z-10 gap-2 absolute bottom-4 left-4 right-4">
            <p></p>

            <Button type="button" onClick={handleClose}>
              Select
            </Button>
          </div>
        </>
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </main>
  );
};

const Directions: FC<{
  origin: Location | undefined;
  destination: Location | undefined;
}> = ({ destination, origin }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true,
        preserveViewport: true,
      })
    );
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !destination || !origin)
      return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });

    // return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, destination, origin]);

  return <div className="directions"></div>;
};

export default Gmap;
