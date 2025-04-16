"use client";
import * as postApi from "@/app/api/post/postApi";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import React, { useCallback, useEffect, useState } from "react";
import IconClock from "/public/icons/clock.svg";
import { dateFormatFull, dateFormatTime } from "@/app/utils/dateFormat";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import notification from "@/app/utils/notification";

function ModifyAttendanceTime({ opened, close, selectedRows }: any) {
  const [userInfo, setUserInfo] = useState({
    checkInTime: selectedRows?.checkInTime,
    checkOutTime: selectedRows?.checkOutTime,
    userName: selectedRows?.userName,
  });

  const form = useForm<any>({
    mode: "uncontrolled",
    initialValues: {
      checkInTime: "",
      checkOutTime: "",
      updateReason: "",
    },
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (selectedRows) {
      setUserInfo((prev) => ({ ...prev, checkInTime: selectedRows?.checkInTime, checkOutTime: selectedRows?.checkOutTime, userName: selectedRows?.userName }));
      const { checkInTime, checkOutTime, commuteDate } = selectedRows;

      const checkInHHmmss = checkInTime ? dayjs(selectedRows?.checkInTime).format("HH:mm:ss") : null;
      const checkOutHHmmss = checkOutTime ? dayjs(selectedRows?.checkOutTime).format("HH:mm:ss") : null;

      form.setFieldValue("checkInTime", checkInHHmmss);
      form.setFieldValue("checkOutTime", checkOutHHmmss);
    }
    // form.setFieldValue("checkOutTime", dayjs(selectedRows?.checkOutTime).toDate());
  }, [selectedRows]);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.editCommuteTime(values),
  });

  const formHelper = useCallback(
    (values: any) => {
      let submitForm: any = {};

      if (!values.checkInTime || values.checkInTime === "") {
        submitForm.checkInTime = null;
      } else {
        const [hour, min, ss] = values.checkInTime.split(":").map((v: string) => parseInt(v));
        const checkInTime = dayjs(userInfo.checkInTime || new Date()); // 전체 형식
        const formattedDate = checkInTime.set("hour", hour).set("minute", min).set("second", ss);
        submitForm.checkInTime = formattedDate.toDate();
      }

      if (!values.checkOutTime || values.checkOutTime === "") {
        submitForm.checkOutTime = null;
      } else {
        const [checkOutHour, checkOutMin, checkOutSec = 0] = values.checkOutTime.split(":").map((v: string) => parseInt(v));
        const checkOutTime = dayjs(userInfo.checkInTime || new Date()); // 전체 형식
        const formattedDate = checkOutTime.set("hour", checkOutHour).set("minute", checkOutMin).set("second", checkOutSec);

        submitForm.checkOutTime = formattedDate.toDate();
      }
      submitForm.updateReason = values.updateReason;
      return submitForm;
    },
    [userInfo]
  );

  const modifyTime = (values: any) => {
    const submitForm = formHelper(values);

    mutate(
      { commuteIdx: selectedRows.commuteIdx, body: submitForm, queryParams: selectedRows.userIdx },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries({ queryKey: ["attendances"] });

          close();

          notification({
            color: "green",
            message: "출퇴근 시간 정보가 수정되었습니다.",
            title: "출퇴근 시간 수정",
          });
        },
        onError: (error) => {
          notification({
            color: "red",
            message: JSON.stringify(error),
            title: "출퇴근 시간 수정",
          });
        },
      }
    );
  };

  const closeModal = () => {
    const checkInTime = dateFormatTime(selectedRows?.checkInTime);
    const checkOutTime = dateFormatTime(selectedRows?.checkOutTime);
    form.setFieldValue("checkInTime", checkInTime);
    form.setFieldValue("checkOutTime", checkOutTime);
    close();
  };

  return (
    <Modal opened={opened} onClose={closeModal} title="출퇴근시간 수정" centered>
      <form onSubmit={form.onSubmit(modifyTime)}>
        <Stack gap="md">
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"} miw={60}>
              성명
            </Text>
            <Text fw={500} fz={"sm"}>
              {userInfo.userName}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"} miw={60}>
              출근시간
            </Text>
            <Text fw={500} fz={"sm"}>
              {dateFormatFull(userInfo.checkInTime)}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"} miw={60}>
              퇴근시간
            </Text>
            <Text fw={500} fz={"sm"}>
              {dateFormatFull(userInfo.checkOutTime) || (
                <Text component="span" c={"dimmed"} fz={"sm"}>
                  ❗ 아직 퇴근하지 않았습니다.
                </Text>
              )}
            </Text>
          </Group>

          <Group wrap="nowrap">
            <TimeInput
              pointer
              key={form.key("checkInTime")}
              {...form.getInputProps("checkInTime")}
              leftSection={<IconClock />}
              withSeconds
              label="출근 시간 변경"
              styles={{ root: { width: "100%" } }}
            />
            <TimeInput
              pointer
              key={form.key("checkOutTime")}
              {...form.getInputProps("checkOutTime")}
              leftSection={<IconClock />}
              withSeconds
              label="퇴근 시간 변경"
              styles={{ root: { width: "100%" } }}
            />
          </Group>
          <TextInput
            required
            key={form.key("updateReason")}
            {...form.getInputProps("updateReason")}
            label="변경 사유 입력"
            placeholder="출퇴근 시간 변경 사유를 입력해 주세요."
          />

          <Group wrap="nowrap">
            <Button fullWidth size="sm" variant="light" type="submit">
              수정
            </Button>
            <Button fullWidth size="sm" color="gray" onClick={closeModal}>
              닫기
            </Button>
          </Group>
        </Stack>
        {/* Modal content */}
      </form>
    </Modal>
  );
}

export default ModifyAttendanceTime;
