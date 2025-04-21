"use client";
import * as api from "@/app/api/get/getApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { ActivitySettlement } from "@/app/components/table/activity/ActivitySettlement";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ACTIVITY_CONFIG } from "@/app/enums/breadcrumbs";
import { ACTIVITY_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { yearsList } from "@/app/utils/selectTimeList";
import { Button, Flex, Group, ScrollArea, Select, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { lazy, useState } from "react";

const SettlementBaseAmountDrawer = lazy(() => import("@/app/components/activity/settlement/SettlementBaseAmountDrawer"));
const ModifyNote = lazy(() => import("@/app/components/activity/modifyNote"));
const ModifyTotalBudget = lazy(() => import("@/app/components/activity/modifyTotalBudget"));
const SettlementCancelConfirm = lazy(() => import("@/app/components/activity/settlement/SettlementCancelConfirm"));
const SettlementConfirm = lazy(() => import("@/app/components/activity/settlement/SettlementConfirm"));

function page() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    halfYear: "H1",
    perPage: 20,
    pageNo: 1,
  });
  const [year, setYear] = useState(dayjs().year().toString());

  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] = useDisclosure(false);
  const [modifyNoteOpened, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [settlementOpened, { open: openSettlement, close: closeSettlement }] = useDisclosure(false);
  const [settlementCancelOpened, { open: openSettlementCancel, close: closeSettlementCancel }] = useDisclosure(false);
  const [modifyTotalBudget, { open: openModifyTotalBudget, close: closeModifyTotalBudget }] = useDisclosure(false);

  const { data, isLoading, isError } = useQuery({ queryKey: ["settlementActivities", searchParam], queryFn: () => api.getSettlementActivites(searchParam) });
  const [selectedRowsDetail, setSelectedRowsDetail] = useState<any>();
  const [newTotalBudget, setNewTotalBudget] = useState();

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        color: "yellow",
        message: "1명 이상이 선택되어야 합니다.",
        title: "정산완료",
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

  console.log("🚀 ~ page ~ data?.data.data:", data);

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
    setSelectedRowsDetail(element);
  };
  const handleModifyTotalBudget = (event: any, element: any) => {
    if (event.key === "Enter") {
      setSelectedRowsDetail(element);
      openModifyTotalBudget();
    }
  };

  const activityStats = data?.data.data.activityStats;
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ACTIVITY_CONFIG} />

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
        <Table striped={activityStats?.length < 1 ? false : true} stickyHeader highlightOnHover={activityStats?.length < 1 ? false : true}>
          <TableHeader columns={ACTIVITY_SETTLEMENT_HEADER} />
          <TableBody data={activityStats} columns={ACTIVITY_SETTLEMENT_HEADER}>
            <ActivitySettlement
              data={activityStats}
              setNewTotalBudget={setNewTotalBudget}
              handleModifyTotalBudget={handleModifyTotalBudget}
              handleModifyNote={handleModifyNote}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </TableBody>
        </Table>
      </ScrollArea>

      <SettlementBaseAmountDrawer opened={baseAmountOpened} close={closeBaseAmount} />
      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={modifyNoteOpened} selectedRows={selectedRowsDetail} />
      <SettlementConfirm close={closeSettlement} opened={settlementOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      <SettlementCancelConfirm close={closeSettlementCancel} opened={settlementCancelOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      <ModifyTotalBudget newTotalBudget={newTotalBudget} close={closeModifyTotalBudget} opened={modifyTotalBudget} selectedRows={selectedRowsDetail} />
    </Flex>
  );
}

export default page;
