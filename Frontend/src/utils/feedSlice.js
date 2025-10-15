import { createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
  name: 'feed',
  initialState: null, // null means not loaded yet
  reducers: {
    addFeed: (state, action) => {
      return action.payload // Replace entire feed with fresh data
    },
    removeFeed: (state, action) => {
      if (!state) return state
      return state.filter(user => user._id !== action.payload)
    }
  }
})

export const { addFeed, removeFeed } = feedSlice.actions
export default feedSlice.reducer