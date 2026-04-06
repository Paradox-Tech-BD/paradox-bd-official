import { PageBySlugQueryResult } from "../../sanity.types";

export type PageBuilderBlockTypes = NonNullable<
  NonNullable<PageBySlugQueryResult>["pageBuilder"]
>[number]["_type"];

export type PageBuilderType<T extends PageBuilderBlockTypes> = Extract<
  NonNullable<NonNullable<PageBySlugQueryResult>["pageBuilder"]>[number],
  { _type: T }
>;

export type ButtonType = NonNullable<
  NonNullable<PageBuilderType<"heroBlock">>["buttons"]
>[number];

export type PortableTextProps = NonNullable<
  NonNullable<PageBuilderType<"heroBlock">>["content"]
>;

export type FormType = NonNullable<
  NonNullable<PageBuilderType<"formBlock">>["form"]
>;