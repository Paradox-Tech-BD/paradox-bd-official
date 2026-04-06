import { useCallback } from 'react';
import { StringInputProps, set } from 'sanity';
import { Stack, Flex, Button, Grid, Label, Text } from '@sanity/ui';

export const spacingOptions = [
  { title: 'None', value: 'none', description: '0px'},
  { title: 'Small', value: 'small', description: '8px'},
  { title: 'Medium', value: 'medium', description: '12px'},
  { title: 'Large', value: 'large', description: '16px'},
] as const;

export function SpacingInput(props: StringInputProps) {

  const { value, onChange } = props

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange]
  )

  return (
    <Grid columns={spacingOptions.length} gap={3}>
      {spacingOptions.map((spacing: {
        title: string;
        value: string;
        description: string;
      }) => (
        <Button
          key={spacing.value}
          value={spacing.value}
          mode={value === spacing.value ? `default` : `ghost`}
          tone={value === spacing.value ? `primary` : `default`}
          onClick={handleClick}
        >
          <Stack space={4} padding={2}>
            <Flex align="center" gap={3}>
              <Label>{spacing.title}</Label>
            </Flex>
            <Text>{spacing.description}</Text>
          </Stack>
        </Button>
      ))}
    </Grid>
  )
}