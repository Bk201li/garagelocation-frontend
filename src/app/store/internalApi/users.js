import internalApiSlice from './internalApiSlice';

export const users = internalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => {
        return {
          url: '/accounts/login',
          method: 'post',
          body,
        };
      },
    }),
  }),
});

export const { useLoginUserMutation } = users;
