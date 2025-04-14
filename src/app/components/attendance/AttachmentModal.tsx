import React, { useCallback, useEffect, useState } from "react";
import { Button, FileButton, Group, Image, Modal, Stack, Text } from "@mantine/core";
import NextImage from "next/image";
import { IconDownload, IconPhotoScan } from "@tabler/icons-react";
const AttachmentModal = ({ opened, close, info }: any) => {
  console.log("🚀 ~ AttachmentModal ~ info:", info);
  const [imagePreview, setImagePreview] = useState<any>(info?.imageUrl);
  const downloadImage = useCallback(async (imageUrl: string, imageName: string) => {
    try {
      // For external URLs, fetch the image first
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = imageName || "image";

      // Programmatically click the link to trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  }, []);

  if (!info?.imageUrl) {
    return (
      <Modal opened={opened} onClose={close} title="첨부파일" centered size={"md"}>
        <Text ta={"center"} c={"dimmed"} pb={"lg"} fz={"sm"}>
          첨부파일이 없습니다.
        </Text>
        <Button variant="light" color="gray" fullWidth onClick={close}>
          닫기
        </Button>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={close} title="첨부파일" centered size={"md"}>
      <NextImage
        src={imagePreview}
        alt="Uploaded image"
        fill
        style={{ objectFit: "contain" }}
        className="group-hover:brightness-50 transition-all duration-200"
      />
      <Button
        leftSection={<IconDownload size={20} strokeWidth={1.5} />}
        variant="subtle"
        size="xs"
        onClick={() => downloadImage(info?.imageUrl, info?.imageName)}
      >
        {info?.imageName}
      </Button>
      <Button variant="light" color="gray" fullWidth onClick={close}>
        닫기
      </Button>
    </Modal>
  );
};

export default AttachmentModal;
