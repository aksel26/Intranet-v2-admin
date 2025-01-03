"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { WELFARE_CONFIG_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Drawer,
  Flex,
  Group,
  LoadingOverlay,
  NumberFormatter,
  NumberInput,
  Pagination,
  Popover,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Edit from "/public/icons/edit.svg";
import NoList from "/public/icons/no-list.svg";
import EditNote from "/public/icons/square-rounded-plus.svg";
interface FormValues {
  period: string;
  activityBudget: number | null;
}
function page() {
  const queryClient = useQueryClient();
  const [searchParam, setSearchParam] = useState({
    halfYear: "H1",
  });
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  const [noteOpenedRowId, setNoteOpenedRowId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<string | number>("");
  const saveNoteRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, isError } = useQuery({ queryKey: ["activitiesBudget", searchParam], queryFn: () => api.getActivitiesBudget(searchParam) });
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointBudget(values),
  });
  const { mutate: updateBudgetByPerson } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointByPerson(values),
  });
  const { mutate: updateNoteByPerson } = useMutation({
    mutationFn: (values: any) => postApi.updateNoteByPerson(values),
  });
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      period: "H1",
      activityBudget: null,
    },
  });

  const submitWelfareBudget = (values: FormValues) => {
    mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["activitiesBudget"] });
        notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
        form.reset();
      },
      onError: () => {
        notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
      },
    });
  };

  const handleSubmitUpdateByPerson = () => {
    updateBudgetByPerson(
      { body: { activityBudget: newBudget }, params: openedRowId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["activityBudget"] });
          notification({ title: "활동비", message: "활동비 기본금액 설정을 완료하였습니다.", color: "green" });
          setOpenedRowId(null);
          setNewBudget("");
        },
      }
    );
  };
  const saveNote = (idx: number) => {
    let note = null;
    if (saveNoteRef.current) {
      if (saveNoteRef.current.value === "") note = null;
      else {
        note = saveNoteRef.current.value;
      }
    }
    updateNoteByPerson(
      { body: { note: note }, queryParams: idx },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["activitiesBudget"] });
          notification({
            title: "비고 내용 수정",
            color: "green",
            message: "비고 내용이 수정되었습니다.",
          });
          setNoteOpenedRowId(null);
        },
        onError: () => {
          notification({
            title: "비고 내용 수정",
            color: "red",
            message: "비고 내용이 수정을 실패하였습니다.",
          });
        },
      }
    );
  };
  const pressKey = (e: any, idx: number) => {
    const { key } = e;
    if (key === "Enter") {
      saveNote(idx);
    }
  };

  const selectPeriod = (e: any) => {
    setSearchParam((prev) => ({ ...prev, halfYear: e }));
  };
  const rows = data?.data.data.map((element: any, index: number) => (
    <Table.Tr key={element.activityStatsIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <Group>
          <NumberFormatter thousandSeparator value={element.activityBudget} suffix=" 원" />
          <Popover
            opened={openedRowId === element.activityStatsIdx}
            onChange={() => setOpenedRowId(openedRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
            width={300}
            position="bottom-end"
            withArrow
            shadow="md"
            trapFocus
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size={"sm"}
                color="blue.4"
                onClick={() => setOpenedRowId(openedRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
              >
                <Edit width="15" height="15" strokeWidth="1.0" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown bg="var(--mantine-color-body)">
              <Group align="end">
                <NumberInput
                  thousandSeparator
                  hideControls
                  size="sm"
                  label="총 사용금액 수정"
                  placeholder="금액을 입력해 주세요."
                  styles={{ root: { flex: 1 } }}
                  onChange={setNewBudget}
                  value={newBudget}
                />
                <Button size="sm" variant="light" onClick={handleSubmitUpdateByPerson}>
                  수정
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Table.Td>
      <Table.Td>
        <Popover
          width={300}
          position="bottom-end"
          withArrow
          shadow="md"
          trapFocus
          opened={noteOpenedRowId === element.activityStatsIdx}
          onChange={() => setNoteOpenedRowId(noteOpenedRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
        >
          {element.note === null ? (
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size={"sm"}
                color="gray.7"
                onClick={() => setNoteOpenedRowId(noteOpenedRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
              >
                <EditNote width="17" height="17" strokeWidth="1.0" />
              </ActionIcon>
            </Popover.Target>
          ) : (
            <Group>
              {element.note}
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  size={"sm"}
                  color="blue.4"
                  onClick={() => setNoteOpenedRowId(noteOpenedRowId === element.activityStatsIdx ? null : element.activityStatsIdx)}
                >
                  <Edit width="15" height="15" strokeWidth="1.0" />
                </ActionIcon>
              </Popover.Target>
            </Group>
          )}

          <Popover.Dropdown bg="var(--mantine-color-body)">
            <Group align="end">
              <TextInput
                onKeyDown={(e) => pressKey(e, element.activityStatsIdx)}
                ref={saveNoteRef}
                size="sm"
                label="비고 내용 작성"
                placeholder="비고 내용을 입력해 주세요."
                styles={{ root: { flex: 1 } }}
              />
              <Button size="sm" variant="light" onClick={() => saveNote(element.activityStatsIdx)}>
                저장
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        활동비 설정
      </Title>
      <Group justify="space-between">
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
              fontSize: "var(--mantine-font-size-lg)",
              fontWeight: 700,
            },
          }}
        />
        <Button size="sm" onClick={open}>
          기본금액 설정
        </Button>
      </Group>
      {data?.data.data.length < 1 ? (
        <Center h={200}>
          <Stack align="center">
            <NoList width="30" height="30" />
            <Text c={"dimmed"}>정산 내역 목록이 없습니다.</Text>
          </Stack>
        </Center>
      ) : (
        <>
          <ScrollArea>
            <Box pos={"relative"} h={"100%"}>
              <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ type: "bars" }} />
              <Table striped stickyHeader highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    {WELFARE_CONFIG_HEADER.map((item: string, key: number) => (
                      <Table.Th key={key}>{item}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Box>
          </ScrollArea>
        </>
      )}
      <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="활동비 기본금액 설정" position="right">
        <form onSubmit={form.onSubmit(submitWelfareBudget)}>
          <Stack gap={50} py={"md"}>
            <Radio.Group
              label="적용 기간 설정"
              description="복지포인트가 설정한 기간에 일괄적으로 적용됩니다."
              withAsterisk
              styles={{ description: { marginBottom: 17 } }}
              key={form.key("period")}
              {...form.getInputProps("period")}
            >
              <Group mt="xs">
                <Radio value="H1" label="상반기" />
                <Radio value="H2" label="하반기" />
              </Group>
            </Radio.Group>

            <NumberInput
              withAsterisk
              label="활동비 금액"
              description="설정될 활동비 기본 금액을 입력해 주세요."
              placeholder="숫자를 입력해 주세요."
              thousandSeparator=","
              hideControls
              suffix=" 원"
              key={form.key("activityBudget")}
              {...form.getInputProps("activityBudget")}
            />
            <Group wrap="nowrap">
              <Button fullWidth type="submit" radius={"md"}>
                저장
              </Button>
              <Button fullWidth onClick={close} radius={"md"} variant="light" color="gray">
                닫기
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </Flex>
  );
}

export default page;
