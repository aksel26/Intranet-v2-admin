import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, UserOption } from "../type/staff";
// import type { User, UserOption } from '@/types/user'

interface UserState {
  // 원본 사용자 데이터
  users: User[];

  // 변환된 옵션 데이터 (label: userName, value: userIdx)
  userOptions: UserOption[];

  // 로딩 상태
  isLoading: boolean;

  // 액션들
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  getUserByIdx: (userIdx: number) => User | undefined;
  getUserNameByIdx: (userIdx: number) => string;
  clearUsers: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      users: [],
      userOptions: [],
      isLoading: false,

      setUsers: (users) => {
        // 사용자 데이터를 설정하고 동시에 옵션 형태로 변환
        const userOptions = users.map((user) => ({
          label: user.userName,
          value: user.userIdx.toString(),
        }));

        set({
          users,
          userOptions,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      getUserByIdx: (userIdx) => {
        const { users } = get();
        return users.find((user) => user.userIdx === userIdx);
      },

      getUserNameByIdx: (userIdx) => {
        const { users } = get();
        const user = users.find((user) => user.userIdx === userIdx);
        return user?.userName || "";
      },

      clearUsers: () =>
        set({
          users: [],
          userOptions: [],
          isLoading: false,
        }),
    }),
    {
      name: "user-store",
    }
  )
);
