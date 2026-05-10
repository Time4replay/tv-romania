const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 7000;

const PROXY_PORT = 7001;
const PROXY_HOST = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PROXY_PORT}`;

const CHANNELS = [
  // ── PRO TV Group ──────────────────────────────────────────────────────────
  {
    id: 'ro-tv-protv',
    name: 'PRO TV',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/8/8e/Pro_TV_logo.png',
    url: 'https://xn--p3t879b.store/protv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-protvint',
    name: 'PRO TV International',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/8/8e/Pro_TV_logo.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/protvint/index.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-proarena',
    name: 'PRO Arena',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/2/2e/Pro_Arena_logo.svg/200px-Pro_Arena_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/proarena/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── Antena Group ──────────────────────────────────────────────────────────
  {
    id: 'ro-tv-antena1',
    name: 'Antena 1',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Antena_1_logo.svg/200px-Antena_1_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/antena1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-antena3',
    name: 'Antena 3 CNN',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/6/67/Antena_3_CNN_logo.svg/200px-Antena_3_CNN_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/antena3/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-antenastars',
    name: 'Antena Stars',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/e/e7/Antena_Stars_logo.svg/200px-Antena_Stars_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/antenastars/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-antenaint',
    name: 'Antena International',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Antena_1_logo.svg/200px-Antena_1_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/antenaint/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-antennasport',
    name: 'Antena Sport',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Antena_1_logo.svg/200px-Antena_1_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/antneassport/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── HBO Group ─────────────────────────────────────────────────────────────
  {
    id: 'ro-tv-hbo',
    name: 'HBO',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/hbo/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-hbo-alt',
    name: 'HBO (alt)',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png',
    url: 'https://xn--p3t879b.store/hbo/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-hbo2',
    name: 'HBO 2',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/hbo2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-hbo3',
    name: 'HBO 3',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/hbo3/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── Prima Group ───────────────────────────────────────────────────────────
  {
    id: 'ro-tv-primatv',
    name: 'Prima TV',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--p3t879b.store/primatv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primacomedy',
    name: 'Prima Comedy',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--p3t879b.store/primacomedy/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primanews',
    name: 'Prima News',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/primanews/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primaworld',
    name: 'Prima World',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/primaworld/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── Sport ─────────────────────────────────────────────────────────────────
  {
    id: 'ro-tv-digisport1',
    name: 'Digi Sport 1',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/5/5d/Digi_Sport_logo.svg/200px-Digi_Sport_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/digi1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digisport2',
    name: 'Digi Sport 2',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/5/5d/Digi_Sport_logo.svg/200px-Digi_Sport_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/digi2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digisport3',
    name: 'Digi Sport 3',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/5/5d/Digi_Sport_logo.svg/200px-Digi_Sport_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/digi3/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digisport4',
    name: 'Digi Sport 4',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/5/5d/Digi_Sport_logo.svg/200px-Digi_Sport_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/digi4/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primasp1',
    name: 'Prima Sport 1',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--p3t879b.store/primasp1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primasp2',
    name: 'Prima Sport 2',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/primasp2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primasp3',
    name: 'Prima Sport 3',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/primasp3/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primasp4',
    name: 'Prima Sport 4',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/primasp4/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-primasp5',
    name: 'Prima Sport 5',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/primasp5/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-prima4k',
    name: 'Prima Sport 4K',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/a/a0/Prima_TV_logo.svg/200px-Prima_TV_logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/prima4kk/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-eurosport1',
    name: 'Eurosport 1',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Eurosport_1_logo.svg/200px-Eurosport_1_logo.svg.png',
    url: 'https://xn--p3t879b.store/eurosport1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-eurosport2',
    name: 'Eurosport 2',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Eurosport_1_logo.svg/200px-Eurosport_1_logo.svg.png',
    url: 'https://xn--p3t879b.store/eurosport2/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-ppv1',
    name: 'PPV 1',
    group: 'Sport',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/ppv1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-ppv2',
    name: 'PPV 2',
    group: 'Sport',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/ppv2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-ppv3',
    name: 'PPV 3',
    group: 'Sport',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/ppv3/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvrsport',
    name: 'TVR Sport',
    group: 'Sport',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/e/e2/TVR_Sport_logo.svg/200px-TVR_Sport_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tvr-sport/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-realitateasportiva',
    name: 'Realitatea Sportiva',
    group: 'Sport',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/realitateasportiva/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-sportextra',
    name: 'Sport Extra',
    group: 'Sport',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/sportextra/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── Muzica ────────────────────────────────────────────────────────────────
  {
    id: 'ro-tv-kisstv',
    name: 'Kiss TV',
    group: 'Muzica',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/6/6d/Kiss_TV_Romania_logo.svg/200px-Kiss_TV_Romania_logo.svg.png',
    url: 'https://xn--p3t879b.store/kisstv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-mezzo',
    name: 'Mezzo',
    group: 'Muzica',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mezzo_logo.svg/200px-Mezzo_logo.svg.png',
    url: 'https://xn--p3t879b.store/mezzo/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-mtv80',
    name: 'MTV 80',
    group: 'Muzica',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/MTV_2021_%28logo%29.svg/200px-MTV_2021_%28logo%29.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/mtv80/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-musicchannel',
    name: 'Music Channel',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/musicchannel/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-taraf',
    name: 'Taraf TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/taraf/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-etno',
    name: 'Etno TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/etno/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-balcan',
    name: 'Balcan TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/balcan/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-boomtv',
    name: 'Boom TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/boomtv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-traditional',
    name: 'Traditional TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/traditional/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-partymix',
    name: 'Party Mix TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/partymix/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-impacttv',
    name: 'Impact TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://online.tvimpact.live/hls/impact_tv.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-dancetv',
    name: 'Dance TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://online.tvimpact.live/hls/dancetv.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-magictv',
    name: 'Magic TV',
    group: 'Muzica',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/magictv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvr-folclor',
    name: 'TVR Folclor',
    group: 'Muzica',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/38/TVR_logo.svg/200px-TVR_logo.svg.png',
    url: 'https://xn--p3t879b.store/tvr-folclor/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── Natura / Documentare ──────────────────────────────────────────────────
  {
    id: 'ro-tv-natgeo',
    name: 'National Geographic',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeo_next.svg/200px-Natgeo_next.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/natgeo/tracks-t1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-natgeowild',
    name: 'Nat Geo Wild',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeo_next.svg/200px-Natgeo_next.svg.png',
    url: 'https://xn--p3t879b.store/natgeowild/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-animalplanet',
    name: 'Animal Planet',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/twentythree/Animal_Planet_logo_2018.svg/200px-Animal_Planet_logo_2018.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/animalplanet/tracks-t5/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-discovery',
    name: 'Discovery Channel',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Discovery_Channel_logo_2019.svg/200px-Discovery_Channel_logo_2019.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/discovery/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-bbcearth',
    name: 'BBC Earth',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/BBC_Earth_2020.svg/200px-BBC_Earth_2020.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/bbcearth/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-viasatnature',
    name: 'Viasat Nature',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Viasat_Nature_logo.svg/200px-Viasat_Nature_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/viasatnature/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-viasathistory',
    name: 'Viasat History',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Viasat_History_logo.svg/200px-Viasat_History_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/viasathistory/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-viasatexplor',
    name: 'Viasat Explorer',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Viasat_Nature_logo.svg/200px-Viasat_Nature_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/viasatexplor/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-viasatkino',
    name: 'Viasat Kino',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/viasatkino/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-history',
    name: 'History Channel',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/History_channel_logo_detail.svg/200px-History_channel_logo_detail.svg.png',
    url: 'https://xn--p3t879b.store/history/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-descopera',
    name: 'Descopera',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/descopera/tracks-v1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-lovenature',
    name: 'Love Nature',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/lovenature/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-fishinghunting',
    name: 'Fishing & Hunting',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/fishinghunting/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digiworld',
    name: 'Digi World',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/digiworld/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digianimalworld',
    name: 'Digi Animal World',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/digianimalworld/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-exploris',
    name: 'Exploris',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/exploris/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tlc',
    name: 'TLC',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/TLC_Logo.svg/200px-TLC_Logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tlc/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },

  // ── Restul in ordine alfabetica ───────────────────────────────────────────
  {
    id: 'ro-tv-acasa',
    name: 'Acasa TV',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/38/Acasa_TV_logo.svg/200px-Acasa_TV_logo.svg.png',
    url: 'https://xn--p3t879b.store/acasa/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-acasagold',
    name: 'Acasa Gold',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/38/Acasa_TV_logo.svg/200px-Acasa_TV_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/acasagold/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-amc',
    name: 'AMC',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/AMC_logo_2019.svg/200px-AMC_logo_2019.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/amc/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-atomic',
    name: 'Atomic TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/atomic/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-asiatv',
    name: 'Asia TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/asiatv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-axn',
    name: 'AXN',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/AXN-Logo.svg/200px-AXN-Logo.svg.png',
    url: 'https://xn--p3t879b.store/axn/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-axnwhite',
    name: 'AXN White',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/AXN-Logo.svg/200px-AXN-Logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/axnwhite/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-axnblack',
    name: 'AXN Black',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/AXN-Logo.svg/200px-AXN-Logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/axnblack/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-axnspin',
    name: 'AXN Spin',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/AXN-Logo.svg/200px-AXN-Logo.svg.png',
    url: 'https://xn--p3t879b.store/axnspin/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-b1',
    name: 'B1 TV',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/5/5c/B1_TV_logo.svg/200px-B1_TV_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/b1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-bbcfirst',
    name: 'BBC First',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_Studios_logo_2019.svg/200px-BBC_Studios_logo_2019.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/bbcfirst/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-bean',
    name: 'Bean TV',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/bean/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-beautyon',
    name: 'Beauty On',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/beautyon/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-bestof',
    name: 'Best Of TV',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/bestof/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cameraasc',
    name: 'Camera Ascunsa TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/cameraasc/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cartoonnetwork',
    name: 'Cartoon Network',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/200px-Cartoon_Network_2010_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/cartoonnerwork/tracks-t1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cartoonito',
    name: 'Cartoonito',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/200px-Cartoon_Network_2010_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/cartoonito/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cinemaraton',
    name: 'Cine Maraton',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/cinemaraton/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cinemaratonplus',
    name: 'Cine Maraton Plus',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/cinemaratonplus/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cinemaratonmoldova',
    name: 'Cine Maraton Moldova',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/cinemaratonmoldova/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cinemax',
    name: 'Cinemax',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cinemax_logo.svg/200px-Cinemax_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/cinemax/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cinemax2',
    name: 'Cinemax 2',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cinemax_logo.svg/200px-Cinemax_logo.svg.png',
    url: 'https://xn--p3t879b.store/cinemax2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-cinewow',
    name: 'CineWow',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/cinewow/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-comedycentral',
    name: 'Comedy Central',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Comedy_Central_2018.svg/200px-Comedy_Central_2018.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/comedycentral/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-crimeinv',
    name: 'Crime + Investigation',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/crimeinv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digi24',
    name: 'Digi 24',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/5/5f/Digi24_logo.svg/200px-Digi24_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/digi24/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-digilife',
    name: 'Digi Life',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/digilife/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-disneychannel',
    name: 'Disney Channel',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Disney_Channel_SEA_2014.svg/200px-Disney_Channel_SEA_2014.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/disneychannel/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-disneyjunior',
    name: 'Disney Junior',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Disney_Channel_SEA_2014.svg/200px-Disney_Channel_SEA_2014.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/disneyjunior/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-diva',
    name: 'Diva',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/diva/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-dizi',
    name: 'Dizi',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/dizi/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-duk',
    name: 'Duk TV',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/duk/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-ent',
    name: 'ENT',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/ent/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-epicdrama',
    name: 'Epic Drama',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/epicdrama/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-euronews',
    name: 'Euronews',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Euronews_logo_2022.svg/200px-Euronews_logo_2022.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/euronews/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-favorit',
    name: 'Favorit TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/favorit/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmbox',
    name: 'FilmBox',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/filmbox/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmboxstars',
    name: 'FilmBox Stars',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/filmboxstars/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmboxfamily',
    name: 'FilmBox Family',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://aes.m3u8simplu.workers.dev/filmboxfamily/tracks-v1a1/mono.m3u8?seq=0',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmboxpremium',
    name: 'FilmBox Premium',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/filmboxpremium/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmboxextra',
    name: 'FilmBox Extra',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/filmboxextra/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmcafe',
    name: 'Film Cafe',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/filmcafe/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmmania',
    name: 'Film Mania',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/filmmania/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-filmnow',
    name: 'Film Now',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/filmnow/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-happy',
    name: 'Happy Channel',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/happy/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-hgtv',
    name: 'HGTV',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/HGTV_2010.svg/200px-HGTV_2010.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/hgtv/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-idinvesti',
    name: 'ID Investigation',
    group: 'Documentare',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/idinvesti/tracks-a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-jimjam',
    name: 'JimJam',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/jimjam/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-kanald',
    name: 'Kanal D',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kanal_D_logo.svg/200px-Kanal_D_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/kanald/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-kanald2',
    name: 'Kanal D 2',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kanal_D_logo.svg/200px-Kanal_D_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/kanald2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-las',
    name: 'Las Fierbinti TV',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/8/8e/Pro_TV_logo.png',
    url: 'https://xn--z6uw1sboh9x2b.store/las/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-minimax',
    name: 'Minimax',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Minimax_logo.svg/200px-Minimax_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/minimax/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nasultv',
    name: 'Nasul TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/nasultv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nationaltv',
    name: 'National TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/nationaltv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nationalplus',
    name: 'National Plus',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6uw1sboh9x2b.store/nationalplus/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nickelodeon',
    name: 'Nickelodeon',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nickelodeon_2009_logo.svg/200px-Nickelodeon_2009_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/nickelodeon/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nickjr',
    name: 'Nick Jr',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nickelodeon_2009_logo.svg/200px-Nickelodeon_2009_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/nickjr/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nicktoons',
    name: 'Nicktoons',
    group: 'Copii',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nickelodeon_2009_logo.svg/200px-Nickelodeon_2009_logo.svg.png',
    url: 'https://xn--z6ut02b7b.store/nicktoons/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-nostalgia',
    name: 'Nostalgia',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/nostalgia/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-orizont',
    name: 'Orizont TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/orizont/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-paprika',
    name: 'Paprika TV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/paprika/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-procinema',
    name: 'Pro Cinema',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/c/c7/Pro_Cinema_logo.svg/200px-Pro_Cinema_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/procinema/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-povesti',
    name: 'Povesti cu Suflet',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/povesti/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-realitateaplus',
    name: 'Realitatea Plus',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/3d/Realitatea_Plus_logo.svg/200px-Realitatea_Plus_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/realitateaplus/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-realitateastar',
    name: 'Realitatea Star',
    group: 'Stiri',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/realitateastar/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-rofilme',
    name: 'Ro Filme',
    group: 'Filme',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/rofilme/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-romaniatv',
    name: 'Romania TV',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/37/Romania_TV_logo.svg/200px-Romania_TV_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/romaniatv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-sky1',
    name: 'Sky 1',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.store/sky1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-sky2',
    name: 'Sky 2',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/sky2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-taralaladan',
    name: 'Tralala Dan Dan',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--z6ut02b7b.store/taralaladan/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tralala',
    name: 'Tralala',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tralala/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tlc2',
    name: 'TLC',
    group: 'Documentare',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/TLC_Logo.svg/200px-TLC_Logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tlc/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tom',
    name: 'Tom & Jerry TV',
    group: 'Copii',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tom/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvr1',
    name: 'TVR 1',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/2/20/TVR1_logo_2017.svg/200px-TVR1_logo_2017.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tvr1/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvr2',
    name: 'TVR 2',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/f/f4/TVR2_logo_2017.svg/200px-TVR2_logo_2017.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.site/tvr2/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvr3',
    name: 'TVR 3',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/3c/TVR3_logo.svg/200px-TVR3_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/tvr3/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvrcultural',
    name: 'TVR Cultural',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/38/TVR_logo.svg/200px-TVR_logo.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/tvr-cultural/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvrinternational',
    name: 'TVR International',
    group: 'Generale',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/3/38/TVR_logo.svg/200px-TVR_logo.svg.png',
    url: 'https://xn--ehqq0muwlk95a0vi.store/tvr-international/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-tvrinfo',
    name: 'TVR Info',
    group: 'Stiri',
    logo: 'https://upload.wikimedia.org/wikipedia/ro/thumb/b/b1/TVR_Info_logo_2017.svg/200px-TVR_Info_logo_2017.svg.png',
    url: 'https://xn--p3t879b.store/tvr-info/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-utv',
    name: 'UTV',
    group: 'Generale',
    logo: 'https://www.tvzonehd.com/favicon.ico',
    url: 'https://xn--p3t879b.store/utv/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  },
  {
    id: 'ro-tv-warner',
    name: 'Warner TV',
    group: 'Filme',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Warner_TV_logo_2022.svg/200px-Warner_TV_logo_2022.svg.png',
    url: 'https://xn--z6uw1sboh9x2b.store/warner/tracks-v1a1/mono.m3u8',
    referer: 'https://www.tvzonehd.com/'
  }
];

// ─── Proxy ────────────────────────────────────────────────────────────────────
const proxyServer = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const targetUrl = parsed.query.url;
  const referer = parsed.query.ref || 'https://www.tvzonehd.com/';

  if (!targetUrl) { res.writeHead(400); res.end('Missing url'); return; }

  const target = url.parse(targetUrl);
  const lib = target.protocol === 'https:' ? https : http;

  const options = {
    hostname: target.hostname,
    port: target.port || (target.protocol === 'https:' ? 443 : 80),
    path: target.path,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': referer,
      'Origin': new url.URL(referer).origin,
      'Accept': '*/*',
      'Accept-Language': 'ro-RO,ro;q=0.9',
      'Connection': 'keep-alive'
    }
  };

  const proxyReq = lib.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    const isM3U8 = contentType.includes('mpegurl') || targetUrl.includes('.m3u8');

    res.writeHead(proxyRes.statusCode, {
      'Content-Type': proxyRes.headers['content-type'] || 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*'
    });

    if (isM3U8) {
      let body = '';
      proxyRes.on('data', chunk => body += chunk.toString());
      proxyRes.on('end', () => {
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        const lines = body.split('\n').map(line => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return line;
          const absoluteUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
          return `${PROXY_HOST}/proxy?url=${encodeURIComponent(absoluteUrl)}&ref=${encodeURIComponent(referer)}`;
        });
        res.end(lines.join('\n'));
      });
    } else {
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', (err) => { res.writeHead(502); res.end('Proxy error: ' + err.message); });
  proxyReq.end();
});

proxyServer.listen(PROXY_PORT, () => console.log(`🔀 Proxy pornit pe portul ${PROXY_PORT}`));

// ─── Addon ────────────────────────────────────────────────────────────────────
const manifest = {
  id: 'ro.tv.personal',
  version: '2.0.0',
  name: '📺 TV România',
  description: `${CHANNELS.length} canale românești live.`,
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/200px-Flag_of_Romania.svg.png',
  resources: ['catalog', 'meta', 'stream'],
  types: ['tv'],
  catalogs: [{
    type: 'tv',
    id: 'ro-tv',
    name: 'TV România',
    extra: [{ name: 'search', isRequired: false }]
  }]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({ extra }) => {
  const search = extra && extra.search ? extra.search.toLowerCase() : null;
  const list = search ? CHANNELS.filter(c => c.name.toLowerCase().includes(search)) : CHANNELS;
  return Promise.resolve({
    metas: list.map(c => ({
      id: c.id, type: 'tv', name: c.name,
      poster: c.logo, posterShape: 'square',
      logo: c.logo, genres: [c.group],
      description: `📺 ${c.name} — Live`
    }))
  });
});

builder.defineMetaHandler(({ id }) => {
  const ch = CHANNELS.find(c => c.id === id);
  if (!ch) return Promise.resolve({ meta: null });
  return Promise.resolve({
    meta: { id: ch.id, type: 'tv', name: ch.name, poster: ch.logo, logo: ch.logo, genres: [ch.group] }
  });
});

builder.defineStreamHandler(({ id }) => {
  const ch = CHANNELS.find(c => c.id === id);
  if (!ch) return Promise.resolve({ streams: [] });
  const proxyUrl = `${PROXY_HOST}/proxy?url=${encodeURIComponent(ch.url)}&ref=${encodeURIComponent(ch.referer)}`;
  return Promise.resolve({
    streams: [{ url: proxyUrl, title: `📺 ${ch.name} — Live HD`, name: 'TV România' }]
  });
});

serveHTTP(builder.getInterface(), { port: PORT });
console.log(`\n🇷🇴 TV România Addon pornit! (${CHANNELS.length} canale)`);
console.log(`➡️  Adaugă în Stremio: http://localhost:${PORT}/manifest.json\n`);
