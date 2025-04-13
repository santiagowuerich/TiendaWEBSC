import type {StructureResolver} from 'sanity/desk'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // Productos
      S.listItem()
        .title('Productos')
        .child(
          S.list()
            .title('Productos')
            .items([
              S.documentTypeListItem('product').title('Todos los productos'),
              S.documentTypeListItem('category').title('Categorías'),
            ])
        ),
      
      // Páginas informativas
      S.listItem()
        .title('Páginas informativas')
        .child(
          S.list()
            .title('Páginas informativas')
            .items([
              // Lista filtrada para cada tipo de página
              S.listItem()
                .title('Acerca de')
                .child(
                  S.documentList()
                    .title('Acerca de')
                    .filter('_type == "page" && pageType == "about"')
                ),
              S.listItem()
                .title('Términos y condiciones')
                .child(
                  S.documentList()
                    .title('Términos y condiciones')
                    .filter('_type == "page" && pageType == "terms"')
                ),
              S.listItem()
                .title('Política de envío')
                .child(
                  S.documentList()
                    .title('Política de envío')
                    .filter('_type == "page" && pageType == "shipping"')
                ),
              S.listItem()
                .title('Política de privacidad')
                .child(
                  S.documentList()
                    .title('Política de privacidad')
                    .filter('_type == "page" && pageType == "privacy"')
                ),
              S.listItem()
                .title('Preguntas frecuentes')
                .child(
                  S.documentList()
                    .title('Preguntas frecuentes')
                    .filter('_type == "page" && pageType == "faq"')
                ),
              S.listItem()
                .title('Todas las páginas')
                .child(
                  S.documentTypeList('page')
                    .title('Todas las páginas')
                ),
            ])
        ),
      
      // Blog
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('author').title('Autores'),
            ])
        ),
        
      S.divider(),
      
      // Otros tipos de documentos que no están organizados
      ...S.documentTypeListItems().filter(
        (item) => {
          const itemId = item.getId();
          // Filtrar si itemId existe y no está en la lista de tipos ya organizados
          return !!itemId && !['page', 'post', 'product', 'category', 'author'].includes(itemId);
        }
      ),
    ])
