"use client";
import useStorageInfo from "@/app/hooks/useStorageInfo";
import { Box, Button, FileButton, Flex, Group, Input, MultiSelect, ScrollArea, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as postApi from "@/app/api/post/postApi";
import { useForm } from "@mantine/form";
import Image from "next/image";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_NOTICE, BREADSCRUMBS_NOTICE_CREATE, BREADSCRUMBS_WELFARE_CONFIG } from "@/app/enums/breadscrumbs";

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
  console.log("🚀 ~ page ~ preview:", preview);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.submitNotices(values),
  });
  const { mutate: uploadImage } = useMutation({
    mutationFn: (values: any) => postApi.uploadNoticeImage(values),
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

  // const uploadFile = async (file: File): Promise<UploadResponse> => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const response = await fetch("/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     throw new Error("Upload failed");
  //   }

  //   return response.json();
  // };

  // const upload = (file: File | null) => {
  //   if (file) {
  //     setFile(file);
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     console.log("🚀 ~ upload ~ file:", file);
  //   }
  // };

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
    console.log(data);

    uploadImage({});
  };

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <BreadScrumb level={BREADSCRUMBS_NOTICE_CREATE} />
      <Title order={3} mb={"lg"}>
        공지사항 작성
      </Title>
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
