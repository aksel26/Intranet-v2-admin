import { Button, Divider, Group, Modal, ScrollArea, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DeleteAddVacationModal from "./DeleteAddVacationModal";
import ModifyAddVacationModal from "./ModifyAddVacationModal";
import { useQuery } from "@tanstack/react-query";
import { getAddDetails } from "@/app/api/get/getApi";
import dayjs from "dayjs";
import { useState } from "react";
import { getYearRange } from "@/app/utils/selectTimeList";
import { LeaveAddDetails } from "@/app/type/vacationDetail";
import { dateFormatYYYYMMDD } from "@/app/utils/dateFormat";

function AddVacationModalDetails({ opened, close }: any) {
  const [deleteModalOpened, { close: deleteModalClose, open: deleteModalOpen }] = useDisclosure(false);
  const [modifyModalOpened, { close: modifyModalClose, open: modifyModalOpen }] = useDisclosure(false);

  const [params, setParams] = useState({ year: dayjs().year().toString() });

  const { data, isLoading, isError } = useQuery({ queryKey: ["addVacationDetails", params], queryFn: () => getAddDetails(params), enabled: !!opened });

  const addDetails = data?.data.data;

  const selectYear = (e: string | null) => {
    if (e) {
      setParams((params) => ({ ...params, year: e.toString() }));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Stack gap={3}>
          <Text fz={"lg"}>휴가/연차 부여 내역</Text>
          <Text fz={"sm"} c={"dimmed"}>
            휴가/연차 부여 내역 확인
          </Text>
        </Stack>
      }
      centered
    >
      {isLoading ? (
        <Text fz={"xs"} c={"dimmed"}>
          로딩중입니다.
        </Text>
      ) : (
        <Group justify="space-between" align="center">
          <Text c={"dimmed"} fz={"sm"}>
            총
            <Text c={"black"} fz={"sm"} component="span" fw={600} ml={5}>
              {addDetails?.length}건
            </Text>
            이 조회되었습니다.
          </Text>
          <Select
            value={params.year}
            onChange={selectYear}
            data={getYearRange().map((year: number) => year.toString())}
            defaultValue={dayjs().year().toString()}
            size="xs"
            w={100}
          />
        </Group>
      )}
      {/* <Divider my={"md"} /> */}
      <ScrollArea h={500} pb={"md"}>
        <Stack my={"lg"} gap={"xl"}>
          {addDetails?.map((item: LeaveAddDetails) => (
            <Group align="center" justify="space-between">
              <Stack gap={"xs"}>
                <Group>
                  <Stack gap={1}>
                    <Text c={"dimmed"} fz={"xs"}>
                      대상자
                    </Text>
                    <Text fz={"xs"}>{item.userName}</Text>
                  </Stack>

                  <Stack gap={1}>
                    <Text c={"dimmed"} fz={"xs"}>
                      유형
                    </Text>
                    <Text fz={"xs"}>{item.leaveType}</Text>
                  </Stack>
                  <Stack gap={1}>
                    <Text c={"dimmed"} fz={"xs"}>
                      개수
                    </Text>
                    <Text fz={"xs"}>{item.extraLeave}개</Text>
                  </Stack>

                  <Stack gap={1}>
                    <Text c={"dimmed"} fz={"xs"}>
                      작성자
                    </Text>
                    <Text fz={"xs"}>{item.adminName}</Text>
                  </Stack>
                  <Stack gap={1}>
                    <Text c={"dimmed"} fz={"xs"}>
                      작성일
                    </Text>
                    <Text fz={"xs"}>{dateFormatYYYYMMDD(item.createdAt)}</Text>
                  </Stack>
                </Group>
                <Group>
                  <Text w={30} fz={"xs"} c={"dimmed"}>
                    내용
                  </Text>
                  <Text fz={"xs"}>{item.note || "-"}</Text>
                </Group>
              </Stack>
              <Group gap={"xs"}>
                <Button size="compact-xs" variant="light" onClick={modifyModalOpen}>
                  수정
                </Button>
                <Button size="compact-xs" variant="light" color="red.5" onClick={deleteModalOpen}>
                  삭제
                </Button>
              </Group>
            </Group>
          ))}
        </Stack>
      </ScrollArea>
      <Button variant="light" fullWidth color="gray">
        닫기
      </Button>
      <DeleteAddVacationModal opened={deleteModalOpened} close={deleteModalClose} />
      <ModifyAddVacationModal opened={modifyModalOpened} close={modifyModalClose} />
    </Modal>
  );
}

export default AddVacationModalDetails;
