import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid link. No token provided.");
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid or expired link");
      }

      const data = await response.json();

      setStatus("success");
      setMessage("Successfully verified! Redirecting...");

      // Redirect based on user type
      setTimeout(() => {
        if (data.isNewUser) {
          navigate("/onboarding/welcome");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="glass-frost rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-md w-full p-12 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-accent mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Verifying your link...</h1>
            <p className="text-muted-foreground">Please wait while we verify your magic link.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Success!</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <a
              href="/login"
              className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3 rounded-full transition-all"
            >
              Request a new link
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
