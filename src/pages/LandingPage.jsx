import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Shield,
  ChartBar,
  Target,
  AlertTriangle,
  BarChart2,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";

const SmallcapLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    // Generate mock chart data
    const data = Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: Math.random() * 30 + 20,
    }));
    setChartData(data);
  }, []);

  // Mini chart component
  const MiniChart = () => (
    <svg className="w-full h-16" viewBox="0 0 100 40">
      <path
        d={`M 0 ${40 - chartData[0]?.y || 0} ${chartData
          .map((point, i) => `L ${(i + 1) * 5} ${40 - point.y}`)
          .join(" ")}`}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Floating Navigation */}
      <nav className="fixed w-full z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">smallcap.ai</span>
            </div>
            <button className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 flex items-center space-x-2">
              <span>Start Investing</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#22c55e1a,transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Discover the Next
                <span className="block text-green-500">Small Cap Gems</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl">
                AI-powered analysis of companies under $50M valuation. Get ahead
                of the market with data-driven insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <span>Explore Companies</span>
                  <ArrowUpRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <MiniChart />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-green-500 text-sm">Average Growth</div>
                    <div className="text-2xl font-bold">+127%</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-green-500 text-sm">
                      Companies Tracked
                    </div>
                    <div className="text-2xl font-bold">500+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ChartBar className="w-8 h-8 text-green-500" />,
                title: "Market Analytics",
                description:
                  "Real-time valuation tracking and market sector analysis",
              },
              {
                icon: <Target className="w-8 h-8 text-green-500" />,
                title: "Growth Scoring",
                description:
                  "Proprietary AI-driven growth potential scoring system",
              },
              {
                icon: <AlertTriangle className="w-8 h-8 text-green-500" />,
                title: "Risk Assessment",
                description:
                  "Comprehensive risk level evaluation and monitoring",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="p-3 bg-gray-700 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Points Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Comprehensive{" "}
            <span className="text-green-500">Company Analysis</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Valuation Tracking",
                value: "Under $50M",
                icon: <DollarSign className="w-6 h-6" />,
              },
              {
                title: "Stock Exchange",
                value: "Multi-Exchange",
                icon: <TrendingUp className="w-6 h-6" />,
              },
              {
                title: "Market Sectors",
                value: "10+ Sectors",
                icon: <ChartBar className="w-6 h-6" />,
              },
              {
                title: "Growth Scoring",
                value: "1-10 Scale",
                icon: <Target className="w-6 h-6" />,
              },
              {
                title: "Risk Analysis",
                value: "3-Tier System",
                icon: <Shield className="w-6 h-6" />,
              },
              {
                title: "Daily Updates",
                value: "Real-time",
                icon: <BarChart2 className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6 bg-gray-900 border border-gray-800 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-gray-400 mb-1">{item.title}</div>
                      <div className="text-xl font-semibold">{item.value}</div>
                    </div>
                    <div className="p-2 bg-gray-800 rounded-lg">
                      {item.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">
            Start Discovering{" "}
            <span className="text-green-500">Hidden Gems</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of investors using AI-powered insights to find the
            next big small-cap opportunity.
          </p>
          <button className="px-12 py-6 bg-green-500 hover:bg-green-600 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto">
            <span className="text-xl font-semibold">Access Database Now</span>
            <ArrowUpRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default SmallcapLanding;
