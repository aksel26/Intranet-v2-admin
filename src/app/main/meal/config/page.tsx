"use client";
import {
  ActionIcon,
  Box,
  Button,
  CloseButton,
  Divider,
  Group,
  NumberFormatter,
  NumberInput,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Edit from "/public/icons/edit.svg";
import EditNote from "/public/icons/square-rounded-plus.svg";

import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { MONTH } from "@/app/enums/month";
import dayjs from "dayjs";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

interface FormValues {
  baseAmount: null | number;
  mealBudget: null | number;
  year: string | number;
  month: string | number;
}

function page() {
  const queryClient = useQueryClient();
  const saveNoteRef = useRef<HTMLInputElement>(null);
  const [baseAmount, setBaseAmount] = useState(0);
  const [mealBudget, setMealBudget] = useState(0);
  const [workDay, setWorkDay] = useState(0);
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  const [searchParam, setSearchParam] = useState<{
    month: number;
    year: number;
  }>({
    month: dayjs().month() + 1,
    year: dayjs().year(),
  });
  const { data, isLoading, isError } = useQuery({ queryKey: ["mealsBudget", searchParam], queryFn: () => api.getMealsBudget(searchParam) });
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateMealBudgetNote(values),
  });
  const { mutate: saveBaseBudget } = useMutation({
    mutationFn: (values: any) => postApi.updateMealBudget(values),
  });

  const defaultPrice = (e: any) => {
    setMealBudget((prev) => e * workDay);
    setBaseAmount(e);
  };
  const handleWorkDay = (e: any) => {
    setWorkDay(e);
    setMealBudget((prev) => e * baseAmount);
  };
  const changeMonth = (e: any) => setSearchParam((prev) => ({ ...prev, month: e.replace("월", "") }));

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      baseAmount: null,
      mealBudget: null,
      year: searchParam.year.toString(),
      month: searchParam.month.toString(),
    },
  });

  const saveBaseAmount = () => {
    form.setFieldValue("baseAmount", baseAmount);
    form.setFieldValue("mealBudget", mealBudget);
    form.setFieldValue("year", searchParam.year.toString());
    form.setFieldValue("month", searchParam.month.toString());

    saveBaseBudget(
      { body: form.getValues() },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsBudget"] });
          notification({
            title: "식대 기본 금액 설정",
            color: "green",
            message: "식대 기본 금액이 설정되었습니다.",
          });
        },
        onError: () => {
          notification({
            title: "식대 기본 금액 설정",
            color: "red",
            message: "식대 기본 금액 설정 요청을 실패하였습니다.",
          });
        },
      }
    );
  };

  const pressKey = (e: any, idx: number) => {
    const { key } = e;
    if (key === "Enter") {
      saveNote(idx);
    }
  };

  const saveNote = (idx: number) => {
    let note = null;
    if (saveNoteRef.current) {
      if (saveNoteRef.current.value === "") note = null;
      else {
        note = saveNoteRef.current.value;
      }
    }
    mutate(
      { body: { note: note }, queryParams: idx },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsBudget"] });
          notification({
            title: "비고 내용 수정",
            color: "green",
            message: "비고 내용이 수정되었습니다.",
          });
          setOpenedRowId(null);
        },
        onError: () => {
          notification({
            title: "비고 내용 수정",
            color: "red",
            message: "비고 내용이 수정을 실패하였습니다.",
          });
        },
      }
    );
  };
  const rows = data?.data.data.mealBudget.map((element: any, index: number) => (
    <Table.Tr key={element.mealStatsIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.userGrade}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <Group>
          <NumberFormatter thousandSeparator value={element.mealBudget} suffix=" 원" />
          <Popover width={300} position="bottom-end" withArrow shadow="md" trapFocus>
            <Popover.Target>
              <ActionIcon variant="subtle" size={"sm"} color="blue.4">
                <Edit width="15" height="15" strokeWidth="1.0" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown bg="var(--mantine-color-body)">
              <Group align="end">
                <TextInput size="sm" label="총 사용금액 수정" placeholder="금액을 입력해 주세요." styles={{ root: { flex: 1 } }} />
                <Button size="sm" variant="light">
                  수정
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Table.Td>
      <Table.Td>
        <Popover
          width={300}
          position="bottom-end"
          withArrow
          shadow="md"
          trapFocus
          opened={openedRowId === element.mealStatsIdx}
          onChange={() => setOpenedRowId(openedRowId === element.mealStatsIdx ? null : element.mealStatsIdx)}
        >
          {element.note === null ? (
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size={"sm"}
                color="gray.7"
                onClick={() => setOpenedRowId(openedRowId === element.mealStatsIdx ? null : element.mealStatsIdx)}
              >
                <EditNote width="17" height="17" strokeWidth="1.0" />
              </ActionIcon>
            </Popover.Target>
          ) : (
            <Group>
              {element.note}
              <Popover.Target>
                <ActionIcon variant="subtle" size={"sm"} color="blue.4">
                  <Edit width="15" height="15" strokeWidth="1.0" />
                </ActionIcon>
              </Popover.Target>
            </Group>
          )}

          <Popover.Dropdown bg="var(--mantine-color-body)">
            <Group align="end">
              <TextInput
                onKeyDown={(e) => pressKey(e, element.mealStatsIdx)}
                ref={saveNoteRef}
                size="sm"
                label="비고 내용 작성"
                placeholder="비고 내용을 입력해 주세요."
                styles={{ root: { flex: 1 } }}
              />
              <Button size="sm" variant="light" onClick={() => saveNote(element.mealStatsIdx)}>
                저장
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box pb={50}>
      <Text fw={900} size="xl" mb={"xl"}>
        식대 설정
      </Text>
      <Stack mb={"xl"} gap={"sm"}>
        <Paper p="lg" withBorder radius={"lg"} px={"xl"} w={"max-content"}>
          <Group align="baseline" mb={"md"}>
            <Select
              maxDropdownHeight={200}
              styles={{ root: { fontWeight: 700 } }}
              w={100}
              size="md"
              checkIconPosition="right"
              data={MONTH}
              variant="unstyled"
              defaultValue={"11월"}
              onChange={changeMonth}
            />
            <Text size="md" fw={700}>
              기본 식대 금액 설정
            </Text>
          </Group>
          <form onSubmit={form.onSubmit(saveBaseAmount)}>
            <Group align="flex-end" gap={"xl"}>
              <NumberInput
                description="식대금액이 설정한 기간에 일괄적으로 적용됩니다."
                label="기본 제공 식대"
                placeholder="금액을 입력해 주세요."
                thousandSeparator=","
                hideControls
                suffix=" 원"
                onChange={defaultPrice}
              />

              <NumberInput label="업무일" thousandSeparator="," hideControls suffix=" 일" value={workDay || 0} onChange={handleWorkDay} />

              <NumberInput
                label={"인원별 총 금액"}
                description="기본제공 식대 x 업무일"
                readOnly
                variant="unstyled"
                thousandSeparator=","
                hideControls
                suffix=" 원"
                value={mealBudget}
              />
              <Button type="submit" radius={"md"}>
                저장
              </Button>
            </Group>
          </form>
        </Paper>
      </Stack>
      <Divider my="md" />

      <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>No.</Table.Th>
            <Table.Th>직급</Table.Th>
            <Table.Th>성명</Table.Th>
            <Table.Th>총 금액</Table.Th>
            <Table.Th>비고</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
}

export default page;
