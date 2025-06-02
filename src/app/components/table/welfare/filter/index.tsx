import { ConfirmYN } from "@/app/enums/confirmYN";
import { useUserStore } from "@/app/store/useStaffs";
import { Group, Pill, Stack, Text } from "@mantine/core";
import { memo, useCallback, useMemo } from "react";

// 필터링할 키 목록을 상수로 정의
const EXCLUDED_KEYS = new Set(["pageNo", "perPage", "sDate", "eDate"]);

// 필터 라벨 매핑
const FILTER_LABELS: Record<string, string> = {
  confirmYN: "승인상태",
  userIdxs: "성명",
  payerIdxs: "결제자",
  content: "사용처",
};

interface FilterProps {
  params: Record<string, any>;
  setParams: React.Dispatch<React.SetStateAction<any>>;
}

const Filter = memo(({ params, setParams }: FilterProps) => {
  const { userOptions } = useUserStore();

  // userOptions를 Map으로 변환하여 검색 성능 향상
  const userOptionsMap = useMemo(() => {
    return new Map(userOptions.map((user) => [user.value, user.label]));
  }, [userOptions]);

  // 이름 변환 함수 최적화
  const nameConvert = useCallback(
    (idxs: string) => {
      const targets = idxs.split(",");
      return targets
        .map((target) => userOptionsMap.get(target))
        .filter(Boolean)
        .join(", ");
    },
    [userOptionsMap]
  );

  // 키 변환 함수 최적화
  const keyConvert = useCallback(
    (key: string, value: unknown): string => {
      switch (key) {
        case "confirmYN":
          return typeof value === "string" ? ConfirmYN[value as keyof typeof ConfirmYN] ?? value : String(value ?? "");
        case "userIdxs":
        case "payerIdxs":
          return typeof value === "string" ? nameConvert(value) : "";
        default:
          return String(value ?? "");
      }
    },
    [nameConvert]
  );

  // 비활성화 함수 최적화
  const inactive = useCallback(
    (key: string) => {
      setParams((prev: any) => ({ ...prev, [key]: null }));
    },
    [setParams]
  );

  // 렌더링할 필터 항목들 사전 계산
  const filterItems = useMemo(() => {
    const asdf = Object.entries(params)
      .filter(([key, value]) => !EXCLUDED_KEYS.has(key) && value != null)
      .map(([key, value]) => ({
        key,
        value,
        label: FILTER_LABELS[key] || key,
        displayValue: keyConvert(key, value),
      }));
    console.log(asdf);
    return asdf;
  }, [params, keyConvert]);

  // 필터 항목이 없으면 null 반환
  if (filterItems.length === 0) {
    return null;
  }

  return (
    <Group mb="md">
      {filterItems.map(({ key, value, label, displayValue }) => (
        <Stack gap={1} key={`${key}-${value}`}>
          <Text fz="xs" c="gray">
            {label}
          </Text>
          <Pill withRemoveButton onRemove={() => inactive(key)}>
            {displayValue}
          </Pill>
        </Stack>
      ))}
    </Group>
  );
});

Filter.displayName = "Filter";

export default Filter;
