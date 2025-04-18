"use client";

import { getLunchGroup } from "@/app/api/get/getApi";
import { resetLunchGroupConfig, setLunchGroup } from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Drawer,
  Group,
  List,
  LoadingOverlay,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { Suspense, useEffect, useState } from "react";
import IconInfo from "/public/icons/info-circle.svg";
const GroupNumber = ({ groupNumber }: { groupNumber: number }) => {
  return (
    <Avatar color="blue" radius="md">
      <Text>{`${groupNumber}조`}</Text>
    </Avatar>
  );
};

interface TLunchGroupInit {
  total: undefined | number | string;
  perGroup: undefined | number | string;
  notice: readonly string[] | undefined | number | null;
  sDate: null | Date;
  eDate: null | Date;
  groups: any[];
}
function LunchGroup() {
  const { data: lunchGroup, isLoading: lunchGroupLoading, isError: lunchGroupError } = useQuery({ queryKey: ["lunchGroup"], queryFn: () => getLunchGroup() });
  console.log(lunchGroup);
  const [opened, { open, close }] = useDisclosure(false);
  const [resetModalOpened, { open: openResetModal, close: closeResetModal }] = useDisclosure(false);
  const [lunchGroupDate, setLunchGroupDate] = useState<[Date | null, Date | null]>([null, null]);
  const { mutate } = useMutation({
    mutationFn: (values: any) => setLunchGroup(values),
  });
  const { mutate: resetLunchGroup } = useMutation({
    mutationFn: () => resetLunchGroupConfig(),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      total: null,
      perGroup: null,
      sDate: "",
      eDate: "",
      notice: "",
    },
  });

  const [initialValue, setInitialValue] = useState<TLunchGroupInit>({
    total: undefined,
    perGroup: undefined,
    notice: null,
    sDate: null,
    eDate: null,
    groups: [],
  });

  useEffect(() => {
    if (lunchGroup) {
      const { total, perGroup, notice, sDate, eDate, groups } = lunchGroup.data.data;
      setInitialValue({
        total,
        perGroup,
        notice,
        sDate: dayjs(sDate).toDate(),
        eDate: dayjs(eDate).toDate(),
        groups,
      });
    }
  }, [lunchGroup]);

  const queyrClient = useQueryClient();

  const handleReset = () => {
    resetLunchGroup(undefined, {
      onSuccess: async () => {
        await queyrClient.invalidateQueries({ queryKey: ["lunchGroup"] });
        notification({
          color: "green",
          message: "점심조 설정이 초기화되었습니다.",
          title: "점심조 설정 초기화",
        });
        closeResetModal();
      },
    });
  };

  const submit = (values: any) => {
    console.log("🚀 ~ submit ~ values:", values);

    const temp = { ...values };
    temp.sDate = dayjs(temp.date[0]).format("YYYY-MM-DD");
    temp.eDate = dayjs(temp.date[1]).format("YYYY-MM-DD");
    mutate(temp, {
      onSuccess: async () => {
        await queyrClient.invalidateQueries({ queryKey: ["lunchGroup"] });
        notification({
          color: "green",
          message: "점심조 뽑기 설정이 완료되었습니다.",
          title: "점심조 뽑기 설정",
        });
        form.reset();
        close();
        setLunchGroupDate([null, null]);
      },
      onError: () => {
        notification({
          color: "red",
          message: "점심조 뽑기 설정을 실패하였습니다.",
          title: "점심조 뽑기 설정",
        });
      },
    });
  };

  return (
    <Stack pt={"md"} px={"md"} h={"inherit"}>
      <Group justify="space-between">
        <Group align="flex-end" gap={"xl"}>
          <NumberInput
            hideControls
            value={initialValue?.total}
            label="총원"
            description="점심조 참여 총 인원입니다."
            placeholder="점심조 참여인원"
            readOnly
            onChange={() => {}}
            variant="unstyled"
          />
          <NumberInput
            hideControls
            value={initialValue?.perGroup}
            label="조별 인원"
            description="한 조에 들어갈 인원입니다."
            placeholder="조 인원 수"
            readOnly
            variant="unstyled"
            onChange={() => {}}
          />

          <DatePickerInput
            valueFormat="MM월 D일 dddd"
            firstDayOfWeek={0}
            allowSingleDateInRange
            locale="ko"
            type="range"
            clearable
            label="점심조 기간"
            placeholder="점심조 기간"
            variant="unstyled"
            readOnly
            onChange={() => {}}
            value={[initialValue?.sDate, initialValue?.eDate]}
          />
          <TextInput readOnly variant="unstyled" label="비고" placeholder="비고사항" value={initialValue?.notice || ""} />
        </Group>
        <Group>
          <Button size="xs" variant="light" onClick={openResetModal} color="red">
            설정 초기화
          </Button>
          <Button size="xs" variant="light" onClick={open}>
            점심조 설정
          </Button>
        </Group>
      </Group>

      {lunchGroupLoading && <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
      {!initialValue?.groups ? (
        <Text ta={"center"} c={"dimmed"} py={"lg"}>
          점심조 진행을 위해 <br />
          우측 '점심조 설정'에서 설정을 먼저 진행해 주세요.
        </Text>
      ) : (
        <ScrollArea flex={1}>
          <List spacing="xs" size="sm" center>
            {Object.entries(initialValue.groups)?.map((item: any, index: number) => (
              <List.Item icon={<GroupNumber groupNumber={item[0]} />} key={index}>
                <Group gap={"xl"} ml={"lg"}>
                  {item[1].length === 0 ? (
                    <Text size="xs" c={"dimmed"}>
                      아직 배정인원이 없어요.
                    </Text>
                  ) : (
                    item[1].map((name: string, index: number, arr: any) => {
                      return (
                        <>
                          <Text size="sm">{name}</Text>
                          {arr.length === index + 1 ? null : <Divider orientation="vertical" size={"xs"} />}
                        </>
                      );
                    })
                  )}
                </Group>
              </List.Item>
            ))}
          </List>
        </ScrollArea>
      )}

      <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="점심조 설정" position="right">
        <form onSubmit={form.onSubmit(submit)}>
          <Stack>
            <NumberInput
              key={form.key("total")}
              {...form.getInputProps("total")}
              hideControls
              label="총원"
              description="점심조 참여 총 인원을 입력해 주세요."
              placeholder="점심조 참여인원"
            />
            <NumberInput
              key={form.key("perGroup")}
              {...form.getInputProps("perGroup")}
              hideControls
              label="조별 인원"
              description="한 조에 들어갈 인원을 입력해 주세요."
              placeholder="조 인원 수"
            />

            <DatePickerInput
              valueFormat="MM월 D일 dddd"
              firstDayOfWeek={0}
              allowSingleDateInRange
              locale="ko"
              type="range"
              clearable
              label="점심조 기간"
              placeholder="점심조 기간 설정"
              key={form.key("date")}
              {...form.getInputProps("date")}
            />
            <TextInput key={form.key("notice")} {...form.getInputProps("notice")} label="비고" placeholder="비고사항을 입력해 주세요." />
            <Button type="submit">저장</Button>
          </Stack>
        </form>
      </Drawer>
      <Modal opened={resetModalOpened} onClose={closeResetModal} centered title="점심조 설정 초기화">
        <Suspense fallback={<div>Loading...</div>}>
          <Alert variant="outline" color="red" radius="md" title="점심조 설정을 초기화 하시겠습니까?" icon={<IconInfo />}>
            삭제 후 되돌릴 수 없습니다.
          </Alert>
          <Group wrap="nowrap" mt={"md"}>
            <Button variant="light" color="red" fullWidth onClick={handleReset}>
              초기화
            </Button>
            <Button variant="light" color="gray" fullWidth onClick={closeResetModal}>
              닫기
            </Button>
          </Group>
        </Suspense>
      </Modal>
    </Stack>
  );
}

export default LunchGroup;
