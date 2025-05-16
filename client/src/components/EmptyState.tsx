export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
      <p className="text-gray-500 max-w-md">
        Try adjusting your search or filter criteria, or add some new products.
      </p>
    </div>
  );
}
