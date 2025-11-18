import {
  ActionBar,
  Button,
  HStack,
  Portal,
  RadioCard,
  SimpleGrid,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import { LuRefreshCcw, LuSave } from "react-icons/lu";
import ProductCard from "@/components/custom/ProductCart";
import { useData } from "@/context/DataContext";

export default function MainGrid() {
  const { data, setData } = useData();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState(3);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  async function updateCsv() {
    setLoading(true);
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const blob = await res.blob();
    await saveAs(blob, `${Date.now()}.zip`);
    setLoading(false);
  }

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: columns }}
        gap={4}
        p={4}
        hidden={data.length === 0}
      >
        {data.map((row, index) => (
          <ProductCard
            key={`${row.referenceCode}-GRD-${index}`}
            index={index}
            handleChange={handleChange}
            data={row}
          />
        ))}
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
                  value={columns}
                  onValueChange={(e) => setColumns(e.value)}
                  variant="solid"
                  size="sm"
                >
                  <HStack justifyContent="center" alignItems="center">
                    {[2, 3, 4].map((item) => (
                      <RadioCard.Item key={item} value={item} cursor="pointer">
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>{item}</RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </HStack>
                </RadioCard.Root>
              </HStack>
              <ActionBar.Separator />
              <Button
                rounded="full"
                variant="outline"
                onClick={() => {
                  setData([]);
                }}
              >
                Reset <LuRefreshCcw />
              </Button>
              <Button rounded="full" onClick={updateCsv} loading={loading}>
                Update CSV <LuSave />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}
