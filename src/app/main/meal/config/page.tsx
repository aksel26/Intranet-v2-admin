"use client";
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Group,
  NumberFormatter,
  NumberInput,
  Popover,
  ScrollArea,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Edit from "/public/icons/edit.svg";
import EditNote from "/public/icons/square-rounded-plus.svg";

import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { MONTH } from "@/app/enums/month";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";

interface FormValues {
  baseAmount: null | number;
  mealBudget: string | null | number;
  year: string | number;
  month: string | number;
}

function page() {
  const queryClient = useQueryClient();
  const saveNoteRef = useRef<HTMLInputElement>(null);
  const [baseAmount, setBaseAmount] = useState(0);
  const [mealBudget, setMealBudget] = useState<string | number>("");
  const [workDay, setWorkDay] = useState<string | number>("");
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
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
    setMealBudget((prev) => e * Number(workDay));
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
          close();
          setWorkDay("");
          setMealBudget("");
          form.reset();
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
      <Table.Td>{element.gradeName}</Table.Td>
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
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        식대 설정
      </Title>

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Select
          allowDeselect={false}
          label="조회기간 선택"
          maxDropdownHeight={200}
          w={100}
          size="sm"
          checkIconPosition="right"
          data={MONTH}
          variant="unstyled"
          defaultValue={`${dayjs().month() + 1}월`}
          onChange={changeMonth}
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-lg)",
              fontWeight: 700,
            },
          }}
        />

        <Button size="sm" onClick={open}>
          기본금액 설정
        </Button>
      </Group>
      <ScrollArea>
        <Table striped stickyHeader highlightOnHover>
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
      </ScrollArea>

      <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="식대 기본금액 설정" position="right">
        <form onSubmit={form.onSubmit(saveBaseAmount)}>
          <Stack gap={"lg"} py={"md"}>
            <Select
              withAsterisk
              allowDeselect={false}
              label="적용 월 선택"
              maxDropdownHeight={200}
              size="sm"
              checkIconPosition="right"
              data={MONTH}
              defaultValue={`${dayjs().month() + 1}월`}
              onChange={changeMonth}
            />

            <NumberInput
              withAsterisk
              description="식대금액이 설정한 기간에 일괄적으로 적용됩니다."
              label="기본 제공 식대"
              placeholder="금액을 입력해 주세요."
              thousandSeparator=","
              hideControls
              suffix=" 원"
              onChange={defaultPrice}
            />

            <NumberInput
              withAsterisk
              label="업무일"
              thousandSeparator=","
              hideControls
              suffix=" 일"
              value={workDay}
              onChange={handleWorkDay}
              placeholder="해당 월의 업무일을 입력해 주세요."
              allowNegative={false}
            />

            <NumberInput
              label={"인원별 총 금액"}
              description="기본제공 식대 x 업무일"
              readOnly
              variant="unstyled"
              thousandSeparator=","
              hideControls
              suffix=" 원"
              value={mealBudget}
              styles={{ root: { fontWeight: 700 } }}
              placeholder="자동계산되어 표시됩니다."
            />
            <Group wrap="nowrap">
              <Button fullWidth type="submit" radius={"md"}>
                저장
              </Button>
              <Button fullWidth onClick={close} radius={"md"} variant="light" color="gray">
                닫기
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </Flex>
  );
}

export default page;
