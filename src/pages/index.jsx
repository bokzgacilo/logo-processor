'use client';

import { ActionBar, Box, Button, Container, FileUpload, Flex, Heading, HStack, Icon, Portal, RadioCard, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import Papa from "papaparse";
import { useState } from 'react';
import { LuDownload, LuRefreshCcw, LuSave, LuUpload } from 'react-icons/lu';
import ProductCard from '@/components/custom/ProductCart';
import { useColorMode } from '@/components/ui/color-mode';
import { Toaster, toaster } from '@/components/ui/toaster';

export default function Home() {
  const [data, setData] = useState([]);
  const { toggleColorMode } = useColorMode();
  const [columns, setColumns] = useState(3)

  const handleFileUpload = (File) => {
    if (!File) return;

    Papa.parse(File, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const requiredHeaders = [
          "Reference Code",
          "Image URL",
          "Logo Name",
          "Logo Color",
          "Placement",
          "Deco Method",
          "No Logo",
        ];

        const headers = results.meta.fields || [];

        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h)
        );

        if (missingHeaders.length > 0) {
          toaster.create({
            max: 3,
            duration: 5000,
            type: "error",
            description: `Invalid CSV template. Missing column(s): ${missingHeaders.join(", ")}`
          })
          return;
        }

        const filtered = results.data.filter((row) =>
          Object.values(row).some((v) => v && v.toString().trim() !== "")
        );

        const enriched = filtered.map((row) => ({
          ReferenceCode: row["Reference Code"] || "",
          ImageURL: row["Image URL"] || "",
          logoName: row["Logo Name"] || "",
          logoColor: row["Logo Color"] || "",
          placement: row["Placement"] || "",
          decoMethod: row["Deco Method"] || "",
          noLogo:
            row["No Logo"] === "true" ||
            row["No Logo"] === true ||
            false,
        }));

        toaster.create({
          max: 3,
          duration: 3000,
          type: "success",
          description: `Upload successful! Your CSV passed all checks and is ready to review.`
        })
        setData(enriched);
      },
    });
  };

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const updateCsv = () => {
    const csvData = data.map(row => ({
      "Reference Code": row.ReferenceCode,
      "Image URL": row.ImageURL,
      "Logo Name": row.logoName,
      "Logo Color": row.logoColor,
      "Placement": row.placement,
      "Deco Method": row.decoMethod,
      "No Logo": row.noLogo
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "updated_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxW="full" p={0}>
      <Toaster />
      <Flex
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
        <Button rounded="full" onClick={toggleColorMode}>Toggle</Button>
      </Flex>
      <Stack height="92dvh" gap={4} p={4} placeItems="center" hidden={data.length > 0}>
        <Heading w="500px" mt={12}>Step 1: Prepare CSV</Heading>
        <Button size="xl" rounded="full">
          <a href='/Template.csv' download>Download CSV Template</a><LuDownload />
        </Button>
        <Heading w="500px" mt={6}>Step 2: Upload Data</Heading>
        <Box w="500px">
          <FileUpload.Root onFileAccept={(files) => handleFileUpload(files.files[0])} onFileChange={(files) => handleFileUpload(files.files)} accept={["text/csv"]} maxFiles={1} >
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone>
              <Icon size="xl">
                <LuUpload />
              </Icon>
              <FileUpload.DropzoneContent w="500px">
                <Stack gap={0}>
                  <Text fontSize="16px">Drag and drop files here</Text>
                  <Text mt={2} fontSize="16px">or click below to browse files</Text>
                  <FileUpload.Trigger asChild>
                    <Button my={4} rounded="full" size="xl">Browse File <LuUpload /></Button>
                  </FileUpload.Trigger>
                  <Text fontSize="12px">.csv only up to 5MB</Text>
                </Stack>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
          </FileUpload.Root>
        </Box>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: columns }} gap={4} p={4} hidden={data.length === 0}>
        {data.map((row, index) => <ProductCard key={row.referenceCode} index={index} handleChange={handleChange} data={row} />)}
      </SimpleGrid>

      <ActionBar.Root open={data.length > 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content rounded="full">
              <ActionBar.SelectionTrigger rounded="full">
                {data.length} items
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <HStack>
                <RadioCard.Root
                  orientation="horizontal"
                  alignItems="center"
                  justify="center"
                  defaultValue={columns}
                  value={columns} onValueChange={(e) => setColumns(e.value)}
                  variant="solid"
                  size="sm"
                >
                  <HStack
                    justifyContent="center"
                    alignItems="center"
                  >
                    {[2, 3, 4].map((item) => (
                      <RadioCard.Item key={item} value={item} cursor="pointer" >
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                          {item}
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </HStack>
                </RadioCard.Root>
              </HStack>
              <ActionBar.Separator />
              <Button rounded="full" variant="outline" onClick={() => {
                setData([])
              }}>
                Reset <LuRefreshCcw />
              </Button>
              <Button rounded="full" onClick={updateCsv}>
                Update CSV <LuSave />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Container>
  );
}
