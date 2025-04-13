import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const pageType = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required().error('El título es obligatorio')
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required().error('El slug es obligatorio')
    }),
    defineField({
      name: 'pageType',
      title: 'Tipo de página',
      type: 'string',
      options: {
        list: [
          {title: 'Acerca de', value: 'about'},
          {title: 'Términos y condiciones', value: 'terms'},
          {title: 'Política de envío', value: 'shipping'},
          {title: 'Política de privacidad', value: 'privacy'},
          {title: 'Preguntas frecuentes', value: 'faq'},
          {title: 'Otra', value: 'other'},
        ],
      },
      validation: Rule => Rule.required().error('El tipo de página es obligatorio'),
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Leyenda',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Última actualización',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'pageType',
      slug: 'slug.current',
    },
    prepare(selection) {
      const {title, type, slug} = selection
      const typeLabels: Record<string, string> = {
        about: 'Acerca de',
        terms: 'Términos y condiciones',
        shipping: 'Política de envío',
        privacy: 'Política de privacidad',
        faq: 'Preguntas frecuentes',
        other: 'Otra',
      }
      
      return {
        title,
        subtitle: `${typeLabels[type] || 'Página'} - /${slug}`,
      }
    },
  },
}) 