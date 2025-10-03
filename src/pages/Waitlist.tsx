import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Sparkles, UserPlus, Copy, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WAITLIST_STORAGE_KEY = "agentranked_waitlist_ref";
const REFERRAL_TARGET = 3;

type WaitlistUser = Database["public"]["Tables"]["waitlist_users"]["Row"];

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const Waitlist = () => {
  const [searchParams] = useSearchParams();
  const referralParam = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<WaitlistUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const normalizedReferral = useMemo(() => {
    if (!referralParam) return null;
    return referralParam.trim().toUpperCase();
  }, [referralParam]);

  const fetchUserByReferral = useCallback(async (code: string) => {
    const { data, error: fetchError } = await supabase
      .from("waitlist_users")
      .select("*")
      .eq("referral_code", code)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to load waitlist user", fetchError);
      return null;
    }

    if (data) {
      setCurrentUser(data);
      localStorage.setItem(WAITLIST_STORAGE_KEY, data.referral_code);
    }

    return data;
  }, []);

  useEffect(() => {
    const storedCode = localStorage.getItem(WAITLIST_STORAGE_KEY);

    if (storedCode) {
      fetchUserByReferral(storedCode).finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
  }, [fetchUserByReferral]);

  const generateUniqueReferralCode = useCallback(async (): Promise<string> => {
    let attempt = 0;

    while (attempt < 10) {
      const code = Array.from({ length: 6 })
        .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
        .join("");

      const { data } = await supabase
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", code)
        .maybeSingle();

      if (!data) {
        return code;
      }

      attempt += 1;
    }

    throw new Error("Unable to generate referral code. Please try again.");
  }, []);

  const incrementInviterCount = useCallback(async (code: string | null) => {
    if (!code) return;

    const { data: inviter, error: inviterError } = await supabase
      .from("waitlist_users")
      .select("id, invite_count, referral_code")
      .eq("referral_code", code)
      .maybeSingle();

    if (inviterError) {
      console.error("Failed to load inviter", inviterError);
      return;
    }

    if (!inviter) return;

    const nextCount = (inviter.invite_count ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("waitlist_users")
      .update({ invite_count: nextCount })
      .eq("id", inviter.id);

    if (updateError) {
      console.error("Failed to increment inviter count", updateError);
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
      const { data: existing, error: lookupError } = await supabase
        .from("waitlist_users")
        .select("*")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (lookupError) {
        throw lookupError;
      }

      if (existing) {
        setCurrentUser(existing);
        localStorage.setItem(WAITLIST_STORAGE_KEY, existing.referral_code);
        toast("You’re already on the AgentRanked waitlist.");
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
        toast("Welcome! You’re on the AgentRanked Beta waitlist.");
      }
    } catch (signUpError) {
      console.error(signUpError);
      setError("Something went wrong while joining the waitlist. Please try again.");
      toast("We couldn’t process your signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = useMemo(() => {
    if (!currentUser) return "";
    return `https://getagentranked.com/waitlist?ref=${currentUser.referral_code}`;
  }, [currentUser]);

  const progress = useMemo(() => {
    const count = currentUser?.invite_count ?? 0;
    return {
      count,
      capped: Math.min(count, REFERRAL_TARGET),
      percent: (Math.min(count, REFERRAL_TARGET) / REFERRAL_TARGET) * 100,
      unlocked: count >= REFERRAL_TARGET,
    };
  }, [currentUser]);

  const handleCopyLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      toast("Referral link copied to clipboard.");
    } catch (copyError) {
      console.error(copyError);
      toast("Unable to copy link. Please copy it manually.");
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

  const steps = [
    {
      title: "Sign up with your email",
      description: "Secure your spot in the beta by joining the waitlist.",
      icon: Mail,
    },
    {
      title: "Invite 3 Shopify friends",
      description: "Share your unique link with fellow merchants.",
      icon: UserPlus,
    },
    {
      title: "Unlock Beta access",
      description: "Get instant access when 3 invites join successfully.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_50%)]" />

      <main className="relative z-10 flex flex-col items-center px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl text-center"
        >
          <div className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 p-10 shadow-2xl shadow-cyan-400/10 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-transparent to-white/5" />
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Join the AgentRanked Beta
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Be among the first 25 Shopify merchants to unlock AI-powered visibility in ChatGPT Shopping.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className={cn(
                  "mx-auto flex w-full max-w-xl flex-col gap-4 sm:flex-row",
                  currentUser && "pointer-events-none opacity-60",
                )}
              >
                <Input
                  type="email"
                  value={email}
                  disabled={loading || !!currentUser}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@store.com"
                  className="h-14 rounded-full border-white/20 bg-white/10 px-6 text-base text-foreground backdrop-blur focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                />
                <Button
                  type="submit"
                  disabled={loading || !!currentUser}
                  size="lg"
                  className="h-14 rounded-full bg-cyan-400/90 px-8 text-base font-semibold text-slate-900 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>

              {error && (
                <p className="text-sm text-red-300">{error}</p>
              )}

              {currentUser && (
                <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-5 text-left shadow-inner shadow-cyan-300/10">
                  <p className="text-sm font-medium text-cyan-100">
                    Welcome aboard! Share your link below to unlock early access.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-foreground">
                      {currentUser.email}
                    </span>
                    <span className="text-white/70">•</span>
                    <span>Your referral code: </span>
                    <span className="font-semibold text-cyan-200">{currentUser.referral_code}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {!initializing && currentUser && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-16 w-full max-w-3xl"
          >
            <div className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl shadow-cyan-400/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-transparent to-white/10" />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col gap-2 text-left">
                  <h2 className="text-2xl font-semibold text-foreground">Referral Tracker</h2>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Invite 3 Shopify friends to unlock Beta access.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-cyan-200">
                      {progress.capped}/{REFERRAL_TARGET} invites
                    </span>
                  </div>
                  <Progress
                    value={progress.percent}
                    className="mt-3 h-3 rounded-full border border-white/10 bg-white/10 shadow-inner shadow-cyan-300/20"
                  />
                  {progress.unlocked ? (
                    <p className="mt-4 text-base font-semibold text-cyan-100">
                      🎉 You’ve unlocked Beta access!
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {REFERRAL_TARGET - progress.count} more invite{REFERRAL_TARGET - progress.count === 1 ? "" : "s"} to go.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your link</span>
                    <div className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-foreground">
                      <Link2 className="h-4 w-4 text-cyan-200" />
                      <span className="truncate">{referralLink}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      variant="outline"
                      className="rounded-full border-cyan-300/40 bg-cyan-400/20 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:bg-cyan-300/30"
                    >
                      <Copy className="h-4 w-4" />
                      Copy referral link
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
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-20 w-full max-w-6xl"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-xl shadow-cyan-400/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-400/10" />
                <div className="relative z-10 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-20 w-full max-w-3xl text-center"
        >
          <div className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl shadow-cyan-400/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-white/5" />
            <div className="relative z-10 space-y-4">
              <p className="text-base text-muted-foreground">
                Already invited? Check your status in your referral dashboard.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-cyan-400/90 px-8 text-base font-semibold text-slate-900 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
              >
                <a href="/waitlist/dashboard">View My Dashboard</a>
              </Button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Waitlist;
