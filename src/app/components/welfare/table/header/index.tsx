import { useUsers } from "@/app/hooks/useStaffs";
import { useUserStore } from "@/app/store/useStaffs";
import classes from "@/app/styles/SelectList.module.css";
import { Button, Checkbox, Combobox, Group, Popover, Radio, Stack, Table, Text, TextInput, useCombobox } from "@mantine/core";
import { IconCornerDownLeft, IconFilterSearch } from "@tabler/icons-react";
import { memo, useState } from "react";

interface UserOption {
  value: string;
  label: string;
}

// Memoized TableHeader component
export const WelfarePointTableHeader = memo(({ columns, setParams }: { value?: any; sort?: any; columns: string[]; setParams: any }) => {
  const { isError, error } = useUsers();
  const { userOptions, getUserNameByIdx, isLoading } = useUserStore();

  // 성명 필터용 상태와 combobox
  const nameCombobox = useCombobox();
  const [nameValue, setNameValue] = useState<UserOption[]>([]);
  const [nameSearch, setNameSearch] = useState("");
  const [nameOpened, setNameOpened] = useState(false);

  // 결제자 필터용 상태와 combobox
  const payerCombobox = useCombobox();
  const [payerValue, setPayerValue] = useState<UserOption[]>([]);
  const [payerSearch, setPayerSearch] = useState("");
  const [payerOpened, setPayerOpened] = useState(false);

  const [confirmStatus, setConfirmStatus] = useState<string>();

  const handleConfirm = (e: string) => {
    setConfirmStatus(e);
    setParams((prev: any) => ({ ...prev, confirmYN: e }));
  };

  const handleNameValueSelect = (val: string) => {
    const selectedOption = userOptions.find((option) => option.value === val);
    if (selectedOption) {
      setNameValue((current) => {
        const exists = current.some((item) => item.value === val);
        if (exists) {
          return current.filter((item) => item.value !== val);
        } else {
          return [...current, selectedOption];
        }
      });
    }
  };

  const handlePayerValueSelect = (val: string) => {
    const selectedOption = userOptions.find((option) => option.value === val);
    if (selectedOption) {
      setPayerValue((current) => {
        const exists = current.some((item) => item.value === val);
        if (exists) {
          return current.filter((item) => item.value !== val);
        } else {
          return [...current, selectedOption];
        }
      });
    }
  };

  const handleSearch = (column: string) => {
    if (column === "성명") {
      const values = nameValue.map((item) => item.value);
      setParams((prev: any) => ({ ...prev, userIdxs: String(values) }));
      setNameOpened(false);
      setNameValue([]);
    } else if (column === "결제자") {
      const values = payerValue.map((item) => item.value);
      setParams((prev: any) => ({ ...prev, payerIdxs: String(values) }));
      setPayerOpened(false);
      setPayerValue([]);
    }
  };

  const getOptions = (searchValue: string, selectedValues: UserOption[], combobox: any) => {
    return userOptions
      .filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase().trim()))
      .map((item) => (
        <Combobox.Option value={item.value} key={item.value} active={selectedValues.some((selected) => selected.value === item.value)} onMouseOver={() => combobox.resetSelectedOption()}>
          <Group gap="sm">
            <Checkbox size="xs" checked={selectedValues.some((selected) => selected.value === item.value)} onChange={() => {}} aria-hidden tabIndex={-1} style={{ pointerEvents: "none" }} />
            <Text fz={"xs"} component="span">
              {item.label}
            </Text>
          </Group>
        </Combobox.Option>
      ));
  };

  return (
    <Table.Thead>
      <Table.Tr fz={"xs"}>
        {columns.map((column: string, index: number) => {
          if (column === "성명") {
            return (
              <Table.Th fz={"xs"} key={index} py={8}>
                <Popover position="bottom-start" withArrow shadow="md" opened={nameOpened} onChange={setNameOpened}>
                  <Popover.Target>
                    <Group gap={"xs"} styles={{ root: { cursor: "pointer" } }} onClick={() => setNameOpened((o) => !o)}>
                      {column}
                      <IconFilterSearch size={15} color="gray" strokeWidth={1.2} />
                    </Group>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Combobox size="sm" store={nameCombobox} onOptionSubmit={handleNameValueSelect}>
                      <Combobox.EventsTarget>
                        <TextInput
                          size="xs"
                          placeholder="검색 인원을 선택하세요."
                          classNames={{ input: classes.input }}
                          value={nameSearch}
                          rightSection={<IconCornerDownLeft size={15} strokeWidth={1.2} />}
                          onChange={(event) => {
                            setNameSearch(event.currentTarget.value);
                            nameCombobox.updateSelectedOptionIndex();
                          }}
                        />
                      </Combobox.EventsTarget>

                      <div className={classes.list}>
                        <Combobox.Options>
                          {getOptions(nameSearch, nameValue, nameCombobox).length > 0 ? getOptions(nameSearch, nameValue, nameCombobox) : <Combobox.Empty>검색 결과가 없습니다.</Combobox.Empty>}
                        </Combobox.Options>
                      </div>
                    </Combobox>
                    <Button size="xs" fullWidth variant="light" onClick={() => handleSearch(column)}>
                      검색
                    </Button>
                  </Popover.Dropdown>
                </Popover>
              </Table.Th>
            );
          } else if (column === "결제자") {
            return (
              <Table.Th fz={"xs"} key={index} py={8}>
                <Popover position="bottom-start" withArrow shadow="md" opened={payerOpened} onChange={setPayerOpened}>
                  <Popover.Target>
                    <Group gap={"xs"} styles={{ root: { cursor: "pointer" } }} onClick={() => setPayerOpened((o) => !o)}>
                      {column}
                      <IconFilterSearch size={15} color="gray" strokeWidth={1.2} />
                    </Group>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Combobox size="sm" store={payerCombobox} onOptionSubmit={handlePayerValueSelect}>
                      <Combobox.EventsTarget>
                        <TextInput
                          size="xs"
                          placeholder="검색 인원을 선택하세요."
                          classNames={{ input: classes.input }}
                          value={payerSearch}
                          rightSection={<IconCornerDownLeft size={15} strokeWidth={1.2} />}
                          onChange={(event) => {
                            setPayerSearch(event.currentTarget.value);
                            payerCombobox.updateSelectedOptionIndex();
                          }}
                        />
                      </Combobox.EventsTarget>

                      <div className={classes.list}>
                        <Combobox.Options>
                          {getOptions(payerSearch, payerValue, payerCombobox).length > 0 ? getOptions(payerSearch, payerValue, payerCombobox) : <Combobox.Empty>검색 결과가 없습니다.</Combobox.Empty>}
                        </Combobox.Options>
                      </div>
                    </Combobox>
                    <Button size="xs" fullWidth variant="light" onClick={() => handleSearch(column)}>
                      검색
                    </Button>
                  </Popover.Dropdown>
                </Popover>
              </Table.Th>
            );
          } else if (column === "관리자 승인 상태") {
            return (
              <Table.Th fz={"xs"} key={index} py={8}>
                <Group gap={"xs"}>
                  {column}
                  <Popover position="bottom-start" withArrow shadow="md">
                    <Popover.Target>
                      <IconFilterSearch size={15} color="gray" strokeWidth={1.2} style={{ cursor: "pointer" }} />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Radio.Group onChange={handleConfirm} value={confirmStatus}>
                        <Stack gap={"xs"}>
                          <Radio size="xs" value="Y" label="승인" />
                          <Radio size="xs" value="T" label="가승인" />
                          <Radio size="xs" value="N" label="미승인" />
                        </Stack>
                      </Radio.Group>
                    </Popover.Dropdown>
                  </Popover>
                </Group>
              </Table.Th>
            );
          }
          return (
            <Table.Th fz={"xs"} key={index} py={8}>
              {column}
            </Table.Th>
          );
        })}
      </Table.Tr>
    </Table.Thead>
  );
});
