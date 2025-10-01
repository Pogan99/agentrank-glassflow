import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { InputField } from "@/components/InputField";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      title: "Getting Started with ACP for Etsy",
      excerpt: "A comprehensive guide to understanding and implementing ACP feeds for your Etsy shop.",
      date: "March 15, 2025",
      readTime: "8 min read",
      category: "Getting Started",
      slug: "getting-started-with-acp"
    },
    {
      title: "Optimizing Product Data for AI Discovery",
      excerpt: "Learn how to structure your product information to maximize visibility in AI search results.",
      date: "March 10, 2025",
      readTime: "6 min read",
      category: "Optimization",
      slug: "optimizing-product-data"
    },
    {
      title: "Understanding ChatGPT Shopping Behavior",
      excerpt: "Insights into how AI assistants recommend products and what factors influence their choices.",
      date: "March 5, 2025",
      readTime: "10 min read",
      category: "Research",
      slug: "chatgpt-shopping-behavior"
    },
    {
      title: "ACP Best Practices for 2025",
      excerpt: "Stay ahead with the latest recommendations and standards for AI commerce protocols.",
      date: "February 28, 2025",
      readTime: "7 min read",
      category: "Best Practices",
      slug: "acp-best-practices-2025"
    },
    {
      title: "Case Study: 300% Increase in AI Traffic",
      excerpt: "How one Etsy seller used AgentRank to dramatically increase discoverability.",
      date: "February 20, 2025",
      readTime: "5 min read",
      category: "Case Study",
      slug: "case-study-ai-traffic"
    },
    {
      title: "Common ACP Mistakes to Avoid",
      excerpt: "Don't let these simple errors prevent AI assistants from finding your products.",
      date: "February 15, 2025",
      readTime: "6 min read",
      category: "Troubleshooting",
      slug: "common-acp-mistakes"
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <InputField
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <GlassCard key={index} className="p-6 cursor-pointer group">
              <div className="flex items-center gap-2 text-sm text-accent mb-3">
                <span className="font-semibold">{article.category}</span>
              </div>
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
