export type Release = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  world: string;
  mood: string;
  status: "live" | "project";
  spotify?: string;
  youtube?: string;
  amazon?: string;
  artwork?: string;
  accent: string;
};

export const releases: Release[] = [
  { slug:"crown-of-the-abyss", title:"CROWN OF THE ABYSS", subtitle:"Orchestral metal statement", year:"2026", world:"Abyss", mood:"Orchestral Metal", status:"live", spotify:"https://open.spotify.com/album/2ZWAT8pIDAZwrTkcbmlBMx", youtube:"https://www.youtube.com/results?search_query=Bossie+on+that+beat+CROWN+OF+THE+ABYSS", accent:"abyss" },
  { slug:"one-world-one-dream", title:"One World One Dream", subtitle:"World Cup Song 2026", year:"2026", world:"Global", mood:"Global Anthem", status:"live", amazon:"https://music.amazon.com/tracks/B0H6SMW3Q2", youtube:"https://www.youtube.com/results?search_query=Bossie+on+that+beat+One+World+One+Dream", accent:"sun" },
  { slug:"symphony-of-the-storm", title:"Symphony Of The Storm", subtitle:"Single", year:"2026", world:"Storm", mood:"Orchestral Power", status:"live", amazon:"https://music.amazon.in/albums/B0H7NX3MVF", accent:"storm" },
  { slug:"nul-een-acht-zes", title:"Nul Een Acht Zes", subtitle:"Single", year:"2026", world:"City", mood:"Dutch Energy", status:"live", amazon:"https://music.amazon.co.uk/albums/B0H7P9852Q", accent:"city" },
  { slug:"the-door-was-never-closed", title:"The Door Was Never Closed", subtitle:"Prestige cinematic world", year:"2026", world:"Door", mood:"Gothic Psychological Cinema", status:"project", youtube:"https://www.youtube.com/results?search_query=Bossie+on+that+beat+The+Door+Was+Never+Closed", accent:"door" },
  { slug:"nims-dai", title:"Nims Dai", subtitle:"Cinematic tribute", year:"2026", world:"Mountain", mood:"Cinematic Tribute", status:"project", youtube:"https://www.youtube.com/results?search_query=Bossie+on+that+beat+Nims+Dai", accent:"mountain" },
  { slug:"carry-nepal-home", title:"Carry Nepal Home", subtitle:"The Mountain Remembers", year:"2026", world:"Mountain", mood:"Emotional Cinematic", status:"project", accent:"snow" },
  { slug:"tout-se-payer", title:"Tout Se Payer", subtitle:"French world", year:"2026", world:"Noir", mood:"Dark European", status:"project", accent:"noir" },
  { slug:"gasolina", title:"Gasolina", subtitle:"Global club world", year:"2026", world:"Heat", mood:"Latin / Club", status:"project", accent:"heat" },
];

export const getRelease = (slug:string) => releases.find((r) => r.slug === slug);
