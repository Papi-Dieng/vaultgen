# 🔐 VaultGen

Gestionnaire d'identifiants pour abonnements Netflix, Spotify, etc. avec génération automatique d'instructions.

## 🚀 Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copie `.env.example` en `.env` et remplis tes vraies valeurs :

```bash
cp .env.example .env
```

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
VITE_EMAILJS_TO_EMAIL=ton_email@gmail.com
```

> ⚠️ **Ne commite JAMAIS ton fichier `.env` sur GitHub !** Il est déjà dans `.gitignore`.

### 3. Lancer en développement

```bash
npm run dev
```

### 4. Build pour la production

```bash
npm run build
```

---

## 📁 Structure du projet

```
vaultgen/
├── index.html
├── package.json
├── vite.config.js
├── .env.example          ← Modèle pour tes variables
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── constants.js       ← Templates, statuts, config EmailJS
    ├── styles.js          ← Styles partagés
    ├── hooks/
    │   ├── useIsMobile.js
    │   ├── useDebounce.js
    │   ├── useToast.js
    │   └── useKeyboardShortcuts.js
    ├── utils/
    │   ├── storage.js     ← Helpers localStorage
    │   └── helpers.js
    └── components/
        ├── AuthScreen.jsx
        ├── Sidebar.jsx
        ├── GeneratePage.jsx
        ├── AccountsPage.jsx
        ├── AccountCard.jsx
        ├── SettingsPage.jsx
        ├── ToastContainer.jsx
        └── ConfirmDialog.jsx
```

---

## 🌐 Déploiement sur GitHub Pages

```bash
# 1. Build
npm run build

# 2. Installer gh-pages
npm install --save-dev gh-pages

# 3. Ajouter dans package.json > scripts :
#    "deploy": "gh-pages -d dist"

# 4. Déployer
npm run deploy
```

Ou utilise **Vercel** / **Netlify** en connectant ton repo GitHub — build command: `npm run build`, output: `dist`.

---

## ⌨️ Raccourcis clavier

| Touche | Action |
|--------|--------|
| `G` | Page Générer |
| `A` | Page Comptes |
| `S` | Paramètres |
| `Ctrl+K` | Rechercher |
