import internalApiSlice from './internalApiSlice';

export const vehicules = internalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicules: builder.query({
      query: () => {
        return {
          url: '/vehicules',
          method: 'get',
        };
      },
    }),
  }),
});

export const { useGetVehiculesQuery } = vehicules;
