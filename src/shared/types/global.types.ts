export interface PageProps {
  searchParams: Promise<{
    page: string;
    limit: string;
    q: string;
    sortField: string;
    sortOrder: string;
  }>;
  params: Promise<{
    slug: string;
    categorySlug: string;
    subCategorySlug: string;
    variantSlug: string;
  }>;
}
