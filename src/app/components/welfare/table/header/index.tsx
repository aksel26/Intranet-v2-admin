import { useUsers } from "@/app/hooks/useStaffs";
import { useUserStore } from "@/app/store/useStaffs";
import classes from "@/app/styles/SelectList.module.css";
import { Checkbox, Combobox, Group, Popover, Stack, Table, Text, TextInput, useCombobox } from "@mantine/core";
import { IconCornerDownLeft, IconFilterSearch } from "@tabler/icons-react";
import { memo, useState } from "react";

// Memoized TableHeader component
export const WelfarePointTableHeader = memo(({ columns, sort }: { value?: any; sort?: any; columns: string[] }) => {
  const { isError, error } = useUsers();
  const { userOptions, getUserNameByIdx, isLoading } = useUserStore();
  const combobox = useCombobox();

  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const handleValueSelect = (val: string) => setValue((current) => (current.includes(val) ? current.filter((v) => v !== val) : [...current, val]));

  const options = userOptions
    .filter((item) => item.label.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item.value} key={item.value} active={value.includes(item.value)} onMouseOver={() => combobox.resetSelectedOption()}>
        <Group gap="sm">
          <Checkbox size="xs" checked={value.includes(item.value)} onChange={() => {}} aria-hidden tabIndex={-1} style={{ pointerEvents: "none" }} />
          <Text fz={"xs"} component="span">
            {item.label}
          </Text>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Table.Thead>
      <Table.Tr fz={"xs"}>
        {columns.map((column: string, index: number) => {
          if (column === "성명" || column === "결제자") {
            return (
              <Table.Th fz={"xs"} key={index} py={8}>
                <Popover position="bottom-start" withArrow shadow="md">
                  <Popover.Target>
                    <Group gap={"xs"} styles={{ root: { cursor: "pointer" } }}>
                      {column}
                      <IconFilterSearch size={15} color="gray" strokeWidth={1.2} />
                    </Group>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Combobox size="sm" store={combobox} onOptionSubmit={handleValueSelect}>
                      <Combobox.EventsTarget>
                        <TextInput
                          size="sm"
                          placeholder="검색 인원을 선택하세요."
                          classNames={{ input: classes.input }}
                          value={search}
                          rightSection={<IconCornerDownLeft size={15} strokeWidth={1.2} />}
                          onChange={(event) => {
                            setSearch(event.currentTarget.value);
                            combobox.updateSelectedOptionIndex();
                          }}
                        />
                      </Combobox.EventsTarget>

                      <div className={classes.list}>
                        <Combobox.Options>{options.length > 0 ? options : <Combobox.Empty>Nothing found....</Combobox.Empty>}</Combobox.Options>
                      </div>
                    </Combobox>
                  </Popover.Dropdown>
                </Popover>
              </Table.Th>
            );
          } else if (column === "관리자 승인 상태") {
            return (
              <Table.Th fz={"xs"} key={index} py={8}>
                <Popover position="bottom-start" withArrow shadow="md">
                  <Popover.Target>
                    <Group gap={"xs"} styles={{ root: { cursor: "pointer" } }}>
                      {column}
                      <IconFilterSearch size={15} color="gray" strokeWidth={1.2} />
                    </Group>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Checkbox.Group defaultValue={["react"]}>
                      <Stack gap={"xs"}>
                        <Checkbox size="xs" value="react" label="미승인" />
                        <Checkbox size="xs" value="svelte" label="가승인" />
                        <Checkbox size="xs" value="ng" label="승인" />
                      </Stack>
                    </Checkbox.Group>
                  </Popover.Dropdown>
                </Popover>
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
