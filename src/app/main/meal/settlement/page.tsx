"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { MEAL_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { Badge, Button, Center, Checkbox, Flex, Group, NumberFormatter, ScrollArea, Stack, Table, Text, Title } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import NoList from "/public/icons/no-list.svg";
dayjs.locale("ko");
function page() {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<Date | null>(dayjs().toDate());
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  console.log("🚀 ~ page ~ selectedRows:", selectedRows);

  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const selectMonth = (e: any) => {
    setValue(e);
    const year = dayjs(e).year();
    const month = dayjs(e).month() + 1;
    setSearchParam((prev: any) => ({ ...prev, year: year, month: month }));
  };

  const { data, isLoading, isError } = useQuery({ queryKey: ["mealsSettlement", searchParam], queryFn: () => api.getMealsSettlement(searchParam) });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.settlement(values),
  });
  const { mutate: settlementCancel } = useMutation({
    mutationFn: (values: any) => postApi.settlementCancel(values),
  });

  const handleSettlementCancel = () => {
    settlementCancel(
      {
        mealStatsIdxList: selectedRows,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          setSelectedRows([]);
          notification({
            title: "정산",
            message: "정산취소가 완료되었습니다.",
            color: "green",
          });
        },
      }
    );
  };

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "정산",
        message: "정산처리할 인원을 먼저 선택해 주세요.",
        color: "yellow",
      });
      return;
    }
    mutate(
      {
        mealStatsIdxList: selectedRows,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          setSelectedRows([]);
          notification({
            title: "정산",
            message: "정산이 정상적으로 완료되었습니다.",
            color: "green",
          });
        },
      }
    );
  };

  const rows = () => {
    return data?.data.data.mealStats.map((element: any, index: number) => (
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
                  : selectedRows.filter((mealStatsIdx) => mealStatsIdx !== element.mealStatsIdx)
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
          <NumberFormatter thousandSeparator value={element.mealExpense} suffix=" 원" />
        </Table.Td>
        <Table.Td>
          <NumberFormatter thousandSeparator value={element.mealBalance} suffix=" 원" />
        </Table.Td>
        <Table.Td>
          <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{element.clearStatus === "not_yet" ? "미정산" : "정산완료"}</Badge>
        </Table.Td>

        <Table.Td>{element.note}</Table.Td>
      </Table.Tr>
    ));
  };
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        식대 정산
      </Title>

      <Group justify="space-between" mb={"lg"} align="flex-end">
        <MonthPickerInput
          locale="ko"
          variant="unstyled"
          label="월 선택"
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-xl)",
              fontWeight: 700,
            },
          }}
          rightSection={<IconDownArrow />}
          rightSectionPointerEvents="none"
          placeholder="조회하실 월을 선택해 주세요."
          value={value}
          valueFormat="M월"
          onChange={selectMonth}
          w={100}
        />
        <Group>
          {selectedRows.length >= 1 && (
            <Button size="sm" radius="md" color="red" onClick={handleSettlementCancel}>
              정산취소
            </Button>
          )}
          <Button size="sm" radius="md" onClick={handleSettlement}>
            정산완료
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
        </Group>
      </Group>
      {data?.data.data.mealStats.length < 1 ? (
        <Center h={400}>
          <Stack align="center">
            <NoList width="30" height="30" />
            <Text c={"dimmed"}>정산 내역 목록이 없습니다.</Text>
          </Stack>
        </Center>
      ) : (
        // <Box pos={"relative"} h={"50vh"}>
        //   <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ type: "bars" }} />

        <ScrollArea>
          <Table striped stickyHeader highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {MEAL_SETTLEMENT_HEADER.map((item: string, index: number) => (
                  <Table.Th key={index}>{item}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows()}</Table.Tbody>
          </Table>
        </ScrollArea>

        // </Box>
      )}
      {/* <Group justify="center">
        <Pagination total={10} radius="md" />
      </Group> */}
    </Flex>
  );
}

export default page;
