"use client";
import * as postApi from "@/app/api/post/postApi";
import * as api from "@/app/api/get/getApi";
import notification from "@/app/utils/notification";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  NumberFormatter,
  NumberInput,
  Paper,
  Popover,
  Radio,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import More from "/public/icons/dots.svg";
import { useRef, useState } from "react";
import Edit from "/public/icons/edit.svg";
import { WELFARE_CONFIG_HEADER } from "@/app/enums/tableHeader";

interface FormValues {
  period: string;
  welfareBudget: number | null;
}
function page() {
  const queryClient = useQueryClient();
  const [searchParam, setSearchParam] = useState({
    halfYear: "H1",
  });
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<string | number>("");

  const { data, isLoading, isError } = useQuery({ queryKey: ["welfareBudget", searchParam], queryFn: () => api.getWelfaresBudget(searchParam) });
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointBudget(values),
  });
  const { mutate: updateBudgetByPerson } = useMutation({
    mutationFn: (values: any) => postApi.updateWelfarePointByPerson(values),
  });

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      period: "H1",
      welfareBudget: null,
    },
  });

  const submitWelfareBudget = (values: FormValues) => {
    mutate(values, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["welfareBudget"] });
        notification({ title: "복지포인트", message: "복지포인트 기본금액 설정을 완료하였습니다.", color: "green" });
        form.reset();
      },
      onError: () => {
        notification({ title: "복지포인트", message: "복지포인트 기본금액 설정을 완료하였습니다.", color: "green" });
      },
    });
  };

  const handleSubmitUpdateByPerson = () => {
    updateBudgetByPerson(
      { body: { welfareBudget: newBudget }, params: openedRowId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["welfareBudget"] });
          notification({ title: "복지포인트", message: "복지포인트 기본금액 설정을 완료하였습니다.", color: "green" });
          setOpenedRowId(null);
          setNewBudget("");
        },
      }
    );
  };

  const rows = data?.data.data.map((element: any, index: number) => (
    <Table.Tr key={element.welfareStatsIdx}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.gradeName}</Table.Td>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>
        <Group>
          <NumberFormatter thousandSeparator value={element.welfareBudget} suffix=" 원" />
          <Popover
            opened={openedRowId === element.welfareStatsIdx}
            onChange={() => setOpenedRowId(openedRowId === element.welfareStatsIdx ? null : element.welfareStatsIdx)}
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
                onClick={() => setOpenedRowId(openedRowId === element.welfareStatsIdx ? null : element.welfareStatsIdx)}
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
      <Table.Td>{element.note}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box pb={50}>
      <Title order={3} mb={"xl"}>
        복지포인트 설정
      </Title>
      <Stack mb={"xl"} gap={"sm"}>
        <Paper p="lg" withBorder radius={"lg"} px={"xl"} w={"max-content"}>
          <Stack gap={"lg"}>
            <Text size="md" fw={700}>
              복지포인트 기본금액 설정
            </Text>

            <form onSubmit={form.onSubmit(submitWelfareBudget)}>
              <Group align="end" gap={"xl"}>
                <Radio.Group
                  label="적용 기간 설정"
                  description="복지포인트가 설정한 기간에 일괄적으로 적용됩니다."
                  withAsterisk
                  styles={{ description: { marginBottom: 17 } }}
                  key={form.key("period")}
                  {...form.getInputProps("period")}
                >
                  <Group mt="xs">
                    {/* <Checkbox value="1년" label="1년" /> */}
                    <Radio value="H1" label="상반기" />
                    <Radio value="H2" label="하반기" />
                  </Group>
                </Radio.Group>
                <Divider orientation="vertical" size={"sm"} />
                <Group align="end" gap={"xl"}>
                  <NumberInput
                    withAsterisk
                    label="복지포인트 금액"
                    description="설정될 복지포인트 기본 금액을 입력해 주세요."
                    placeholder="숫자를 입력해 주세요."
                    thousandSeparator=","
                    hideControls
                    suffix=" 원"
                    // onChange={defaultPrice}
                    key={form.key("welfareBudget")}
                    {...form.getInputProps("welfareBudget")}
                  />

                  <Button type="submit" radius={"md"}>
                    저장
                  </Button>
                </Group>
              </Group>
            </form>
          </Stack>
        </Paper>
      </Stack>
      <Divider my="md" />
      <Box pos={"relative"} h={"50vh"}>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ type: "bars" }} />
        <Table striped stickyHeader stickyHeaderOffset={50} highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {WELFARE_CONFIG_HEADER.map((item: string) => (
                <Table.Th>{item}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default page;
