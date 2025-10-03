import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Copy, ExternalLink, Mail, Sparkles, CheckCircle2 } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

const WAITLIST_STORAGE_KEY = "agentranked_waitlist_ref";
const REFERRAL_TARGET = 3;

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Stage of the waitlist funnel shown in the UI. */
type WaitlistStage = "signup" | "referrals" | "success";

/** Convenience type for the Supabase waitlist row. */
type WaitlistUser = Database["public"]["Tables"]["waitlist_users"]["Row"];

const Waitlist = () => {
  const [searchParams] = useSearchParams();
  const referralParam = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<WaitlistUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [stage, setStage] = useState<WaitlistStage>("signup");

  const normalizedReferral = useMemo(() => {
    if (!referralParam) return null;
    return referralParam.trim().toUpperCase();
  }, [referralParam]);

  /** Load a waitlist user by referral code and cache it locally. */
  const fetchUserByReferral = useCallback(async (code: string) => {
    // Use secure function to validate referral code without exposing all data
    const { data: isValid, error: validateError } = await supabase
      .rpc("validate_referral_code", { code });

    if (validateError) {
      console.error("Failed to validate referral code", validateError);
      return null;
    }

    if (isValid) {
      // Store code for later use when user signs up
      localStorage.setItem(WAITLIST_STORAGE_KEY, code);
      // We can't fetch full user data anymore for security, so just track the code
      return { referral_code: code } as WaitlistUser;
    }

    return null;
  }, []);

  /** Bootstrap the page with any cached referral visitor state. */
  useEffect(() => {
    const storedCode = localStorage.getItem(WAITLIST_STORAGE_KEY);

    if (storedCode) {
      fetchUserByReferral(storedCode).finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
  }, [fetchUserByReferral]);

  /** Update the UI stage whenever waitlist progress changes. */
  useEffect(() => {
    if (initializing) return;

    if (!currentUser || !currentUser.referral_code) {
      setStage("signup");
    } else if ((currentUser.invite_count ?? 0) >= REFERRAL_TARGET) {
      setStage("success");
    } else {
      setStage("referrals");
    }
  }, [currentUser, initializing]);

  /** Generate a short, human-friendly referral code. */
  const generateUniqueReferralCode = useCallback(async (): Promise<string> => {
    let attempt = 0;

    while (attempt < 10) {
      const code = Array.from({ length: 6 })
        .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
        .join("");

      // Use secure function to validate referral code
      const { data: exists, error } = await supabase
        .rpc("validate_referral_code", { code });

      if (error) {
        console.error("Error checking referral code:", error);
        attempt += 1;
        continue;
      }

      if (!exists) {
        return code;
      }

      attempt += 1;
    }

    throw new Error("Unable to generate referral code. Please try again.");
  }, []);

  /** Increment the inviter's counter when a referral signs up. */
  const incrementInviterCount = useCallback(async (code: string | null) => {
    if (!code) return;

    // Use secure function to increment referral count
    const { error } = await supabase
      .rpc("increment_referral_count", { code });

    if (error) {
      console.error("Failed to increment inviter count", error);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use secure function to check if email exists
      const { data: emailCheckRaw, error: lookupError } = await supabase
        .rpc("check_waitlist_email_exists", { email_address: normalizedEmail });

      if (lookupError) {
        throw lookupError;
      }

      // Type assertion for the JSONB response
      const emailCheck = emailCheckRaw as { exists: boolean; id?: string; referral_code?: string; invite_count?: number };

      if (emailCheck && emailCheck.exists && emailCheck.referral_code) {
        setCurrentUser({
          referral_code: emailCheck.referral_code,
          invite_count: emailCheck.invite_count ?? 0,
          id: emailCheck.id as string,
          email: normalizedEmail,
        } as WaitlistUser);
        localStorage.setItem(WAITLIST_STORAGE_KEY, emailCheck.referral_code);
        toast("You're already on the waitlist.");
        return;
      }

      const referralCode = await generateUniqueReferralCode();

      const { data: inserted, error: insertError } = await supabase
        .from("waitlist_users")
        .insert({
          email: normalizedEmail,
          referral_code: referralCode,
          invited_by: normalizedReferral,
          invite_count: 0,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      await incrementInviterCount(normalizedReferral);

      if (inserted) {
        setCurrentUser(inserted);
        localStorage.setItem(WAITLIST_STORAGE_KEY, inserted.referral_code);
        toast("Welcome to the AgentRanked waitlist!");
      }
    } catch (signUpError) {
      console.error(signUpError);
      setError("Something went wrong while joining the waitlist. Please try again.");
      toast.error("We couldn't process your signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = useMemo(() => {
    if (!currentUser) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/waitlist?ref=${currentUser.referral_code}`;
  }, [currentUser]);

  const totalInvites = currentUser?.invite_count ?? 0;
  const pendingInvites = Math.max(REFERRAL_TARGET - totalInvites, 0);
  const progressPercent = (Math.min(totalInvites, REFERRAL_TARGET) / REFERRAL_TARGET) * 100;

  const handleCopyLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied to clipboard!");
    } catch (copyError) {
      console.error(copyError);
      toast.error("Unable to copy link. Please copy it manually.");
    }
  };

  const handleInviteEmail = () => {
    if (!referralLink) return;

    const subject = encodeURIComponent("Join me in the AgentRanked Beta");
    const body = encodeURIComponent(
      `I just joined the AgentRanked Beta to get my Shopify store listed in ChatGPT Shopping. Use my link to join me: ${referralLink}`,
    );

    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_bottom,_rgba(26,86,219,0.16),_transparent_55%)]" />

      <main className="relative z-10 px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 p-10 shadow-2xl shadow-cyan-400/15 backdrop-blur-2xl md:p-16"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-white/10" />
            <div className="relative grid items-center gap-12 md:grid-cols-2">
              {/* Left: Copy and Form */}
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Early Access Waitlist</p>
                  <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                    Your Shopify Products in ChatGPT Shopping
                  </h1>
                  <p className="max-w-xl text-lg text-muted-foreground">
                    AgentRanked auto-builds ACP feeds so your Shopify products are found by ChatGPT shoppers. Get ready before everyone else.
                  </p>
                </div>

                {stage === "signup" && (
                  <>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <Input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        disabled={loading}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="youremail@company.com"
                        className="h-14 rounded-full border-white/20 bg-white/10 px-6 text-base text-foreground backdrop-blur focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="h-14 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-[0_0_40px_rgba(34,211,238,0.4)] transition hover:bg-accent/90"
                      >
                        {loading ? "Joining..." : "Join Waitlist"}
                      </Button>
                    </form>
                    {error && (
                      <p className="text-sm text-red-300">{error}</p>
                    )}
                  </>
                )}

                {stage !== "signup" && (
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-sm shadow-inner shadow-cyan-300/20">
                    {stage === "success" ? (
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🎉</span>
                        <p className="text-base font-semibold text-cyan-100">
                          You've unlocked beta access! We'll notify you the moment onboarding opens.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                        <p className="text-base font-medium text-cyan-100">
                          You're on the list! Share your referral link below to unlock early beta access.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Hero Image */}
              <div className="relative">
                <div className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-cyan-400/20">
                  <img
                    src="/chatgpthero1.png"
                    alt="ChatGPT Shopping carousel mockup showing Shopify products"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* What is ACP? Why Now? Section */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <GlassCard className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl shadow-cyan-400/15">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-white/10" />
            <div className="relative space-y-6 text-left">
              <h2 className="text-3xl font-semibold text-foreground">What is ACP? Why Now?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  <strong className="text-foreground">ACP (Agentic Commerce Protocol)</strong> is OpenAI's new standard that enables ChatGPT and other AI assistants to recommend and sell products directly in conversations. Think of it as SEO for the AI era—but instead of ranking on Google, your products appear when millions of users ask ChatGPT for shopping recommendations.
                </p>
                <p className="text-lg leading-relaxed">
                  OpenAI recently announced official support for Shopify stores, meaning ChatGPT will soon browse, recommend, and link to products from ACP-compliant Shopify merchants. <strong className="text-foreground">If your store isn't ACP-ready when this launches, you'll be invisible to AI shoppers.</strong>
                </p>
                <p className="text-lg leading-relaxed">
                  AgentRanked automates the entire ACP feed generation and optimization process so you can focus on running your business while we make sure your products are discoverable by ChatGPT Shopping, Claude Commerce, and other AI shopping agents.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="justify-start rounded-full border border-cyan-300/40 bg-cyan-400/20 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:bg-cyan-300/30"
                >
                  <a href="https://openai.com/index/buy-it-in-chatgpt/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    OpenAI + Shopify Announcement
                  </a>
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Referral Dashboard */}
        {!initializing && currentUser && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <GlassCard className="relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl shadow-cyan-400/15">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-white/10" />
              <div className="relative space-y-8">
                <div className="space-y-3 text-left">
                  <h2 className="text-2xl font-semibold text-foreground">Referral Dashboard</h2>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Invite 3 Shopify friends to unlock early beta access (only 25 spots available).
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Invited</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">{totalInvites}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pending Invites</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">{pendingInvites}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Goal</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">{REFERRAL_TARGET}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-muted-foreground">Progress</span>
                    <span className="font-semibold text-cyan-200">{Math.min(totalInvites, REFERRAL_TARGET)}/{REFERRAL_TARGET}</span>
                  </div>
                  <Progress
                    value={progressPercent}
                    className="h-3 rounded-full border border-white/10 bg-white/10 shadow-inner shadow-cyan-300/20"
                  />
                  {stage === "success" ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/40 bg-cyan-500/15 px-4 py-3 text-sm font-medium text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                      <Sparkles className="h-4 w-4" />
                      You've unlocked beta access. We'll notify you soon.
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {pendingInvites} more invite{pendingInvites === 1 ? "" : "s"} to go.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="w-full max-w-xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Your Referral Link</p>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-foreground">
                      <span className="truncate">{referralLink}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      variant="outline"
                      className="rounded-full border-cyan-300/40 bg-cyan-400/20 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:bg-cyan-300/30"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Button
                      type="button"
                      onClick={handleInviteEmail}
                      variant="ghost"
                      className="rounded-full border border-white/10 bg-white/10 text-foreground hover:bg-white/20"
                    >
                      <Mail className="h-4 w-4" />
                      Invite via Email
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        )}

        {/* Privacy Policy Link */}
        <div className="mt-12 text-center">
          <a 
            href="/privacy-policy" 
            className="text-sm text-muted-foreground hover:text-cyan-200 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </main>
    </div>
  );
};

export default Waitlist;
