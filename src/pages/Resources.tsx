import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { InputField } from "@/components/InputField";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filterTabs = ["All", "ACP Guides", "Etsy Tips"];

  const articles = [
    {
      title: "Getting Started with ACP for Etsy",
      excerpt: "A comprehensive guide to understanding and implementing ACP feeds for your Etsy shop.",
      date: "March 15, 2025",
      readTime: "8 min read",
      category: "ACP Guides",
      slug: "getting-started-with-acp"
    },
    {
      title: "Optimizing Product Titles for AI Search",
      excerpt: "Learn how to structure your product titles to maximize visibility in ChatGPT Shopping.",
      date: "March 10, 2025",
      readTime: "6 min read",
      category: "Etsy Tips",
      slug: "optimizing-product-titles"
    },
    {
      title: "Understanding ChatGPT Shopping Behavior",
      excerpt: "Insights into how AI assistants recommend products and what factors influence their choices.",
      date: "March 5, 2025",
      readTime: "10 min read",
      category: "ACP Guides",
      slug: "chatgpt-shopping-behavior"
    },
    {
      title: "ACP Best Practices for 2025",
      excerpt: "Stay ahead with the latest recommendations and standards for AI commerce protocols.",
      date: "February 28, 2025",
      readTime: "7 min read",
      category: "ACP Guides",
      slug: "acp-best-practices-2025"
    },
    {
      title: "Etsy Tag Strategy for AI Discoverability",
      excerpt: "How to choose tags that work for both human and AI shoppers on Etsy.",
      date: "February 20, 2025",
      readTime: "5 min read",
      category: "Etsy Tips",
      slug: "etsy-tag-strategy"
    },
    {
      title: "Common ACP Feed Errors to Avoid",
      excerpt: "Don't let these simple validation errors prevent AI assistants from finding your products.",
      date: "February 15, 2025",
      readTime: "6 min read",
      category: "ACP Guides",
      slug: "common-acp-errors"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === "All" || article.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Resources &{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              Guides
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-light">
            Learn everything you need to know about ACP and AI commerce
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <InputField
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-6 py-2 rounded-full transition-all font-medium ${
                  selectedFilter === tab
                    ? "bg-accent text-accent-foreground"
                    : "glass-panel text-muted-foreground hover:text-foreground hover:bg-white/[0.12]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <GlassCard key={index} className="p-0 cursor-pointer group overflow-hidden">
              {/* Thumbnail - 16:9 aspect ratio */}
              <div className="aspect-video bg-gradient-to-br from-accent/20 via-accent/10 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-sm font-semibold text-accent">{article.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 font-light line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your search.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <GlassCard className="p-12 text-center bg-gradient-to-br from-accent/10 to-transparent">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay updated with the latest ACP insights
            </h2>
            <p className="text-muted-foreground mb-6 font-light">
              Get weekly tips and updates delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <InputField
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl transition-colors">
                Subscribe
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
