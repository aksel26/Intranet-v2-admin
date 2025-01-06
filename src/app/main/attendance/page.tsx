"use client";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_ATTENDANCE } from "@/app/enums/breadscrumbs";
import { ATTENDANCE_HEADER } from "@/app/enums/tableHeader";
import { Button, Divider, Flex, Group, Modal, ScrollArea, Select, Stack, Table, Text, TextInput } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconCalendar from "/public/icons/calendar.svg";
import IconClock from "/public/icons/clock.svg";
import IconLink from "/public/icons/external-link.svg";

function page() {
  const [welfareStats, setWelfareStats] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModify, { open: openModify, close: closeModify }] = useDisclosure(false);
  const [openedModifyNote, { open: openModifyNote, close: closeModifyNote }] = useDisclosure(false);

  useEffect(() => {
    const stats = [];
    for (let i = 2; i <= 40; i++) {
      stats.push({
        id: `emp${String(i).padStart(3, "0")}`,
        position: ["대리", "과장", "부장"][Math.floor(Math.random() * 3)],
        name: ["김현명", "이철수", "박영희", "최민수", "정지훈"][Math.floor(Math.random() * 5)],
        department: ["개발팀", "인사팀", "마케팅팀", "영업팀"][Math.floor(Math.random() * 4)],
        attendanceDate: `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(2, "0")}`,
        startTime: ["09:00", "09:15", "09:30"][Math.floor(Math.random() * 3)],
        endTime: ["18:00", "18:15", "18:30"][Math.floor(Math.random() * 3)],
        workHours: ["8시간", "7시간 45분", "7시간 30분"][Math.floor(Math.random() * 3)],
        overWork: ["1시간", "45분", "1시간 30분"][Math.floor(Math.random() * 3)],
        isLate: ["정상", "지각"][Math.floor(Math.random() * 2)],
        status: ["정상", "휴가", "병가"][Math.floor(Math.random() * 3)],
        reasonForChange: ["없음", "회의", "출장"][Math.floor(Math.random() * 3)],
        device: ["모바일", "PC"][Math.floor(Math.random() * 2)],
        notes: ["없음", "프로젝트 마감", "고객 미팅"][Math.floor(Math.random() * 3)],
        updatedAt: `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(2, "0")}`,
        createdAt: `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(2, "0")}`,
      });
    }
    setWelfareStats(stats);
  }, []);

  const router = useRouter();
  const moveDetail = () => {
    router.push("/main/attendance/vacation/12");
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadScrumb level={BREADSCRUMBS_ATTENDANCE} />
      <Group justify="space-between" my={"md"} align="center">
        <DatePickerInput
          valueFormat="YYYY-MM-DD"
          firstDayOfWeek={0}
          type="range"
          locale="ko"
          allowSingleDateInRange
          variant="unstyled"
          leftSection={<IconCalendar />}
          placeholder="조회하실 기간을 선택해 주세요."
          size="sm"
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-md)",
              fontWeight: 700,
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
          // value={value}
          // onChange={selectDateRange}
          clearable
        />

        <Group>
          <Button size="sm" radius="md">
            다운로드
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={welfareStats?.length < 1 ? false : true} stickyHeader highlightOnHover={welfareStats?.length < 1 ? false : true}>
          <TableHeader columns={ATTENDANCE_HEADER} />
          <TableBody data={welfareStats} columns={ATTENDANCE_HEADER}>
            {/* <Table> */}
            {welfareStats.map((employee: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{employee.id}</Table.Td>
                <Table.Td>{employee.position}</Table.Td>
                <Table.Td>{employee.name}</Table.Td>
                <Table.Td>{employee.department}</Table.Td>
                <Table.Td>{employee.attendanceDate}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8} onClick={open}>
                    {employee.startTime}
                  </Button>
                </Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8}>
                    {employee.endTime}
                  </Button>
                </Table.Td>
                <Table.Td>{employee.workHours}</Table.Td>
                <Table.Td>{employee.overWork}</Table.Td>
                <Table.Td>{employee.isLate}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8} rightSection={<IconLink strokeWidth="1.3" />} onClick={moveDetail}>
                    {employee.status}
                  </Button>
                </Table.Td>
                <Table.Td>{employee.reasonForChange}</Table.Td>
                <Table.Td>{employee.device}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="sm" px={8} onClick={openModifyNote}>
                    {employee.notes}
                  </Button>
                </Table.Td>
                <Table.Td>{employee.updatedAt}</Table.Td>
                <Table.Td>{employee.createdAt}</Table.Td>
                {/* <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="light" aria-label="Settings">
                        <IconMore />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item>시간 수정</Menu.Item>
                      <Menu.Item>특이사항 수정</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td> */}
              </Table.Tr>
            ))}
            {/* </Table> */}
            {/* <WelfareSettlement data={welfareStats} selectedRows={selectedRows} setSelectedRows={setSelectedRows} /> */}
          </TableBody>
        </Table>
      </ScrollArea>
      <Modal opened={opened} onClose={close} title="출근시간 수정" centered>
        <Stack gap="md">
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              등록일시
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:22:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              대상 날짜
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:30:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              성명
            </Text>
            <Text fw={600} fz={"sm"}>
              이철호
            </Text>
          </Group>

          <TimeInput leftSection={<IconClock />} withSeconds label="변경 시간" />
          <Group wrap="nowrap">
            <Button fullWidth size="sm" variant="light">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={close}>
              닫기
            </Button>
          </Group>
        </Stack>
        {/* Modal content */}
      </Modal>

      <Modal opened={openedModify} onClose={closeModify} title="근태 정보 수정" centered>
        <Stack gap="md">
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              등록일시
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:22:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              대상 날짜
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              성명
            </Text>
            <Text fw={600} fz={"sm"}>
              이철호
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              근태
            </Text>
            <Text fw={600} fz={"sm"}>
              병가
            </Text>
          </Group>

          <Divider />

          <Select
            label="근태 선택"
            placeholder="변경할 근태 종류를 선택해 주세요."
            data={["연차", "반차", "반반차", "병가", "보건휴가", "경조휴무", "특별휴무"]}
          />

          <TextInput
            label="근태 수정사유 입력"
            placeholder="근태 수정 사유를 입력해 주세요."
            // inputWrapperOrder={['label', 'error', 'input', 'description']}
          />
          <Group wrap="nowrap">
            <Button fullWidth size="sm" variant="light">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={closeModify}>
              닫기
            </Button>
          </Group>
        </Stack>
        {/* Modal content */}
      </Modal>
      <Modal opened={openedModifyNote} onClose={closeModifyNote} title="특이사항 수정" centered>
        <Stack gap="md">
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              등록일시
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33 09:22:11
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              대상 날짜
            </Text>
            <Text fw={600} fz={"sm"}>
              2024-12-33
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"}>
              성명
            </Text>
            <Text fw={600} fz={"sm"}>
              이철호
            </Text>
          </Group>

          <Divider />

          <TextInput label="특이사항" placeholder="특이사항 내용을 입력해 주세요." />
          <Group wrap="nowrap">
            <Button fullWidth size="sm" variant="light">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={closeModifyNote}>
              닫기
            </Button>
          </Group>
        </Stack>
        {/* Modal content */}
      </Modal>
    </Flex>
  );
}

export default page;
