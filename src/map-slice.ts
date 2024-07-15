import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Location {
  lat: number;
  lng: number;
}

export interface MapState {
  center?: Location;
  origin?: Location;
  destination?: Location;
  mode?: "origin" | "destination";
}

const initialState: MapState = {};

export const fetchCenter = createAsyncThunk("map/fetchCenter", async () => {
  const response = await fetch(
    "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAMt8kpa9iiLodRndhQOtbCcwUc0wyTZIA",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch center");
  }

  const json = (await response.json()) as {
    location: {
      lat: number;
      lng: number;
    };
    accuracy: number;
  };

  return json.location;
});

export const mapSlice = createSlice({
  name: "map",
  initialState,

  reducers: {
    setCenter(state, action: PayloadAction<MapState["center"]>) {
      state.center = action.payload;
    },
    setOrigin(state, action: PayloadAction<MapState["origin"]>) {
      state.origin = action.payload;
    },
    setDestination(state, action: PayloadAction<MapState["destination"]>) {
      state.destination = action.payload;
    },
    setMode(state, action: PayloadAction<MapState["mode"]>) {
      state.mode = action.payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchCenter.fulfilled, (state, action) => {
      state.center = action.payload;
    });
  },
});

export const { setCenter, setDestination, setOrigin, setMode } =
  mapSlice.actions;

export const selectCenter = (state: RootState) => state.map.center;
export const selectOrigin = (state: RootState) => state.map.origin;
export const selectDestination = (state: RootState) => state.map.destination;
export const selectMode = (state: RootState) => state.map.mode;

const mapReducer = mapSlice.reducer;

export default mapReducer;
