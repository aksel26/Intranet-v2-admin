"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { TActivitesSettlement } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { settlementStatus } from "@/app/utils/settlement";
import { Alert, Badge, Button, Checkbox, Flex, Group, Modal, NumberFormatter, ScrollArea, Select, Stack, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import IconInfo from "/public/icons/info-circle.svg";
import { YearPickerInput } from "@mantine/dates";
import IconDownArrow from "/public/icons/chevron-down.svg";
const elements = Array.from({ length: 41 }, (_, index) => {
  return { position: index + 1, grade: "본부장", balance: 1500, expense: 75300, amount: 890000, name: "김현근2", etc: "정산완료" };
});

function page() {
  const [value, setValue] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [year, setYear] = useState<Date | null>(dayjs().toDate());
  const [settlementConfirm, { open: openSettlementConfirm, close: closeSettlementConfirm }] = useDisclosure(false);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().toDate(),
    halfYear: "H1",
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.settleDone(values),
  });
  const { mutate: settleCancel } = useMutation({
    mutationFn: (values: any) => postApi.settleCancel(values),
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({ queryKey: ["settlementActivities", searchParam], queryFn: () => api.getSettlementActivites(searchParam) });

  const selectYear = (e: any) => setYear(e);
  const selectPeriod = (e: any) => {
    setSearchParam((prev: any) => ({ ...prev, halfYear: e, year: year?.getFullYear() }));
  };

  const settleDone = () => {
    mutate(
      { activityStatsIdxList: selectedRows },
      {
        onSuccess: () => {
          notification({ title: "활동비 정산", message: "활동비 정산이 완료되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
          setSelectedRows([]);
          closeSettlementConfirm();
        },
        onError: () => {
          notification({ title: "활동비 정산", message: "활동비 정산을 실패하였습니다.", color: "red" });
        },
      }
    );
  };

  const settlementModal = () => {
    if (selectedRows.length < 1) {
      notification({ title: "활동비 정산", message: "한명 이상을 선택해 주세요", color: "yellow" });
      return;
    }
    openSettlementConfirm();
  };

  const settlementCancel = () => {
    if (selectedRows.length < 1) {
      notification({ title: "활동비 정산", message: "한명 이상을 선택해 주세요", color: "yellow" });
      return;
    }
    settleCancel(
      { activityStatsIdxList: selectedRows },
      {
        onSuccess: () => {
          notification({ title: "활동비 정산", message: "활동비 정산취소가 완료되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
          setSelectedRows([]);
        },
        onError: () => {
          notification({ title: "활동비 정산", message: "활동비 정산취소를 실패하였습니다.", color: "red" });
        },
      }
    );
  };

  const rows = data?.data.data.activityStats.map((element: TActivitesSettlement, index: number) => (
    <Table.Tr key={element.activityStatsIdx} bg={selectedRows.includes(element.activityStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.activityStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.activityStatsIdx]
                : selectedRows.filter((position) => position !== element.activityStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityBudget} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityExpense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.activityBalance} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>{settlementStatus(element.clearStatus)}</Badge>
      </Table.Td>

      <Table.Td>{element.note || ""}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        활동비 정산
      </Title>

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Group>
          <YearPickerInput
            locale="ko"
            variant="unstyled"
            label="년도 선택"
            styles={{
              input: {
                fontSize: "var(--mantine-font-size-xl)",
                fontWeight: 700,
              },
            }}
            rightSection={<IconDownArrow />}
            rightSectionPointerEvents="none"
            placeholder="조회하실 기간을 선택해 주세요."
            value={year}
            valueFormat="YYYY년"
            onChange={selectYear}
          />

          <Select
            allowDeselect={false}
            label="조회기간 선택"
            data={[
              { label: "상반기", value: "H1" },
              { label: "하반기", value: "H2" },
            ]}
            variant="unstyled"
            defaultValue={"H1"}
            size="sm"
            onChange={selectPeriod}
            styles={{
              input: {
                fontSize: "var(--mantine-font-size-xl)",
                fontWeight: 700,
              },
            }}
          />
        </Group>

        <Group>
          <Button size="sm" radius="md" onClick={settlementModal}>
            정산완료
          </Button>
          <Button color="red" variant="light" size="sm" radius="md" onClick={settlementCancel}>
            정산취소
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>No.</Table.Th>
              <Table.Th>직급</Table.Th>
              <Table.Th>성명</Table.Th>
              <Table.Th>총 금액</Table.Th>
              <Table.Th>사용 금액</Table.Th>
              <Table.Th>잔액</Table.Th>
              <Table.Th>정산여부</Table.Th>
              <Table.Th>비고</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <PageList totalPage={10} />
      <Modal opened={settlementConfirm} onClose={closeSettlementConfirm} centered title="활동비 정산">
        <Stack>
          <Alert variant="outline" color="blue" radius="md" title="활동비 정산을 진행하시겠습니까?" icon={<IconInfo />}>
            {selectedRows.length}건을 정산 완료 처리합니다.
          </Alert>
          <Group wrap="nowrap">
            <Button fullWidth onClick={settleDone}>
              정산하기
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={closeSettlementConfirm}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Flex>
  );
}

export default page;
