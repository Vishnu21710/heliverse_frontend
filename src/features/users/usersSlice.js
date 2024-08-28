import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page, searchQuery, selectedDomains, selectedGenders, selectedAvailability }) => {
      try {
        const params = new URLSearchParams();
  
        if (page) params.append('page', page);
        if (searchQuery) params.append('name', searchQuery);
        if (selectedDomains?.length > 0) params.append('domain', selectedDomains.join(','));
        if (selectedGenders?.length > 0) params.append('gender', selectedGenders.join(','));
        if (selectedAvailability !== null) params.append('available', selectedAvailability);
  
        const response = await axios.get(`https://heliverse-backend-zo6o.onrender.com/api/users?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  );
  

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    filteredUsers: [],
    selectedTeam: [],
    status: 'idle',
    error: null,
    totalPages: 1,
    currentPage: 1,
  
  },
  reducers: {
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload
    },
    addToTeam: (state, action) => {
      state.selectedTeam.push(action.payload)
    },
    removeFromTeam: (state, action) => {
      state.selectedTeam = state.selectedTeam.filter(user => user.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.filteredUsers = action.payload.users; // This will now be the filtered data from the backend
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
  
})

export const { setFilteredUsers, addToTeam, removeFromTeam } = usersSlice.actions

export default usersSlice.reducer
