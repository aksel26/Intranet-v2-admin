import { useQuery } from "@tanstack/react-query";
// import { useUserStore } from '@/store/useUserStore'
import { useEffect, useState } from "react";
// import type { User } from '@/types/user'
import { getStaffs } from "../api/get/getApi";
import { useUserStore } from "../store/useStaffs";

// API 함수

export const useUsers = () => {
  const { setUsers, setLoading } = useUserStore();

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
    perPage: 50,
    userAvail: "Y",
  });

  const query = useQuery({ queryKey: ["staffs", searchParam], queryFn: () => getStaffs(searchParam) });

  // React Query 상태를 Zustand에 동기화
  useEffect(() => {
    setLoading(query.isLoading);

    if (query.data) {
      setUsers(query.data?.data.data.users);
    }
  }, [query.data, query.isLoading, setUsers, setLoading]);

  return query;
};
