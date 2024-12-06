"use client";
import useStorageInfo from "@/app/hooks/useStorageInfo";
import { Box, Button, FileButton, Flex, Group, Input, MultiSelect, Stack, Text, Textarea, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function page() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };
  const { userInfo } = useStorageInfo();

  const goBack = () => router.back();
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        공지사항 작성
      </Title>

      <Stack>
        <Input.Wrapper label="작성자" styles={{ label: { fontWeight: 700 } }}>
          <Input value={userInfo?.adminName || ""} variant="unstyled" />
        </Input.Wrapper>

        <MultiSelect
          styles={{ label: { fontWeight: 700 } }}
          label="참조"
          placeholder="참조할 인원을 선택해 주세요."
          data={["React", "Angular", "Vue", "Svelte", "Svelte2", "Svelte3"]}
          searchable
        />

        <Textarea styles={{ label: { fontWeight: 700 } }} label="내용입력" placeholder="내용을 입력해 주세요." autosize minRows={10} />

        <Stack>
          <Text styles={{ root: { fontSize: "var(--mantine-font-size-sm)", fontWeight: 700 } }}>첨부파일</Text>
          <Group justify="start">
            <Stack>
              {file && (
                <Text size="sm" mt="sm">
                  Picked file: {file.name}
                </Text>
              )}

              <Group>
                <FileButton resetRef={resetRef} onChange={setFile} accept="image/png,image/jpeg">
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
          <Button>저장하기</Button>
          <Button variant="light" color="gray" onClick={goBack}>
            뒤로가기
          </Button>
        </Group>
      </Stack>
    </Flex>
  );
}
