import * as api from "@/app/api/get/getApi";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

interface UseIdCheckProps {
  id: string;
  minLength?: number;
  debounceMs?: number;
}

interface UseIdCheckReturn {
  isAvailable: boolean;
  message: string;
  isChecking: boolean;
}

export const useIdCheck = ({ id, minLength = 4, debounceMs = 1000 }: UseIdCheckProps): UseIdCheckReturn => {
  const [debouncedId] = useDebouncedValue(id, debounceMs);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["duplicateId", debouncedId],
    queryFn: () => api.checkDuplicateID({ loginId: debouncedId }),
    enabled: debouncedId?.length >= minLength, // minLength 이상일 때만 쿼리 실행
    retry: false, // 에러 시 재시도하지 않음
  });

  const getMessage = (): string => {
    if (!debouncedId) return "";
    if (debouncedId.length < minLength) return `ID는 최소 ${minLength}자 이상이어야 합니다`;
    if (isError) return "중복된 ID입니다. 다른 ID를 입력해 주세요.";
    if (isSuccess) return data?.data.statusCode === 200 ? "사용 가능한 ID입니다" : "이미 사용중인 ID입니다";
    return "";
  };

  const getIsAvailable = (): boolean => {
    if (!debouncedId || debouncedId.length < minLength) return false;
    if (isError) return false;
    if (isSuccess) return data?.data.statusCode ? true : false;
    return false;
  };

  return {
    isAvailable: getIsAvailable(),
    message: getMessage(),
    isChecking: isLoading,
  };
};
