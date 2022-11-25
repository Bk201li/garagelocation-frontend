import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const internalApiSlice = createApi({
  reducerPath: 'internalApiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/v1/' }),
  tagTypes: ['Vehicules'],
  endpoints: () => ({}),
});

export default internalApiSlice;
