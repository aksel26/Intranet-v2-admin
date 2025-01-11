"use client";
import * as postApi from "@/app/api/post/postApi";
import TextEditorWrapper from "@/app/components/notice/TextEditorWrapper";
import BreadScrumb from "@/app/components/ui/BreadScrumb";
import { BREADSCRUMBS_NOTICE_CREATE } from "@/app/enums/breadscrumbs";
import useStorageInfo from "@/app/hooks/useStorageInfo";
import { convertFileUnit } from "@/app/utils/convertFileUnit";
import notification from "@/app/utils/notification";
import {
  ActionIcon,
  Anchor,
  Button,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import IconImage from "/public/icons/photo-scan.svg";
import IconUpload from "/public/icons/upload.svg";
import IconX from "/public/icons/x.svg";

export default function page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userInfo } = useStorageInfo();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  const [openedPreview, { open: openPreviewModal, close: closePreviewModal }] =
    useDisclosure(false);

  const [preview, setPreview] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.submitNotices(values),
  });

  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const [content, onChange] = useState<any>();

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

  const upload = (file: File[] | null | any) => {
    console.log("file: ", file);
    if (file) {
      if (!file[0].type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      setFile(file[0]);
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
        content: content,
        noticeImage: file,
      },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries({ queryKey: ["notices"] });
          notification({
            color: "green",
            message: "공지사항이 작성되었습니다.",
            title: "공지사항 작성",
          });

          router.back();
        },
        onError: (error) => {
          notification({
            color: "red",
            message: "공지사항에 문제가 발생하였습니다..",
            title: "공지사항 작성",
          });
        },
      }
    );
  };

  const openPreview = () => {
    openPreviewModal();
  };

  return (
    <Flex
      direction={"column"}
      h={"100%"}
      styles={{ root: { overflow: "hidden" } }}
    >
      <BreadScrumb level={BREADSCRUMBS_NOTICE_CREATE} />

      <ScrollArea mt={"md"}>
        <form onSubmit={form.onSubmit(submitNotice)}>
          <Stack gap={"md"}>
            <TextInput
              label="작성자"
              value={userInfo?.adminName || ""}
              onChange={() => {}}
              variant="unstyled"
              readOnly
            />

            <TextInput
              styles={{
                label: {
                  fontSize: "var(--mantine-font-size-sm)",
                  fontWeight: 600,
                },
              }}
              key={form.key("title")}
              {...form.getInputProps("title")}
              label="제목"
              placeholder="제목을 입력해 주세요"
              description="최대 100자까지 입력 가능합니다."
            />

            <Stack gap={2}>
              <Text fz={"sm"} fw={600}>
                내용
              </Text>
              <TextEditorWrapper value={content} onChange={onChange} />
            </Stack>
            <Stack gap={2}>
              <Text fz={"sm"} fw={600}>
                첨부파일
              </Text>

              <Dropzone
                w={"100%"}
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,
                  MIME_TYPES.svg,
                  MIME_TYPES.gif,
                  MIME_TYPES.webp,
                ]}
                onDrop={(files) => upload(files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                // accept={IMAGE_MIME_TYPE}
                // {...props}
              >
                <Group
                  justify="center"
                  gap="xl"
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <Group>
                      <IconUpload width="40" strokeWidth="1.2" height="40" />
                      <div>
                        <Text size="md" inline>
                          첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을
                          눌러 파일을 직접 선택해주세요.
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          파일 1개당 크기는 10mb를 초과할 수 없습니다.
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          가능한 파일 형식 : png, jpeg, svg, gif, webp
                        </Text>
                      </div>
                    </Group>
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <Group>
                      <IconX width="40" strokeWidth="1.2" height="40" />
                      <div>
                        <Text size="md" inline>
                          파일 형식 또는 용량을 확인해 주세요.
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          파일 1개당 크기는 10mb를 초과할 수 없습니다.
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          가능한 파일 형식 : png, jpeg, svg, gif, webp
                        </Text>
                      </div>
                    </Group>
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <Group>
                      <IconImage width="40" strokeWidth="1.2" height="40" />
                      <div>
                        <Text size="md" inline>
                          첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을
                          눌러 파일을 직접 선택해주세요.
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          파일 1개당 크기는 10mb를 초과할 수 없습니다.
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          가능한 파일 형식 : png, jpeg, svg, gif, webp
                        </Text>
                      </div>
                    </Group>
                  </Dropzone.Idle>
                </Group>
              </Dropzone>

              {file && (
                <Group align="center">
                  <Anchor onClick={openPreview} size="sm">
                    {`${file.name}, [${convertFileUnit(file.size)}]`}
                  </Anchor>
                  <ActionIcon
                    variant="subtle"
                    aria-label="removeImg"
                    onClick={clearFile}
                  >
                    <IconX style={{ width: "70%", height: "70%" }} />
                  </ActionIcon>
                </Group>
              )}
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
      <Modal
        opened={openedPreview}
        onClose={closePreviewModal}
        title="미리보기"
      >
        {preview && <img src={preview} alt="preview" />}
      </Modal>
    </Flex>
  );
}
