import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import {
  Search,
  TrendingUp,
  Briefcase,
  MapPin,
  DollarSign,
  ArrowUpRight,
  Filter,
} from "lucide-react";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetId = "10n9xmV01j3_6pDU7QiR5DIbanIfAyYcd8rVavXT17oE";
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        const response = await fetch(sheetUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data
              .filter((company) => company["Company Name"])
              .map((company) => {
                // Get the valuation using the exact column name from sheets
                let valuationString = (company["Company Valuation "] || "")
                  .toString()
                  .trim();

                // Remove any currency symbols, commas, and spaces
                valuationString = valuationString.replace(/[$,\s]/g, "");

                // Convert to number, handle invalid values
                const valuation = Number(valuationString);

                return {
                  ...company,
                  "Company Valuation": isNaN(valuation) ? null : valuation,
                };
              });

            console.log("Sample processed company:", processedData[0]); // For debugging
            setCompanies(processedData);
            setFilteredCompanies(processedData);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique industries for filter
  const industries = [
    "All",
    ...new Set(companies.map((company) => company["Industry"]).filter(Boolean)),
  ];

  useEffect(() => {
    // Filter companies based on search term and industry filter
    const filtered = companies.filter((company) => {
      const matchesSearch = Object.values(company).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesIndustry =
        industryFilter === "All" || company["Industry"] === industryFilter;
      return matchesSearch && matchesIndustry;
    });

    setFilteredCompanies(filtered);
  }, [searchTerm, industryFilter, companies]);

  // Get random featured companies
  const featuredCompanies =
    companies.length > 0
      ? [...companies].sort(() => 0.5 - Math.random()).slice(0, 3)
      : [];

  // Updated currency formatter with better handling
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    if (typeof value === "string")
      value = Number(value.replace(/[^0-9.-]+/g, ""));
    if (typeof value !== "number") return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#22c55e1a,transparent)] pointer-events-none"></div>
      <div className="absolute top-1/3 -left-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Discover <span className="text-green-500">Small Cap Gems</span>
            </h1>
            <p className="text-gray-400 max-w-xl">
              AI-powered analysis of companies under $50M valuation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 border border-gray-700">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </button>
            <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors duration-200">
              Track New Company
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-10 border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies, industries, locations..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:w-64">
              <select
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 focus:outline-none appearance-none cursor-pointer"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Companies */}
        {featuredCompanies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
              Featured Companies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCompanies.map((company, index) => (
                <Link
                  key={index}
                  to={`/${encodeURIComponent(company["Company Name"])}`}
                  className="bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:scale-[1.02] group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-green-500 group-hover:text-green-400 transition-colors">
                        {company["Company Name"]}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {company["Website URL"]}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-lg">
                      <Briefcase className="w-5 h-5 text-green-500" />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-300">
                        {company["Headquarters"]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Company List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Briefcase className="w-6 h-6 text-green-500 mr-2" />
            All Companies
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredCompanies.length} companies)
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <>
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/80 rounded-xl border border-gray-700/50">
                  <div className="flex justify-center mb-4">
                    <Search className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No companies found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50">
                  {/* Table Header */}
                  <div className="hidden md:grid md:grid-cols-5 bg-gray-700/50 p-4 font-medium text-sm uppercase tracking-wider border-b border-gray-700">
                    <div>Company Name</div>
                    <div></div>

                    <div>Industry</div>
                    <div>Headquarters</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-700/50">
                    {filteredCompanies.map((company, index) => (
                      <div
                        key={index}
                        className="block md:grid md:grid-cols-5 p-4 hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="font-medium text-green-500 group-hover:text-green-400 transition-colors mb-2 md:mb-0">
                          <Link
                            to={`/${encodeURIComponent(
                              company["Company Name"]
                            )}`}
                          >
                            {company["Company Name"]}
                          </Link>
                        </div>
                        <div className="text-gray-400 text-sm md:text-base truncate mb-2 md:mb-0">
                          {company["Website URL"] && (
                            <a
                              href={company["Website URL"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-green-400 transition-colors"
                            >
                              {company["Website URL"]}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center mb-2 md:mb-0">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          {company["Industry"]}
                        </div>
                        <div className="flex items-center text-gray-300 mb-2 md:mb-0">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400 md:hidden" />
                          {company["Headquarters"]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
