// ─── EmailJS Config (depuis variables d'environnement Vite) ──────────────────
// Crée un fichier .env à la racine du projet avec ces variables
export const SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID   || "service_169phpn";
export const TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID  || "template_8qnnrru";
export const PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY   || "kFK9eBXqTg441PxLX";
export const NOTIFY_EMAIL = import.meta.env.VITE_EMAILJS_TO_EMAIL     || "ton_email@gmail.com";

// ─── Statuts ──────────────────────────────────────────────────────────────────
export const STATUS_OPTIONS = ["Terminé", "À vérifier", "Amna"];

export const STATUS_COLORS = {
  "Terminé":    { bg: "#0f6e56", text: "#e1f5ee" },
  "À vérifier": { bg: "#854f0b", text: "#faeeda" },
  "Amna":       { bg: "#533ab7", text: "#eeedfe" },
};

// ─── Templates ────────────────────────────────────────────────────────────────
export const TEMPLATES = {
  netflix: {
    label: "Netflix",
    icon: "📺",
    generate: ({ email, password, profileName, pin }) => {
      const fullEmail    = `${email}@gmail.com`;
      const fullPassword = `${password}098`;
      const pinLine      = pin
        ? `\n8- Ensuite, il demandera un PIN :\n\nUser-Pin : ${pin}\n`
        : "";
      return `NB : 1 profil = 1 appareil ⚠️

1- Installe l'application Netflix

2- Ouvre l'application

3- Appuie sur le bouton "Sign in" ou "S'identifier"

4- Entre l'email du compte :

Email : ${fullEmail}

Puis appuie sur Continuer.

5- Quand Netflix demande un code d'identification :
Appuie sur « Obtenir de l'aide » puis sur « Utiliser le mot de passe ».

6- Entre le mot de passe :

Mot de passe 🔐 : ${fullPassword}

7- Sélectionne le profil :

Profil : ${profileName}
${pinLine}
Tu peux commencer !

🚫 Fin d'abonnement

---

🔔 Renouvelle avant la date limite pour conserver ton compte actuel.`;
    },
  },
  spotify: {
    label: "Spotify",
    icon: "🎵",
    generate: ({ email, password }) => {
      return `1- Installe l'application Spotify

2- Appuie sur "Se connecter"

3- Connecte-toi avec :

Email : ${email}@gmail.com
Mot de passe 🔐 : ${password}098

Tu peux écouter !

🚫 Fin d'abonnement

---

🔔 Renouvelle avant la date limite.`;
    },
  },
};

// ─── localStorage keys ────────────────────────────────────────────────────────
export const LS_ACCOUNTS = "vaultgen_accounts";
export const LS_USER     = "vaultgen_user";
