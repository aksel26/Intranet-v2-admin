"use client";

import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import React, { useCallback, useEffect, useState } from "react";
import IconClock from "/public/icons/clock.svg";
import { dateFormatFull, dateFormatTime } from "@/app/utils/dateFormat";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

function ModifyAttendanceTime({ opened, close, selectedRows }: any) {
  const [userInfo, setUserInfo] = useState({
    checkInTime: "",
    checkOutTime: "",
    userName: "",
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      checkInTime: "",
      checkOutTime: "",
      updateReason: "",
    },
  });

  useEffect(() => {
    setUserInfo((prev) => ({ ...prev, checkInTime: selectedRows?.checkInTime, checkOutTime: selectedRows?.checkOutTime, userName: selectedRows?.userName }));

    const checkInTime = dateFormatTime(selectedRows?.checkInTime);
    const checkOutTime = dateFormatTime(selectedRows?.checkOutTime);

    form.setFieldValue("checkInTime", checkInTime);
    form.setFieldValue("checkOutTime", checkOutTime);
    // form.setFieldValue("checkOutTime", dayjs(selectedRows?.checkOutTime).toDate());
  }, [selectedRows]);

  const modifyTime = (values: any) => {
    console.log("🚀 ~ modifyTime ~ values:", values);
    const [hour, min, ss] = values.checkInTime.split(":").map((v: string) => parseInt(v));
    const [checkOutHour, checkOutMin, checkOutSec = 0] = values.checkOutTime.split(":").map((v: string) => parseInt(v));
    console.log("🚀 ~ modifyTime ~ checkOutHour, checkOutMin, checkOutSec:", checkOutHour, checkOutMin, checkOutSec);
    console.log("🚀 ~ modifyTime ~ hour, min, ss:", hour, min, ss);
    // const { hours, minutes, seconds } = values.checkInTime;
    // console.log("🚀 ~ modifyTime ~ hours, minutes, seconds:", hours, minutes, seconds);
    const updatedCheckInDate = dayjs(selectedRows?.checkInTime).hour(hour).minute(min).second(ss).toDate();
    // if(selectedRows.chek)
    // const updatedCheckOutDate = dayjs(selectedRows?.checkOutTime).hour(checkOutHour).minute(checkOutMin).second(checkOutSec).toDate();

    // console.log(updatedCheckInDate, updatedCheckOutDate);
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
            <Text fw={600} fz={"sm"}>
              {userInfo.userName}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"} miw={60}>
              출근시간
            </Text>
            <Text fw={600} fz={"sm"}>
              {dateFormatFull(userInfo.checkInTime)}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"} miw={60}>
              퇴근시간
            </Text>
            <Text fw={600} fz={"sm"}>
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
