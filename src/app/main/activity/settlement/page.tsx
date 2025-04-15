"use client";
import * as api from "@/app/api/get/getApi";
import ModifyNote from "@/app/components/activity/modifyNote";
import SettlementBaseAmountDrawer from "@/app/components/activity/settlement/SettlementBaseAmountDrawer";
import SettlementCancelConfirm from "@/app/components/activity/settlement/SettlementCancelConfirm";
import SettlementConfirm from "@/app/components/activity/settlement/SettlementConfirm";
import ModifyActivityBudget from "@/app/components/activity/settlement/template/ModifyActivityBudget";
import PageList from "@/app/components/Global/PageList";
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
import { useState } from "react";

function page() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    halfYear: "H1",
  });
  const [year, setYear] = useState(dayjs().year().toString());

  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] = useDisclosure(false);
  const [modifyNoteOpened, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);
  const [settlementOpened, { open: openSettlement, close: closeSettlement }] = useDisclosure(false);
  const [settlementCancelOpened, { open: openSettlementCancel, close: closeSettlementCancel }] = useDisclosure(false);
  const [modifyBudgetOpened, { open: openModifyBudget, close: closeModifyBudget }] = useDisclosure(false);

  const { data, isLoading, isError } = useQuery({ queryKey: ["settlementActivities", searchParam], queryFn: () => api.getSettlementActivites(searchParam) });
  const [selectedRowsDetail, setSelectedRowsDetail] = useState<any>();

  console.log("🚀 ~😵‍💫a:", data);

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
    openSettlementCancel();
  };

  const activityStats = data?.data.data.activityStats;

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
  const handleModifyBudget = (element: any) => {
    openModifyBudget();
    setSelectedRowsDetail(element);
  };

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
              handleModifyBudget={handleModifyBudget}
              handleModifyNote={handleModifyNote}
              data={activityStats}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </TableBody>
        </Table>
      </ScrollArea>
      {activityStats?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}

      {/* <Modal opened={settlementConfirm} onClose={closeSettlementConfirm} centered title="활동비 정산">
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
      </Modal> */}

      <SettlementBaseAmountDrawer opened={baseAmountOpened} close={closeBaseAmount} />
      <ModifyNote closeModifyNote={closeModifyNote} openedModifyNote={modifyNoteOpened} selectedRows={selectedRowsDetail} />
      <SettlementConfirm close={closeSettlement} opened={settlementOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      <SettlementCancelConfirm close={closeSettlementCancel} opened={settlementCancelOpened} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      <ModifyActivityBudget opened={modifyBudgetOpened} selectedRows={selectedRowsDetail} close={closeModifyBudget} />
    </Flex>
  );
}

export default page;
