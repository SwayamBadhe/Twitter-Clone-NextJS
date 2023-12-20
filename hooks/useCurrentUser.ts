import useSWR from 'swr'; //decide if data needs to be revalidated or not

import fetcher from '@/libs/fetcher';

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);

  return { data, error, isLoading, mutate };
};

export default useCurrentUser;
