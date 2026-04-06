import { StringInputProps, set } from 'sanity';
import { createElement, useCallback } from 'react';
import { Stack, Flex, Button, Grid, Label, Text } from '@sanity/ui';
import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';

export const ratioOptions = [
  { title: 'Square', value: 'square', description: '1:1', icon: Square },
  { title: 'Rectangle', value: 'rectangle', description: '3:2', icon:  RectangleHorizontal },
  { title: 'Portrait', value: 'portrait', description: '3:4', icon: RectangleVertical },
] as const;

export function RatioInput(props: StringInputProps) {

  const { value, onChange } = props

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange]
  )

  return (
    <Grid columns={ratioOptions.length} gap={3}>
      {ratioOptions.map((ratio: {
        title: string;
        value: string;
        description: string;
        icon: React.ComponentType;
      }) => (
        <Button
          key={ratio.value}
          value={ratio.value}
          mode={value === ratio.value ? `default` : `ghost`}
          tone={value === ratio.value ? `primary` : `default`}
          onClick={handleClick}
        >
          <Stack space={4} padding={2}>
            <Flex align="center" gap={3}>
              <Text size={4}>
                {createElement(ratio.icon)}
              </Text>
              <Label>{ratio.title}</Label>
            </Flex>
            <Text>{ratio.description}</Text>
          </Stack>
        </Button>
      ))}
    </Grid>
  )
}