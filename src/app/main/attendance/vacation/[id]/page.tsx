"use client";
import * as api from "@/app/api/get/getApi";
import PageList from "@/app/components/Global/PageList";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { VacationDetil } from "@/app/components/table/vacationDetail";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import AddVacationModal from "@/app/components/vacation/AddVacationModal";
import AddVacationModalDetails from "@/app/components/vacation/AddVacationModalDetails";
import AttachmentModal from "@/app/components/vacation/AttachmentModal";
import DeleteVacationModal from "@/app/components/vacation/DeleteVacationModal";
import ModifyNote from "@/app/components/vacation/ModifyNote";
import MonthFilter from "@/app/components/vacation/MonthFilter";
import VacationDetailSummary from "@/app/components/vacation/VacationDetailSummary";
import { VACATION_DETAIL } from "@/app/enums/breadcrumbs";
import { VACATION_DETAIL_HEADER } from "@/app/enums/tableHeader";
import { LeaveSummaryRoot } from "@/app/type/vacationDetail";
import { yearsList } from "@/app/utils/selectTimeList";
import { Button, Flex, Group, ScrollArea, Select, Table, useCombobox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";

function page() {
  const { id } = useParams();

  const [yearValue, setYearValue] = useState<string | null>(dayjs().year().toString());
  const [isActive, setIsActive] = useState({
    yearSelect: false,
    monthSelect: false,
    userSelect: false,
  });

  const [params, setParams] = useState({
    year: dayjs().year().toString(),
    // month: null,
    userIdx: Number(id),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacationDetail", params],
    queryFn: () => api.getVacationDetail(params),
  });
  const {
    data: vacationStats,
    isLoading: vacationStats_isLoading,
    isError: vacationStats_isError,
  } = useQuery({
    queryKey: ["vacationStats", { year: params.year, userIdx: params.userIdx }],
    queryFn: () => api.getVacationStats({ year: params.year, userIdx: params.userIdx }),
  });

  const vacationDetail = data?.data.data;

  const vacationDetailSummary: LeaveSummaryRoot = vacationStats?.data.data;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectYear = (e: any) => {
    setParams((params) => ({ ...params, year: e }));
    setYearValue(e);
    setIsActive((prev) => ({ ...prev, yearSelect: false }));
  };

  // const submitCheck = (e: any) => {
  //   const monthParam = monthValue.length >= 1 ? monthValue.join(",") : null;

  //   setParams((params) => ({ ...params, month: monthParam }));
  //   setMonthSelectOpened(false);
  // };

  const [opened, { open, close }] = useDisclosure(false);
  const [openedAddDetails, { open: openAddDetails, close: closeAddDetails }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [modifyNoteOpened, { open: modifyNoteOpen, close: modifyNoteClose }] = useDisclosure(false);
  const [openedAttachmentModal, { open: openAttachmentModal, close: closeAttachmentModal }] = useDisclosure(false);
  const [currentRow, setCurrentRow] = useState();

  const deleteDetail = (row: any) => {
    openDelete();
    setCurrentRow(row);
  };

  const modifyNote = (row: any) => {
    modifyNoteOpen();
    setCurrentRow(row);
  };

  const selectAttachment = (row: any) => {
    setCurrentRow(row);
    openAttachmentModal();
  };
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={VACATION_DETAIL} />
      <Group justify="space-between" align="center">
        <Select
          styles={{
            root: { width: "max-content" },
            input: { background: "transparent", border: "none", fontSize: "var(--mantine-font-size-md)", fontWeight: 600 },
          }}
          comboboxProps={{
            withinPortal: false, // 포털 비활성화로 외부 클릭 감지 개선
            transitionProps: { transition: "pop", duration: 200 },
          }}
          w={150}
          label="회계연도"
          defaultValue={"2024년"}
          data={yearsList().map((item) => ({ value: item.toString(), label: `${item}년` }))}
          onChange={selectYear}
          value={yearValue}
          dropdownOpened={isActive.yearSelect}
          onBlur={() => setIsActive((prev) => ({ ...prev, yearSelect: false }))}
          onClick={() => {
            setIsActive((prev) => ({ ...prev, yearSelect: true }));
          }}
        />

        <Group>
          <Button onClick={open}>휴가 부여하기</Button>
          <Button onClick={openAddDetails}>휴가 부여 내역</Button>
          <Button>다운로드</Button>
        </Group>
      </Group>
      <VacationDetailSummary leaveSummary={vacationDetailSummary?.leaveSummary} leaveUsageStats={vacationDetailSummary?.leaveUsageStats} />
      <MonthFilter trigger={setParams} />
      <ScrollArea>
        <Table striped={vacationDetail?.length < 1 ? false : true} stickyHeader highlightOnHover={vacationDetail?.length < 1 ? false : true}>
          <TableHeader columns={VACATION_DETAIL_HEADER} />
          <TableBody data={vacationDetail} columns={VACATION_DETAIL_HEADER}>
            <VacationDetil
              data={vacationDetail}
              selectAttachment={selectAttachment}
              setCurrentRow={setCurrentRow}
              deleteDetail={deleteDetail}
              modifyNote={modifyNote}
            />
          </TableBody>
        </Table>
      </ScrollArea>
      {vacationDetail?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}

      <AddVacationModal opened={opened} close={close} />
      <AddVacationModalDetails opened={openedAddDetails} close={closeAddDetails} />
      <DeleteVacationModal opened={openedDelete} close={closeDelete} currentRow={currentRow} />
      <ModifyNote currentRow={currentRow} opened={modifyNoteOpened} close={modifyNoteClose} />
      <AttachmentModal opened={openedAttachmentModal} close={closeAttachmentModal} info={currentRow} />
    </Flex>
  );
}

export default page;
