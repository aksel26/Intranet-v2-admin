"use client";

import { updateMealBudgetNote } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { ActionIcon, Anchor, Badge, Button, Checkbox, Group, NumberFormatter, Popover, Table, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useRef, useState } from "react";

import Edit from "/public/icons/edit.svg";
import EditNote from "/public/icons/square-rounded-plus.svg";
import { useDisclosure } from "@mantine/hooks";

export const MealSettlement = memo(({ data, setSelectedRows, selectedRows, setSelectedRowsDetail, openExpensesDetail }: any) => {
  const queryClient = useQueryClient();
  const saveNoteRef = useRef<HTMLInputElement>(null);
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (values: any) => updateMealBudgetNote(values),
  });

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
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
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
  const pressKey = (e: any, idx: number) => {
    const { key } = e;
    if (key === "Enter") {
      saveNote(idx);
    }
  };

  const handleExpensesDetail = (element: any) => {
    setSelectedRowsDetail(element);
    openExpensesDetail();
  };

  return data?.map((element: any, index: number) => (
    <Table.Tr key={element.mealStatsIdx} bg={selectedRows.includes(element.mealStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.mealStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.mealStatsIdx]
                : selectedRows.filter((mealStatsIdx: number) => mealStatsIdx !== element.mealStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealBudget} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Anchor fz={"sm"} onClick={() => handleExpensesDetail(element)}>
          <NumberFormatter thousandSeparator value={element.mealExpense} suffix=" 원" />
        </Anchor>
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.mealBalance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.totalOverpay} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{element.clearStatus === "not_yet" ? "미정산" : "정산완료"}</Badge>
      </Table.Td>

      <Table.Td>
        {/* {element.note} */}
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
                <ActionIcon
                  variant="subtle"
                  size={"sm"}
                  color="blue.4"
                  onClick={() => setOpenedRowId(openedRowId === element.mealStatsIdx ? null : element.mealStatsIdx)}
                >
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
});
