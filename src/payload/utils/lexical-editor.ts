import {
  lexicalEditor,
  HeadingFeature,
  ItalicFeature,
  BoldFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  UnderlineFeature,
  BlockquoteFeature,
  ParagraphFeature,
  InlineCodeFeature,
} from '@payloadcms/richtext-lexical'

type LexicalOptions = NonNullable<Parameters<typeof lexicalEditor>[0]>
type FeaturesOption = NonNullable<LexicalOptions['features']>
type FeaturesFn = Extract<FeaturesOption, (args: any) => any>
type EditorConfigArgs = Parameters<FeaturesFn>[0]

export const lexicalEditorConfig = lexicalEditor({
  features: ({ rootFeatures }: EditorConfigArgs) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
    ParagraphFeature(),
    BoldFeature(),
    UnderlineFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    LinkFeature(),
    ItalicFeature(),
    BlockquoteFeature(),
    InlineCodeFeature(),
  ],
})
