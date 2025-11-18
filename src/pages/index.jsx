"use client";

import { Box, Container, Flex, Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { useData } from "@/context/DataContext";
import Landing from "./landing";
import MainGrid from "./main-grid";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode";

export default function Layout() {
  const { data } = useData();
  const headerbg = useColorModeValue("#fff", "#000")
  const dot = useColorModeValue("radial-gradient(#dfdfdf 1px, transparent 1px)", "radial-gradient(#3c3c3c 1px, transparent 1px)")

  return (
    <>
      <Head>
        <title>Product Logo Review Tool</title>
      </Head>
      <Container maxW="full" p={0}>
        <Flex
          bg={headerbg}
          height="8vh"
          p={4}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;"
          justifyContent="space-between"
          position="sticky"
          top={0}
          zIndex={5}
          direction="row"
          alignItems="center"
        >
          <Heading size={{base: "lg", lg: "2xl"}}>Product Logo Review Tool</Heading>
          <ColorModeButton />
        </Flex>
        <Stack
          bgImage={dot}
          bgSize={"16px 14px"}
        >
        {data.length === 0 ? <Landing /> : <MainGrid />}
        </Stack>
      </Container>
    </>
  );
}
