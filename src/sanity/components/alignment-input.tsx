import { StringInputProps, set } from 'sanity';
import { createElement, useCallback } from 'react';
import { Stack, Flex, Button, Grid, Label, Text } from '@sanity/ui';
import { AlignEndVertical, AlignHorizontalSpaceAround, AlignStartVertical } from 'lucide-react';

export const alignmentOptions = [
  { title: 'Left', value: 'left', icon: AlignStartVertical },
  { title: 'Center', value: 'center', icon:  AlignHorizontalSpaceAround },
  { title: 'Right', value: 'right', icon: AlignEndVertical },
] as const;

export function AlignmentInput(props: StringInputProps) {

  const { value, onChange } = props

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange]
  )

  return (
    <Grid columns={alignmentOptions.length} gap={3}>
      {alignmentOptions.map((option: {
        title: string;
        value: string;
        icon: React.ComponentType;
      }) => (
        <Button
          key={option.value}
          value={option.value}
          mode={value === option.value ? `default` : `ghost`}
          tone={value === option.value ? `primary` : `default`}
          onClick={handleClick}
        >
          <Stack space={4} padding={2}>
            <Flex align="center" gap={3}>
              <Text size={4}>
                {createElement(option.icon)}
              </Text>
              <Label>{option.title}</Label>
            </Flex>
          </Stack>
        </Button>
      ))}
    </Grid>
  )
}