import {defineField, defineType} from 'sanity'
import {TechStackInput} from '../components/TechStackInput'

export const post = defineType({
  name: 'post',
  title: '블로그 포스트',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: '태그',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'techStack',
      title: '기술스택',
      type: 'array',
      of: [{
        type: 'object',
        name: 'techItem',
        fields: [
          defineField({name: 'name', title: '기술명', type: 'string'}),
          defineField({name: 'icon', title: '커스텀 아이콘', type: 'image'}),
        ],
        preview: {select: {title: 'name', media: 'icon'}},
      }],
      components: {input: TechStackInput},
    }),
    defineField({
      name: 'summary',
      title: '요약',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: '본문',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: '대체 텍스트',
              type: 'string',
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: '최신순',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
