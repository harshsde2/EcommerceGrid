export function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="font-heading font-semibold text-gray-800">
              Shop Curator
            </span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Shop Curator. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
