# 🚀 DEPLOYMENT GUIDE - PROTOCOL HEALTH

## ÉTAPE 1: INSTALLATION NODE.JS (10 min)

### Windows:
1. Va sur https://nodejs.org
2. Télécharge "LTS" (bouton vert à gauche)
3. Lance le .exe téléchargé
4. Clique "Next" partout (options par défaut OK)
5. Termine l'installation

### Mac:
1. Va sur https://nodejs.org  
2. Télécharge "LTS" pour macOS
3. Lance le .pkg téléchargé
4. Suit les instructions

### Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### ✅ Vérification:
Ouvre un terminal et tape:
```bash
node --version
# Devrait afficher: v18.x.x ou plus

npm --version
# Devrait afficher: 9.x.x ou plus
```

❌ **Si erreur "command not found":**
- Redémarre ton ordinateur
- Réessaye
- Si toujours erreur, reinstalle Node.js

---

## ÉTAPE 2: INSTALLER VS CODE (5 min)

1. Va sur https://code.visualstudio.com
2. Télécharge pour ton OS
3. Installe (options par défaut OK)
4. Lance VS Code

### Extensions utiles (optionnel):
Dans VS Code, clique sur l'icône Extensions (carré avec 4 carrés) et installe:
- "Prettier" (formatage auto)
- "ESLint" (détection erreurs)
- "Tailwind CSS IntelliSense" (aide CSS)

---

## ÉTAPE 3: PRÉPARER LE PROJET (10 min)

### 3.1 Télécharge et extrais:

1. Télécharge le fichier protocol-health-LAUNCH-READY.zip
2. **Windows**: Clic droit → "Extraire tout" → Bureau
3. **Mac**: Double-clic pour extraire
4. Tu devrais avoir un dossier `protocol-health` sur ton bureau

### 3.2 Ouvre dans VS Code:

1. Ouvre VS Code
2. File → Open Folder
3. Sélectionne le dossier `protocol-health`
4. Trust authors? → Yes

### 3.3 Ouvre le terminal intégré:

Dans VS Code:
- **Windows**: Ctrl + `
- **Mac**: Cmd + `
- Ou menu: Terminal → New Terminal

### 3.4 Installe les dépendances:

Dans le terminal VS Code, tape:
```bash
npm install
```

⏳ **Attends 2-5 minutes** (ça télécharge tout)

Si tu vois des warnings jaunes → C'EST OK
Si tu vois des erreurs rouges → STOP et lis l'erreur

### ✅ Vérification:
```bash
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur

**Tu dois voir le site!** 🎉

Si oui → Ctrl+C dans le terminal pour arrêter

---

## ÉTAPE 4: CRÉER LES COMPTES SERVICES (45 min)

## 📊 SUPABASE (Base de données) - 15 min

### 4.1 Créer compte:
1. Va sur https://supabase.com
2. "Start your project" → Sign up avec GitHub ou email
3. Confirme ton email

### 4.2 Créer projet:
```
Organization: ton-pseudo
Project name: protocol-health
Database Password: [GÉNÈRE UN MOT DE PASSE FORT ET NOTE-LE!]
Region: East US (Virginia) ou Europe (Frankfurt)
Pricing Plan: Free

→ Create new project
```

⏳ **Attends 2 minutes** que le projet se crée

### 4.3 Configurer la base de données:

1. Menu gauche → SQL Editor
2. Clique "New query"
3. **IMPORTANT**: Ouvre le fichier `supabase/schema.sql` dans VS Code
4. Copie TOUT le contenu (Ctrl+A, Ctrl+C)
5. Colle dans l'éditeur SQL de Supabase
6. Clique "Run" (ou F5)

✅ Tu devrais voir "Success. No rows returned"

### 4.4 Récupérer les clés:

1. Menu gauche → Settings → API
2. Note ces valeurs:

```
Project URL: https://[xxxxx].supabase.co
Anon/Public key: eyJhbGciOiJI... (très long)
Service role key: (clique "Reveal") eyJhbGciOiJI... (très long)
```

⚠️ **GARDE CES CLÉS SECRÈTES!**

---

## 💳 STRIPE (Paiements) - 10 min

### 5.1 Créer compte:
1. Va sur https://stripe.com
2. Sign up avec email
3. Confirme email
4. Skip company info pour l'instant

### 5.2 Mode Test:
En haut à droite, assure-toi que tu vois "Test mode" activé

### 5.3 Récupérer les clés:
1. Developers → API keys
2. Note:
```
Publishable key: pk_test_51...
Secret key: sk_test_51... (clique "Reveal")
```

### 5.4 Créer le produit:
1. Products → Add product
```
Name: Protocol Health Pro
Description: Full access to all DeFi risk scores
Price: 29 EUR, Recurring, Monthly
Price ID: (sera généré, note-le! price_1O...)
```
2. Save product

---

## 🔴 UPSTASH REDIS (Cache) - 5 min

### 6.1 Créer compte:
1. Va sur https://upstash.com
2. Sign up avec GitHub ou Google

### 6.2 Créer database:
```
Name: protocol-health
Type: Regional
Region: EU-West-1 (ou US-East-1)
→ Create
```

### 6.3 Récupérer les clés:
Dans "Details" tab:
```
REST URL: https://[xxx].upstash.io
REST Token: [copie le token]
```

---

## 🔑 GITHUB (Code) - 5 min

### 7.1 Créer compte:
1. Va sur https://github.com
2. Sign up (username: choisis bien, c'est permanent!)
3. Confirme email

### 7.2 Créer repository:

1. Clique "+" en haut à droite → New repository
```
Repository name: protocol-health
Description: DeFi risk scoring platform
Public/Private: Public (ou Private si tu veux)
Initialize: NE COCHE RIEN
→ Create repository
```

### 7.3 Upload ton code:

Dans le terminal VS Code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/protocol-health.git
git push -u origin main
```

📝 GitHub te demandera de te connecter:
- Username: ton-username
- Password: [crée un token sur github.com/settings/tokens]

---

## ÉTAPE 5: CONFIGURATION LOCALE (10 min)

### 8.1 Créer le fichier .env.local:

Dans VS Code:
1. Trouve `.env.local.example`
2. Clic droit → Rename → `.env.local`
3. Ouvre-le et remplace avec TES vraies valeurs:

```env
# SUPABASE (depuis étape 4.4)
NEXT_PUBLIC_SUPABASE_URL=https://tonprojet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tonAnonKey...
SUPABASE_SERVICE_ROLE_KEY=eyJ...tonServiceKey...

# STRIPE (depuis étape 5.3 et 5.4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PRICE_ID_PRO=price_1O...
STRIPE_WEBHOOK_SECRET=whsec_... (on le fera après)

# REDIS (depuis étape 6.3)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=tonToken...

# APIS (laisse vide pour l'instant)
ETHERSCAN_API_KEY=
GITHUB_TOKEN=

# SÉCURITÉ (CHANGE ÇA!)
CRON_SECRET=change-moi-avec-un-truc-long-et-random-azerty123456789

# ANALYTICS (laisse vide)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# APP
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 8.2 Test local:

```bash
npm run dev
```

Ouvre http://localhost:3000

✅ **Le site doit marcher!**
✅ **Teste "Sign up" avec un email**

Si erreur → vérifie tes clés dans .env.local

---

## ÉTAPE 6: DÉPLOIEMENT VERCEL (20 min)

### 9.1 Créer compte Vercel:

1. Va sur https://vercel.com
2. "Sign up" → Continue with GitHub
3. Autorise Vercel

### 9.2 Importer le projet:

1. Dashboard → "Import Project"
2. Import Git Repository
3. Sélectionne "protocol-health"
4. Configure Project:
```
Framework Preset: Next.js (auto-détecté)
Root Directory: ./ (laisser vide)
Build Command: (laisser par défaut)
Output Directory: (laisser par défaut)
Install Command: (laisser par défaut)
```

### 9.3 Variables d'environnement:

**SUPER IMPORTANT!** 

Avant de cliquer Deploy, ajoute TOUTES tes variables:

1. Clique "Environment Variables"
2. Pour CHAQUE ligne de ton .env.local:
   - Name: LE_NOM_DE_LA_VARIABLE
   - Value: la valeur
   - Add

⚠️ **CHANGE `NEXT_PUBLIC_APP_URL`** avec l'URL Vercel:
```
NEXT_PUBLIC_APP_URL=https://protocol-health.vercel.app
```

### 9.4 Deploy:

Clique "Deploy" et attends 2-5 minutes...

✅ **Quand c'est fini, clique "Visit" pour voir ton site live!**

---

## ÉTAPE 7: CONFIGURATION STRIPE WEBHOOK (10 min)

### 10.1 Créer le webhook:

1. Retourne sur stripe.com
2. Developers → Webhooks → Add endpoint
```
Endpoint URL: https://ton-app.vercel.app/api/webhooks/stripe
Description: Vercel production
Events: 
  - checkout.session.completed
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_failed
→ Add endpoint
```

### 10.2 Récupérer le secret:

1. Clique sur le webhook créé
2. "Signing secret" → Reveal → Copie (whsec_...)

### 10.3 Mettre à jour Vercel:

1. Vercel Dashboard → ton projet
2. Settings → Environment Variables
3. Ajoute:
```
STRIPE_WEBHOOK_SECRET = whsec_tonSecret...
```
4. Redeploy: Deployments → ... → Redeploy

---

## ÉTAPE 8: TESTS FINAUX (15 min)

### ✅ Checklist de vérification:

1. **Page d'accueil**: https://ton-app.vercel.app
   - [ ] Ça charge?
   - [ ] Les images s'affichent?

2. **Protocols**: /protocols
   - [ ] La liste s'affiche?

3. **Pricing**: /pricing
   - [ ] Les prix s'affichent?

4. **Sign up**: /signup
   - [ ] Tu peux créer un compte?
   - [ ] Email de confirmation reçu?

5. **Paiement** (MODE TEST):
   - [ ] Clique "Upgrade to Pro"
   - [ ] Stripe checkout apparaît?
   - [ ] Carte test: 4242 4242 4242 4242
   - [ ] Date: n'importe quelle date future
   - [ ] CVC: 123

---

## 🚨 TROUBLESHOOTING

### "Module not found"
```bash
npm install
npm run dev
```

### "Invalid environment variables"
- Vérifie .env.local
- Pas d'espaces autour du =
- Pas de guillemets sauf si la valeur contient des espaces

### "Supabase connection failed"
- Vérifie tes clés Supabase
- Le projet est bien créé?
- La base de données est active?

### "Page not found" sur Vercel
```bash
vercel --prod
```

### Build failed sur Vercel
- Check logs dans Vercel Dashboard
- Souvent c'est une variable manquante

---

## 🎉 FÉLICITATIONS!

**TON APP EST LIVE!** 

URL: https://protocol-health.vercel.app (ou ton custom domain)

### Prochaines étapes:

1. **Ajoute du vrai contenu**:
   - Lance `/api/cron/refresh-scores` pour avoir des vraies données

2. **Configure monitoring**:
   - Teste `/api/health` → doit retourner "healthy"

3. **Active les emails**:
   - Supabase → Authentication → Email Templates

4. **Lance sur les réseaux**:
   - Tweet ton URL
   - Post sur Discord/Telegram
   - Envoie à 10 amis

---

## 📞 BESOIN D'AIDE?

- **Vercel**: https://vercel.com/help
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Next.js**: https://nextjs.org/discord

---

## 🔒 SÉCURITÉ FINALE

Avant d'avoir de vrais users:

1. Change `CRON_SECRET` avec quelque chose de vraiment random
2. Active 2FA sur GitHub, Stripe, Supabase
3. Stripe: Passe en mode LIVE quand prêt (nouvelles clés!)
4. Fais un backup Supabase

---

## 🚀 C'EST FAIT!

Tu as maintenant:
- ✅ Une app live sur internet
- ✅ Base de données configurée
- ✅ Paiements prêts
- ✅ Tout sécurisé

**MAINTENANT VA CHERCHER DES USERS!**

Tweet, DM, post, spam (gentiment), et SHIP!

Tu vas réussir! 💪
