

export const translations = {
  ar: {
    loader: {
        checking: "يتم التحقق من وجود تحديثات",
        downloading: "جاري تحميل حيوانات مرحة",
        downloadingCritical: "تحميل الملفات الأساسية",
        downloadingEssentials: "تحميل الصور والأسماء",
        downloadingSecondary: "تحميل أصوات الحيوانات",
        installing: "جاري تثبيت الملفات...",
        errorTitle: "حدث خطأ",
        retry: "المحاولة مرة أخرى",
        fetchError: "تعذر تحميل ملفات اللعبة بعد عدة محاولات. يرجى التأكد من أن اتصالك بالإنترنت مستقر والمحاولة مرة أخرى.",
        offlineError: "يبدو أنك غير متصل بالإنترنت. يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة.",
        corsError: "فشل تحميل الملفات بسبب قيود الأمان في المتصفح (CORS). هذا يعني أن جميع الطرق البديلة فشلت أيضاً. قد يساعد استخدام شبكة مختلفة.",
        start: "ابدأ اللعب",
    },
    loading: "...يتم التحميل",
    pageTitles: {
      asset_loading: "الرجاء الانتظار",
      main_menu: "حيوانات مرحة",
      help: "كيف ألعب؟",
      facts: "حقائق عن الحيوانات",
      games_menu: "اختر لعبة",
      name_game: "لعبة الأسماء",
      sound_game: "لعبة الأصوات",
      memory_game: "لعبة الذاكرة",
      diet_game: "لعبة الطعام",
      sound_chain_game: "لعبة سلسلة الأصوات",
      tictactoe_name_game: "أسماء ❌⭕️",
      tictactoe_sound_game: "أصوات ❌⭕️",
      tictactoe_memory_game: "ذاكرة ❌⭕️",
    },
    mainMenu: {
      facts: "حقائق",
      games: "ألعاب",
      help: "مساعدة",
      backToMenu: "العودة للقائمة",
      goodbye: "خروج",
    },
    gamesMenu: {
        nameGame: "لعبة الأسماء",
        soundGame: "لعبة الأصوات",
        memoryGame: "لعبة الذاكرة",
        dietGame: "لعبة الطعام",
        soundChainGame: "سلسلة الأصوات",
        tictactoeNameGame: "أسماء ❌⭕️",
        tictactoeSoundGame: "أصوات ❌⭕️",
        tictactoeMemoryGame: "ذاكرة ❌⭕️",
        comingSoon: "قريباً",
        backToGames: "العودة للألعاب",
        hearQuestion: "اسمع السؤال",
    },
    factModal: {
        hearArabicName: "الاسم بالعربي",
        hearEnglishName: "الاسم بالإنجليزي",
        hearAnimalSound: "صوت الحيوان",
        funFactsTitle: "حقائق ممتعة:",
        listenToFact: "الاستماع إلى:",
        dietHerbivore: "آكل أعشاب",
        dietCarnivore: "آكل لحوم",
        dietOmnivore: "قارت",
    },
    nameGame: {
        prompt: "اضغط على صورة {animal}",
        youWon: "أحسنت! لقد وجدت كل الحيوانات!",
        playAgain: "العب مرة أخرى"
    },
    soundGame: {
        prompt: "اضغط على الحيوان الذي يصدر هذا الصوت",
        youWon: "رائع! أذناك ممتازة!",
        playAgain: "العب مرة أخرى"
    },
    memoryGame: {
        memorize: "احفظ أماكن الحيوانات!",
        ready: "أنا مستعد!",
        start: "ابدأ",
        prompt: "أين هو {animal}؟",
        youWon: "ذاكرة رائعة! لقد فزت!",
        playAgain: "العب مرة أخرى"
    },
     dietGame: {
        youWon: "أنت خبير في طعام الحيوانات!",
        playAgain: "العب مرة أخرى",
        score: "النتيجة",
        perfectScore: {
            title: "شهادة خبير طعام الحيوانات",
            congrats: "علامة كاملة!",
            text: "مذهل! لقد أجبت على جميع الأسئلة بشكل صحيح. أنت تستحق هذه الشهادة!",
        }
    },
    soundChainGame: {
        title: "لعبة سلسلة الأصوات",
        prompt_computer: "استمع جيداً...",
        prompt_player: "دورك الآن! كرر التسلسل.",
        prompt_start: "اضغط على ابدأ لتحدي ذاكرتك السمعية!",
        youWon: "رائع! لقد فزت!",
        playAgain: "العب مرة أخرى",
        score: "النتيجة",
        showAgain: "أرني مرة أخرى",
    },
    tictactoe: {
        player_X: "اللاعب ❌",
        player_O: "اللاعب ⭕️",
        prompt_select_cell: "اختر مربعاً لتفوز به",
        prompt_challenge_title: "أجب على التحدي!",
        win_announcement: "مبروك لقد فزت، لقد حصلت على:",
        tie_announcement: "لقد تعادلتما!",
        playAgain: "العب مرة أخرى"
    },
    helpPage: {
        title: "كيف ألعب؟",
        readInstructions: "اقرأ التعليمات",
        welcome: "أهلاً بك في عالم الحيوانات المرحة! هيا نتعلم كيف نلعب.",
        factsTitle: "تعلم الحقائق",
        factsText: "اضغط على هذا الزر لترى كل الحيوانات. يمكنك تعلم أسمائهم، وسماع أصواتهم، واكتشاف حقائق ممتعة عنهم!",
        gamesTitle: "العب الألعاب",
        gamesText: "اضغط على هذا الزر لتلعب ألعابًا ممتعة! يمكنك اختبار معرفتك بأسماء وأصوات الحيوانات.",
    },
    updateNotifier: {
        available: "تحديث جديد متوفر!",
        updateNow: "تحديث الآن",
    },
    privacyPolicy: {
        title: "سياسة الخصوصية"
    },
    copyrightAndCredits: {
        title: "حقوق النشر والتقدير"
    }
  },
  en: {
    loader: {
        checking: "Checking for updates",
        downloading: "Downloading Fun Animals",
        downloadingCritical: "Downloading Critical Files",
        downloadingEssentials: "Downloading Pictures & Names",
        downloadingSecondary: "Downloading Animal Sounds",
        installing: "Installing Files...",
        errorTitle: "An Error Occurred",
        retry: "Retry",
        fetchError: "Could not load game files after multiple attempts. Please ensure your internet connection is stable and try again.",
        offlineError: "You appear to be offline. Please check your network connection and try again.",
        corsError: "File download failed due to browser security (CORS). This means all alternative sources also failed. Trying a different network might help.",
        start: "Start Playing",
    },
    loading: "Loading...",
    pageTitles: {
      asset_loading: "Please Wait",
      main_menu: "Fun Animals",
      help: "How to Play?",
      facts: "Animal Facts",
      games_menu: "Choose a Game",
      name_game: "Name Game",
      sound_game: "Sound Game",
      memory_game: "Memory Game",
      diet_game: "Diet Game",
      sound_chain_game: "Sound Chain Game",
      tictactoe_name_game: "Name ❌⭕️",
      tictactoe_sound_game: "Sound ❌⭕️",
      tictactoe_memory_game: "Memory ❌⭕️",
    },
    mainMenu: {
      facts: "Facts",
      games: "Games",
      help: "Help",
      backToMenu: "Back to Menu",
      goodbye: "Exit",
    },
    gamesMenu: {
        nameGame: "Name Game",
        soundGame: "Sound Game",
        memoryGame: "Memory Game",
        dietGame: "Diet Game",
        soundChainGame: "Sound Chain",
        tictactoeNameGame: "Names ❌⭕️",
        tictactoeSoundGame: "Sounds ❌⭕️",
        tictactoeMemoryGame: "Memory ❌⭕️",
        comingSoon: "Coming Soon",
        backToGames: "Back to Games",
        hearQuestion: "Hear Question",
    },
    factModal: {
        hearArabicName: "Arabic Name",
        hearEnglishName: "English Name",
        hearAnimalSound: "Animal Sound",
        funFactsTitle: "Fun Facts:",
        listenToFact: "Listen to:",
        dietHerbivore: "Herbivore",
        dietCarnivore: "Carnivore",
        dietOmnivore: "Omnivore",
    },
    nameGame: {
        prompt: "Click on the picture of the {animal}",
        youWon: "Well done! You found all the animals!",
        playAgain: "Play Again"
    },
    soundGame: {
        prompt: "Click on the animal that's making this sound",
        youWon: "Awesome! You have great ears!",
        playAgain: "Play Again"
    },
    memoryGame: {
        memorize: "Memorize the animals!",
        ready: "I'm Ready!",
        start: "Start",
        prompt: "Where is the {animal}?",
        youWon: "Great memory! You won!",
        playAgain: "Play Again"
    },
     dietGame: {
        youWon: "You're an animal food expert!",
        playAgain: "Play Again",
        score: "Score",
        perfectScore: {
            title: "Certificate of Food Expertise",
            congrats: "Perfect Score!",
            text: "Amazing! You answered every question correctly. You've earned this certificate!",
        }
    },
    soundChainGame: {
        title: "Sound Chain Game",
        prompt_computer: "Listen carefully...",
        prompt_player: "Your turn! Repeat the sequence.",
        prompt_start: "Press Start to challenge your audio memory!",
        youWon: "Awesome! You won!",
        playAgain: "Play Again",
        score: "Score",
        showAgain: "Show Again",
    },
    tictactoe: {
        player_X: "Player ❌",
        player_O: "Player ⭕️",
        prompt_select_cell: "Choose a square to capture",
        prompt_challenge_title: "Answer the Challenge!",
        win_announcement: "Congratulations, you won with:",
        tie_announcement: "It's a tie!",
        playAgain: "Play Again"
    },
    helpPage: {
        title: "How to Play?",
        readInstructions: "Read Instructions",
        welcome: "Welcome to Fun Animals! Let's learn how to play.",
        factsTitle: "Learn Facts",
        factsText: "Click this button to see all the animals. You can learn their names, hear their sounds, and discover fun facts about them!",
        gamesTitle: "Play Games",
        gamesText: "Click this button to play fun games! You can test your knowledge of animal names and sounds.",
    },
    updateNotifier: {
        available: "A new update is available!",
        updateNow: "Update Now",
    },
    privacyPolicy: {
        title: "Privacy Policy"
    },
    copyrightAndCredits: {
        title: "Copyright & Credits"
    }
  },
};