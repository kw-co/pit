

import React from 'react';
import { Animal, AnimalType, DietType } from './types';
import { Language } from './contexts/LanguageContext';

const AS = 'ARSOUND'; // Arabic Sounds folder
const ES = 'ENSOUND'; // English Sounds folder

interface VoicePrompt {
    path: string;
    desc: string; // Description in Arabic
}

interface VoicePromptGroup {
    [key: string]: VoicePrompt | VoicePrompt[];
}

interface AllVoicePrompts {
    ar: VoicePromptGroup;
    en: VoicePromptGroup;
}

// URLs for the new conversational voice prompts.
// Each entry now contains the path and a description.
export const VOICE_PROMPTS: AllVoicePrompts = {
    ar: {
        WELCOME_GREETING: { path: `${AS}/VINTRO1.mp3`, desc: "مرحبا" },
        WELCOME_INTRO: { path: `${AS}/VINTRO3.mp3`, desc: "اهلا بك في برنامج حيوانات مرحة" },

        GOODBYE: [
            { path: `${AS}/VBYE1.mp3`, desc: "الى اللقاء" },
            { path: `${AS}/VBYE2.mp3`, desc: "باي باي" },
            { path: `${AS}/VBYE3.mp3`, desc: "مع السلامة" },
        ],

        MAIN_MENU_PROMPT: { path: `${AS}/VHELP18.mp3`, desc: "اضغط على زر حقائق لتتعلم عن الحيوانات او اضغط على زر العاب لتختار لعبة" },
        FACTS_PROMPT: { path: `${AS}/VHELP20.mp3`, desc: "اضغط على الحيوان الذي تريد" },
        GAMES_MENU_PROMPT: { path: `${AS}/VHELP7.mp3`, desc: "اختر اللعبة التي تريدها" },
        
        GAME_START_PROMPT: { path: `${AS}/VHELP6.mp3`, desc: "أولا يجب ان تجد حيواناً" },
        PLAY_AGAIN_PROMPT: { path: `${AS}/VHELP5.mp3`, desc: "هيا نلعب مرة اخرى" },
        SHUFFLE_PROMPT: { path: `${AS}/VHELP11.mp3`, desc: "انتظر حتى نخلط الصور" },
        CONFIRM_PLAY_AGAIN: { path: `${AS}/VHELP15.mp3`, desc: "هل تريد اللعب مرة اخرى" },
        CONJUNCTION_AND: { path: `${AS}/VHELP17.mp3`, desc: "و" },

        NAME_GAME_QUESTION: [
            { path: `${AS}/VHELP19.mp3`, desc: "اضغط على صورة" },
            { path: `${AS}/VHELP3.mp3`, desc: "اضغط على المربع الذي فيه صورة" }
        ],
        SOUND_GAME_QUESTION: { path: `${AS}/VHELP1.mp3`, desc: "اضغط على الحيوان الذي يصدر الصوت" },
        MEMORY_GAME_START: { path: `${AS}/VHELP2.mp3`, desc: "اضغط على زر ابدأ حين تكون مستعداً" },
        SOUND_CHAIN_GAME_INTRO: { path: `${AS}/VHELP21.mp3`, desc: "لعبة سلسلة الاصوات: هيا نلعب لعبة التقليد!" },

        TICTACTOE_PROMPT_PREFIX: { path: `${AS}/VHELP10.mp3`, desc: "اضغط حيث تريد وضع" },
        TICTACTOE_X: { path: `${AS}/VHELP8.mp3`, desc: "❌" },
        TICTACTOE_O: { path: `${AS}/VHELP9.mp3`, desc: "⭕️" },
        TICTACTOE_PLAYER: { path: `${AS}/VHELP12.mp3`, desc: "اللاعب" },
        TICTACTOE_PLAYER_1: { path: `${AS}/VHELP13.mp3`, desc: "الأول" },
        TICTACTOE_PLAYER_2: { path: `${AS}/VHELP14.mp3`, desc: "الثاني" },

        CORRECT_PRAISE: [
             { path: `${AS}/VRIGHT1.mp3`, desc: "احسنت" },
             { path: `${AS}/VRIGHT2.mp3`, desc: "ممتاز" },
             { path: `${AS}/VRIGHT3.mp3`, desc: "انت حقاً ذكي" },
             { path: `${AS}/VRIGHT10.mp3`, desc: "انت ذكي جداً" },
             { path: `${AS}/VRIGHT12.mp3`, desc: "عمل رائع" },
        ],
        CORRECT_PREFIX_KNOWLEDGE: { path: `${AS}/VRIGHT4.mp3`, desc: "يبدوا انك تعرف الكثير عن" },
        CORRECT_PREFIX_FIND: { path: `${AS}/VRIGHT6.mp3`, desc: "لقد وجدت" },
        CORRECT_PREFIX_MEMORY: { path: `${AS}/VRIGHT5.mp3`, desc: "ذاكرتك ممتازة لقد وجدت" },
        CORRECT_PREFIX_GENERIC: { path: `${AS}/VRIGHT9.mp3`, desc: "لقد حصلت على" },
        
        WIN_ALL_FOUND: { path: `${AS}/VRIGHT7.mp3`, desc: "لقد وجدت كل الحيوانات" },
        WIN_CONGRATS: { path: `${AS}/VRIGHT8.mp3`, desc: "مبروك لقد فزت" },
        PERFECT_SCORE_CELEBRATION: { path: `${AS}/VRIGHT11.mp3`, desc: "علامة كاملة! رائع!" },

        WRONG_PREFIX: { path: `${AS}/VWRONG1.mp3`, desc: "اسف فهذه صورة" },
        WRONG_PREFIX_ALT: { path: `${AS}/VWRONG3.mp3`, desc: "اسف فهذه ليست صورة" },
        WRONG_SOUND_PROMPT: { path: `${AS}/VWRONG2.mp3`, desc: "صوته هكذا" },
        WRONG_HELP_PROMPT: { path: `${AS}/VWRONG4.mp3`, desc: "اليك هذه المساعدة..." },
        
        WRONG_SUFFIXES: [
            { path: `${AS}/VWRONG5.mp3`, desc: "استمر في المحاولة" },
            { path: `${AS}/VWRONG6.mp3`, desc: "حاول ثانية" },
            { path: `${AS}/VWRONG7.mp3`, desc: "حظ اوفر في المرة القادمة" },
        ],
        
        WRONG_CELL_CONTAINS: { path: `${AS}/VWRONG8.mp3`, desc: "فهذا المربع يحتوي على" },
        WRONG_GENERIC_ERROR: { path: `${AS}/VWRONG9.mp3`, desc: "خطأ" },
        WRONG_ALREADY_FOUND: { path: `${AS}/VWRONG10.mp3`, desc: "حيوان تم العثور عليه من قبل" },
        TICTACTOE_TIE: { path: `${AS}/VWRONG11.mp3`, desc: "لقد تعادلت" },

        STAR_AWARDED: { path: `${AS}/VRIGHT11.mp3`, desc: "صوت الحصول على نجمة" },
    },
    en: {
        WELCOME_GREETING: { path: `${ES}/VINTRO1.mp3`, desc: "Hello" },
        WELCOME_INTRO: { path: `${ES}/VINTRO3.mp3`, desc: "Welcome to Fun Animals" },

        GOODBYE: [
            { path: `${ES}/VBYE1.mp3`, desc: "Goodbye" },
            { path: `${ES}/VBYE2.mp3`, desc: "Bye bye" },
            { path: `${ES}/VBYE3.mp3`, desc: "See you later" },
        ],

        MAIN_MENU_PROMPT: { path: `${ES}/VHELP18.mp3`, desc: "Click facts to learn or games to play" },
        FACTS_PROMPT: { path: `${ES}/VHELP20.mp3`, desc: "Click on the animal you want" },
        GAMES_MENU_PROMPT: { path: `${ES}/VHELP7.mp3`, desc: "Choose the game you want" },
        
        GAME_START_PROMPT: { path: `${ES}/VHELP6.mp3`, desc: "First, find an animal" },
        PLAY_AGAIN_PROMPT: { path: `${ES}/VHELP5.mp3`, desc: "Let's play again" },
        SHUFFLE_PROMPT: { path: `${ES}/VHELP11.mp3`, desc: "Wait while we shuffle" },
        CONFIRM_PLAY_AGAIN: { path: `${ES}/VHELP15.mp3`, desc: "Do you want to play again?" },
        CONJUNCTION_AND: { path: `${ES}/VHELP17.mp3`, desc: "and" },
        
        NAME_GAME_QUESTION: [
            { path: `${ES}/VHELP19.mp3`, desc: "Click on the picture of" },
            { path: `${ES}/VHELP3.mp3`, desc: "Click on the box with" }
        ],
        SOUND_GAME_QUESTION: { path: `${ES}/VHELP1.mp3`, desc: "Click the animal that makes this sound" },
        MEMORY_GAME_START: { path: `${ES}/VHELP2.mp3`, desc: "Press start when you're ready" },
        SOUND_CHAIN_GAME_INTRO: { path: `${ES}/VHELP21.mp3`, desc: "Sound Chain Game: Let's play a copycat game!" },

        TICTACTOE_PROMPT_PREFIX: { path: `${ES}/VHELP10.mp3`, desc: "Click where you want to place" },
        TICTACTOE_X: { path: `${ES}/VHELP8.mp3`, desc: "❌" },
        TICTACTOE_O: { path: `${ES}/VHELP9.mp3`, desc: "⭕️" },
        TICTACTOE_PLAYER: { path: `${ES}/VHELP12.mp3`, desc: "Player" },
        TICTACTOE_PLAYER_1: { path: `${ES}/VHELP13.mp3`, desc: "One" },
        TICTACTOE_PLAYER_2: { path: `${ES}/VHELP14.mp3`, desc: "Two" },
        
        CORRECT_PRAISE: [
             { path: `${ES}/VRIGHT1.mp3`, desc: "Well done" },
             { path: `${ES}/VRIGHT2.mp3`, desc: "Excellent" },
             { path: `${ES}/VRIGHT3.mp3`, desc: "You are so smart" },
             { path: `${ES}/VRIGHT10.mp3`, desc: "You are very smart" },
             { path: `${ES}/VRIGHT12.mp3`, desc: "Great job" },
        ],
        CORRECT_PREFIX_KNOWLEDGE: { path: `${ES}/VRIGHT4.mp3`, desc: "You seem to know a lot about" },
        CORRECT_PREFIX_FIND: { path: `${ES}/VRIGHT6.mp3`, desc: "You found" },
        CORRECT_PREFIX_MEMORY: { path: `${ES}/VRIGHT5.mp3`, desc: "Great memory, you found" },
        CORRECT_PREFIX_GENERIC: { path: `${ES}/VRIGHT9.mp3`, desc: "You got" },
        
        WIN_ALL_FOUND: { path: `${ES}/VRIGHT7.mp3`, desc: "You found all the animals" },
        WIN_CONGRATS: { path: `${ES}/VRIGHT8.mp3`, desc: "Congratulations, you won" },
        PERFECT_SCORE_CELEBRATION: { path: `${ES}/VRIGHT11.mp3`, desc: "Perfect score! Awesome!" },

        WRONG_PREFIX: { path: `${ES}/VWRONG1.mp3`, desc: "Sorry, this is a picture of" },
        WRONG_PREFIX_ALT: { path: `${ES}/VWRONG3.mp3`, desc: "Sorry, this is not a picture of" },
        WRONG_SOUND_PROMPT: { path: `${ES}/VWRONG2.mp3`, desc: "Its sound is like this" },
        WRONG_HELP_PROMPT: { path: `${ES}/VWRONG4.mp3`, desc: "Here's a hint..." },
        WRONG_GENERIC_ERROR: { path: `${ES}/VWRONG9.mp3`, desc: "Error" },
        WRONG_ALREADY_FOUND: { path: `${ES}/VWRONG10.mp3`, desc: "Animal already found" },
        WRONG_CELL_CONTAINS: { path: `${ES}/VWRONG8.mp3`, desc: "This cell contains" },
        TICTACTOE_TIE: { path: `${ES}/VWRONG11.mp3`, desc: "It's a tie" },
        
        WRONG_SUFFIXES: [
            { path: `${ES}/VWRONG5.mp3`, desc: "Keep trying" },
            { path: `${ES}/VWRONG6.mp3`, desc: "Try again" },
            { path: `${ES}/VWRONG7.mp3`, desc: "Better luck next time" },
        ],
        
        STAR_AWARDED: { path: `${ES}/VRIGHT11.mp3`, desc: "Star awarded sound" },
    }
};

const animalsData = [
    // Row 1: IDs 1-10
    { id: 1, name: 'Loon', name_ar: 'آكِلُ السَّمَكِ', name_en: 'Loon', type: AnimalType.BIRD, diet: DietType.CARNIVORE, facts_ar: ["يغوص بمهارة لاصطياد الأسماك", "صوته مميز وحزين", "طائر مائي كبير"], facts_en: ["Dives skillfully to catch fish", "Has a distinct, haunting call", "A large water bird"] },
    { id: 2, name: 'Robin', name_ar: 'أَبُو الحِنَّاءِ', name_en: 'Robin', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["يأكل الحشرات والديدان", "يغني بصوت جميل", "يبني عشه من العشب"], facts_en: ["Eats insects and worms", "Sings a beautiful song", "Builds its nest from grass"] },
    { id: 3, name: 'Lion', name_ar: 'الأَسَدُ', name_en: 'Lion', type: AnimalType.MAMMAL, diet: DietType.CARNIVORE, facts_ar: ["ملك الغابة", "صوته زئير", "يعيش في مجموعة"], facts_en: ["King of the jungle", "Its sound is a roar", "Lives in a group called a pride"] },
    { id: 4, name: 'Moose', name_ar: 'الإِلْكَةُ', name_en: 'Moose', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["أكبر أنواع الأيائل", "له قرون ضخمة", "يعيش في الغابات الباردة"], facts_en: ["The largest type of deer", "Has huge antlers", "Lives in cold forests"] },
    { id: 5, name: 'Orangutan', name_ar: 'إِنْسَانُ الغَابِ', name_en: 'Orangutan', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["ذكي جداً", "يقضي معظم حياته على الأشجار", "يأكل الفاكهة"], facts_en: ["Very intelligent", "Spends most of its life in trees", "Eats fruit"] },
    { id: 6, name: 'Goose', name_ar: 'الأَوَزَّةُ', name_en: 'Goose', type: AnimalType.BIRD, diet: DietType.HERBIVORE, facts_ar: ["تسبح في الماء", "تطير في أسراب على شكل حرف V", "صوتها عالٍ"], facts_en: ["Swims in the water", "Flies in a V-shaped flock", "Has a loud honking sound"] },
    { id: 7, name: 'Parrot', name_ar: 'البَبَّغَاءُ', name_en: 'Parrot', type: AnimalType.BIRD, diet: DietType.HERBIVORE, facts_ar: ["يقلد الكلام", "ألوانه زاهية", "يأكل الفواكه والبذور"], facts_en: ["Can copy speech", "Has bright colors", "Eats fruits and seeds"] },
    { id: 8, name: 'Duck', name_ar: 'البَطَّةُ', name_en: 'Duck', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["تحب السباحة", "صوتها بطبطة", "لها منقار عريض"], facts_en: ["Loves to swim", "Its sound is a quack", "Has a wide beak"] },
    { id: 9, name: 'Mosquito', name_ar: 'البَعُوضَةُ', name_en: 'Mosquito', type: AnimalType.INSECT, diet: DietType.CARNIVORE, facts_ar: ["حشرة صغيرة تطير", "تصدر صوتاً مزعجاً", "تتغذى على الدم"], facts_en: ["A small flying insect", "Makes a buzzing sound", "Feeds on blood"] },
    { id: 10, name: 'Cow', name_ar: 'البَقَرَةُ', name_en: 'Cow', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["تعطينا الحليب", "صوتها خوار", "حيوان أليف"], facts_en: ["Gives us milk", "Its sound is a moo", "A domestic animal"] },
    { id: 11, name: 'Owl', name_ar: 'البُومَةُ', name_en: 'Owl', type: AnimalType.BIRD, diet: DietType.CARNIVORE, facts_ar: ["تنشط في الليل", "تستطيع لف رأسها", "عيناها كبيرتان"], facts_en: ["Is active at night", "Can turn its head almost all the way around", "Has large eyes"] },
    { id: 12, name: 'Crocodile', name_ar: 'التِّمْسَاحُ', name_en: 'Crocodile', type: AnimalType.REPTILE, diet: DietType.CARNIVORE, facts_ar: ["له فك قوي وأسنان حادة", "يعيش في الماء واليابسة", "من أقدم الكائنات"], facts_en: ["Has a strong jaw and sharp teeth", "Lives in water and on land", "One of the oldest creatures"] },
    { id: 13, name: 'Bison', name_ar: 'الثَّوْرُ', name_en: 'Bison', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["حيوان ضخم وقوي", "يعيش في قطعان", "له فرو بني كثيف"], facts_en: ["A large and strong animal", "Lives in herds", "Has thick brown fur"] },
    { id: 14, name: 'Camel', name_ar: 'الجَمَلُ', name_en: 'Camel', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["سفينة الصحراء", "يخزن الدهون في سنامه", "يتحمل العطش"], facts_en: ["Ship of the desert", "Stores fat in its hump", "Can withstand thirst"] },
    { id: 15, name: 'Grasshopper', name_ar: 'الجُنْدُبُ', name_en: 'Grasshopper', type: AnimalType.INSECT, diet: DietType.HERBIVORE, facts_ar: ["يقفز لمسافات طويلة", "يصدر صريراً بأجنحته", "يأكل النباتات"], facts_en: ["Jumps long distances", "Makes a chirping sound with its wings", "Eats plants"] },
    { id: 16, name: 'Horse', name_ar: 'الحِصَانُ', name_en: 'Horse', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["صديق للإنسان", "يركض بسرعة", "صوته صهيل"], facts_en: ["A friend to humans", "Runs very fast", "Its sound is a neigh"] },
    { id: 17, name: 'Donkey', name_ar: 'الحِمَارُ', name_en: 'Donkey', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["يساعد في حمل الأشياء", "صبور وقوي", "صوته نهيق"], facts_en: ["Helps carry things", "Patient and strong", "Its sound is a bray"] },
    { id: 18, name: 'Rhinoceros', name_ar: 'الخَرْتِيتُ', name_en: 'Rhinoceros', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["له قرن على أنفه", "جلده سميك جداً", "مهدد بالانقراض"], facts_en: ["Has a horn on its nose", "Its skin is very thick", "It is endangered"] },
    { id: 19, name: 'Sheep', name_ar: 'الخَرُوفُ', name_en: 'Sheep', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["يعطينا الصوف", "صوته 'باء'", "يعيش في قطعان"], facts_en: ["Gives us wool", "Its sound is 'baa'", "Lives in flocks"] },
    { id: 20, name: 'Bat', name_ar: 'الخُفَّاشُ', name_en: 'Bat', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["يطير في الليل", "ينام ورأسه للأسفل", "يستخدم صدى الصوت ليرى"], facts_en: ["Flies at night", "Sleeps upside down", "Uses sound to see (echolocation)"] },
    { id: 21, name: 'Pig', name_ar: 'الخِنْزِيرُ', name_en: 'Pig', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["يحب اللعب في الطين", "حيوان ذكي جداً", "يأكل كل شيء تقريباً"], facts_en: ["Loves to play in the mud", "A very smart animal", "Eats almost anything"] },
    { id: 22, name: 'Guinea Pig', name_ar: 'الخِنْزِيرُ الغِينِيُّ', name_en: 'Guinea Pig', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["حيوان أليف لطيف", "يصدر أصواتاً متنوعة", "يحب الخضروات الطازجة"], facts_en: ["A cute pet", "Makes a variety of sounds", "Loves fresh vegetables"] },
    { id: 23, name: 'Bear', name_ar: 'الدُّبُّ', name_en: 'Bear', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["يحب العسل", "بعضه ينام في الشتاء", "ضخم وقوي"], facts_en: ["Loves honey", "Some sleep in the winter (hibernate)", "Large and strong"] },
    { id: 24, name: 'Hen', name_ar: 'الدَّجَاجَةُ', name_en: 'Hen', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["تعطينا البيض", "صوتها 'نقنقة'", "تربي صغارها الكتاكيت"], facts_en: ["Gives us eggs", "Its sound is a 'cluck'", "Raises its young chicks"] },
    { id: 25, name: 'Dolphin', name_ar: 'الدُّرْفِيلُ', name_en: 'Dolphin', type: AnimalType.AQUATIC, diet: DietType.CARNIVORE, facts_ar: ["حيوان ذكي جداً", "صديق للإنسان", "يحب اللعب والقفز"], facts_en: ["A very smart animal", "A friend to humans", "Loves to play and jump"] },
    { id: 26, name: 'Rooster', name_ar: 'الدِّيكُ', name_en: 'Rooster', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["يصيح في الصباح", "له عرف أحمر جميل", "هو ذكر الدجاجة"], facts_en: ["Crows in the morning", "Has a beautiful red comb", "Is a male chicken"] },
    { id: 27, name: 'Turkey', name_ar: 'الدِّيكُ الرُّومِيُّ', name_en: 'Turkey', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["طائر كبير الحجم", "يصدر صوت 'قرقرة'", "يأكل الحبوب والحشرات"], facts_en: ["A large bird", "Makes a 'gobble' sound", "Eats grains and insects"] },
    { id: 28, name: 'Wolf', name_ar: 'الذِّئْبُ', name_en: 'Wolf', type: AnimalType.MAMMAL, diet: DietType.CARNIVORE, facts_ar: ["يعيش في مجموعة", "صوته عواء", "ذكي في الصيد"], facts_en: ["Lives in a pack", "Its sound is a howl", "A smart hunter"] },
    { id: 29, name: 'Raccoon', name_ar: 'الرَّاكُونُ', name_en: 'Raccoon', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["له قناع أسود حول عينيه", "يغسل طعامه", "نشيط في الليل"], facts_en: ["Has a black mask around its eyes", "Washes its food", "Active at night"] },
    { id: 30, name: 'Blackbird', name_ar: 'الشُّحْرُورُ', name_en: 'Blackbird', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["لونه أسود لامع", "صوته جميل", "يأكل الديدان والفواكه"], facts_en: ["Is shiny black", "Has a beautiful song", "Eats worms and fruits"] },
    { id: 31, name: 'Chimpanzee', name_ar: 'الشِّمْبَانْزِي', name_en: 'Chimpanzee', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["قريب جداً من الإنسان", "يستخدم الأدوات", "يعيش في جماعات"], facts_en: ["Very closely related to humans", "Uses tools", "Lives in groups"] },
    { id: 32, name: 'Cricket', name_ar: 'صَرَّارُ اللَّيْلِ', name_en: 'Cricket', type: AnimalType.INSECT, diet: DietType.OMNIVORE, facts_ar: ["يصدر صوتاً في الليل", "يقفز عالياً", "يأكل النباتات والحشرات الصغيرة"], facts_en: ["Makes a sound at night", "Jumps high", "Eats plants and small insects"] },
    { id: 33, name: 'Falcon', name_ar: 'الصَّقْرُ', name_en: 'Falcon', type: AnimalType.BIRD, diet: DietType.CARNIVORE, facts_ar: ["طائر جارح وسريع", "بصره حاد جداً", "يصطاد في الجو"], facts_en: ["A fast bird of prey", "Has very sharp eyesight", "Hunts in the air"] },
    { id: 34, name: 'Frog', name_ar: 'الضِّفْدَعَةُ', name_en: 'Frog', type: AnimalType.AMPHIBIAN, diet: DietType.CARNIVORE, facts_ar: ["يقفز بمهارة", "يصطاد الحشرات بلسانه", "يعيش قرب الماء"], facts_en: ["Jumps skillfully", "Catches insects with its tongue", "Lives near water"] },
    { id: 35, name: 'Blue Jay', name_ar: 'العُصْفُورُ الأَزْرَقُ', name_en: 'Blue Jay', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["لونه أزرق وأبيض", "صوته عالٍ ومميز", "طائر ذكي"], facts_en: ["Is blue and white", "Has a loud, distinct call", "A smart bird"] },
    { id: 36, name: 'Crow', name_ar: 'الغُرَابُ', name_en: 'Crow', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["طائر أسود ذكي", "يأكل كل شيء تقريباً", "يستطيع حل المشكلات"], facts_en: ["A smart black bird", "Eats almost anything", "Can solve problems"] },
    { id: 37, name: 'Gorilla', name_ar: 'الغُورِيلا', name_en: 'Gorilla', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["أكبر أنواع القرود", "قوي جداً", "يعيش في الغابات"], facts_en: ["The largest type of ape", "Very strong", "Lives in forests"] },
    { id: 38, name: 'Seal', name_ar: 'الفُقْمَةُ', name_en: 'Seal', type: AnimalType.AQUATIC, diet: DietType.CARNIVORE, facts_ar: ["تسبح بمهارة", "تأكل الأسماك", "تعيش في البحار الباردة"], facts_en: ["Swims skillfully", "Eats fish", "Lives in cold seas"] },
    { id: 39, name: 'Elephant', name_ar: 'الفِيلُ', name_en: 'Elephant', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["أكبر حيوان بري", "له خرطوم طويل", "ذاكرته قوية"], facts_en: ["The largest land animal", "Has a long trunk", "Has a strong memory"] },
    { id: 40, name: 'Cat', name_ar: 'القِطَّةُ', name_en: 'Cat', type: AnimalType.MAMMAL, diet: DietType.CARNIVORE, facts_ar: ["حيوان نظيف", "تحب النوم", "صوتها مواء"], facts_en: ["A clean animal", "Loves to sleep", "Its sound is a meow"] },
    { id: 41, name: 'Hedgehog', name_ar: 'القُنْفُذُ', name_en: 'Hedgehog', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["يغطي جسمه الشوك", "يتكور عند الخطر", "يصطاد الحشرات ليلاً"], facts_en: ["Its body is covered in spines", "Curls into a ball when in danger", "Hunts insects at night"] },
    { id: 42, name: 'Coyote', name_ar: 'القَيُّوطُ', name_en: 'Coyote', type: AnimalType.MAMMAL, diet: DietType.CARNIVORE, facts_ar: ["يشبه الذئب الصغير", "يعيش في أمريكا الشمالية", "يصدر عواءً مميزاً"], facts_en: ["Looks like a small wolf", "Lives in North America", "Makes a distinctive howl"] },
    { id: 43, name: 'Cardinal', name_ar: 'الكاردينَال', name_en: 'Cardinal', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["لونه أحمر زاهي (الذكر)", "يغني بصوت جميل", "يأكل البذور والحشرات"], facts_en: ["Bright red color (the male)", "Sings a beautiful song", "Eats seeds and insects"] },
    { id: 44, name: 'Dog', name_ar: 'الكَلْبُ', name_en: 'Dog', type: AnimalType.MAMMAL, diet: DietType.OMNIVORE, facts_ar: ["أفضل صديق للإنسان", "وفي ويحرس صاحبه", "صوته نباح"], facts_en: ["Man's best friend", "Loyal and guards its owner", "Its sound is a bark"] },
    { id: 45, name: 'Canary', name_ar: 'الكَنَارِي', name_en: 'Canary', type: AnimalType.BIRD, diet: DietType.HERBIVORE, facts_ar: ["طائر صغير", "مشهور بصوته الجميل", "يأكل البذور"], facts_en: ["A small bird", "Famous for its beautiful song", "Eats seeds"] },
    { id: 46, name: 'Goat', name_ar: 'المَاعِزُ', name_en: 'Goat', type: AnimalType.MAMMAL, diet: DietType.HERBIVORE, facts_ar: ["يحب تسلق الأماكن العالية", "يأكل كل شيء تقريباً", "يعطينا الحليب"], facts_en: ["Loves to climb high places", "Eats almost anything", "Gives us milk"] },
    { id: 47, name: 'Bee', name_ar: 'النَّحْلَةُ', name_en: 'Bee', type: AnimalType.INSECT, diet: DietType.HERBIVORE, facts_ar: ["تصنع العسل", "تعيش في خلية", "مفيدة للأزهار"], facts_en: ["Makes honey", "Lives in a hive", "Is helpful for flowers"] },
    { id: 48, name: 'Eagle', name_ar: 'النَّسْرُ', name_en: 'Eagle', type: AnimalType.BIRD, diet: DietType.CARNIVORE, facts_ar: ["ملك الطيور", "قوي وله مخالب حادة", "يبني عشه في الأماكن العالية"], facts_en: ["King of the birds", "Strong with sharp talons", "Builds its nest in high places"] },
    { id: 49, name: 'Tiger', name_ar: 'النَّمِرُ', name_en: 'Tiger', type: AnimalType.MAMMAL, diet: DietType.CARNIVORE, facts_ar: ["له خطوط سوداء", "يسبح بمهارة", "أكبر القطط"], facts_en: ["Has black stripes", "Swims skillfully", "The largest cat"] },
    { id: 50, name: 'Seagull', name_ar: 'النَّوْرَسُ', name_en: 'Seagull', type: AnimalType.BIRD, diet: DietType.OMNIVORE, facts_ar: ["يعيش قرب البحر", "يأكل الأسماك", "صوته عالٍ"], facts_en: ["Lives near the sea", "Eats fish", "Has a loud call"] },
    { id: 51, name: 'Lynx', name_ar: 'الوَشَقُ', name_en: 'Lynx', type: AnimalType.MAMMAL, diet: DietType.CARNIVORE, facts_ar: ["قط بري", "له خصل شعر على أذنيه", "صياد ماهر"], facts_en: ["A wild cat", "Has tufts of hair on its ears", "A skilled hunter"] },
];

export const ANIMALS: Animal[] = animalsData.map((animal) => {
    const paddedId = String(animal.id).padStart(2, '0');
    return {
        ...animal,
        imageUrl: `PHOTOS/T${paddedId}.webp`,
        animalSoundUrl: `VOICES/${paddedId}.mp3`,
        nameSoundUrl: `ARSOUND/${paddedId}.mp3`,
        nameSoundUrl_en: `ENSOUND/${paddedId}.mp3`,
    };
});

const welcomeMascotNames = ['Lion', 'Elephant', 'Dolphin', 'Parrot', 'Cow', 'Horse', 'Frog'];

// Find the full animal objects from the main ANIMALS array.
// This ensures we have access to all data, including sound URLs,
// and keeps the data consistent.
export const WELCOME_MASCOTS: Animal[] = welcomeMascotNames
    .map(name => ANIMALS.find(animal => animal.name === name))
    .filter((animal): animal is Animal => animal !== undefined);


export const getAnimalTypeTranslation = (type: AnimalType, lang: Language): string => {
  if (lang === 'ar') {
    return type;
  }
  switch(type) {
    case AnimalType.MAMMAL: return 'Mammals';
    case AnimalType.BIRD: return 'Birds';
    case AnimalType.REPTILE: return 'Reptiles';
    case AnimalType.AQUATIC: return 'Aquatic';
    case AnimalType.AMPHIBIAN: return 'Amphibians';
    case AnimalType.INSECT: return 'Insects';
    default: return 'Animal';
  }
}

export const getDietTranslation = (diet: DietType, lang: Language): string => {
  if (lang === 'ar') {
    return diet;
  }
  switch(diet) {
    case DietType.HERBIVORE: return 'Herbivore';
    case DietType.CARNIVORE: return 'Carnivore';
    case DietType.OMNIVORE: return 'Omnivore';
    default: return 'Mixed Diet';
  }
}

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const HomeIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
    </svg>
);

export const BackIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
    </svg>
);

export const PawIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.18,10.61a2.4,2.4,0,1,0-2.83-2.83A2.4,2.4,0,0,0,12.18,10.61Zm4.47-5.26a2.4,2.4,0,1,0-2.83-2.83,2.4,2.4,0,0,0,2.83,2.83Zm-11,2.83a2.4,2.4,0,1,0,2.83-2.83A2.4,2.4,0,0,0,5.65,8.18ZM19.5,14a3,3,0,0,0-4-2.83h-.14a3,3,0,0,0-5.72,0H9.5A3,3,0,0,0,5.5,14a2.91,2.91,0,0,0,1.19,2.4,1,1,0,0,0-.19,1.4,1,1,0,0,0,1.4.2,4.89,4.89,0,0,0,8.2,0,1,1,0,0,0,1.4-.2,1,1,0,0,0-.19-1.4A2.91,2.91,0,0,0,19.5,14Z"></path></svg>
);

export const BirdIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.4,6.5A2.22,2.22,0,0,0,20,6H16.33L19.5,2.8a1,1,0,0,0,0-1.41,1,1,0,0,0-1.41,0L14.92,4.58A6.93,6.93,0,0,0,4,6.25a7.45,7.45,0,0,0,1,3.75,3.42,3.42,0,0,1,.54,1.86,3.44,3.44,0,0,1-3.44,3.44H2a1,1,0,0,0,0,2H2.09A5.45,5.45,0,0,0,7.5,22.75a1,1,0,0,0,1-1.74A3.53,3.53,0,0,1,6.1,18H8.5a1,1,0,0,0,0-2H6.1a5.46,5.46,0,0,0-2.43-4.52,5.34,5.34,0,0,1-.52-2.71A5,5,0,0,1,8,8.14a4.93,4.93,0,0,1,6.58-.22,1,1,0,0,0,1.3-.35,4.92,4.92,0,0,1,3.45-2.07H20a.21.21,0,0,1,.18.33L18.3,9.5a1,1,0,0,0,1.33,1.48L21.82,7.9a2.23,2.23,0,0,0,.18-1.4Z"></path></svg>
);

export const ReptileIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.28,11.28a1,1,0,0,0-1.42,0L18.4,12.75A4.47,4.47,0,0,0,15,12a4.48,4.48,0,0,0-4.24,3.12L9.5,14.5a3.5,3.5,0,0,0-3-1.5,3.49,3.49,0,0,0-3.16,2H2a1,1,0,0,0,0,2h1.34a3.49,3.49,0,0,0,6.32,0H11a1,1,0,0,0,0-2,.5.5,0,0,1,0-1,2.5,2.5,0,0,1,2.5-2.5,2.5,2.5,0,0,1,2.2,1.29l1.46-1.46A1,1,0,0,0,21.28,11.28ZM6.5,18A1.5,1.5,0,1,1,8,16.5,1.5,1.5,0,0,1,6.5,18Z M17,2.5a4.48,4.48,0,0,0-3.35,1.58A4.48,4.48,0,0,0,10.3,4.08a4.48,4.48,0,0,0-3.35,7.5,1,1,0,1,0,1.5-1.34,2.51,2.51,0,0,1,1.85-4.14,2.48,2.48,0,0,1,2.5,2.2,2.5,2.5,0,0,1-1.7,2.3,1,1,0,0,0-.6,1.4,1,1,0,0,0,1.4.6A4.5,4.5,0,0,0,17,2.5Z"></path></svg>
);

export const AmphibianIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19,9a1,1,0,0,0-1,1,5,5,0,0,1-4,4.9,5,5,0,0,1-4-4.9,1,1,0,1,0-2,0,7,7,0,0,0,6,6.9V20a1,1,0,1,0,2,0V16.9A7,7,0,0,0,20,10,1,1,0,0,0,19,9ZM7.5,6A1.5,1.5,0,1,0,6,4.5,1.5,1.5,0,0,0,7.5,6Zm9,0A1.5,1.5,0,1,0,15,4.5,1.5,1.5,0,0,0,16.5,6Z"></path></svg>
);

export const AquaticIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.92,11.6C21.36,11,9,2.94,8.88,2.83A2,2,0,0,0,6,2.69,7.4,7.4,0,0,0,1,8.5a7.3,7.3,0,0,0,2.53,5.62L3,15.06A4.1,4.1,0,0,0,6.13,22a4,4,0,0,0,4-3.8,1,1,0,0,0-2,0,2,2,0,0,1-4-1.74,3.18,3.18,0,0,1,.45-1.71l.65,.86a1,1,0,0,0,1.6-.2l.8-1.07a5.52,5.52,0,0,1,5.63-2.19,5.73,5.73,0,0,1,4.24,4.92,1,1,0,0,0,2,0,7.73,7.73,0,0,0-4.88-6.6A7.47,7.47,0,0,0,22,8.5C22,8.13,21.92,11.6,21.92,11.6ZM5.5,9A1.5,1.5,0,1,1,7,10.5,1.5,1.5,0,0,1,5.5,9Z"></path></svg>
);

export const InsectIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,6a1,1,0,0,0-1,1V8h2V7A1,1,0,0,0,12,6Zm7-2a1,1,0,0,0-1,1v5a1,1,0,0,0,1,1,2,2,0,0,1,2,2v1a1,1,0,0,0,2,0v-1a4,4,0,0,0-4-4V5A1,1,0,0,0,19,4Zm-9,2h2v4H10Zm-2,4a4,4,0,0,0-4,4v1a1,1,0,0,0,2,0v-1a2,2,0,0,1,2-2,1,1,0,0,0,1-1V5a1,1,0,0,0-1-1A1,1,0,0,0,5,5Zm15,14H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Zm-3,3a3,3,0,0,0-3,3v1a1,1,0,0,0,2,0v-1a1,1,0,0,1,1-1,1,1,0,0,1,1,1v1a1,1,0,0,0,2,0v-1A3,3,0,0,0,12,17Z"></path></svg>
);

export const SoundOnIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
);

export const StarIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22,9.81a1,1,0,0,0-.84-.68l-5.7-.83L12.88,3.69a1,1,0,0,0-1.76,0L8.54,8.3l-5.7.83a1,1,0,0,0-.55,1.71l4.13,4L5.34,20.2a1,1,0,0,0,1.45,1.05L12,18.65l5.21,2.6a1,1,0,0,0,1.45-1.05l-1-5.63,4.13-4A1,1,0,0,0,22,9.81Z"></path></svg>
);

// New UI Icons
export const BookIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></svg>
);

export const GameIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>
);

export const AbcIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8,7.4H5.2V18h2.6V12.8h2.2c2.1,0,3.3-1.4,3.3-3.2c0-1.8-1.2-3.2-3.3-3.2Zm0,4.6H7.8V9.2h2.2c1,0,1.5,0.6,1.5,1.6c0,1-0.5,1.6-1.5,1.6Z M20.4,18h-2.5l-2-6h-3.2v6H10V7.4h5.2c2.1,0,3.3,1.4,3.3,3.2c0,1.5-0.9,2.6-2.2,3l2.6,4.4Z M15.1,11.2c1,0,1.5-0.6,1.5-1.6c0-1-0.5-1.6-1.5-1.6h-2.6v3.2H15.1Z"></path></svg>
);

export const SoundWaveIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 10v4c0 1.1.9 2 2 2h2l4 4V4L6 8H4c-1.1 0-2 .9-2 2zm11-1.34v6.68c1.42-.41 2.5-1.52 2.5-2.84s-1.08-2.43-2.5-2.84zM13 2.25v2.09c2.83.82 5 3.53 5 6.66s-2.17 5.84-5 6.66v2.09c3.95-.91 7-4.59 7-8.75s-3.05-7.84-7-8.75z"></path></svg>
);

export const MemoryIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v2h-2zm0 4h2v6h-2z"></path></svg>
);

export const GridIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11h6V5H4v6zm0 7h6v-6H4v6zm7-7h6V5h-6v6zm7 0h6V5h-6v6zm-7 7h6v-6h-6v6zm7 7h6v-6h-6v6z"></path></svg>
);

export const HelpIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></svg>
);

export const ShieldIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
    </svg>
);

export const CopyrightIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-2-12c-1.1 0-2 .9-2 2s.9 2 2 2c.55 0 1.05-.22 1.41-.59l1.42 1.42C12.3 15.4 11.7 16 11 16c-2.21 0-4-1.79-4-4s1.79-4 4-4c.7 0 1.3.19 1.83.55L11.41 10A1.99 1.99 0 0 0 10 8z"/>
    </svg>
);

export const ExitIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path></svg>
);

export const TicTacToeIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-5c-.83 0-1.5-.67-1.5-1.5S15.67 8.5 16.5 8.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-5 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-5-1.41L8.09 15 9.5 13.59 8.09 12.17 6.67 13.59 5.26 12.17 3.84 13.59l1.41 1.41zM11.5 7c.83 0 1.5.67 1.5 1.5S12.33 10 11.5 10s-1.5-.67-1.5-1.5S10.67 7 11.5 7zm-5 5L8.09 10.5 9.5 12l-1.41 1.41L6.67 12l-1.41 1.41L3.84 12l1.41-1.41zM6.5 7c.83 0 1.5.67 1.5 1.5S7.33 10 6.5 10s-1.5-.67-1.5-1.5S5.67 7 6.5 7z"></path></svg>
);

export const SoundChainIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.5,8a2.5,2.5,0,1,1-2.5-2.5A2.5,2.5,0,0,1,10.5,8Zm-5,0A2.5,2.5,0,1,0,8,10.5,2.5,2.5,0,0,0,5.5,8Zm8,5a2.5,2.5,0,1,0,2.5,2.5A2.5,2.5,0,0,0,13.5,13Zm5,0a2.5,2.5,0,1,0,2.5,2.5A2.5,2.5,0,0,0,18.5,13Zm-8.15-1.85a1,1,0,0,0-1.7,0l-4,6A1,1,0,0,0,5,18.5a1,1,0,0,0,.85-.5l4-6A1,1,0,0,0,9.85,11.15Zm8,0a1,1,0,0,0-1.7,0l-4,6A1,1,0,0,0,13,18.5a1,1,0,0,0,.85-.5l4-6A1,1,0,0,0,17.85,11.15Z" />
    </svg>
);

export const ReplayIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>
);

export const AppleIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71,10.29a6,6,0,0,0-12-2.18,6,6,0,0,0,1,11.9,6,6,0,0,0,5.5-3.61,1,1,0,0,1,1.74,1,8,8,0,0,1-7.34,4.8,8,8,0,0,1-1.35-15.89,8,8,0,0,1,15.78,3A8.06,8.06,0,0,1,18.71,10.29ZM15,2a1,1,0,0,0-1,1,3,3,0,0,1-3,3,1,1,0,0,0,0,2,5,5,0,0,0,5-5A1,1,0,0,0,15,2Z"/>
    </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({className, style}) => (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5,2h-15A2.5,2.5,0,0,0,2,4.5v3A2.5,2.5,0,0,0,4.5,10H6v5a6,6,0,0,0,12,0V10h1.5A2.5,2.5,0,0,0,22,7.5v-3A2.5,2.5,0,0,0,19.5,2ZM16,15a4,4,0,0,1-8,0V10H16ZM4,7.5v-3A.5.5,0,0,1,4.5,4h15a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5H18V15a6,6,0,0,0-1,3.44,1,1,0,0,0,1,1.1,1.49,1.49,0,0,0,1.41-1.15A2.45,2.45,0,0,1,21.5,20h-19A2.45,2.45,0,0,1,4.59,18.39,1.49,1.49,0,0,0,6,19.54a1,1,0,0,0,1-1.1A6,6,0,0,0,6,15V8H4.5A.5.5,0,0,1,4,7.5Z"></path>
    </svg>
);

// New Volume Icons
export const VolumeFullIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z M14 0v2.06c5 .9 9 4.49 9 8.77s-4 7.87-9 8.77v2.06c6-.9 11-5.52 11-10.83S20 1 14 0z"></path>
  </svg>
);
export const VolumeHighIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
  </svg>
);
export const VolumeMediumIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path>
  </svg>
);
export const VolumeLowIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3z"></path>
  </svg>
);
export const VolumeMuteIcon: React.FC<IconProps> = ({className, style}) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
  </svg>
);