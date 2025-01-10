"use client";
import * as postApi from "@/app/api/post/postApi";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_NOTICE_CREATE } from "@/app/enums/breadscrumbs";
import useStorageInfo from "@/app/hooks/useStorageInfo";
import notification from "@/app/utils/notification";
import { Button, FileButton, Flex, Group, Input, ScrollArea, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UploadResponse {
  url: string;
  message: string;
}

export default function page() {
  const router = useRouter();
  const { userInfo } = useStorageInfo();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
  });
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.submitNotices(values),
  });

  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  // 파일이 변경될 때마다 미리보기 URL 생성
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // 컴포넌트가 언마운트되거나 파일이 변경될 때 URL 해제
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const upload = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      setFile(file);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);

    resetRef.current?.();
  };

  const goBack = () => router.back();

  const submitNotice = (data: any) => {
    mutate(
      {
        title: data.title,
        content: data.content,
        noticeImage: file,
      },
      {
        onSuccess: (res) => {
          notification({ color: "green", message: "공지사항이 작성되었습니다.", title: "공지사항 작성" });
          router.back();
        },
        onError: (error) => {
          notification({ color: "red", message: "공지사항에 문제가 발생하였습니다..", title: "공지사항 작성" });
        },
      }
    );
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadScrumb level={BREADSCRUMBS_NOTICE_CREATE} />

      <ScrollArea>
        <form onSubmit={form.onSubmit(submitNotice)}>
          <Stack gap={"md"}>
            <Input.Wrapper label="작성자" styles={{ label: { fontWeight: 600 } }}>
              <Input value={userInfo?.adminName || ""} onChange={() => {}} variant="unstyled" />
            </Input.Wrapper>

            <TextInput
              styles={{ label: { fontSize: "var(--mantine-font-size-sm)", fontWeight: 600 } }}
              key={form.key("title")}
              {...form.getInputProps("title")}
              label="제목"
              placeholder="제목을 입력해 주세요"
            />

            <Textarea
              styles={{ label: { fontSize: "var(--mantine-font-size-sm)", fontWeight: 600 } }}
              label="내용입력"
              placeholder="내용을 입력해 주세요."
              autosize
              minRows={10}
              key={form.key("content")}
              {...form.getInputProps("content")}
            />

            <Stack>
              <Text fz={"sm"} fw={600}>
                첨부파일
              </Text>
              {preview ? <Image width={200} height={200} alt="preview" src={preview} /> : null}
              <Group justify="start">
                <Stack>
                  {file && (
                    <Text size="sm" mt="sm">
                      파일명: {file.name}
                    </Text>
                  )}

                  <Group>
                    <FileButton resetRef={resetRef} onChange={upload} accept="image/png,image/jpeg">
                      {(props) => (
                        <Button variant="light" {...props}>
                          파일 업로드
                        </Button>
                      )}
                    </FileButton>
                    <Button disabled={!file} color="red" onClick={clearFile}>
                      업로드 취소
                    </Button>
                  </Group>
                </Stack>
              </Group>
            </Stack>

            <Group justify="center">
              <Button type="submit">작성하기</Button>
              <Button variant="light" color="gray" onClick={goBack}>
                뒤로가기
              </Button>
            </Group>
          </Stack>
        </form>
      </ScrollArea>
    </Flex>
  );
}
