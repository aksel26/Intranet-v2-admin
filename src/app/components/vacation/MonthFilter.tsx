import { monthList } from "@/app/utils/selectTimeList";
import { Box, Button, Checkbox, Divider, Group, Popover, Stack } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const MonthFilter = ({ trigger }: any) => {
  const [selectAll, setSelectAll] = useState(false);
  const [monthValue, setMonthValue] = useState<string[]>([]);
  const [monthSelectOpened, setMonthSelectOpened] = useState(false);

  const handleSelectAll = (e: any) => {
    const { checked } = e.target;
    setSelectAll(!checked);
    if (checked) {
      const monthValue = monthList().map((month: number) => month.toString());
      setMonthValue(monthValue);
    } else {
      setMonthValue([]);
    }
  };

  const selectMonth = (e: any) => setMonthValue(e);

  useEffect(() => {
    if (monthValue.length < 12) {
      setSelectAll(false);
    } else if (monthValue.length === 12) {
      setSelectAll(true);
    }
  }, [monthValue]);

  const submitCheck = () => {
    const monthParam = monthValue.length >= 1 ? monthValue.join(",") : null;
    trigger((params: any) => ({ ...params, month: monthParam }));
    setMonthSelectOpened(false);
  };

  return (
    <Group justify="flex-end">
      <Popover position="left-start" offset={8} withArrow shadow="md" opened={monthSelectOpened} onChange={setMonthSelectOpened}>
        <Popover.Target>
          <Button size="xs" leftSection={<IconCalendar size={18} strokeWidth={1.2} />} variant="light" onClick={() => setMonthSelectOpened((o) => !o)}>
            월 선택
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap={"xs"}>
            <Checkbox labelPosition="right" size="xs" label={"전체선택"} checked={selectAll} onChange={handleSelectAll} />
          </Stack>
          <Divider my={"md"} />
          <Checkbox.Group mb={"sm"} value={monthValue} onChange={selectMonth}>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(6, auto)",
                columnGap: "var(--mantine-spacing-lg)",
                rowGap: "var(--mantine-spacing-xs)",
              }}
            >
              {monthList().map((month: number) => (
                <Checkbox key={month} size="xs" label={`${month}월`} value={month.toString()} />
              ))}
            </Box>
          </Checkbox.Group>
          <Button size="compact-sm" variant="light" fullWidth onClick={submitCheck}>
            확인
          </Button>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};

export default MonthFilter;
