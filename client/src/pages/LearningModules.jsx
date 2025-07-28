import React from "react";
const modules = [
  {
    id: 1,
    title: {
      en: "Introduction to AI",
      tr: "Yapay Zekaya Giriş",
      de: "Einführung in KI",
      pl: "Wprowadzenie do SI"
    },
    videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao",
    notes: {
      en: `What is artificial intelligence?\n- Real-life examples\n- Interacting with AI (chatbots, recommendation systems, etc.)`,
      tr: `Yapay zeka nedir?\n- Gerçek hayattan örnekler\n- AI ile etkileşim (chatbot, öneri sistemi vb.)`,
      de: `Was ist künstliche Intelligenz?\n- Beispiele aus dem echten Leben\n- Interaktion mit KI (Chatbots, Empfehlungssysteme usw.)`,
      pl: `Czym jest sztuczna inteligencja?\n- Przykłady z życia\n- Interakcja z SI (chatboty, systemy rekomendacji itp.)`
    },
    quiz: [
      {
        question: {
          en: "What is AI?",
          tr: "Yapay zeka nedir?",
          de: "Was ist KI?",
          pl: "Czym jest SI?"
        },
        options: [
          { en: "Artificial Intelligence", tr: "Yapay Zeka", de: "Künstliche Intelligenz", pl: "Sztuczna inteligencja" },
          { en: "Automatic Input", tr: "Otomatik Girdi", de: "Automatische Eingabe", pl: "Automatyczne wejście" },
          { en: "Analog Interface", tr: "Analog Arayüz", de: "Analoge Schnittstelle", pl: "Interfejs analogowy" }
        ],
        answer: 0
      },
      {
        question: {
          en: "Which is a real-life example of AI?",
          tr: "Hangisi gerçek hayatta AI örneğidir?",
          de: "Was ist ein Beispiel für KI im echten Leben?",
          pl: "Który z poniższych to przykład SI w życiu codziennym?"
        },
        options: [
          { en: "Chatbot", tr: "Chatbot", de: "Chatbot", pl: "Chatbot" },
          { en: "Notebook", tr: "Defter", de: "Notizbuch", pl: "Zeszyt" },
          { en: "Pen", tr: "Kalem", de: "Stift", pl: "Długopis" }
        ],
        answer: 0
      }
    ]
  },
  {
    id: 2,
    title: {
      en: "AI in Daily Life",
      tr: "Günlük Hayatta AI",
      de: "KI im Alltag",
      pl: "SI w życiu codziennym"
    },
    videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
    notes: {
      en: `Applications using AI (Google Translate, TikTok, WhatsApp)\n- Advantages and limitations of AI\n- Real-world scenarios`,
      tr: `AI kullanan uygulamalar (Google Translate, TikTok, WhatsApp)\n- AI'nin avantajları ve sınırlamaları\n- Gerçek dünya senaryoları`,
      de: `Anwendungen mit KI (Google Translate, TikTok, WhatsApp)\n- Vorteile und Grenzen von KI\n- Szenarien aus der realen Welt`,
      pl: `Aplikacje wykorzystujące SI (Google Translate, TikTok, WhatsApp)\n- Zalety i ograniczenia SI\n- Przykłady z życia wzięte`
    },
    quiz: [
      {
        question: {
          en: "Which app uses AI?",
          tr: "Hangi uygulama AI kullanır?",
          de: "Welche App nutzt KI?",
          pl: "Która aplikacja używa SI?"
        },
        options: [
          { en: "Google Translate", tr: "Google Translate", de: "Google Translate", pl: "Google Translate" },
          { en: "Calculator", tr: "Hesap Makinesi", de: "Taschenrechner", pl: "Kalkulator" },
          { en: "Ruler", tr: "Cetvel", de: "Lineal", pl: "Linijka" }
        ],
        answer: 0
      },
      {
        question: {
          en: "What is a limitation of AI?",
          tr: "AI'nin bir sınırlaması nedir?",
          de: "Was ist eine Einschränkung von KI?",
          pl: "Jakie jest ograniczenie SI?"
        },
        options: [
          { en: "Can make mistakes", tr: "Hata yapabilir", de: "Kann Fehler machen", pl: "Może popełniać błędy" },
          { en: "Never makes mistakes", tr: "Asla hata yapmaz", de: "Macht nie Fehler", pl: "Nigdy się nie myli" },
          { en: "Is always creative", tr: "Her zaman yaratıcıdır", de: "Ist immer kreativ", pl: "Zawsze jest kreatywna" }
        ],
        answer: 0
      }
    ]
  },
  {
    id: 3,
    title: { en: "AI & Jobs of the Future", tr: "Geleceğin İşleri ve AI", de: "KI & Jobs der Zukunft", pl: "SI i Praca Przyszłości" },
    videoUrl: "https://www.youtube.com/embed/3jZ5vnv-LZc",
    notes: {
      en: `Which jobs are changing with AI?\n- New skills: prompt writing, data literacy, etc.\n- Opportunities for migrant youth`,
      tr: `Hangi işler AI ile değişiyor?\n- Yeni beceriler: prompt yazma, veri okuryazarlığı vb.\n- Göçmen gençler için fırsatlar`,
      de: `Welche Jobs verändern sich mit KI?\n- Neue Fähigkeiten: Prompt-Schreiben, Datenkompetenz usw.\n- Chancen für Migrantenjugendliche`,
      pl: `Które zawody zmieniają się dzięki SI?\n- Nowe umiejętności: pisanie promptów, umiejętność analizy danych itp.\n- Możliwości dla młodzieży migrantów`
    },
    quiz: [
      {
        question: { en: "Which skill is important for the future?", tr: "Gelecekte hangi beceri önemlidir?", de: "Welche Fähigkeit ist wichtig für die Zukunft?", pl: "Jakie umiejętności są ważne w przyszłości?" },
        options: [ { en: "Prompt writing", tr: "Prompt yazma", de: "Prompt-Schreiben", pl: "Pisanie promptów" }, { en: "Typewriting", tr: "Daktilo", de: "Maschinenschreiben", pl: "Pisanie na maszynie" }, { en: "Horse riding", tr: "Ata Binme", de: "Reiten", pl: "Jazda konna" } ],
        answer: 0
      }
    ]
  },
  {
    id: 4,
    title: { en: "Ethics & Safety in AI", tr: "AI'da Etik ve Güvenlik", de: "Ethik & Sicherheit in KI", pl: "Etyka i Bezpieczeństwo w SI" },
    videoUrl: "https://www.youtube.com/embed/8nt3edWLgIg",
    notes: {
      en: `What is bias and why does it matter?\n- Data privacy and digital footprint\n- Ethical behavior in AI`,
      tr: `Önyargı nedir ve neden önemlidir?\n- Veri gizliliği ve dijital ayak izi\n- AI'da etik davranış`,
      de: `Was ist Vorurteil und warum ist es wichtig?\n- Datenschutz und digitale Fußabdrücke\n- Ethisches Verhalten in KI`,
      pl: `Czym jest stronniczość i dlaczego jest ważna?\n- Prywatność danych i ślad cyfrowy\n- Etyczne zachowanie w SI`
    },
    quiz: [
      {
        question: { en: "What is bias in AI?", tr: "AI'da önyargı nedir?", de: "Was ist Vorurteil in KI?", pl: "Czym jest stronniczość w SI?" },
        options: [ { en: "Unfair preference", tr: "Adaletsiz tercih", de: "Unfaire Bevorzugung", pl: "Niesprawiedliwy wybór" }, { en: "A type of computer", tr: "Bir bilgisayar türü", de: "Eine Art von Computer", pl: "Rodzaj komputera" }, { en: "A programming language", tr: "Bir programlama dili", de: "Eine Programmiersprache", pl: "Język programowania" } ],
        answer: 0
      }
    ]
  },
  {
    id: 5,
    title: { en: "Using AI for Language Learning", tr: "Dil Öğreniminde AI Kullanımı", de: "KI für das Sprachenlernen nutzen", pl: "Wykorzystanie SI do nauki języków" },
    videoUrl: "https://www.youtube.com/embed/1Bq1j3p1Q6k",
    notes: {
      en: `Practice with ChatGPT\n- AI-powered translation tools\n- Switching between your language and English`,
      tr: `ChatGPT ile pratik yapın\n- AI destekli çeviri araçları\n- Kendi dilinizle İngilizce arasında geçiş yapma`,
      de: `Üben mit ChatGPT\n- KI-gestützte Übersetzungstools\n- Wechsel zwischen Ihrer Sprache und Englisch`,
      pl: `Ćwicz z ChatGPT\n- Narzędzia do tłumaczenia wspomagane przez SI\n- Przełączanie między swoim językiem a angielskim`
    },
    quiz: [
      {
        question: { en: "Which tool can help you practice English?", tr: "Hangi araç İngilizce pratik yapmanıza yardımcı olabilir?", de: "Welches Tool kann Ihnen helfen, Englisch zu üben?", pl: "Które narzędzie może pomóc Ci w ćwiczeniu angielskiego?" },
        options: [ { en: "ChatGPT", tr: "ChatGPT", de: "ChatGPT", pl: "ChatGPT" }, { en: "Paint", tr: "Boyama", de: "Malerei", pl: "Malowanie" }, { en: "Excel", tr: "Excel", de: "Excel", pl: "Excel" } ],
        answer: 0
      }
    ]
  },
  {
    id: 6,
    title: { en: "Build Your First Chatbot (No-code)", tr: "İlk Chatbot'unuzu Oluşturun (Kod Olmadan)", de: "Erstellen Sie Ihren ersten Chatbot (ohne Code)", pl: "Zbuduj swojego pierwszego chatbota (bez kodu)" },
    videoUrl: "https://www.youtube.com/embed/1lwddP0KUEg",
    notes: {
      en: `Create a simple AI tool (e.g., Tidio, Dialogflow introduction)\n- Example: greeting, answering questions`,
      tr: `Basit bir AI aracı oluşturun (örneğin, Tidio, Dialogflow tanıtımı)\n- Örnek: selamlaşma, soruları yanıtlama`,
      de: `Erstellen Sie ein einfaches KI-Tool (z. B. Tidio, Einführung in Dialogflow)\n- Beispiel: Begrüßung, Beantwortung von Fragen`,
      pl: `Utwórz proste narzędzie SI (np. Tidio, wprowadzenie do Dialogflow)\n- Przykład: powitanie, odpowiadanie na pytania`
    },
    quiz: [
      {
        question: { en: "Which platform lets you build a chatbot without coding?", tr: "Hangi platform kod yazmadan chatbot oluşturmanıza izin verir?", de: "Welche Plattform ermöglicht es Ihnen, einen Chatbot ohne Programmierung zu erstellen?", pl: "Która platforma pozwala na budowanie chatbota bez kodowania?" },
        options: [ { en: "Tidio", tr: "Tidio", de: "Tidio", pl: "Tidio" }, { en: "Word", tr: "Word", de: "Word", pl: "Word" }, { en: "Photoshop", tr: "Photoshop", de: "Photoshop", pl: "Photoshop" } ],
        answer: 0
      }
    ]
  },
  {
    id: 7,
    title: { en: "Prompt Engineering Basics", tr: "Prompt Mühendisliği Temelleri", de: "Grundlagen des Prompt-Engineerings", pl: "Podstawy inżynierii promptów" },
    videoUrl: "https://www.youtube.com/embed/2xxziIWmaSA",
    notes: {
      en: `How to use ChatGPT effectively?\n- Role play, content creation, research prompts`,
      tr: `ChatGPT'yi etkili bir şekilde nasıl kullanırsınız?\n- Rol yapma, içerik oluşturma, araştırma istemleri`,
      de: `Wie man ChatGPT effektiv nutzt?\n- Rollenspiel, Inhaltserstellung, Forschungsaufforderungen`,
      pl: `Jak skutecznie korzystać z ChatGPT?\n- Odgrywanie ról, tworzenie treści, zapytania badawcze`
    },
    quiz: [
      {
        question: { en: "What is prompt engineering?", tr: "Prompt mühendisliği nedir?", de: "Was ist Prompt-Engineering?", pl: "Czym jest inżynieria promptów?" },
        options: [ { en: "Writing effective questions for AI", tr: "AI için etkili sorular yazmak", de: "Schreiben effektiver Fragen für KI", pl: "Pisanie skutecznych pytań dla SI" }, { en: "Building robots", tr: "Robotlar inşa etmek", de: "Roboter bauen", pl: "Budowanie robotów" }, { en: "Drawing pictures", tr: "Resim çizmek", de: "Bilder zeichnen", pl: "Rysowanie obrazków" } ],
        answer: 0
      }
    ]
  },
  {
    id: 8,
    title: { en: "AI for Education", tr: "Eğitim için AI", de: "KI für die Bildung", pl: "SI w edukacji" },
    videoUrl: "https://www.youtube.com/embed/9L0lY6y2Szw",
    notes: {
      en: `AI-powered learning resources\n- Study tools: Notion AI, Quizlet, Khanmigo\n- Video summarization, note taking`,
      tr: `AI destekli öğrenme kaynakları\n- Çalışma araçları: Notion AI, Quizlet, Khanmigo\n- Video özetleme, not alma`,
      de: `KI-gestützte Lernressourcen\n- Lernwerkzeuge: Notion AI, Quizlet, Khanmigo\n- Videozusammenfassungen, Notizen machen`,
      pl: `Zasoby edukacyjne wspomagane przez SI\n- Narzędzia do nauki: Notion AI, Quizlet, Khanmigo\n- Streszczenie wideo, robienie notatek`
    },
    quiz: [
      {
        question: { en: "Which is an AI-powered study tool?", tr: "Hangi araç AI destekli bir çalışma aracıdır?", de: "Welches ist ein KI-gestütztes Lernwerkzeug?", pl: "Które z nich jest narzędziem do nauki wspomaganym przez SI?" },
        options: [ { en: "Quizlet", tr: "Quizlet", de: "Quizlet", pl: "Quizlet" }, { en: "Paint", tr: "Boyama", de: "Malerei", pl: "Malowanie" }, { en: "Calculator", tr: "Hesap Makinesi", de: "Taschenrechner", pl: "Kalkulator" } ],
        answer: 0
      }
    ]
  },
  // Diğer modüller de aynı şekilde iki dilli olarak eklenebilir...
];

export default function LearningModules() {
  // LocalStorage anahtarları
  const LS_COMPLETED = "learningModules_completed";
  const LS_QUIZ = "learningModules_quizAnswers";
  const LS_SELECTED = "learningModules_selected";
  const LS_TAB = "learningModules_tab";
  const LS_LANG = "learningModules_lang";

  // Başlangıç değerlerini localStorage'dan oku
  const [selected, setSelected] = React.useState(() => {
    const val = localStorage.getItem(LS_SELECTED);
    return val !== null ? Number(val) : 0;
  });
  const [completed, setCompleted] = React.useState(() => {
    const val = localStorage.getItem(LS_COMPLETED);
    return val ? JSON.parse(val) : [];
  });
  const [quizAnswers, setQuizAnswers] = React.useState(() => {
    const val = localStorage.getItem(LS_QUIZ);
    return val ? JSON.parse(val) : {};
  });
  const [tab, setTab] = React.useState(() => {
    const val = localStorage.getItem(LS_TAB);
    return val || "video";
  });
  const [lang, setLang] = React.useState(() => {
    const val = localStorage.getItem(LS_LANG);
    return val || "en";
  });

  // Badge logic
  const badges = [];
  if (completed.length >= 1) badges.push({ name: "AI Beginner", color: "bg-blue-500" });
  if (completed.includes(7)) badges.push({ name: "Prompt Explorer", color: "bg-purple-500" });
  if (completed.includes(5)) badges.push({ name: "CV Master", color: "bg-green-500" });

  // Progress
  const progress = Math.round((completed.length / modules.length) * 100);
  const current = modules[selected];

  // Only allow selecting unlocked modules
  function isUnlocked(i) {
    return i === 0 || completed.includes(modules[i - 1].id) || completed.includes(modules[i].id);
  }

  function handleQuizChange(qIdx, optIdx) {
    setQuizAnswers(prev => {
      const updated = { ...prev, [qIdx]: optIdx };
      localStorage.setItem(LS_QUIZ, JSON.stringify(updated));
      return updated;
    });
  }

  function handleMarkCompleted() {
    if (!completed.includes(current.id)) {
      setCompleted(prev => {
        const updated = [...prev, current.id];
        localStorage.setItem(LS_COMPLETED, JSON.stringify(updated));
        return updated;
      });
    }
  }

  // selected, tab, lang değişince localStorage'a yaz
  React.useEffect(() => {
    localStorage.setItem(LS_SELECTED, selected);
  }, [selected]);
  React.useEffect(() => {
    localStorage.setItem(LS_TAB, tab);
  }, [tab]);
  React.useEffect(() => {
    localStorage.setItem(LS_LANG, lang);
  }, [lang]);
  // completed ve quizAnswers zaten fonksiyon içinde yazılıyor

  // Example reflection/apply task for each module
  const applyTasks = [
    "Try chatting with a simple AI bot online.",
    "List 3 apps you use that have AI features.",
    "Write a prompt for a job you want in the future.",
    "Reflect: Why is ethics important in AI?",
    "Translate a sentence using an AI tool.",
    "Create a greeting message in a chatbot builder.",
    "Write a creative prompt for ChatGPT.",
    "Summarize a video using an AI tool."
  ];

  // Example ChatGPT prompt for each module
  const chatPrompts = [
    "Can you simulate a chatbot greeting for me?",
    "How does TikTok use AI for recommendations?",
    "What skills should I learn for future jobs with AI?",
    "Give me an example of bias in AI.",
    "Help me practice English with an AI conversation.",
    "How do I build a simple chatbot without code?",
    "Show me how to write a good prompt for research.",
    "What are the best AI-powered study tools?"
  ];

  // Multilingual UI labels
  const t = {
    modules: { en: "Modules", tr: "Modüller", de: "Module", pl: "Moduły" },
    quiz: { en: "Quiz", tr: "Quiz", de: "Quiz", pl: "Quiz" },
    notes: { en: "Notes", tr: "Notlar", de: "Notizen", pl: "Notatki" },
    apply: { en: "Apply what you learned", tr: "Öğrendiklerini uygula", de: "Wende das Gelernte an", pl: "Zastosuj to, czego się nauczyłeś" },
    video: { en: "Video", tr: "Video", de: "Video", pl: "Wideo" },
    markCompleted: { en: "Mark as completed", tr: "Tamamlandı olarak işaretle", de: "Als abgeschlossen markieren", pl: "Oznacz jako ukończony" },
    completed: { en: "Completed", tr: "Tamamlandı", de: "Abgeschlossen", pl: "Ukończono" },
    progress: { en: "modules completed", tr: "modül tamamlandı", de: "Module abgeschlossen", pl: "ukończonych modułów" },
    practice: { en: "Practice with ChatGPT", tr: "ChatGPT ile pratik yap", de: "Übe mit ChatGPT", pl: "Ćwicz z ChatGPT" },
    tryPrompt: { en: "Try this prompt:", tr: "Bu prompt'u dene:", de: "Probiere diesen Prompt:", pl: "Wypróbuj ten prompt:" },
    reflection: { en: "(This is a reflection or practical task. You can write your answer in your notes.)", tr: "(Bu bir yansıtma veya pratik görevidir. Cevabını notlarına yazabilirsin.)", de: "(Dies ist eine Reflexions- oder Praxisaufgabe. Du kannst deine Antwort in deinen Notizen aufschreiben.)", pl: "(To jest zadanie refleksyjne lub praktyczne. Możesz zapisać swoją odpowiedź w notatkach.)" }
  };

  return (
    <div className="flex h-full gap-8">
      {/* Left: Module List */}
      <aside className="w-64 bg-blue-50 rounded-2xl p-4 flex flex-col gap-2 shadow-md">
        <h2 className="text-lg font-bold mb-2 text-blue-800">{t.modules[lang] || t.modules.en}</h2>
        {modules.map((m, i) => (
          <button
            key={m.id}
            onClick={() => isUnlocked(i) && setSelected(i)}
            disabled={!isUnlocked(i)}
            className={`text-left px-3 py-2 rounded-lg font-medium transition border border-transparent flex items-center justify-between ${selected === i ? "bg-blue-600 text-white" : !isUnlocked(i) ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-800"}`}
          >
            <span>{m.title[lang] || m.title.en}</span>
            {completed.includes(m.id) && <span className="ml-2 text-green-500 font-bold">✓</span>}
            {!isUnlocked(i) && <span className="ml-2 text-xs text-gray-400">🔒</span>}
          </button>
        ))}
      </aside>
      {/* Right: Video & Content */}
      <main className="flex-1 bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6 relative">
        {/* Language Selector - top right */}
        <div className="absolute right-6 top-6 z-20">
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold shadow border border-blue-200"
          >
            <option value="en">EN</option>
            <option value="tr">TR</option>
            <option value="de">DE</option>
            <option value="pl">PL</option>
          </select>
        </div>
        {/* Progress & Badges */}
        <div className="absolute right-6 top-20 flex flex-col items-end gap-2 z-10">
          <div className="text-sm font-semibold text-blue-900 bg-blue-100 px-4 py-1 rounded-full shadow">
            {completed.length} of {modules.length} {t.progress[lang] || t.progress.en} • {progress}%
          </div>
          <div className="flex gap-2">
            {badges.map(badge => (
              <span key={badge.name} className={`text-xs text-white px-3 py-1 rounded-full font-bold shadow ${badge.color}`}>{badge.name}</span>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-blue-900 mb-2">{current.title[lang] || current.title.en}</h1>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("video")} className={`px-4 py-1 rounded-t-lg font-semibold ${tab === "video" ? "bg-blue-200 text-blue-900" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>{t.video[lang] || t.video.en}</button>
          <button onClick={() => setTab("quiz")} className={`px-4 py-1 rounded-t-lg font-semibold ${tab === "quiz" ? "bg-blue-200 text-blue-900" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>{t.quiz[lang] || t.quiz.en}</button>
          <button onClick={() => setTab("notes")} className={`px-4 py-1 rounded-t-lg font-semibold ${tab === "notes" ? "bg-blue-200 text-blue-900" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>{t.notes[lang] || t.notes.en}</button>
          <button onClick={() => setTab("apply")} className={`px-4 py-1 rounded-t-lg font-semibold ${tab === "apply" ? "bg-blue-200 text-blue-900" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>{t.apply[lang] || t.apply.en}</button>
        </div>
        {/* Tab Content */}
        {tab === "video" && (
          <div>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
              <iframe
                src={current.videoUrl}
                title={current.title[lang] || current.title.en}
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            {/* ChatGPT Practice suggestion */}
            {completed.includes(current.id) && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div className="font-semibold text-blue-700 mb-1">{t.practice[lang] || t.practice.en}</div>
                <div className="text-blue-900 text-sm">{t.tryPrompt[lang] || t.tryPrompt.en} <span className="font-mono bg-blue-100 px-2 py-1 rounded">{chatPrompts[selected]}</span></div>
              </div>
            )}
          </div>
        )}
        {tab === "quiz" && (
          <div>
            <h3 className="font-semibold text-blue-700 mb-1">{t.quiz[lang] || t.quiz.en}</h3>
            {current.quiz.map((q, qIdx) => (
              <div key={qIdx} className="mb-3">
                <div className="font-medium text-gray-800 mb-1">{q.question[lang] || q.question.en}</div>
                <div className="flex gap-3">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`quiz-${selected}-${qIdx}`}
                        checked={quizAnswers[qIdx] === optIdx}
                        onChange={() => handleQuizChange(qIdx, optIdx)}
                        className="accent-blue-600"
                      />
                      <span className="text-gray-700 text-sm">{opt[lang] || opt.en}</span>
                    </label>
                  ))}
                </div>
                {quizAnswers[qIdx] === q.answer && (
                  <span className="text-green-600 text-xs font-bold ml-2">Correct!</span>
                )}
              </div>
            ))}
          </div>
        )}
        {tab === "notes" && (
          <div>
            <h3 className="font-semibold text-blue-700 mb-1">{t.notes[lang] || t.notes.en}</h3>
            <pre className="text-gray-700 text-base whitespace-pre-line bg-blue-50 rounded p-3">{current.notes[lang] || current.notes.en}</pre>
          </div>
        )}
        {tab === "apply" && (
          <div>
            <h3 className="font-semibold text-blue-700 mb-1">{t.apply[lang] || t.apply.en}</h3>
            <div className="text-blue-900 text-base mb-2">{applyTasks[selected]}</div>
            <div className="text-xs text-gray-500">{t.reflection[lang] || t.reflection.en}</div>
          </div>
        )}
        <button
          onClick={handleMarkCompleted}
          disabled={completed.includes(current.id) || (selected > 0 && !completed.includes(modules[selected - 1].id))}
          className="mt-auto px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 disabled:opacity-60"
        >
          {completed.includes(current.id) ? t.completed[lang] || t.completed.en : t.markCompleted[lang] || t.markCompleted.en}
        </button>
      </main>
    </div>
  );
}
