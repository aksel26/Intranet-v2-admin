"use client";
import { Flex } from "@mantine/core";

import LunchGroup from "@/app/components/meal/config/LunchGroup";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { LUNCH_GROUP } from "@/app/enums/breadcrumbs";

function page() {
  return (
    <Flex direction={"column"} h={"100%"}>
      <BreadCrumb level={LUNCH_GROUP} />
      <LunchGroup />
    </Flex>
  );
}

export default page;
