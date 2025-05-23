import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().error('El nombre es obligatorio.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'name', // Genera el slug a partir del campo 'name'
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('El slug es obligatorio.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: {type: 'category'},
      validation: (Rule) => Rule.required().error('La categoría es obligatoria'),
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).error('El precio debe ser un número positivo.'),
    }),
    defineField({
      name: 'stock',
      title: 'Stock disponible',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).integer().error('El stock debe ser un número entero positivo.'),
    }),
    defineField({
      name: 'images',
      title: 'Imágenes del Producto',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1).error('Se requiere al menos una imagen.'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Título 2', value: 'h2'},
            {title: 'Título 3', value: 'h3'},
            {title: 'Título 4', value: 'h4'},
            {title: 'Cita', value: 'blockquote'}
          ],
          lists: [
            {title: 'Viñetas', value: 'bullet'},
            {title: 'Numerada', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Negrita', value: 'strong'},
              {title: 'Cursiva', value: 'em'},
              {title: 'Subrayado', value: 'underline'},
              {title: 'Tachado', value: 'strike-through'}
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  }
                ]
              }
            ]
          }
        },
      ]
    }),
  ],
}) 