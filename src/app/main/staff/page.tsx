"use client";
import { GRADE_NAME_LABEL, GRADE_NAME_LIST, JOIN_DATE_LABEL, STAFF_NAME_LABEL } from "@/app/enums/staffInfo";
import { STAFF_TABLE_HEADER } from "@/app/enums/tableHeader";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Menu,
  Modal,
  Pagination,
  Popover,
  Select,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useRef, useState } from "react";
import IconAdjust from "/public/icons/adjustments-alt.svg";
import More from "/public/icons/dots.svg";
import IconDownload from "/public/icons/download.svg";
import IconInfo from "/public/icons/info-circle.svg";
import IconUserExclamation from "/public/icons/exclamation-circle.svg";
import { useDisclosure } from "@mantine/hooks";
import JoinModal from "@/app/components/staff/JoinModal";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/app/api/get/getApi";
import { genderFormat } from "@/app/utils/gender";
import { TStaffs } from "@/app/type/staff";
import { useForm } from "@mantine/form";
interface FormValues {
  userName?: string;
  userGender?: string | null;
  gradeIdx?: number | null;
}

function cleanObject(obj: any) {
  // Create a copy of the object to avoid mutating the original
  const cleanedObj = { ...obj };

  // Remove keys with empty string values
  Object.keys(cleanedObj).forEach((key) => {
    if (cleanedObj[key] === "" || cleanedObj[key] === null) {
      delete cleanedObj[key];
    }
  });

  // Convert gradeIdx to number if it exists
  if ("gradeIdx" in cleanedObj) {
    cleanedObj.gradeIdx = Number(cleanedObj.gradeIdx);
  }

  return cleanedObj;
}

function page() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const [searchParam, setSearchParam] = useState({
    pageNo: 1,
  });
  const form = useForm<FormValues>({
    initialValues: {
      userName: "",
      userGender: null,
      gradeIdx: null,
    },
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["staffs", searchParam], queryFn: () => api.getStaffs(searchParam) });
  const { data: gradeIds, isLoading: gradeIds_isLoading, isError: gradeIds_isError } = useQuery({ queryKey: ["gradeIds"], queryFn: () => api.getGradeIds() });

  const [gradeIdData, setGradeIdData] = useState();

  useEffect(() => {
    gradeIds &&
      setGradeIdData(gradeIds?.data.data.map((item: { gradeIdx: number; gradeName: string }) => ({ value: item.gradeIdx.toString(), label: item.gradeName })));
  }, [gradeIds]);

  const submitSearch = async (values: any) => {
    const temp = cleanObject(values);
    const result = { ...temp, pageNo: 1 };
    setSearchParam(result);
  };

  const rows = data?.data.data.users.map((element: TStaffs, index: number) => (
    <Table.Tr key={element.userIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{`${element.hqName}`}</Table.Td>
      <Table.Td>{`${element.teamName}`}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{element.id || ""}</Table.Td>
      <Table.Td>{element.userCell}</Table.Td>
      <Table.Td>{element.userAddress}</Table.Td>
      <Table.Td>{element.userEmail}</Table.Td>
      <Table.Td>{genderFormat(element.userGender)}</Table.Td>
      <Table.Td>{element.userBirth}</Table.Td>
      <Table.Td>{element.joinDate}</Table.Td>
      <Table.Td>
        {element.comment ? (
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="subtle" color="red.4">
                <IconUserExclamation width="15" height="15" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">재택근무</Text>
              <Text size="xs">지각 : 3회</Text>
              <Text size="xs">육아휴직</Text>
            </Popover.Dropdown>
          </Popover>
        ) : (
          "-"
        )}
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="light" size={"sm"}>
              <More width="15" height="15" strokeWidth="1.5" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>정보 수정</Menu.Item>
            <Menu.Item onClick={openDeleteModal} color="red">
              삭제
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex direction={"column"} justify={"space-between"} pb={50}>
      <Box>
        <Text fw={900} size="xl" mb={"xl"}>
          직원 목록 조회
        </Text>
        <Group justify="space-between" mb={"md"}>
          <form onSubmit={form.onSubmit(submitSearch)}>
            <Group gap={"xs"} align="end">
              <Select
                label={GRADE_NAME_LABEL}
                data={gradeIdData || []}
                clearable
                placeholder="직급 선택"
                key={form.key("gradeIdx")}
                {...form.getInputProps("gradeIdx")}
              />
              <DatePickerInput type="range" label={JOIN_DATE_LABEL} placeholder="입사일 선택" value={value} onChange={setValue} />
              <Select
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
                <Input placeholder="검색 대상의 성영을 입력해 주세요." radius="md" key={form.key("userName")} {...form.getInputProps("userName")} />
              </Input.Wrapper>

              <Button type="submit" size="sm" radius={"md"}>
                검색
              </Button>
            </Group>
          </form>
          <Group>
            <Button variant="light" size="sm" radius={"md"} onClick={open}>
              직원 등록
            </Button>
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

        <Box pos={"relative"} h={"50vh"}>
          <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: "pink", type: "bars" }} />
          <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {STAFF_TABLE_HEADER.map((item: string, index: number) => (
                  <Table.Th key={index}>{item}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          {isLoading ? null : (
            <Group justify="center" my={30}>
              <Pagination total={10} radius="md" />
            </Group>
          )}
        </Box>
      </Box>

      <Modal opened={opened} onClose={close} title="직원 등록" centered>
        <JoinModal close={close} />
      </Modal>
      <Modal opened={deleteModal} onClose={closeDeleteModal} centered title="직원 삭제">
        <Stack>
          <Alert variant="outline" color="red" radius="md" title="해당 직원을 삭제하시겠습니까?" icon={<IconInfo />}>
            삭제 후 되돌릴 수 없습니다.
            <Group mt={"sm"} gap={"xs"}>
              <Text size="xs" c={"gray.7"}>
                김현근2
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                hkkim
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                010-3232-2322
              </Text>
              <Divider orientation="vertical" size={"sm"} />
              <Text size="xs" c={"gray.7"}>
                asdf@asdf.com{" "}
              </Text>
            </Group>
          </Alert>
          <Group wrap="nowrap">
            <Button variant="light" color="red" fullWidth>
              삭제하기
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={closeDeleteModal}>
              닫기
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Flex>
  );
}

export default page;
