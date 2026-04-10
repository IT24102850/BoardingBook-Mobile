import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Roommate {
  id: string;
  name: string;
  age: number;
  interests: string[];
}

interface RoommateState {
  roommates: Roommate[];
  loading: boolean;
  error: string | null;
}

const initialState: RoommateState = {
  roommates: [],
  loading: false,
  error: null,
};

const roommateSlice = createSlice({
  name: 'roommate',
  initialState,
  reducers: {
    fetchRoommatesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRoommatesSuccess(state, action: PayloadAction<Roommate[]>) {
      state.loading = false;
      state.roommates = action.payload;
    },
    fetchRoommatesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addRoommate(state, action: PayloadAction<Roommate>) {
      state.roommates.push(action.payload);
    },
    removeRoommate(state, action: PayloadAction<string>) {
      state.roommates = state.roommates.filter(roommate => roommate.id !== action.payload);
    },
  },
});

export const {
  fetchRoommatesStart,
  fetchRoommatesSuccess,
  fetchRoommatesFailure,
  addRoommate,
  removeRoommate,
} = roommateSlice.actions;

export default roommateSlice.reducer;