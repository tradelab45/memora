"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Share2,
  Check,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { playSubtleClick } from "@/lib/audio";
import "./collaborator-circle.css";

export type ContributorRole = "curator" | "storyteller" | "contributor" | "reader";

export interface Contributor {
  id: string;
  name: string;
  email: string;
  role: ContributorRole;
  avatar: string;
  status: "active" | "invited";
  contributions: string;
}

const DEFAULT_CONTRIBUTORS: Contributor[] = [
  {
    id: "1",
    name: "Elena Rostova",
    email: "elena@memora.internal",
    role: "curator",
    avatar: "ER",
    status: "active",
    contributions: "Owner & Creator · 12 photos",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.c@family.internal",
    role: "storyteller",
    avatar: "MC",
    status: "active",
    contributions: "3 voice keepsakes · 4 memories",
  },
  {
    id: "3",
    name: "Sophia Vance",
    email: "sophia@family.internal",
    role: "contributor",
    avatar: "SV",
    status: "active",
    contributions: "6 photos contributed",
  },
];

export function CollaboratorCircle() {
  const [contributors, setContributors] = useState<Contributor[]>(DEFAULT_CONTRIBUTORS);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<ContributorRole>("storyteller");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/circle?token=vol1-c98f`
      : "https://memora.app/invite/circle?token=vol1-c98f";

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    playSubtleClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddContributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const initials = inviteName
      .trim()
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newMember: Contributor = {
      id: String(Date.now()),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: initials || "CO",
      status: "invited",
      contributions: "Invited contributor",
    };

    setContributors((prev) => [...prev, newMember]);
    setInviteName("");
    setInviteEmail("");
    setShowInviteForm(false);
    playSubtleClick();
  };

  return (
    <div className="collaborator-circle-panel">
      <div className="circle-header">
        <div className="circle-title-cluster">
          <span className="circle-kicker">
            <Users size={13} /> FAMILY & KEEPSAKE CIRCLE
          </span>
          <h4>Collaborative Memory Contributions</h4>
          <p className="circle-desc">
            Invite family members and travel companions to contribute their own
            audio keepsakes, anecdotes, and camera photos to this edition.
          </p>
        </div>
        <div className="circle-actions-top">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="copy-invite-link-btn"
          >
            {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copiedLink ? "Link Copied!" : "Share Invite Link"}</span>
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              setShowInviteForm((p) => !p);
              playSubtleClick();
            }}
            className="invite-member-btn"
          >
            <UserPlus size={14} />
            <span>Invite Member</span>
          </Button>
        </div>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <form onSubmit={handleAddContributor} className="invite-member-form">
          <h5>Invite a Contributor to this Photobook</h5>
          <div className="invite-inputs-row">
            <input
              type="text"
              placeholder="Full name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="invite-text-input"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="invite-text-input"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as ContributorRole)}
              className="invite-role-select"
            >
              <option value="storyteller">Co-Storyteller (Can edit & write)</option>
              <option value="contributor">Contributor (Add photos & audio)</option>
              <option value="reader">Keepsake Reader (View only)</option>
            </select>
            <Button type="submit" size="sm" className="send-invite-btn">
              Send Invite
            </Button>
          </div>
        </form>
      )}

      {/* Contributors Grid */}
      <div className="contributors-list">
        {contributors.map((member) => (
          <div key={member.id} className="contributor-card">
            <div className="contributor-avatar">{member.avatar}</div>
            <div className="contributor-info">
              <div className="contributor-name-row">
                <strong>{member.name}</strong>
                <span className={`role-badge role-${member.role}`}>
                  {member.role === "curator" && <ShieldCheck size={11} />}
                  {member.role === "storyteller" && <Sparkles size={11} />}
                  {member.role === "contributor" && <ImageIcon size={11} />}
                  {member.role}
                </span>
                {member.status === "invited" && (
                  <span className="pending-badge">Invite Pending</span>
                )}
              </div>
              <span className="contributor-email">{member.email}</span>
              <p className="contributor-stats">{member.contributions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
