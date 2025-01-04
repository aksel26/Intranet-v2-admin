"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { TWelfareSettlement } from "@/app/type/welfare";
import notification from "@/app/utils/notification";
import { settlementStatus } from "@/app/utils/settlement";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Flex,
  Group,
  Modal,
  NumberFormatter,
  ScrollArea,
  Select,
  Stack,
  Table,
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { lazy, useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import IconInfo from "/public/icons/info-circle.svg";
import { BREADSCRUMBS_WELFARE_CONFIG } from "@/app/enums/breadscrumbs";

const WelfareBaseAmountDrawer = lazy(
  () => import("@/app/components/welfare/settlement/WelfareBaseAmountDrawer")
);

function page() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [
    settlementConfirm,
    { open: openSettlementConfirm, close: closeSettlementConfirm },
  ] = useDisclosure(false);
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settlementWelfare", searchParam],
    queryFn: () => api.getSettlementWelfares(searchParam),
  });

  const settleDone = () => {
    mutate(
      { welfareStatsIdxList: selectedRows },
      {
        onSuccess: () => {
          notification({
            title: "복지포인트 정산",
            message: "복지포인트 정산이 완료되었습니다.",
            color: "green",
          });

          queryClient.invalidateQueries({ queryKey: ["settlementWelfare"] });
          setSelectedRows([]);
          closeSettlementConfirm();
        },
        onError: () => {
          notification({
            title: "복지포인트 정산",
            message: "복지포인트 정산을 실패하였습니다.",
            color: "red",
          });
        },
      }
    );
  };

  const settlementModal = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "복지포인트 정산",
        message: "한명 이상을 선택해 주세요",
        color: "yellow",
      });
      return;
    }
    openSettlementConfirm();
  };

  const settlementCancel = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "복지포인트 정산",
        message: "한명 이상을 선택해 주세요",
        color: "yellow",
      });
      return;
    }
    settleCancel(
      { welfareStatsIdxList: selectedRows },
      {
        onSuccess: () => {
          notification({
            title: "복지포인트 정산",
            message: "복지포인트 정산취소가 완료되었습니다.",
            color: "green",
          });

          queryClient.invalidateQueries({ queryKey: ["settlementWelfare"] });
          setSelectedRows([]);
        },
        onError: () => {
          notification({
            title: "복지포인트 정산",
            message: "복지포인트 정산취소를 실패하였습니다.",
            color: "red",
          });
        },
      }
    );
  };
  const [year, setYear] = useState<Date | null>(dayjs().toDate());
  const selectYear = (e: any) => setYear(e);
  const selectPeriod = (e: any) => {
    setSearchParam((prev: any) => ({
      ...prev,
      halfYear: e,
      year: year?.getFullYear(),
    }));
  };

  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] =
    useDisclosure(false);
  const rows = data?.data.data.welfareStats.map(
    (element: TWelfareSettlement, index: number) => (
      <Table.Tr
        key={element.welfareStatsIdx}
        bg={
          selectedRows.includes(element.welfareStatsIdx)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            size="xs"
            radius="sm"
            aria-label="Select row"
            checked={selectedRows.includes(element.welfareStatsIdx)}
            onChange={(event) =>
              setSelectedRows(
                event.currentTarget.checked
                  ? [...selectedRows, element.welfareStatsIdx]
                  : selectedRows.filter(
                      (position) => position !== element.welfareStatsIdx
                    )
              )
            }
          />
        </Table.Td>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{element.gradeName}</Table.Td>
        <Table.Td>{element.userName}</Table.Td>
        <Table.Td>
          <NumberFormatter
            thousandSeparator
            value={element.welfareBudget}
            suffix=" 원"
          />
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            thousandSeparator
            value={element.welfareExpense}
            suffix=" 원"
          />
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            thousandSeparator
            value={element.welfareBalance}
            suffix=" 원"
          />
        </Table.Td>
        <Table.Td>
          <Badge color={element.clearStatus === "not_yet" ? "yellow" : "blue"}>
            {settlementStatus(element.clearStatus)}
          </Badge>
        </Table.Td>

        <Table.Td>{element.note || ""}</Table.Td>
      </Table.Tr>
    )
  );

  return (
    <Flex
      direction={"column"}
      h={"100%"}
      styles={{ root: { overflow: "hidden" } }}
    >
      <BreadScrumb level={BREADSCRUMBS_WELFARE_CONFIG} />

      <Group justify="space-between" my={"md"} align="flex-end">
        <Group>
          <YearPickerInput
            locale="ko"
            variant="unstyled"
            label="년도 선택"
            styles={{
              input: {
                fontSize: "var(--mantine-font-size-xl)",
                fontWeight: 700,
                paddingTop: 0,
                paddingBottom: 0,
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
          <Button
            color="red"
            variant="light"
            size="sm"
            radius="md"
            onClick={settlementCancel}
          >
            정산취소
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
          <Button size="sm" radius="md" onClick={openBaseAmount}>
            기본금액 설정
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
      <Modal
        opened={settlementConfirm}
        onClose={closeSettlementConfirm}
        centered
        title="복지포인트 정산"
      >
        <Stack>
          <Alert
            variant="outline"
            color="blue"
            radius="md"
            title="복지포인트 정산을 진행하시겠습니까?"
            icon={<IconInfo />}
          >
            {selectedRows.length}건을 정산 완료 처리합니다.
          </Alert>
          <Group wrap="nowrap">
            <Button fullWidth onClick={settleDone}>
              정산하기
            </Button>
            <Button
              variant="light"
              color="gray"
              fullWidth
              onClick={closeSettlementConfirm}
            >
              닫기
            </Button>
          </Group>
        </Stack>
      </Modal>
      <WelfareBaseAmountDrawer
        opened={baseAmountOpened}
        close={closeBaseAmount}
      />
    </Flex>
  );
}

export default page;
