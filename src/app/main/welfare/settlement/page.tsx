"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { TWelfareSettlement } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { settlementStatus } from "@/app/utils/settlement";
import { Alert, Badge, Button, Checkbox, Flex, Group, Modal, NumberFormatter, ScrollArea, Select, Stack, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import IconInfo from "/public/icons/info-circle.svg";
const elements = Array.from({ length: 41 }, (_, index) => {
  return { position: index + 1, grade: "본부장", balance: 1500, expense: 75300, amount: 890000, name: "김현근2", etc: "정산완료" };
});

function page() {
  const [value, setValue] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  console.log("🚀 ~ page ~ selectedRows:", selectedRows);
  const [settlementConfirm, { open: openSettlementConfirm, close: closeSettlementConfirm }] = useDisclosure(false);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    halfYear: "H1",
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.settleDone(values),
  });
  const { mutate: settleCancel } = useMutation({
    mutationFn: (values: any) => postApi.settleCancel(values),
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({ queryKey: ["settlementWelfare", searchParam], queryFn: () => api.getSettlementWelfares(searchParam) });

  const settleDone = () => {
    mutate(
      { welfareStatsIdxList: selectedRows },
      {
        onSuccess: () => {
          notification({ title: "복지포인트 정산", message: "복지포인트 정산이 완료되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["settlementWelfare"] });
          setSelectedRows([]);
          closeSettlementConfirm();
        },
        onError: () => {
          notification({ title: "복지포인트 정산", message: "복지포인트 정산을 실패하였습니다.", color: "red" });
        },
      }
    );
  };

  const settlementModal = () => {
    if (selectedRows.length < 1) {
      notification({ title: "복지포인트 정산", message: "한명 이상을 선택해 주세요", color: "yellow" });
      return;
    }
    openSettlementConfirm();
  };

  const settlementCancel = () => {
    if (selectedRows.length < 1) {
      notification({ title: "복지포인트 정산", message: "한명 이상을 선택해 주세요", color: "yellow" });
      return;
    }
    settleCancel(
      { welfareStatsIdxList: selectedRows },
      {
        onSuccess: () => {
          notification({ title: "복지포인트 정산", message: "복지포인트 정산취소가 완료되었습니다.", color: "green" });

          queryClient.invalidateQueries({ queryKey: ["settlementWelfare"] });
          setSelectedRows([]);
        },
        onError: () => {
          notification({ title: "복지포인트 정산", message: "복지포인트 정산취소를 실패하였습니다.", color: "red" });
        },
      }
    );
  };

  const rows = data?.data.data.welfareStats.map((element: TWelfareSettlement, index: number) => (
    <Table.Tr key={element.welfareStatsIdx} bg={selectedRows.includes(element.welfareStatsIdx) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Checkbox
          size="xs"
          radius="sm"
          aria-label="Select row"
          checked={selectedRows.includes(element.welfareStatsIdx)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked ? [...selectedRows, element.welfareStatsIdx] : selectedRows.filter((position) => position !== element.welfareStatsIdx)
            )
          }
        />
      </Table.Td>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.welfareBudget} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.welfareExpense} suffix=" 원" />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.welfareBalance} suffix=" 원" />
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
        복지포인트 정산
      </Title>

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Select
          defaultSearchValue="전체"
          data={["전체", "상반기", "하반기"]}
          variant="unstyled"
          styles={{ root: { fontWeight: 700 } }}
          size="md"
          checkIconPosition="right"
        />

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
      <Modal opened={settlementConfirm} onClose={closeSettlementConfirm} centered title="복지포인트 정산">
        <Stack>
          <Alert variant="outline" color="blue" radius="md" title="복지포인트 정산을 진행하시겠습니까?" icon={<IconInfo />}>
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
