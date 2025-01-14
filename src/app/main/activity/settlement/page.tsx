"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import PageList from "@/app/components/Global/PageList";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { ActivitySettlement } from "@/app/components/table/activity/ActivitySettlement";
import { ACTIVITY_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { Alert, Button, Flex, Group, Modal, ScrollArea, Select, Stack, Table, Title } from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import IconInfo from "/public/icons/info-circle.svg";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { ACTIVITY_CONFIG, NOTICE } from "@/app/enums/breadcrumbs";
import SettlementBaseAmountDrawer from "@/app/components/activity/settlement/SettlementBaseAmountDrawer";

function page() {
  const [value, setValue] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [year, setYear] = useState<Date | null>(dayjs().toDate());
  const [activityStats, setActivityStats] = useState([]);
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

  const [baseAmountOpened, { open: openBaseAmount, close: closeBaseAmount }] = useDisclosure(false);
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

  useEffect(() => {
    if (data?.data.data.activityStats.length === 0) {
      setActivityStats([]);
    } else {
      setActivityStats(data?.data.data.activityStats);
    }
  }, [data]);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadCrumb level={ACTIVITY_CONFIG} />

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
          <Button size="sm" radius="md" onClick={openBaseAmount}>
            기본금액 설정
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={activityStats?.length < 1 ? false : true} stickyHeader highlightOnHover={activityStats?.length < 1 ? false : true}>
          <TableHeader columns={ACTIVITY_SETTLEMENT_HEADER} />
          <TableBody data={activityStats} columns={ACTIVITY_SETTLEMENT_HEADER}>
            <ActivitySettlement data={activityStats} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
          </TableBody>
        </Table>
      </ScrollArea>
      {activityStats?.length < 1 ? null : <PageList totalPage={data?.data.data.totalPage} />}

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

      <SettlementBaseAmountDrawer opened={baseAmountOpened} close={closeBaseAmount} />
    </Flex>
  );
}

export default page;
