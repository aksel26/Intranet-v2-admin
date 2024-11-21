"use client";

import { GRADE_NAME_LABEL, JOIN_DATE_LABEL, STAFF_NAME_LABEL } from "@/app/enums/staffInfo";
import { VACATION_TABLE_HEADER } from "@/app/enums/tableHeader";
import { ActionIcon, Box, Button, Flex, Group, Input, Menu, NumberFormatter, ScrollArea, Select, Table, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import IconDownload from "/public/icons/download.svg";
import { HEIGHT } from "@/app/enums/design";
const elements = Array.from({ length: 41 }, (_, index) => {
  return {
    position: index + 1,
    hqName: "HR",
    teamName: "HR Tech",
    userName: "김현자",
    gradeName: "본부장",
    userEmail: "asdfa@acghr.co.kr",
    vacationDay: 12,
    remailVacation: 2,
    joinDate: "2001-02-12",
    amount: 500000,
    name: "김현근2",
    etc: "워크샵 경품 (특별휴가 2개)",
  };
});

interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
}
function page() {
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      userGender: null,
      gradeIdx: null,
    },
  });

  const submitSearch = async (values: any) => {
    console.log("🚀 ~ submitSearch ~ values:", values);
    // const temp = cleanObject(values, "gradeIdx");
    // const result = { ...temp, pageNo: 1 };
    // setSearchParam(result);
  };

  const router = useRouter();

  const moveToDetail = () => {
    router.push("/main/attendance/vacation/12");
  };

  const rows = elements.map((element) => (
    <Table.Tr key={element.position} onClick={moveToDetail}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.hqName}</Table.Td>
      <Table.Td>{element.teamName}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.userEmail}</Table.Td>

      <Table.Td>
        <NumberFormatter thousandSeparator value={element.position === 3 ? 10 : element.vacationDay} />
      </Table.Td>
      <Table.Td>
        <NumberFormatter thousandSeparator value={element.position === 3 ? 4 : element.remailVacation} />
      </Table.Td>
      <Table.Td>{element.joinDate}</Table.Td>
      <Table.Td>{element.position === 3 ? element.etc : ""}</Table.Td>
      {/* <Table.Td>
        <Popover width={300} position="bottom-end" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown bg="var(--mantine-color-body)">
            <Stack>
              <Group align="end">
                <TextInput size="sm" label="총 사용금액 수정" placeholder="금액을 입력해 주세요." styles={{ root: { flex: 1 } }} />
                <Button size="sm" variant="light">
                  수정
                </Button>
              </Group>

              <Group align="end">
                <TextInput size="sm" label="비고 내용 작성" placeholder="비고 내용을 입력해 주세요." styles={{ root: { flex: 1 } }} />
                <Button size="sm" variant="light">
                  저장
                </Button>
              </Group>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Table.Td> */}
    </Table.Tr>
  ));
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        직원 휴가 관리
      </Title>

      <Group justify="space-between" align="flex-end" mb={"md"}>
        <form onSubmit={form.onSubmit(submitSearch)}>
          <Group gap={"xs"} align="end">
            <Select label={GRADE_NAME_LABEL} data={[]} clearable placeholder="직급 선택" key={form.key("gradeIdx")} {...form.getInputProps("gradeIdx")} />
            <DatePickerInput
              w={200}
              valueFormat="YYYY-MM-DD"
              firstDayOfWeek={0}
              type="range"
              locale="ko"
              allowSingleDateInRange
              label={JOIN_DATE_LABEL}
              placeholder="입사일 선택"
              // value={value}
              // onChange={selectDateRange}
              clearable
            />
            <Select
              clearable
              label={"성별"}
              data={[
                { label: "남", value: "M" },
                { label: "여", value: "W" },
              ]}
              placeholder="성별"
              key={form.key("userGender")}
              {...form.getInputProps("userGender")}
            />
            <Input.Wrapper label={STAFF_NAME_LABEL}>
              <Input w={250} placeholder="검색 대상의 성영을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
            </Input.Wrapper>

            <Button type="submit" size="sm" radius={"md"}>
              검색
            </Button>
          </Group>
        </form>
        <Group>
          <Button variant="light" size="sm" radius={"md"} rightSection={<IconDownload width="15" height="15" />}>
            내려받기
          </Button>
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="light" size={"lg"}>
                <IconAdjust width="20" height="20" strokeWidth="1.5" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>정렬</Menu.Label>
              <Menu.Item>직급</Menu.Item>
              <Menu.Item>생년월일</Menu.Item>
              <Menu.Item>입사일</Menu.Item>
              <Menu.Item>소속</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
      {/* <Box pos={"relative"} h={"50vh"}> */}
      {/* <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{  type: "bars" }} /> */}
      <ScrollArea>
        <Table striped stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {VACATION_TABLE_HEADER.map((item: string, index: number) => (
                <Table.Th key={index}>{item}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      {/* {isLoading ? null : (
            <Group justify="center" my={30}>
              <Pagination total={10} radius="md" />
            </Group>
          )} */}
      {/* </Box> */}
    </Flex>
  );
}

export default page;
