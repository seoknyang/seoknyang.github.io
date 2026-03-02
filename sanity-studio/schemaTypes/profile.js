import {defineField, defineType} from 'sanity'
import {TechStackInput} from '../components/TechStackInput'

export const profile = defineType({
  name: 'profile',
  title: '프로필',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: '자기소개',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'links',
      title: '외부 링크',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            defineField({name: 'label', title: '레이블', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'techStack',
      title: '기술스택',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'techItem',
          fields: [
            defineField({name: 'name', title: '기술명', type: 'string'}),
            defineField({name: 'icon', title: '커스텀 아이콘', type: 'image'}),
          ],
          preview: {select: {title: 'name', media: 'icon'}},
        },
      ],
      components: {input: TechStackInput},
    }),
    defineField({
      name: 'sections',
      title: '섹션 목록',
      description: '경력, 학력, 자격증 등 원하는 타이틀로 자유롭게 추가',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            defineField({
              name: 'title',
              title: '섹션 타이틀',
              type: 'string',
              description: '예: 경력, 학력, 자격/어학/수상, 경험/활동/교육',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: '항목',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'sectionItem',
                  fields: [
                    defineField({name: 'startDate', title: '시작일', type: 'date'}),
                    defineField({name: 'endDate', title: '종료일', type: 'date'}),
                    defineField({
                      name: 'date',
                      title: '날짜 (단일)',
                      type: 'date',
                      description: '자격 취득일 등 단일 날짜',
                    }),
                    defineField({
                      name: 'name',
                      title: '제목',
                      type: 'string',
                      description: '회사명 / 학교명 / 자격명 등',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'description',
                      title: '설명',
                      type: 'text',
                      rows: 3,
                      description: '업무 내용 / 점수 / 합격 여부 등',
                    }),
                    defineField({
                      name: 'note',
                      title: '부가정보',
                      type: 'string',
                      description: '자격번호 / 졸업여부 등',
                    }),
                  ],
                  preview: {
                    select: {title: 'name', subtitle: 'description'},
                  },
                },
              ],
            }),
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    }),
  ],
})
