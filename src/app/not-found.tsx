import { Anchor, Button, Center, Stack, Title } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center h={"100vh"} w={"100vw"}>
      <Stack>
        <Title>404</Title>
        <h2>해당 주소를 찾을 수 없습니다.</h2>
        <Anchor component={Link} href="/">
          메인페이지로 이동하기
        </Anchor>
      </Stack>
    </Center>
  );
}
