import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import {
  ArrowLeft,
  Globe,
  Building,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  Briefcase,
  Twitter,
  Linkedin,
  Mail,
  ChevronRight,
} from "lucide-react";

function CompanyData() {
  const { companyName } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using public CSV export URL from Google Sheets
        const sheetId = "10n9xmV01j3_6pDU7QiR5DIbanIfAyYcd8rVavXT17oE";
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        const response = await fetch(sheetUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const foundCompany = results.data.find(
              (c) => c["Company Name"] === decodeURIComponent(companyName)
            );

            if (foundCompany) {
              setCompany(foundCompany);
            } else {
              setError("Company not found");
            }
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setError("Failed to load company data");
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch company data");
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  // Helper function to extract LinkedIn URLs
  const extractLinkedInUrls = (text) => {
    if (!text) return [];

    const linkedinRegex =
      /https:\/\/www\.linkedin\.com\/[^\/\s]+\/[^\/\s]+\/?/g;
    return text.match(linkedinRegex) || [];
  };

  // Helper function to extract social media links
  const extractSocialMedia = (text) => {
    if (!text) return { linkedin: null, twitter: null };

    const result = {
      linkedin: null,
      twitter: null,
    };

    // Extract LinkedIn URL
    const linkedinMatch = text.match(
      /LinkedIn: (https:\/\/www\.linkedin\.com\/[^\/\s]+\/[^\/\s]+\/?)/
    );
    if (linkedinMatch) result.linkedin = linkedinMatch[1];

    // Extract Twitter URL
    const twitterMatch = text.match(
      /Twitter: (https:\/\/twitter\.com\/[^\s]+)/
    );
    if (twitterMatch) result.twitter = twitterMatch[1];

    return result;
  };

  // Helper function to extract founder info
  const extractFounders = (text) => {
    if (!text) return [];

    // Split by comma to get different founders
    const founderEntries = text.split(",").map((entry) => entry.trim());

    return founderEntries.map((entry) => {
      const nameMatch = entry.match(/Founder: ([^,]+)/);
      const linkedinMatch = entry.match(/LinkedIn: ([^,]+)/);

      return {
        name: nameMatch ? nameMatch[1].trim() : "N/A",
        linkedin:
          linkedinMatch && linkedinMatch[1] !== "Not Available"
            ? linkedinMatch[1].trim()
            : null,
      };
    });
  };

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    if (!num) return "N/A";
    return parseInt(num).toLocaleString();
  };

  const getRiskLevelColor = (level) => {
    if (!level) return "bg-gray-500";

    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getGrowthPotentialColor = (level) => {
    if (!level) return "bg-gray-500";

    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <Link
          to="/CompanyList"
          className="text-green-500 hover:text-green-400 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Company List
        </Link>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
        <Link
          to="/CompanyList"
          className="text-green-500 hover:text-green-400 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Company List
        </Link>
      </div>
    );
  }

  const founders = extractFounders(company["Founders & LinkedIn URLs"]);
  const socialMedia = extractSocialMedia(company["Social Media Links"]);
  const keyContacts = company["Key Contacts"]
    ? company["Key Contacts"].split(",").map((contact) => contact.trim())
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#22c55e1a,transparent)] pointer-events-none"></div>
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Breadcrumb navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-green-500 hover:text-green-400 flex items-center text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Company List
          </Link>
        </div>

        {/* Company Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {company["Company Name"]}
              </h1>
              <div className="flex items-center text-gray-400">
                <Globe className="w-4 h-4 mr-2" />
                <a
                  href={company["Website URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors flex items-center"
                >
                  {company["Website URL"]}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {socialMedia.linkedin && (
                <a
                  href={socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}

              {socialMedia.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}

              <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Summary */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">
                Company Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {company["Company Description"]}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Industry
                  </div>
                  <div className="font-medium">
                    {company["Industry"] || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Headquarters
                  </div>
                  <div className="font-medium">
                    {company["Headquarters"] || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Founded
                  </div>
                  <div className="font-medium">
                    {company["Founding Year"] || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Employees
                  </div>
                  <div className="font-medium">
                    {formatNumber(company["Number of Employees"])}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">
                Financial Overview
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">
                    Current Valuation
                  </div>
                  <div className="text-2xl font-bold text-green-500">
                    ${formatNumber(company["Current Valuation"])}
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">
                    Annual Revenue
                  </div>
                  <div className="text-2xl font-bold">
                    ${formatNumber(company["Revenue"])}
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">
                    Funding Raised
                  </div>
                  <div className="text-2xl font-bold">
                    ${formatNumber(company["Funding Raised"])}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Stock Exchange
                  </div>
                  <div className="font-medium">
                    {company["Stock Exchange"] || "Private"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    Ticker Symbol
                  </div>
                  <div className="font-medium">
                    {company["Ticker Symbol"] || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Market Sector
                  </div>
                  <div className="font-medium">
                    {company["Market Sector"] || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Key People */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">
                Key People
              </h2>

              {/* Founders */}
              {founders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-green-500">
                    Founders
                  </h3>
                  <div className="space-y-3">
                    {founders.map((founder, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg"
                      >
                        <div className="font-medium">{founder.name}</div>
                        {founder.linkedin ? (
                          <a
                            href={founder.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Linkedin className="w-4 h-4 mr-1" />
                            LinkedIn Profile
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No LinkedIn profile available
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Contacts */}
              {keyContacts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-500">
                    Key Contacts
                  </h3>
                  <div className="space-y-3">
                    {keyContacts.map((contact, index) => {
                      const linkedinUrls = extractLinkedInUrls(contact);
                      const contactName = contact
                        .replace(/,?LinkedIn:.*$/, "")
                        .trim();

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg"
                        >
                          <div className="font-medium">{contactName}</div>
                          {linkedinUrls.length > 0 ? (
                            <a
                              href={linkedinUrls[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Linkedin className="w-4 h-4 mr-1" />
                              LinkedIn Profile
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No LinkedIn profile available
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Investment Metrics & Related */}
          <div className="space-y-8">
            {/* Investment Metrics */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">
                Investment Metrics
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="text-gray-400">Growth Potential</div>
                    <div className="font-medium">
                      {company["Growth Potential Score"] || "N/A"}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getGrowthPotentialColor(
                        company["Growth Potential Score"]
                      )}`}
                      style={{
                        width: company["Growth Potential Score"]
                          ? company["Growth Potential Score"].toLowerCase() ===
                            "high"
                            ? "75%"
                            : company[
                                "Growth Potential Score"
                              ].toLowerCase() === "medium"
                            ? "50%"
                            : "25%"
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <div className="text-gray-400">Risk Level</div>
                    <div className="font-medium">
                      {company["Risk Level"] || "N/A"}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getRiskLevelColor(
                        company["Risk Level"]
                      )}`}
                      style={{
                        width: company["Risk Level"]
                          ? company["Risk Level"].toLowerCase() === "high"
                            ? "75%"
                            : company["Risk Level"].toLowerCase() === "medium"
                            ? "50%"
                            : "25%"
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-2">
                    Price to Revenue Ratio
                  </div>
                  <div className="text-2xl font-bold">
                    {company["Revenue"] && company["Current Valuation"]
                      ? (
                          parseInt(company["Current Valuation"]) /
                          parseInt(company["Revenue"])
                        ).toFixed(2) + "x"
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Position */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Market Position
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="text-gray-400">Industry</div>
                  <div className="font-medium">{company["Industry"]}</div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-700">
                  <div className="text-gray-400">Market Sector</div>
                  <div className="font-medium">
                    {company["Market Sector"] || "N/A"}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-700">
                  <div className="text-gray-400">Stock Exchange</div>
                  <div className="font-medium">
                    {company["Stock Exchange"] || "Private"}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-700">
                  <div className="text-gray-400">Ticker Symbol</div>
                  <div className="font-medium">
                    {company["Ticker Symbol"] || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-2">Ready to Invest?</h2>
              <p className="text-gray-400 mb-6">
                Get full access to financial reports and analyst insights.
              </p>

              <button className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                Get Premium Access
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyData;
