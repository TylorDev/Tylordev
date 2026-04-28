import { FiLogOut, FiShield, FiExternalLink, FiTool } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { isTestMode } from "../../lib/testMode";
import "./AdminHeader.scss";

const PUBLIC_SITE = import.meta.env.VITE_PUBLIC_SITE_URL ?? "/";

export default function AdminHeader() {
  const { session, logout } = useAuth();

  return (
    <header className="ahdr">
      <div className="ahdr-inner container">
        <div className="ahdr-brand">
          <span className="ahdr-logo">
            <FiShield />
          </span>
          <div className="ahdr-brand-text">
            <strong>TylorDev</strong>
            <span>Admin</span>
          </div>
        </div>

        <div className="ahdr-tools">
          {isTestMode() && (
            <span className="ahdr-testbadge" title="Data is stored in localStorage">
              <FiTool /> Test mode
            </span>
          )}
          <a className="ahdr-link" href={PUBLIC_SITE} target="_blank" rel="noopener noreferrer">
            Public site <FiExternalLink />
          </a>
          {session && (
            <div className="ahdr-user">
              {session.avatarUrl && (
                <img src={session.avatarUrl} alt={session.login} />
              )}
              <div className="ahdr-user-info">
                <strong>{session.name ?? session.login}</strong>
                <span>@{session.login}</span>
              </div>
              <button className="ahdr-logout" onClick={logout} aria-label="Sign out">
                <FiLogOut />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
