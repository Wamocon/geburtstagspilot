-- Fix umlaut/encoding issues in game instructions and descriptions

-- Stille Post: fluestert -> flüstert
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'fluestert', 'flüstert') WHERE name_de = 'Stille Post';

-- Schatz-Tauchen: fuellen -> füllen, Meisten -> meisten
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'fuellen', 'füllen') WHERE name_de = 'Schatz-Tauchen';
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'die Meisten', 'die meisten') WHERE name_de = 'Schatz-Tauchen';

-- Planke-Lauf: runterFällt -> runterfällt
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'runterFällt', 'runterfällt') WHERE name_de = 'Planke-Lauf';

-- Alien-Jäger: die Meisten -> die meisten
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'die Meisten', 'die meisten') WHERE name_de = 'Alien-Jäger';

-- Meteoriten-Abwehr: aufhaengen -> aufhängen, Bälle -> Bälle (already correct), Weiche Baelle -> Weiche Bälle
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'aufhaengen', 'aufhängen') WHERE name_de = 'Meteoriten-Abwehr';

-- Elfmeterschiessen: die Meisten -> die meisten
UPDATE public.games SET description_de = REPLACE(description_de, 'die Meisten', 'die meisten') WHERE name_de = 'Elfmeterschiessen';

-- Fussball-Quiz: am Meisten -> am meisten
UPDATE public.games SET description_de = REPLACE(description_de, 'am Meisten', 'am meisten') WHERE name_de = 'Fußball-Quiz';

-- Wasserbomben-Werfen: fuellen -> füllen
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'fuellen', 'füllen') WHERE name_de = 'Wasserbomben-Werfen';

-- Gummibärchen-Wettessen: die Meisten -> die meisten
UPDATE public.games SET description_de = REPLACE(description_de, 'die Meisten', 'die meisten') WHERE name_de = 'Gummibärchen-Wettessen';

-- Piñata: aufhaengen -> aufhängen
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'aufhaengen', 'aufhängen') WHERE name_de = 'Piñata';

-- Blindes Zeichnen: Müssen -> müssen
UPDATE public.games SET description_de = REPLACE(description_de, 'die anderen Müssen', 'die anderen müssen') WHERE name_de = 'Blindes Zeichnen';

-- Dino-Fusabdrücke: überraschung -> Überraschung
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'überraschung', 'Überraschung') WHERE name_de = 'Dino-Fußabdrücke';
UPDATE public.games SET materials_de = array_replace(materials_de, 'überraschung für das Nest', 'Überraschung für das Nest') WHERE name_de = 'Dino-Fußabdrücke';

-- Lava-Lauf: Müssen -> müssen
UPDATE public.games SET instructions_de = REPLACE(instructions_de, 'Kinder Müssen', 'Kinder müssen') WHERE name_de = 'Lava-Lauf';

-- Krönungszeremonie: Kürt -> kürt
UPDATE public.games SET description_de = REPLACE(description_de, 'Kürt', 'kürt') WHERE name_de = 'Krönungszeremonie';

-- Prinzessinnen-Tanz: schönste -> Schönste (at sentence start ok, but in mid-sentence should be lowercase)
-- Actually "schönste Pose gewinnt" is fine as-is

-- Fix various compound words with incorrect casing in materials
UPDATE public.games SET materials_de = array_replace(materials_de, 'KochLöffel', 'Kochlöffel') WHERE 'KochLöffel' = ANY(materials_de);
UPDATE public.games SET materials_de = array_replace(materials_de, 'JuteSäcke', 'Jutesäcke') WHERE 'JuteSäcke' = ANY(materials_de);
UPDATE public.games SET materials_de = array_replace(materials_de, 'TuellRöcke (optional)', 'Tüllröcke (optional)') WHERE 'TuellRöcke (optional)' = ANY(materials_de);
UPDATE public.games SET materials_de = array_replace(materials_de, 'HolzStäbe', 'Holzstäbe') WHERE 'HolzStäbe' = ANY(materials_de);
UPDATE public.games SET materials_de = array_replace(materials_de, 'ZauberStäbe', 'Zauberstäbe') WHERE 'ZauberStäbe' = ANY(materials_de);
UPDATE public.games SET materials_de = array_replace(materials_de, 'TennisBälle', 'Tennisbälle') WHERE 'TennisBälle' = ANY(materials_de);
UPDATE public.games SET materials_de = array_replace(materials_de, 'RaketenKörper', 'Raketenkörper') WHERE 'RaketenKörper' = ANY(materials_de);
