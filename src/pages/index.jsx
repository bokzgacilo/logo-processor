"use client";

import { Container, Flex, Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { useData } from "@/context/DataContext";
import Landing from "./landing";
import MainGrid from "./main-grid";
import { ColorModeButton, useColorMode } from "@/components/ui/color-mode";

export default function Layout() {
  const { data } = useData();
  const {colorMode} = useColorMode();

  return (
    <>
      <Head>
        <title>Product Logo Review Tool</title>
      </Head>
      <Container maxW="full" p={0}>
        <Flex
          bg={colorMode === 'light' ? "#fff" : "#000"}
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
          bgImage={colorMode === 'light' ? "radial-gradient(#f5f5f5 1px, transparent 1px)" : "radial-gradient(#333333 1px, transparent 1px)"}
          bgSize={"16px 14px"}
        >
        {data.length === 0 ? <Landing /> : <MainGrid />}
        </Stack>
      </Container>
    </>
  );
}
