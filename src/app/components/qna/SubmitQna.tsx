"use client";

import { Button, Divider, Group, Stack, Switch, Text, Textarea } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { replyStatusTag } from "../template/qna/category";
import { TQna } from "@/app/type/qna";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "@/app/api/post/postApi";
import { useForm } from "@mantine/form";
import notification from "@/app/utils/notification";

interface TQnaProp {
  selectQna: TQna | undefined;
  close: () => void;
}
type TSubmit = {
  replyText: string;
};
function SubmitQna({ selectQna, close }: TQnaProp) {
  const queryClient = useQueryClient();
  const [isReplied, setIsReplied] = useState(selectQna?.replySuccessYN === "Y" ? true : false);

  const form = useForm({
    initialValues: {
      replyText: selectQna?.replyText || "",
    },

    validate: {
      replyText: (value) => (value.length < 4 ? "답변내용은 최소 4자 이상이어야 합니다" : null),
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.submitQna(values),
  });

  const submit = (values: TSubmit) => {
    if (selectQna?.qnaIdx) {
      mutate(
        { queryParams: selectQna?.qnaIdx, body: values },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["qna"] });
            notification({ message: "답변 작성을 완료하였습니다.", color: "green", title: "문의 답변하기" });
            close();
          },
          onError: () => {
            notification({ message: "답변 작성을 실패하였습니다.", color: "red", title: "문의 답변하기" });
          },
        }
      );
    } else {
      notification({ message: "문의내역을 불러오는데 실패하였습니다.", color: "red", title: "문의 답변하기" });
    }
  };

  return (
    <>
      <Stack gap={5}>
        <Text fw={600} size="sm">
          작성자 정보
        </Text>
        <Group justify="space-between">
          <Group>
            <Text c={"gray.8"} size="sm">
              {selectQna?.userName}
              <Text c={"gray.8"} size="sm" component="span" ml={5}>
                {selectQna?.gradeName}
              </Text>
            </Text>

            <Divider orientation="vertical" />
            <Text c={"gray.8"} size="sm">
              {selectQna?.userCell}
            </Text>
          </Group>
          {replyStatusTag(selectQna?.replySuccessYN)}
        </Group>
      </Stack>
      <Stack gap={5} mt={"lg"}>
        <Text fw={600} size="sm">
          문의 내용
        </Text>
        <Textarea readOnly maxRows={5} value={selectQna?.text || ""} autosize />
      </Stack>
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap={5} my={"lg"}>
          <Text fw={600} size="sm" mb={3}>
            답변내용 작성
          </Text>

          <Textarea placeholder="답변을 작성해 주세요." autosize maxRows={5} minRows={5} key={form.key("replyText")} {...form.getInputProps("replyText")} />
        </Stack>
        <Button type="submit" fullWidth size="sm">
          {isReplied ? "수정하기" : "답변하기"}
        </Button>
      </form>
    </>
  );
}

export default SubmitQna;
