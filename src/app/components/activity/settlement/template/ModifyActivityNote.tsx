"use client";
import { Button, Group, NumberInput, Popover, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import IconArrowRight from "/public/icons/arrow-right.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
function ModifyActivityNote({ element, setOpened }: any) {
  console.log("🚀 ~ ModifyActivityNote ~ element:", element);
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.activityNote(values),
  });

  const ref = useRef<any>(element.note || "");

  const queryClient = useQueryClient();
  const modify = () => {
    const { activityStatsIdx } = element;
    mutate(
      { activityStatsIdx: activityStatsIdx, note: ref.current.value },
      {
        onSuccess: async () => {
          notification({ title: "활동비 비고 수정", message: "활동비 비고 수정이 완료되었습니다.", color: "green" });
          await queryClient.invalidateQueries({ queryKey: ["settlementActivities"] });
          setOpened(null);
        },
        onError: () => {
          notification({ title: "활동비 비고 수정", message: "활동비 비고 수정 중 문제가 발생하였습니다.", color: "red" });
        },
      }
    );
  };

  return (
    <Popover.Dropdown>
      <Title order={6}>
        활동비 비고 수정하기
        <Text component="span" fz={"xs"} ml={"xs"}>
          ({element.userName})
        </Text>
      </Title>
      <Group mt={"xs"}>
        <TextInput w={"100%"} required label="비고" size="xs" ref={ref} placeholder="비고 내용을 입력해 주세요." />
      </Group>
      <Group justify="flex-end" mt={"xs"}>
        <Button onClick={modify} size="xs">
          수정하기
        </Button>
      </Group>
    </Popover.Dropdown>
  );
}

export default ModifyActivityNote;
