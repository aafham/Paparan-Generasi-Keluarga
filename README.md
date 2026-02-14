# KAMI Tree

Website salasilah keluarga interaktif (tree + timeline) menggunakan HTML, CSS, dan JavaScript vanilla.

## Ciri utama
- Paparan pokok keluarga dengan zoom, fit screen, dan minimap.
- Carian nama dan fokus terus ke ahli.
- Statistik keluarga (jumlah ahli, pasangan, jantina, keturunan, ulang tahun terdekat).
- Timeline dengan penapis generasi, bulan lahir, jantina, dan susunan.
- Sokongan BM/EN dan tema cerah/gelap.
- Eksport JPEG/PDF dan import/eksport data JSON.

## Struktur fail
- `index.html` - struktur UI utama.
- `styles.css` - gaya dan responsive layout.
- `app.js` - logik aplikasi, render tree, statistik, timeline, interaksi.
- `data.json` - sumber data keluarga.

## Cara jalankan
1. Buka folder projek ini.
2. Jalankan server statik (contoh):
   - `python -m http.server 5500`
   - atau guna VS Code Live Server.
3. Buka `http://localhost:5500`.

## Format data ringkas
Data disimpan dalam `data.json` dengan dua bahagian utama:
- `people`: senarai ahli keluarga.
- `unions`: senarai pasangan dan anak.

Contoh minimum:

```json
{
  "people": [
    { "id": "p1", "name": "Ali", "birth": "1980-02-16" },
    { "id": "p2", "name": "Aisyah", "birth": "1982-05-03" },
    { "id": "p3", "name": "Anak", "birth": "2010-01-10" }
  ],
  "unions": [
    { "id": "u1", "partner1": "p1", "partner2": "p2", "children": ["p3"] }
  ]
}
```

## Nota perubahan terbaru
- Betulkan paparan `Upcoming Birthday`: jika ada 2 atau lebih ahli berkongsi tarikh ulang tahun terdekat yang sama, semua nama kini dipaparkan sekali dalam kad statistik.
