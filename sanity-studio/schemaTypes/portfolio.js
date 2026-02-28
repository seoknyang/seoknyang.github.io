import {defineField, defineType} from 'sanity'
import {TechStackInput} from '../components/TechStackInput'

export const portfolio = defineType({
  name: 'portfolio',
  title: '포트폴리오',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '프로젝트명',
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
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 4,
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
      name: 'thumbnail',
      title: '대표 이미지',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub 링크',
      type: 'url',
    }),
    defineField({
      name: 'liveUrl',
      title: '배포 링크',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: '정렬 순서',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: '정렬 순서',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
