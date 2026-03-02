import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const SINGLETON_TYPES = ['profile']

export default defineConfig({
  name: 'default',
  title: 'PortPolio_csn',

  projectId: 'nmfm8fl3',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('콘텐츠')
          .items([
            S.listItem()
              .title('프로필')
              .id('profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETON_TYPES.includes(item.getId()),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
