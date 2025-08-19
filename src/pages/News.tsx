import { useState } from "react";
import { 
  FaNewspaper, 
  FaSearch, 
  FaFilter, 
  FaCalendar, 
  FaUser, 
  FaEye,
  FaShare,
  FaBookmark,
  FaClock
} from "react-icons/fa";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock news data
  const newsData = [
    {
      id: 1,
      title: "India vs Australia: Virat Kohli's Century Leads India to Victory",
      excerpt: "Virat Kohli scored a magnificent century as India defeated Australia by 6 wickets in the third ODI...",
      category: "Match Report",
      author: "Cricket Correspondent",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://via.placeholder.com/400x250/22c55e/ffffff?text=Cricket+News",
      featured: true
    },
    {
      id: 2,
      title: "England Announces Squad for Upcoming Test Series",
      excerpt: "England cricket board has announced the 15-member squad for the upcoming test series against South Africa...",
      category: "Team News",
      author: "Sports Reporter",
      date: "2024-01-14",
      readTime: "3 min read",
      image: "https://via.placeholder.com/400x250/3b82f6/ffffff?text=Team+News"
    },
    {
      id: 3,
      title: "IPL 2024: Complete Schedule and Venues Announced",
      excerpt: "The BCCI has announced the complete schedule for IPL 2024 with all matches and venues confirmed...",
      category: "Tournament",
      author: "IPL Desk",
      date: "2024-01-13",
      readTime: "4 min read",
      image: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=IPL+2024"
    },
    {
      id: 4,
      title: "Pakistan's Fast Bowler Sets New World Record",
      excerpt: "Pakistan's premier fast bowler has set a new world record for the fastest delivery in international cricket...",
      category: "Records",
      author: "Stats Analyst",
      date: "2024-01-12",
      readTime: "2 min read",
      image: "https://via.placeholder.com/400x250/ef4444/ffffff?text=Records"
    },
    {
      id: 5,
      title: "Women's Cricket: Australia Dominates World Cup",
      excerpt: "Australia's women's cricket team continues their dominance with another comprehensive victory...",
      category: "Women's Cricket",
      author: "Women's Cricket Desk",
      date: "2024-01-11",
      readTime: "6 min read",
      image: "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Women's+Cricket"
    },
    {
      id: 6,
      title: "Cricket Technology: New DRS System Introduced",
      excerpt: "ICC has announced the introduction of a new and improved DRS system for better decision making...",
      category: "Technology",
      author: "Tech Correspondent",
      date: "2024-01-10",
      readTime: "4 min read",
      image: "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Technology"
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Match Report", label: "Match Reports" },
    { value: "Team News", label: "Team News" },
    { value: "Tournament", label: "Tournaments" },
    { value: "Records", label: "Records" },
    { value: "Women's Cricket", label: "Women's Cricket" },
    { value: "Technology", label: "Technology" }
  ];

  const filteredNews = newsData.filter(
    (news) =>
      (categoryFilter === "all" || news.category === categoryFilter) &&
      (news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Cricket News</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Latest cricket news, match reports, and updates from around the world
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-cricket-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaFilter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 sm:p-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
              />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden sm:flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filters - Mobile */}
            {showFilters && (
              <div className="sm:hidden space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredNews.length} articles found
          </p>
        </div>

        {/* Featured News */}
        {filteredNews.length > 0 && filteredNews[0]?.featured && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Featured Story</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={filteredNews[0].image}
                  alt={filteredNews[0].title}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-cricket-green text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {filteredNews[0].category}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaClock className="h-3 w-3" />
                    <span>{filteredNews[0].readTime}</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {filteredNews[0].title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {filteredNews[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaUser className="h-4 w-4" />
                    <span>{filteredNews[0].author}</span>
                    <span>•</span>
                    <FaCalendar className="h-4 w-4" />
                    <span>{new Date(filteredNews[0].date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <FaBookmark className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <FaShare className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 bg-cricket-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredNews.slice(1).map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded-full">
                    {news.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaClock className="h-3 w-3" />
                    <span>{news.readTime}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {news.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaUser className="h-4 w-4" />
                    <span>{news.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <FaBookmark className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <FaShare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(news.date).toLocaleDateString()}
                    </span>
                    <button className="text-cricket-green hover:text-green-600 font-medium text-sm">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaNewspaper className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No news articles found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
