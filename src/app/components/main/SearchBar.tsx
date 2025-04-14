import * as api from "@/app/api/get/getApi";
import { Combobox, Loader, TextInput, useCombobox } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import IconSearch from "/public/icons/search.svg";

function SearchBar() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState({ searchWord: "" });

  // 디바운스 처리
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue((prev) => ({ ...prev, searchWord: value }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // React Query로 데이터 요청

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["staffs", debouncedValue],
    queryFn: () => api.searchStaff(debouncedValue),
    enabled: debouncedValue.searchWord.length > 0,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });

  console.log("🚀 ~ SearchBar ~ data:", data);
  const loading = isLoading || isFetching;
  const empty = data?.data.data?.length === 0;

  const router = useRouter();

  const movePage = (index: number) => {
    router.push(`/main/attendance/vacation/${index}`);
  };

  const options = (data?.data.data || []).map((item: any) => (
    <Combobox.Option value={item.userName} key={item.userIdx} onClick={() => movePage(item.userIdx)}>
      {item.userName}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          styles={{ input: { background: "white", border: "1px solid var(--mantine-color-gray-4)" } }}
          maw={"30%"}
          placeholder="직원 성명을 입력하세요."
          radius={"xl"}
          rightSection={loading ? <Loader size={18} /> : <IconSearch size={18} />}
          variant="filled"
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.resetSelectedOption();
            if (event.currentTarget.value) {
              combobox.openDropdown();
            }
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            if (value) {
              combobox.openDropdown();
            }
          }}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={!data}>
        <Combobox.Options>
          {options}
          {empty && <Combobox.Empty>검색 결과가 없습니다</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default SearchBar;
