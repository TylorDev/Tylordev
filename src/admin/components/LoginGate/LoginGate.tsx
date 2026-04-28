import { FiGithub, FiLock, FiRefreshCw, FiAlertCircle, FiTool } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { buildLoginUrl, API_URL } from "../../lib/api";
import { enableTestMode, isDevBuild } from "../../lib/testMode";
import Button from "../Button/Button";
import Skeleton from "../Skeleton/Skeleton";
import "./LoginGate.scss";

interface Props {
  children: React.ReactNode;
}

// Gates the entire admin shell behind the GitHub OAuth session.
// Same contract as the original Tylordev-Admin: the backend handles
// /auth/github/start → callback → cookie, then /auth/session returns
// the user once the cookie is present.
export default function LoginGate({ children }: Props) {
  const { status, error, refresh } = useAuth();

  if (status === "checking") {
    return (
      <div className="loginx loginx-loading">
        <div className="loginx-card glass">
          <Skeleton width={48} height={48} radius={12} />
          <div style={{ height: 18 }} />
          <Skeleton width="60%" height={16} />
          <div style={{ height: 8 }} />
          <Skeleton width="80%" height={12} />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="loginx">
        <div className="loginx-card glass">
          <span className="loginx-badge">
            <FiLock />
          </span>
          <span className="eyebrow">Restricted</span>
          <h1 className="section-title">
            <span className="gradient-text">Sign in to continue</span>
          </h1>
          <p className="section-subtitle">
            This panel is restricted. Authenticate with the GitHub account
            authorised on the backend to manage projects and articles.
          </p>

          {error && (
            <div className="loginx-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="loginx-actions">
            <Button
              variant="primary"
              icon={<FiGithub />}
              onClick={() => {
                window.location.href = buildLoginUrl();
              }}
            >
              Continue with GitHub
            </Button>
            <Button variant="ghost" icon={<FiRefreshCw />} onClick={refresh}>
              I just signed in
            </Button>
          </div>

          {isDevBuild() && (
            <div className="loginx-test">
              <Button
                variant="ghost"
                icon={<FiTool />}
                onClick={() => {
                  enableTestMode();
                  refresh();
                }}
              >
                Use test mode (dev only)
              </Button>
              <p>Skips GitHub auth and stores everything in <code>localStorage</code>.</p>
            </div>
          )}

          <div className="loginx-meta">
            <span>API:</span>
            <code>{API_URL}</code>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
