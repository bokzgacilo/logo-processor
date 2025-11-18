"use client";

import { Container, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { useData } from "@/context/DataContext";
import Landing from "./landing";
import MainGrid from "./main-grid";

export default function Layout() {
  const { data } = useData();

  return (
    <>
      <Head>
        <title>Product Logo Review Tool</title>
      </Head>
      <Container maxW="full" p={0}>
        <Flex
          bg="white"
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
          <Heading size="2xl">Product Logo Review Tool</Heading>
        </Flex>

        {data.length === 0 ? <Landing /> : <MainGrid />}
      </Container>
    </>
  );
}
