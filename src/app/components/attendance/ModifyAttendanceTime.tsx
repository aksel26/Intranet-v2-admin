"use client";
import * as postApi from "@/app/api/post/postApi";
import { dateFormatFull } from "@/app/utils/dateFormat";
import notification from "@/app/utils/notification";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

function ModifyAttendanceTime({ opened, close, selectedRows }: any) {
  const [userInfo, setUserInfo] = useState({
    checkInTime: selectedRows?.checkInTime,
    checkOutTime: selectedRows?.checkOutTime,
    userName: selectedRows?.userName,
  });

  const form = useForm<any>({
    mode: "uncontrolled",
    initialValues: {
      checkInTime: null,
      checkOutTime: null,
      updateReason: "",
    },
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (selectedRows) {
      setUserInfo((prev) => ({ ...prev, checkInTime: selectedRows?.checkInTime, checkOutTime: selectedRows?.checkOutTime, userName: selectedRows?.userName }));
      const { checkInTime, checkOutTime, commuteDate } = selectedRows;

      const checkInHHmmss = checkInTime ? dayjs(checkInTime).toDate() : null;
      const checkOutHHmmss = checkOutTime ? dayjs(checkOutTime).toDate() : null;
      console.log("🚀 ~ useEffect ~ checkOutHHmmss:", checkOutHHmmss);

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
        submitForm.checkInTime = dayjs(values.checkInTime).toISOString();
      }

      if (!values.checkOutTime || values.checkOutTime === "") {
        submitForm.checkOutTime = null;
      } else {
        submitForm.checkOutTime = dayjs(values.checkOutTime).toISOString();
      }
      submitForm.updateReason = values.updateReason;
      return submitForm;
    },
    [userInfo]
  );

  function isValidCheckOutTime(checkInTime: any, checkOutTime: any) {
    // 출근시간만 수정할 경우
    if (checkInTime && !checkOutTime) {
      return true;
    }

    // dayjs 객체로 변환
    const checkInDate = dayjs(checkInTime);
    const checkOutDate = dayjs(checkOutTime);
    // 체크아웃 시간이 체크인 시간 이후인지 확인
    // 체크아웃이 체크인보다 이전이면 false 반환
    if (checkInDate && checkOutDate) {
      return checkOutDate.isAfter(checkInDate) || checkOutDate.isSame(checkInDate);
    } else {
      return true;
    }
  }

  const modifyTime = (values: any) => {
    const submitForm = formHelper(values);
    if (!isValidCheckOutTime(submitForm.checkInTime, submitForm.checkOutTime)) {
      notification({ color: "yellow", message: "출퇴근 시간 순서를 다시 확인해 주세요.", title: "출퇴근 시간 수정" });
      return;
    }

    // if (submitForm.checkInTime === null && submitForm.checkOutTime === null) {
    //   console.log("🚀 ~ modifyTime ~ submitForm:", submitForm);
    // console.log("🚀 ~ modifyTime ~ submitForm:", dayjs(submitForm.checkOutTime).toISOString());

    mutate(
      { commuteIdx: selectedRows.commuteIdx, body: submitForm, queryParams: selectedRows.userIdx },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries({ queryKey: ["attendances"] });

          close();
          form.reset();
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
    form.setFieldValue("updateReason", "");
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
              {dateFormatFull(userInfo.checkInTime) || (
                <Text component="span" c={"dimmed"} fz={"sm"}>
                  ❗ 아직 출근 전 입니다.
                </Text>
              )}
            </Text>
          </Group>
          <Group gap={"xs"}>
            <Text c={"dimmed"} fz={"sm"} miw={60}>
              퇴근시간
            </Text>
            <Text fw={500} fz={"sm"}>
              {dateFormatFull(userInfo.checkOutTime) || (
                <Text component="span" c={"dimmed"} fz={"sm"}>
                  ❗ 아직 퇴근 전 입니다.
                </Text>
              )}
            </Text>
          </Group>

          <Group wrap="nowrap">
            <DateTimePicker
              key={form.key("checkInTime")}
              {...form.getInputProps("checkInTime")}
              label="출근 시간 변경"
              clearable
              withSeconds
              highlightToday
              minDate={dayjs(userInfo.checkInTime)
                .hour(6)
                .minute(0)
                .second(0) // 체크인 날짜의 오전 6시
                .toDate()}
              firstDayOfWeek={0}
              locale="ko"
              valueFormat={"YYYY-MM-DD HH:mm:ss"}
              placeholder="출근시간을 입력해 주세요."
              styles={{ root: { width: "100%" } }}
            />
            <DateTimePicker
              key={form.key("checkOutTime")}
              {...form.getInputProps("checkOutTime")}
              label="퇴근 시간 변경"
              clearable
              withSeconds
              highlightToday
              firstDayOfWeek={0}
              minDate={dayjs(userInfo.checkInTime)
                .hour(6)
                .minute(0)
                .second(0) // 체크인 날짜의 오전 6시
                .toDate()}
              maxDate={dayjs(userInfo.checkInTime)
                .add(1, "day")
                .hour(6)
                .minute(0)
                .second(0) // 체크인 다음날 오전 6시
                .toDate()}
              locale="ko"
              valueFormat={"YYYY-MM-DD HH:mm:ss"}
              placeholder="퇴근시간을 입력해 주세요."
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
