export enum AnimalType {
  MAMMAL = 'ثدييات',
  BIRD = 'طيور',
  REPTILE = 'زواحف',
  AQUATIC = 'كائنات بحرية',
  AMPHIBIAN = 'برمائيات',
  INSECT = 'حشرات',
}

export enum DietType {
  HERBIVORE = 'آكل أعشاب',
  CARNIVORE = 'آكل لحوم',
  OMNIVORE = 'قارت',
}

export interface Animal {
  id: number;
  name: string; // English name
  name_ar: string;
  name_en: string;
  imageUrl: string;
  nameSoundUrl: string; // Arabic name sound
  nameSoundUrl_en: string; // English name sound
  animalSoundUrl: string;
  type: AnimalType;
  diet: DietType;
  facts_ar: string[];
  facts_en: string[];
}

export type Page = 
  | 'main_menu'
  | 'help'
  | 'facts' 
  | 'games_menu' 
  | 'name_game' 
  | 'sound_game' 
  | 'memory_game'
  | 'diet_game'
  | 'tictactoe_name_game'
  | 'tictactoe_sound_game'
  | 'tictactoe_memory_game'
  | 'sound_chain_game';