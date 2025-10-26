import { Box, Button, Card, CheckboxCard, Flex, Icon, Image, Input, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PiImageBroken } from "react-icons/pi";

export default function ProductCard({ index, handleChange, data }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const noLogo = data.noLogo;

  const handleRetryFetching = async () => {
    setError(false);
    setLoaded(false);
    setRetryKey((prev) => prev + 1);
  };
  return (
    <Card.Root variant="elevated">
      <Card.Header py={4} px={4}>
        <Flex
          alignItems="center"
          justifyContent="space-between"
        >
          <Card.Title>{data.ReferenceCode}</Card.Title>
          <Box>
            <CheckboxCard.Root disabled={error} rounded="full" size="sm" colorPalette="orange" variant="surface" checked={noLogo} onCheckedChange={(e) => handleChange(index, "noLogo", !!e.checked)} cursor={error ? "" : "pointer"}>
              <CheckboxCard.HiddenInput />
              <CheckboxCard.Control>
                <CheckboxCard.Content p={0}>
                  <CheckboxCard.Label fontSize="12px">No Branding</CheckboxCard.Label>
                </CheckboxCard.Content>
              </CheckboxCard.Control>
            </CheckboxCard.Root>
          </Box>
        </Flex>
      </Card.Header>
      <Card.Body p={4}>
        <SimpleGrid templateColumns="35% 1fr" gap={4}>
          <Stack>
            <Input placeholder="Logo Name" value={data.logoName} disabled={noLogo || error} onChange={(e) => handleChange(index, "logoName", e.target.value)} />
            <Input placeholder="Logo Color" value={data.logoColor} disabled={noLogo || error} onChange={(e) => handleChange(index, "logoColor", e.target.value)} />
            <Input placeholder="Placement" value={data.placement} disabled={noLogo || error} onChange={(e) => handleChange(index, "placement", e.target.value)} />
            <Input placeholder="Deco Method" value={data.decoMethod} disabled={noLogo || error} onChange={(e) => handleChange(index, "decoMethod", e.target.value)} />
          </Stack>
          {!loaded && !error && (
            <Skeleton h={{ base: "280px", md: "320px", lg: "350px" }} width="100%" rounded="xl" />
          )}
          {!error && (
            <Image
              cursor="pointer"
              objectFit="contain"
              key={retryKey}
              src={data.ImageURL}
              alt={data.ReferenceCode}
              onLoad={() => {
                setTimeout(() => setLoaded(true), 500);
              }}
              onError={() => setError(true)}
              h={{ base: "280px", md: "320px", lg: "350px" }}
              width="100%"
              display={loaded ? "block" : "none"}
              rounded="xl"
            />

          )}
          {error && (
            <Stack
              rounded="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth="1px"
              borderStyle="solid"
              fontSize="sm"
              h={{ base: "280px", md: "320px", lg: "350px" }}
              textAlign="center"
            >
              <Icon
                size="2xl"
              >
                <PiImageBroken />
              </Icon>
              <Text fontWeight="semibold">Image not available</Text>
              <Text fontSize="12px">Image not reachable or requires special access.</Text>
              <Button rounded="full" size="sm" w="50%" mt={4} onClick={handleRetryFetching}>Retry</Button>
            </Stack>
          )}
          {/* <Image src={data.ImageURL} onError={(e) => console.log(e)} rounded="xl" /> */}
        </SimpleGrid>
      </Card.Body>
    </Card.Root>
  )
}