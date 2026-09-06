# Meditații Matematică BAC — Profil Tehnologic

Landing page pentru pregătire online la matematică pentru BAC, profil tehnologic.

## Cuprins

- [Rulare locală](#rulare-locală)
- [Publicare pe GitHub Pages](#publicare-pe-github-pages)
- [Personalizare](#personalizare)
  - [Numele profesorului](#1-numele-profesorului)
  - [Fotografia profesorului](#2-fotografia-profesorului)
  - [Testimoniale](#3-testimoniale)
  - [Date de contact](#4-date-de-contact)
  - [Prețul](#5-prețul)
  - [Textele paginii](#6-textele-paginii)
  - [URL-ul site-ului](#7-url-ul-site-ului)
- [Integrare formular](#integrare-formular)
- [Google Analytics 4](#google-analytics-4)
- [UTM Tracking](#utm-tracking)
- [Structura proiectului](#structura-proiectului)

---

## Rulare locală

Proiectul este pur static (HTML + CSS + JS). Poți să-l deschizi direct în browser sau să folosești un server local:

### Opțiunea 1 — Deschide direct

Deschide fișierul `index.html` în browser (dublu-clic).

### Opțiunea 2 — Server local (recomandat)

Cu Python:

```bash
python -m http.server 8000
```

Cu Node.js (npx):

```bash
npx serve .
```

Cu VS Code: instalează extensia **Live Server** și apasă „Go Live".

Apoi deschide `http://localhost:8000` în browser.

---

## Publicare pe GitHub Pages

1. Creează un repository pe GitHub (public).
2. Adaugă toate fișierele din acest proiect.
3. Mergi la **Settings → Pages**.
4. La **Source**, selectează **Deploy from a branch**.
5. Alege branch-ul `main` și directorul `/ (root)`.
6. Apasă **Save**.
7. Site-ul va fi disponibil la: `https://USERNAME.github.io/REPO-NAME/`

**Important:** După publicare, actualizează URL-ul canonic și referințele în:
- `index.html` → `<link rel="canonical">`, Open Graph `og:url`, structured data
- `robots.txt` → URL-ul sitemap-ului
- `sitemap.xml` → `<loc>` URL

---

## Personalizare

### 1. Numele profesorului

Caută și înlocuiește `[NUME PROFESOR]` în tot proiectul:

| Fișier | Locație |
|--------|---------|
| `index.html` | `<title>`, meta description, OG tags, structured data, secțiunea „Despre profesor", footer, copyright |
| `sitemap.xml` | N/A |

### 2. Fotografia profesorului

1. Adaugă fotografia în `assets/images/` (ex: `profesor.jpg`).
   - Dimensiune recomandată: minimum 400×400px, format pătrat.
   - Format: `.jpg` sau `.webp` pentru performanță.
2. În `index.html`, găsește:
   ```html
   <div class="about-photo-placeholder" role="img" aria-label="Fotografia profesorului — placeholder">
     [FOTOGRAFIE PROFESOR]
   </div>
   ```
3. Înlocuiește cu:
   ```html
   <img src="assets/images/profesor.jpg"
        alt="[NUME PROFESOR] — Profesor de matematică"
        width="200"
        height="200"
        loading="lazy"
        style="border-radius: 50%; object-fit: cover;">
   ```
4. Poți șterge clasa `about-photo-placeholder` din CSS dacă nu mai este necesară.

### 3. Testimoniale

În `index.html`, găsește cele 3 carduri cu testimoniale placeholder:

```html
<p class="testimonial-quote">[TESTIMONIAL 1 — ...]</p>
```

Înlocuiește:
- `[TESTIMONIAL 1/2/3 — ...]` cu textul real al testimonialului
- `[Nume Elev 1/2/3]` cu numele elevului (sau inițiale dacă preferă confidențialitate)
- `[Detaliu — ex: „Absolvent BAC 2025"]` cu un detaliu relevant

**Opțional — Adaugă fotografia elevului:**

Înlocuiește:
```html
<div class="testimonial-avatar" aria-hidden="true">?</div>
```
Cu:
```html
<img src="assets/images/elev-1.jpg" alt="Nume Elev" class="testimonial-avatar" width="40" height="40" loading="lazy" style="object-fit: cover;">
```

### 4. Date de contact

Caută și înlocuiește în `index.html`:

| Placeholder | Descriere |
|-------------|-----------|
| `[NUMAR TELEFON]` | Numărul de telefon (ex: `0712 345 678`) |
| `[EMAIL]` | Adresa de email |
| `[LINK POLITICA DE CONFIDENTIALITATE]` | URL-ul politicii de confidențialitate |
| `[LINK TERMENI SI CONDITII]` | URL-ul termenilor și condițiilor |

Acestea apar în:
- Footer (telefon, email, linkuri legale)
- Formularul de evaluare (checkbox GDPR)
- Structured data JSON-LD

### 5. Prețul

Prețul apare în `index.html` în secțiunea `#pret`:

```html
<div class="pricing-amount">360 <span>lei / lună</span></div>
<div class="pricing-per-session">90 lei / ședință</div>
```

Modifică valorile `360` și `90` cu noile prețuri.

Prețul mai apare și în:
- Structured data JSON-LD (`"price": "360"`)
- FAQ-ul „Cât costă?" (`360 lei pe lună pentru 4 ședințe (90 lei / ședință)`)

### 6. Textele paginii

Toate textele sunt direct în `index.html`. Caută secțiunea relevantă după ID-uri:

| ID secțiune | Conținut |
|-------------|----------|
| `#hero` | Titlu principal, subtitlu, badge |
| `#problema` | Problemele elevilor |
| `#solutia` | Cei 4 pași ai programului |
| `#cum-functioneaza` | Caracteristicile programului |
| `#de-ce-grupa` | Avantajele grupei |
| `#despre-profesor` | Despre profesor |
| `#testimoniale` | Testimoniale |
| `#pret` | Prețul |
| `#evaluare` | Formularul de evaluare |
| `#intrebari` | FAQ |

### 7. URL-ul site-ului

Caută `YOUR-USERNAME.github.io/YOUR-REPO-NAME` și înlocuiește cu URL-ul tău real în:

- `index.html` → `<link rel="canonical">`, `og:url`, structured data `url`
- `robots.txt` → URL sitemap
- `sitemap.xml` → `<loc>`

---

## Integrare formular

Formularul este configurat să trimită automat toate cererile pe email-ul: **`teodorcazacu314@gmail.com`** folosind serviciul gratuit **FormSubmit**.

### Cum funcționează:

1. La **prima trimitere de test a formularului**, vei primi un email de la **FormSubmit** cu titlul `Action Required: Activate Form`.
2. Deschide emailul și apasă pe butonul **Activate Form** (o singură dată este nevoie).
3. Din acel moment, **toate cererile viitoare trimise prin formular vor sosi instant în inbox-ul tău**, frumos formatate sub formă de tabel!

Dacă dorești să schimbi adresa de email în viitor, o poți modifica direct în `script.js` la linia `FORM_ENDPOINT`.

### Opțiunea 2 — Google Forms

1. Creează un Google Form cu aceleași câmpuri.
2. Găsește ID-urile de `entry` ale fiecărui câmp (inspectează sursa HTML a Google Form).
3. Maparea câmpurilor trebuie făcută manual în `script.js`, în funcția `submitForm`.

### Opțiunea 3 — Netlify Forms

Dacă găzduiești pe Netlify în loc de GitHub Pages:

1. Adaugă atributul `netlify` la `<form>`:
   ```html
   <form id="evaluation-form" netlify novalidate>
   ```
2. Netlify va prelua automat datele.

### Opțiunea 4 — EmailJS

1. Creează un cont pe [emailjs.com](https://www.emailjs.com/).
2. Adaugă SDK-ul EmailJS.
3. Configurează serviciul și template-ul.
4. Modifică funcția `submitForm` din `script.js`.

---

## Google Analytics 4

1. Creează o proprietate GA4 în [Google Analytics](https://analytics.google.com/).
2. Copiază Measurement ID-ul (ex: `G-XXXXXXXXXX`).
3. În `index.html`, decomentează blocul GA4 din `<head>` și înlocuiește `GA_MEASUREMENT_ID`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. În `script.js`, actualizează:
```javascript
GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
```

### Evenimente urmărite automat

| Eveniment | Când se declanșează |
|-----------|---------------------|
| `cta_click` | Click pe orice buton CTA |
| `form_submit` | Trimiterea formularului |
| `scroll_depth` | La 25%, 50%, 75%, 100% scroll |

---

## UTM Tracking

Landing page-ul captează automat parametrii UTM din URL și îi include în formular.

### Exemplu de URL cu UTM:

```
https://site-ul-tau.ro/?utm_source=instagram&utm_medium=social&utm_campaign=bac2026
```

Parametrii suportați:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

Valorile UTM sunt stocate automat în câmpuri ascunse ale formularului și vor fi transmise odată cu restul datelor când integrarea formularului este activă.

---

## Structura proiectului

```
/
├── index.html          # Pagina principală
├── style.css           # Stiluri CSS
├── script.js           # JavaScript
├── favicon.svg         # Favicon SVG
├── robots.txt          # Instrucțiuni crawlere
├── sitemap.xml         # Sitemap XML
├── README.md           # Documentație (acest fișier)
└── assets/
    ├── images/         # Imagini (foto profesor, elevi etc.)
    └── icons/          # Iconițe suplimentare (dacă e cazul)
```

---

## Checklist de personalizare

Înainte de publicare, verifică că ai completat:

- [ ] `[NUME PROFESOR]` — înlocuit peste tot
- [ ] `[FOTOGRAFIE PROFESOR]` — fotografie reală adăugată
- [ ] `[TESTIMONIAL 1/2/3]` — testimoniale reale adăugate
- [ ] `[NUMAR TELEFON]` — număr de telefon real
- [ ] `[EMAIL]` — adresă de email reală
- [ ] `[POLITICA DE CONFIDENȚIALITATE]` — link real sau document propriu
- [ ] `[TERMENI ȘI CONDIȚII]` — link real sau document propriu
- [ ] URL canonic actualizat
- [ ] Formular conectat la un serviciu extern
- [ ] Google Analytics 4 configurat
- [ ] OG image adăugată (opțional, 1200×630px)
- [ ] Testat pe mobil, tabletă și desktop
- [ ] Verificat că nu mai există placeholdere vizibile

---

## Tehnologii folosite

- HTML5 semantic
- CSS3 cu Custom Properties
- JavaScript vanilla (ES6+)
- Google Fonts (Inter + Space Grotesk)
- Fără framework-uri sau biblioteci externe

---

## Licență

Proiect privat. Toate drepturile rezervate.
