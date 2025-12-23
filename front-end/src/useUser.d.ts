import { User } from 'firebase/auth';

declare const useUser: () => {
  user: User | null;
  isLoading: boolean;
};

export default useUser;