"use client";
import * as api from "@/app/api/get/getApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { WelfareSettlement } from "@/app/components/table/welfare/WelfareSettlement";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { WELFARE_CONFIG } from "@/app/enums/breadcrumbs";
import { WELFARE_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { yearsList } from "@/app/utils/selectTimeList";
import { Button, Flex, Group, ScrollArea, Select, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { lazy, useState } from "react";
// import SettlementConfirm from "@/app/components/activity/settlement/SettlementConfirm";

const WelfareBaseAmountDrawer = lazy(() => import("@/app/components/welfare/settlement/WelfareBaseAmountDrawer"));
const ModifyNote = lazy(() => import("@/app/components/welfare/modifyNote"));
const ModifyTotalBudget = lazy(() => import("@/app/components/welfare/modifyTotalBudget"));
const SettlementCancelConfirm = lazy(() => import("@/app/components/welfare/settlement/SettlementCancelConfirm"));
const SettlementConfirm = lazy(() => import("@/app/components/welfare/settlement/SettlementConfirm"));

function page() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [modifyNoteOpened, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [modifyTotalBudget, { open: openModifyTotalBudget, close: closeModifyTotalBudget }] = useDisclosure(false);
  const [settlementCancelOpened, { open: openSettlementCancel, close: closeSettlementCancel }] = useDisclosure(false);
  const [settlementOpened, { open: openSettlement, close: closeSettlement }] = useDisclosure(false);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    halfYear: "H1",
  });

  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] = useDisclosure(false);

  const [year, setYear] = useState(dayjs().year().toString());
  const [targetRow, setTargetRow] = useState();
  const [newTotalBudget, setNewTotalBudget] = useState();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settlementWelfare", searchParam],
    queryFn: () => api.getSettlementWelfares(searchParam),
  });

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "복지포인트 정산",
        message: "한명 이상을 선택해 주세요",
        color: "yellow",
      });
      return;
    }
    openSettlement();
  };

  const handleSettlementCancel = () => {
    if (selectedRows.length < 1) {
      notification({
        color: "yellow",
        message: "1명 이상이 선택되어야 합니다.",
        title: "정산취소",
      });
      return;
    }
    openSettlementCancel();
  };

  const selectYear = (e: any) => {
    setSearchParam((prev: any) => ({
      ...prev,
      year: e,
    }));
    setYear(e);
  };
  const selectPeriod = (e: any) => {
    setSearchParam((prev: any) => ({
      ...prev,
      halfYear: e,
    }));
  };

  const handleModifyNote = (element: any) => {
    openModifyNote();
    setTargetRow(element);
  };

  const handleModifyTotalBudget = (event: any, element: any) => {
    if (event.key === "Enter") {
      setTargetRow(element);
      openModifyTotalBudget();
    }
  };

  const welfareStats = data?.data.data.welfareStats;
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={WELFARE_CONFIG} />

      <Group justify="space-between" mb={"md"} align="flex-end">
        <Group>
          <Select
            data={yearsList().map((item) => ({ value: item.toString(), label: `${item}년` }))}
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
            value={year}
            onChange={selectYear}
          />

          <Select
            allowDeselect={false}
            data={[
              { label: "상반기", value: "H1" },
              { label: "하반기", value: "H2" },
            ]}
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
            onChange={selectPeriod}
            defaultValue={"H1"}
          />
        </Group>

        <Group>
          <Button size="sm" radius="md" onClick={handleSettlement}>
            정산완료
          </Button>
          <Button color="red" variant="light" size="sm" radius="md" onClick={handleSettlementCancel}>
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
        <Table striped={welfareStats?.length < 1 ? false : true} stickyHeader highlightOnHover={welfareStats?.length < 1 ? false : true}>
          <TableHeader columns={WELFARE_SETTLEMENT_HEADER} />
          <TableBody data={welfareStats} columns={WELFARE_SETTLEMENT_HEADER}>
            <WelfareSettlement
              setNewTotalBudget={setNewTotalBudget}
              handleModifyTotalBudget={handleModifyTotalBudget}
              openModifyNote={handleModifyNote}
              data={welfareStats}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </TableBody>
        </Table>
      </ScrollArea>
      <WelfareBaseAmountDrawer opened={baseAmountOpened} close={closeBaseAmount} />
      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={modifyNoteOpened} selectedRows={targetRow} />
      <ModifyTotalBudget newTotalBudget={newTotalBudget} close={closeModifyTotalBudget} opened={modifyTotalBudget} selectedRows={targetRow} />
      <SettlementConfirm close={closeSettlement} opened={settlementOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      <SettlementCancelConfirm close={closeSettlementCancel} opened={settlementCancelOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
    </Flex>
  );
}

export default page;
