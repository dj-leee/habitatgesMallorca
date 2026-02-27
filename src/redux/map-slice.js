import { createSlice } from '@reduxjs/toolkit'

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    pinElement: {
      name: null,
      latitude: null,
      longitude: null
    },
    pinElements: []
  },
  reducers: {
    setPinElement: (state, action) => {
        state.pinElement = action.payload
    },
    setPinElements: (state, action) => {
        state.pinElements = action.payload
    },
  }
})

export const {
  setPinElement,
  setPinElements
} = mapSlice.actions

export default mapSlice.reducer