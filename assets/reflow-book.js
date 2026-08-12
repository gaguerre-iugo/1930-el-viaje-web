(function () {
  "use strict";

  document.documentElement.dataset.reflowBuild = "47-full-book-83";

  var sections = [
    ["pg001_sec001", "index.html"],
    ["pg009_sec001", "pg009_sec001.html"],
    ["pg010_sec001", "pg010_sec001.html"],
    ["pg011_sec001", "pg011_sec001.html"],
    ["pg013_sec001", "pg013_sec001.html"],
    ["pg014_sec001", "pg014_sec001.html"],
    ["pg015_sec001", "pg015_sec001.html"],
    ["pg016_sec001", "pg016_sec001.html"],
    ["pg017_sec001", "pg017_sec001.html"],
    ["pg019_sec001", "pg019_sec001.html"],
    ["pg020_sec001", "pg020_sec001.html"],
    ["pg021_sec001", "pg021_sec001.html"],
    ["pg022_sec001", "pg022_sec001.html"],
    ["pg023_sec001", "pg023_sec001.html"],
    ["pg024_sec001", "pg024_sec001.html"],
    ["pg025_sec001", "pg025_sec001.html"],
    ["pg026_sec001", "pg026_sec001.html"],
    ["pg027_sec001", "pg027_sec001.html"],
    ["pg028_sec001", "pg028_sec001.html"],
    ["pg029_sec001", "pg029_sec001.html"],
    ["pg030_sec001", "pg030_sec001.html"],
    ["pg031_sec001", "pg031_sec001.html"],
    ["pg032_sec001", "pg032_sec001.html"],
    ["pg033_sec001", "pg033_sec001.html"],
    ["pg034_sec001", "pg034_sec001.html"],
    ["pg035_sec001", "pg035_sec001.html"],
    ["quiz_final", "quiz_final.html"],
    ["pg036_sec001", "pg036_sec001.html"],
    ["pg037_sec001", "pg037_sec001.html"],
    ["pg039_sec001", "pg039_sec001.html"],
    ["pg040_sec001", "pg040_sec001.html"],
    ["pg041_sec001", "pg041_sec001.html"],
    ["pg042_sec001", "pg042_sec001.html"],
    ["pg043_sec001", "pg043_sec001.html"],
    ["pg044_sec001", "pg044_sec001.html"],
    ["pg045_sec001", "pg045_sec001.html"],
    ["pg046_sec001", "pg046_sec001.html"],
    ["pg047_sec001", "pg047_sec001.html"],
    ["pg048_sec001", "pg048_sec001.html"],
    ["pg049_sec001", "pg049_sec001.html"],
    ["pg050_sec001", "pg050_sec001.html"],
    ["pg051_sec001", "pg051_sec001.html"],
    ["pg052_sec001", "pg052_sec001.html"],
    ["pg053_sec001", "pg053_sec001.html"],
    ["pg054_sec001", "pg054_sec001.html"],
    ["pg055_sec001", "pg055_sec001.html"],
    ["pg056_sec001", "pg056_sec001.html"],
    ["pg057_sec001", "pg057_sec001.html"],
    ["qz007", "qz007.html"],
    ["pg058059_sec001", "pg058059_sec001.html"],
    ["pg061_sec001", "pg061_sec001.html"],
    ["pg062_sec001", "pg062_sec001.html"],
    ["pg063_sec001", "pg063_sec001.html"],
    ["pg064_sec001", "pg064_sec001.html"],
    ["pg065_sec001", "pg065_sec001.html"],
    ["pg066_sec001", "pg066_sec001.html"],
    ["pg067_sec001", "pg067_sec001.html"],
    ["pg068_sec001", "pg068_sec001.html"],
    ["pg069_sec001", "pg069_sec001.html"],
    ["pg070_sec001", "pg070_sec001.html"],
    ["pg071_sec001", "pg071_sec001.html"],
    ["pg072_sec001", "pg072_sec001.html"],
    ["pg073_sec001", "pg073_sec001.html"],
    ["pg074_sec001", "pg074_sec001.html"],
    ["pg075_sec001", "pg075_sec001.html"],
    ["pg076_sec001", "pg076_sec001.html"],
    ["pg077_sec001", "pg077_sec001.html"],
    ["pg078_sec001", "pg078_sec001.html"],
    ["pg079_sec001", "pg079_sec001.html"],
    ["qz010", "qz010.html"],
    ["pg080081_sec001", "pg080081_sec001.html"],
    ["pg083_sec001", "pg083_sec001.html"],
    ["pg084_sec001", "pg084_sec001.html"],
    ["pg085_sec001", "pg085_sec001.html"],
    ["pg086_sec001", "pg086_sec001.html"],
    ["pg087_sec001", "pg087_sec001.html"],
    ["pg088_sec001", "pg088_sec001.html"],
    ["pg089_sec001", "pg089_sec001.html"],
    ["pg090_sec001", "pg090_sec001.html"],
    ["pg091_sec001", "pg091_sec001.html"],
    ["pg092_sec001", "pg092_sec001.html"],
    ["pg093_sec001", "pg093_sec001.html"],
    ["pg094_sec001", "pg094_sec001.html"],
    ["pg095_sec001", "pg095_sec001.html"],
    ["pg096_sec001", "pg096_sec001.html"],
    ["pg097_sec001", "pg097_sec001.html"],
    ["pg098_sec001", "pg098_sec001.html"],
    ["pg099_sec001", "pg099_sec001.html"],
    ["pg100_sec001", "pg100_sec001.html"],
    ["pg101_sec001", "pg101_sec001.html"],
    ["pg102_sec001", "pg102_sec001.html"],
    ["pg103_sec001", "pg103_sec001.html"],
    ["qz013", "qz013.html"],
    ["pg104105_sec001", "pg104105_sec001.html"],
    ["pg107_sec001", "pg107_sec001.html"],
    ["pg108_sec001", "pg108_sec001.html"],
    ["pg109_sec001", "pg109_sec001.html"],
    ["pg110_sec001", "pg110_sec001.html"],
    ["pg111_sec001", "pg111_sec001.html"],
    ["pg112_sec001", "pg112_sec001.html"],
    ["pg113_sec001", "pg113_sec001.html"],
    ["pg114_sec001", "pg114_sec001.html"],
    ["pg115_sec001", "pg115_sec001.html"],
    ["pg116_sec001", "pg116_sec001.html"],
    ["pg117_sec001", "pg117_sec001.html"],
    ["pg118_sec001", "pg118_sec001.html"],
    ["pg119_sec001", "pg119_sec001.html"],
    ["pg120_sec001", "pg120_sec001.html"],
    ["pg121_sec001", "pg121_sec001.html"],
    ["qz016", "qz016.html"],
    ["pg122123_sec001", "pg122123_sec001.html"],
    ["pg125_sec001", "pg125_sec001.html"],
    ["pg126_sec001", "pg126_sec001.html"],
    ["pg127_sec001", "pg127_sec001.html"],
    ["pg128_sec001", "pg128_sec001.html"],
    ["pg129_sec001", "pg129_sec001.html"],
    ["pg130_sec001", "pg130_sec001.html"],
    ["pg131_sec001", "pg131_sec001.html"],
    ["pg132_sec001", "pg132_sec001.html"],
    ["pg133_sec001", "pg133_sec001.html"],
    ["pg134_sec001", "pg134_sec001.html"],
    ["pg135_sec001", "pg135_sec001.html"],
    ["pg136_sec001", "pg136_sec001.html"],
    ["pg137_sec001", "pg137_sec001.html"],
    ["pg138_sec001", "pg138_sec001.html"],
    ["pg139_sec001", "pg139_sec001.html"],
    ["pg140_sec001", "pg140_sec001.html"],
    ["pg141_sec001", "pg141_sec001.html"],
    ["pg142_sec001", "pg142_sec001.html"],
    ["pg143_sec001", "pg143_sec001.html"],
    ["qz019", "qz019.html"],
    ["pg144145_sec001", "pg144145_sec001.html"],
    ["pg147_sec001", "pg147_sec001.html"],
    ["pg148_sec001", "pg148_sec001.html"],
    ["pg149_sec001", "pg149_sec001.html"],
    ["pg150_sec001", "pg150_sec001.html"],
    ["pg151_sec001", "pg151_sec001.html"],
    ["pg152_sec001", "pg152_sec001.html"],
    ["pg153_sec001", "pg153_sec001.html"],
    ["pg154_sec001", "pg154_sec001.html"],
    ["pg155_sec001", "pg155_sec001.html"],
    ["pg156_sec001", "pg156_sec001.html"],
    ["pg157_sec001", "pg157_sec001.html"],
    ["pg158_sec001", "pg158_sec001.html"],
    ["pg159_sec001", "pg159_sec001.html"],
    ["pg160_sec001", "pg160_sec001.html"],
    ["pg161_sec001", "pg161_sec001.html"],
    ["pg162_sec001", "pg162_sec001.html"],
    ["pg163_sec001", "pg163_sec001.html"],
    ["pg164_sec001", "pg164_sec001.html"],
    ["pg165_sec001", "pg165_sec001.html"],
    ["pg166_sec001", "pg166_sec001.html"],
    ["pg167_sec001", "pg167_sec001.html"],
    ["pg168_sec001", "pg168_sec001.html"],
    ["pg169_sec001", "pg169_sec001.html"],
    ["pg170_sec001", "pg170_sec001.html"],
    ["pg171_sec001", "pg171_sec001.html"],
    ["pg172_sec001", "pg172_sec001.html"],
    ["pg173_sec001", "pg173_sec001.html"],
    ["pg174_sec001", "pg174_sec001.html"],
    ["pg175_sec001", "pg175_sec001.html"],
    ["qz022", "qz022.html"],
    ["pg176177_sec001", "pg176177_sec001.html"],
    ["pg179_sec001", "pg179_sec001.html"],
    ["pg180_sec001", "pg180_sec001.html"],
    ["pg181_sec001", "pg181_sec001.html"],
    ["pg182_sec001", "pg182_sec001.html"],
    ["pg183_sec001", "pg183_sec001.html"],
    ["pg184_sec001", "pg184_sec001.html"],
    ["pg185_sec001", "pg185_sec001.html"],
    ["pg186_sec001", "pg186_sec001.html"],
    ["pg187_sec001", "pg187_sec001.html"],
    ["pg188_sec001", "pg188_sec001.html"],
    ["pg189_sec001", "pg189_sec001.html"],
    ["pg190_sec001", "pg190_sec001.html"],
    ["pg191_sec001", "pg191_sec001.html"],
    ["pg192_sec001", "pg192_sec001.html"],
    ["pg193_sec001", "pg193_sec001.html"],
    ["pg194_sec001", "pg194_sec001.html"],
    ["pg195_sec001", "pg195_sec001.html"],
    ["pg196_sec001", "pg196_sec001.html"],
    ["pg197_sec001", "pg197_sec001.html"],
    ["pg198_sec001", "pg198_sec001.html"],
    ["pg199_sec001", "pg199_sec001.html"],
    ["pg200_sec001", "pg200_sec001.html"],
    ["pg201_sec001", "pg201_sec001.html"],
    ["pg202_sec001", "pg202_sec001.html"],
    ["pg203_sec001", "pg203_sec001.html"],
    ["pg204_sec001", "pg204_sec001.html"],
    ["pg205_sec001", "pg205_sec001.html"],
    ["pg206_sec001", "pg206_sec001.html"],
    ["pg207_sec001", "pg207_sec001.html"],
    ["pg208_sec001", "pg208_sec001.html"],
    ["pg209_sec001", "pg209_sec001.html"],
    ["pg210_sec001", "pg210_sec001.html"],
    ["pg211_sec001", "pg211_sec001.html"],
    ["pg212_sec001", "pg212_sec001.html"],
    ["pg213_sec001", "pg213_sec001.html"],
    ["pg214_sec001", "pg214_sec001.html"],
    ["pg215_sec001", "pg215_sec001.html"],
    ["qz025", "qz025.html"],
    ["pg216217_sec001", "pg216217_sec001.html"],
    ["pg219_sec001", "pg219_sec001.html"],
    ["pg221_sec001", "pg221_sec001.html"],
    ["pg223_sec001", "pg223_sec001.html"],
    ["pg224_sec001", "pg224_sec001.html"]
  ];

  var fileToSection = Object.create(null);
  sections.forEach(function (entry, index) {
    fileToSection[entry[1]] = { id: entry[0], index: index };
  }, true);

  var progressStorageKey = "adt-reflow-progress:1930-libro-completo-v47";
  var fontStorageKey = "adt-reflow-font-size:1930-libro-completo-v47";
  var defaultReaderStateMigrationKey =
    "adt-reflow-default-reader-state:47-full-book-45";
  var retiredTextCaseStorageKey = "adt-reflow-text-case:1930-libro-completo-v47";
  var ttsVoiceStorageKey = "adt-reflow-tts-voice:1930-libro-completo-v47";
  var editorialTocTitles = {
    pg221_sec001: "Ana Solari",
    pg223_sec001: "Misterio de Cabo Frío"
  };
  var fontScales = { normal: 1, large: 1.2, xlarge: 1.4 };
  var ttsVoices = { valentina: "Valentina", mateo: "Mateo" };
  var ttsVoiceCatalogs = {
    valentina: { audios: Object.create(null), timecodes: Object.create(null), available: false },
    mateo: { audios: Object.create(null), timecodes: Object.create(null), available: false }
  };

  var state = {
    current: 0,
    total: 1,
    wheelGestureActive: false,
    wheelGestureDistance: 0,
    wheelGestureTimer: 0,
    resizeTimer: 0,
    layoutObserverTimer: 0,
    layoutObserver: null,
    layoutObserverSignature: "",
    mutationTimer: 0,
    lastContentReflowAt: 0,
    settingsRepaginationActive: false,
    settingsRepaginationFinalizing: false,
    settingsRepaginationGeneration: 0,
    settingsRepaginationAnchorId: null,
    settingsRepaginationTimer: 0,
    settingsRepaginationIgnoreUntil: 0,
    illustratedSettlementFrame: 0,
    illustratedSettlementTimer: 0,
    textCatalog: null,
    ttsAligning: false,
    ttsTimer: 0,
    ttsActivationTimer: 0,
    ttsDesiredPage: null,
    ttsSeeking: false,
    ttsResumeAfterSeek: true,
    ttsManuallyPaused: false,
    ttsExplicitlyStarted: false,
    ttsAudio: null,
    /* The runtime assigns its stock source just before it calls play(). Keep
       the semantic id independently so the bridge can reject that source if
       a delayed native play tries to escape the replacement path. */
    ttsCurrentAudioId: "",
    nativeMediaPlay: null,
    quizFeedbackAudio: null,
    currentAnchorId: null,
    quizRepaginationAnchorId: null,
    quizRepaginationOverlay: null,
    quizRepaginationTimer: 0,
    pendingSettingsAnchorId: null,
    pendingSettingsAnchorUntil: 0,
    pendingSettingsAnchorTimer: 0,
    initialHashSectionId: null,
    ttsLayoutRevision: 0,
    ttsPageMapRevision: -1,
    ttsPageMap: new WeakMap(),
    ttsPageItemCount: 0,
    ttsCurrentItemIndex: -1,
    ttsManualStepUntil: 0,
    ttsStepShouldRemainPaused: false,
    ttsNavigationLockPage: null,
    ttsNavigationLockUntil: 0,
    ttsNavigationUnlockTimer: 0,
    ttsFollowScheduled: false,
    ttsActiveElement: null,
    ttsImageHighlightOverlay: null,
    ttsImageHighlightTarget: null,
    ttsImageHighlightListenersBound: false,
    ttsMarkupRestoring: false,
    ttsMarkupRestoreTimer: 0,
    ttsChatTransitionUntil: 0,
    panelToggleLockPage: null,
    panelToggleLockUntil: 0,
    panelToggleRestoreTimer: 0,
    explicitPageLockPage: null,
    explicitPageLockUntil: 0,
    explicitPageLockTimer: 0,
    ttsRangeClearTimer: 0,
    ttsManualHandoffPending: false,
    ttsManualHandoffGeneration: 0,
    ttsManualHandoffTimer: 0,
    ttsPlayerVisible: false,
    ttsPlayerReserve: 0,
    ttsPlayerStopPendingUntil: 0,
    sentencePaginationKey: "",
    runtimeMenu: null,
    glossaryHighlightEnabled: false,
    glossaryEntries: null,
    glossaryHighlightFrame: 0,
    glossaryHighlightGeneration: 0,
    glossaryMarkupIgnoreUntil: 0,
    glossaryPaginationWaitTimer: 0,
    glossaryHighlightedPage: -1,
    glossaryHighlightedLayoutRevision: -1,
    glossaryHighlightedCount: 0,
    glossaryFocusOrigin: null,
    glossaryFocusKey: "",
    glossaryFocusText: "",
    glossaryFocusPage: null,
    glossaryFocusOrdinal: 0,
    glossaryDefinitionDialog: null,
    glossaryFocusSuppressUntil: 0,
    glossaryFocusRestoreTimer: 0,
    glossaryHighlightFocusKey: "",
    glossaryHighlightFocusText: "",
    glossaryHighlightFocusOrdinal: 0,
    glossaryHighlightFocusPage: null,
    glossaryHighlightFocusUntil: 0,
    fontSize: "normal",
    ttsVoice: "valentina"
  };

  var content;
  var previousButton;
  var nextButton;
  var currentOutput;
  var totalOutput;
  var indexButton;
  var toolsButton;
  var ttsPlayer;
  var ttsPlayerPreviousButton;
  var ttsPlayerToggleButton;
  var ttsPlayerNextButton;
  var ttsPlayerSettingsButton;
  var ttsPlayerStopButton;
  var announcer;
  var ttsWordTickerRefs = new WeakMap();
  var ttsWordTickerRuns = new WeakMap();

  function suppressBlankCatalogueResidues(catalogue) {
    if (!catalogue || !content) return;
    Array.prototype.slice.call(content.querySelectorAll("[data-id]")).forEach(
      function (node) {
        var id = node.dataset && node.dataset.id;
        if (!id || catalogue[id] !== "" || node.tagName === "IMG") return;
        /* A fixed-layout export can retain a visibly meaningful-looking
           fragment even when the editorial catalogue correctly removes it.
           Clear it before the reader builds its TTS queue, rather than
           waiting for React's locale reconciliation on the next tick. */
        node.textContent = "";
        node.setAttribute("aria-hidden", "true");
        node.classList.add("reflow-source-residue");
      }
    );
  }

  function installReflowDataAdapter() {
    var inheritedFetch = window.fetch.bind(window);
    window.fetch = async function (input, options) {
      var response = await inheritedFetch(input, options);
      var rawUrl = input && typeof input === "object" && input.url ? input.url : String(input);
      var cleanUrl = rawUrl.split("?")[0].split("#")[0];
      var isConfig = cleanUrl.endsWith("/assets/config.json") || cleanUrl.endsWith("assets/config.json");
      var isPages = cleanUrl.endsWith("/content/pages.json") || cleanUrl.endsWith("content/pages.json");
      var isToc = cleanUrl.endsWith("/content/toc.json") || cleanUrl.endsWith("content/toc.json");
      var isAudios = cleanUrl.endsWith("/content/i18n/es-UY/audios.json") ||
        cleanUrl.endsWith("content/i18n/es-UY/audios.json");
      var isTimecodes = cleanUrl.endsWith("/content/i18n/es-UY/timecode/timecode_output.json") ||
        cleanUrl.endsWith("content/i18n/es-UY/timecode/timecode_output.json");
      var isTexts = cleanUrl.endsWith("/content/i18n/es-UY/texts.json") ||
        cleanUrl.endsWith("content/i18n/es-UY/texts.json");

      if (!isConfig && !isPages && !isToc && !isAudios && !isTimecodes && !isTexts) return response;

      var data = await response.clone().json();
      if (isConfig) {
        data.features.showNavigationControls = false;
      } else if (isAudios) {
        /* Keep every historical semantic id on the same cache-busted file.
           The final binding is repeated immediately before play() below so
           an already-created TTS queue cannot retain an older WhatsApp clip. */
        data.whatsapp_chat_intro = "whatsapp_chat_intro_v33_es-UY.mp3?v=45-integrated-35-uatsap";
        data.whatsapp_chat_intro_v31 = "whatsapp_chat_intro_v33_es-UY.mp3?v=45-integrated-35-uatsap";
        data.whatsapp_chat_intro_v33 = "whatsapp_chat_intro_v33_es-UY.mp3?v=45-integrated-35-uatsap";
        data.whatsapp_chat_continuation_v45 =
          "whatsapp_chat_continuation_es-UY.mp3?v=45-integrated-35-uatsap";
        /* The bundled reader only adds elements to its TTS queue when their
           semantic id exists in the base audio catalogue.  The visible chat
           cards are composed after the source pages load, so register every
           generated intro id here as an alias.  The media bridge below still
           swaps these placeholders for the selected Valentina/Mateo clip and
           its matching timings immediately before playback. */
        [
          "pg068_im004", "pg069_im004", "pg069_im005", "pg079_im002",
          "pg127_im002", "whatsapp_chat_intro_pg020",
          "whatsapp_chat_intro_pg021", "whatsapp_chat_intro_pg029",
          "whatsapp_chat_intro_pg070"
        ].forEach(function (audioId) {
          data[audioId] = data.whatsapp_chat_intro;
        });
        data.whatsapp_chat_intro_historical =
          "whatsapp_chat_intro_historical.mp3?v=47-uatsap-final-stress";
        [
          "pg083_im002", "pg084_im002", "pg094_im002", "pg094_im003",
          "pg095_im002", "pg117_im002", "pg117_im002_continuation",
          "pg183_im002", "pg183_im003"
        ].forEach(function (audioId) {
          data[audioId] = data.whatsapp_chat_intro_historical;
        });
        data.pg009_n0002 = "pg009_title_continuous.mp3";
        data.pg001_n0004 = "pg001_n0004_es-UY.mp3";
        data.pg001_n0004_easy_read = "pg001_n0004_es-UY.mp3";
        window.__adtReflowAudioFiles = data;
      } else if (isTimecodes) {
        delete data.pg009_n0002;
        delete data.pg001_n0002;
        delete data.pg001_n0004;
        delete data.pg001_n0004_easy_read;
        Object.keys(data).forEach(function (audioId) {
          if (/^qz00[1-3]_(?:que|o[0-2](?:_exp)?)$/.test(audioId)) delete data[audioId];
        });
      } else if (isTexts) {
        data.pg009_n0002 = "La historia que nos une";
        [
          "pg068_im004", "pg069_im004", "pg069_im005", "pg079_im002",
          "pg127_im002", "whatsapp_chat_intro", "whatsapp_chat_intro_v33",
          "whatsapp_chat_continuation_v45", "whatsapp_chat_intro_pg020",
          "whatsapp_chat_intro_pg021", "whatsapp_chat_intro_pg029",
          "whatsapp_chat_intro_pg070"
        ].forEach(function (audioId) {
          data[audioId] = "Ventana de chat de Uatsáp.";
        });
        [
          "pg083_im002", "pg084_im002", "pg094_im002", "pg094_im003",
          "pg095_im002", "pg117_im002", "pg117_im002_continuation",
          "pg183_im002", "pg183_im003", "whatsapp_chat_intro_historical"
        ].forEach(function (audioId) {
          data[audioId] = "Ventana de chat de Uatsáp con estética antigua.";
        });
        /* The offline package embeds a snapshot of the locale catalogue.
           Apply the same Easy Read corrections here as in texts.json so the
           runtime and the direct low-latency switch always receive identical
           semantic text, online and offline. */
    /* A lone conjunction leaked from the fixed-layout source. It is not a
       sentence in either edition and must never become a visible page or TTS
       stop. Keep both catalogues aligned so locale reconciliation cannot
       resurrect it after changing the reading mode. */
    data.pg076_n0035 = "";
      data.pg076_n0035_easy_read = "";
      data.pg183_n0026 = "Venite con los gemelos a la cabina del capitán.";
      data.pg183_n0026_easy_read = "Vení con los gemelos a la cabina del capitán.";
      /* The fixed-layout source leaves Javier's thought visibly unfinished.
         Preserve that deliberate interruption with an ellipsis instead of
         presenting it as an accidentally truncated sentence. */
      data.pg203_n0023 = "Pero creo que…";
      data.pg203_n0023_easy_read = "Pero creo que…";
      /* Several source lines deliberately stop mid-thought. Make that
         editorial intent explicit in both catalogues so they cannot look
         like damaged or missing text after reflow. */
      data.pg074_n0003 = "De cómo puede ser que…";
      data.pg074_n0003_easy_read = "Sobre cómo puede ser que…";
      data.pg075_n0011 = "Pero te dijimos que…";
      data.pg075_n0011_easy_read = "Pero te dijimos que…";
      data.pg102_n0018 = "Se inclina para recogerla, se la mete en el bolsillo y…";
      data.pg102_n0018_easy_read = "Se inclina para recogerla, se la guarda en el bolsillo y…";
      data.pg125_n0006 = "Creo que…";
      data.pg125_n0006_easy_read = "Creo que…";
      data.pg140_n0020 = "Espero que…";
      data.pg140_n0020_easy_read = "Espero que…";
      data.pg198_n0026 = "—Sí, pero…";
      data.pg198_n0026_easy_read = "—Sí, pero…";
      data.pg212_n0032 = "—Creo que no a menos que…";
      data.pg212_n0032_easy_read = "—Creo que no, a menos que…";
      data.pg091_n0004 = "A muchos no les interesa, porque no les gusta Historia, y porque…";
      data.pg091_n0004_easy_read = "A muchos no les interesa, porque no les gusta Historia, y porque…";
      data.pg139_n0045 = "Les presento a…";
      data.pg139_n0045_easy_read = "Les presento a…";
      data.pg182_n0039 = "No dijo nada, pero…";
      data.pg182_n0039_easy_read = "No dijo nada, pero…";
        data.pg112_n0026_easy_read =
          "Además, el asesinato de mi padre y de otros compañeros la debe de haber afectado mucho.";
    data.pg113_n0002_easy_read = "";
    data.pg126_n0035_easy_read = "";
    data.pg132_n0016_easy_read = "";
    data.pg139_n0045_easy_read = "Les presento a…";
    data.pg181_n0011_easy_read = "";
        suppressBlankCatalogueResidues(data);
        state.textCatalog = data;
      } else {
        if (isToc) {
          data = data.filter(function (entry) {
            return entry.section_id !== "pg010_sec001";
          });
          data.forEach(function (entry) {
            if (editorialTocTitles[entry.section_id]) {
              entry.title = editorialTocTitles[entry.section_id];
            }
          });
        }
        data.forEach(function (entry) {
          entry.href = "index.html#" + entry.section_id;
          /* These values identify source-PDF folios. The generic runtime
             renders them as a misleading “Imprimir” action, although they
             are not controls and have no purpose in this reflow edition. */
          if (isPages) delete entry.page_number;
        });
        if (isPages) window.__adtReflowPageEntries = data;
        if (isToc) window.__adtReflowTocEntries = data;
      }

      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: { "Content-Type": "application/json" }
      });
    };
  }

  async function loadIndexMetadata() {
    try {
      var response = await fetch("./content/toc.json?v=3-index-hierarchy");
      if (!response.ok) throw new Error("No se pudo cargar el índice editorial.");
      var entries = await response.json();
      if (Array.isArray(entries)) window.__adtReflowTocEntries = entries;
    } catch (error) {
      console.warn("No se pudieron precargar los metadatos del índice.", error);
    }
  }

  function isInteractive(element) {
    return element && element.closest && element.closest(
      "input, textarea, select, button, a, [contenteditable='true'], [role='dialog'], [data-activity-item]"
    );
  }

  function pageWidth() {
    // La distancia real entre columnas debe seguir el ancho desplazable de
    // #content. En Chrome puede ser un píxel menor que window.innerWidth por
    // el redondeo del viewport; usar el ancho de la ventana acumula ese error
    // y vuelve inalcanzable la última página tras cientos de columnas.
    return Math.max(1, content && content.clientWidth || window.innerWidth);
  }

  function visiblePageIndex() {
    if (!content) return state.current;
    return Math.max(
      0,
      Math.min(state.total - 1, Math.round(content.scrollLeft / pageWidth()))
    );
  }

  /* Page controls must not scan every semantic node merely to remember the
     destination. Probe a small grid in the painted column and take the first
     semantic element actually under the viewport. This turns navigation
     from an O(book) layout query into a constant-time operation. */
  function paintedSemanticAnchorId() {
    if (!content || typeof document.elementsFromPoint !== "function") return null;
    var rect = content.getBoundingClientRect();
    var xRatios = [0.5, 0.28, 0.72];
    var yRatios = [0.5, 0.3, 0.7, 0.16, 0.84];
    for (var yIndex = 0; yIndex < yRatios.length; yIndex += 1) {
      for (var xIndex = 0; xIndex < xRatios.length; xIndex += 1) {
        var stack = document.elementsFromPoint(
          rect.left + (rect.width * xRatios[xIndex]),
          rect.top + (rect.height * yRatios[yIndex])
        );
        for (var index = 0; index < stack.length; index += 1) {
          var candidate = stack[index].closest && stack[index].closest(
            "[data-id], [data-reflow-anchor-id]"
          );
          if (!candidate || !content.contains(candidate)) continue;
          var id = candidate.dataset.reflowAnchorId || candidate.dataset.id;
          if (id) return id;
        }
      }
    }
    return null;
  }

  /* Screen-reader-only announcements can be laid out by the browser as
     one-pixel fragments in an unrelated multicolumn column.  For page
     following, the WhatsApp continuation announcement belongs to the
     complete second chat card that it introduces, not to that invisible
     fragment. */
  function paginationGeometryElement(element) {
    var semanticElement = element;
    if (element && !element.classList) {
      var semanticNode = element.commonAncestorContainer || element.startContainer;
      semanticElement = semanticNode && (
        semanticNode.nodeType === 1 ? semanticNode : semanticNode.parentElement
      );
    }
    var announcement = semanticElement && semanticElement.closest &&
      semanticElement.closest(".whatsapp-chat-continuation");
    if (announcement) {
      return announcement.closest(".chapter-one-chat-part-continuation") || announcement;
    }
    var chatSource = semanticElement && semanticElement.closest &&
      semanticElement.closest(
        ".reflow-chat-source-image, .chapter5-chat-source-image, .whatsapp-chat-intro"
      );
    if (chatSource) {
      return chatSource.closest(
        ".whatsapp-chat-window, .reflow-book-chat-window, .chapter5-chat-page"
      ) || chatSource;
    }
    /* Chapter portadillas are assembled from two hidden source images and one
       visible composite. TTS narrates the source-image IDs, but pagination
       must remain anchored to the single visible cover page. Following the
       clipped 1px source node can otherwise select the following column (or,
       after a late repagination, the final quiz column). */
    var chapterCoverSource = semanticElement && semanticElement.closest &&
      semanticElement.closest(".chapter-cover-source");
    if (chapterCoverSource) {
      return chapterCoverSource.closest(".chapter-cover") || chapterCoverSource;
    }
    return element;
  }

  function pagesForElement(element) {
    element = paginationGeometryElement(element);
    if (!element || !content) return [];
    var contentRect = content.getBoundingClientRect();
    var occupied = Object.create(null);
    Array.prototype.slice.call(element.getClientRects()).forEach(function (rect) {
      if (rect.width <= 0 && rect.height <= 0) return;
      var absoluteLeft = content.scrollLeft + rect.left - contentRect.left;
      var firstPage = Math.max(0, Math.floor((absoluteLeft + 1) / pageWidth()));
      var lastPage = Math.max(
        firstPage,
        Math.floor((absoluteLeft + Math.max(1, rect.width) - 1) / pageWidth())
      );
      for (var page = firstPage; page <= lastPage; page += 1) occupied[page] = true;
    });
    return Object.keys(occupied).map(Number).sort(function (left, right) {
      return left - right;
    });
  }

  function glossaryExcludedElement(element, includeGlossaryTerms) {
    if (!element) return false;
    if (!includeGlossaryTerms && element.closest(".glossary-term")) return true;
    return Boolean(element.closest(
      "h1, h2, h3, h4, h5, h6, .glossary-popup, " +
      ".activity-text, [data-activity-item], .quiz-panel, .quiz-explanation-bank, " +
      "script, style, [aria-hidden=\"true\"]"
    ));
  }

  function glossaryForms(entry) {
    return [entry && entry.word].concat(entry && entry.variations || [])
      .filter(Boolean)
      .map(function (value) { return String(value).toLocaleLowerCase("es"); });
  }

  function glossaryEntryMatchesText(entry, text) {
    var haystack = String(text || "").toLocaleLowerCase("es");
    return glossaryForms(entry).some(function (form) {
      return haystack.indexOf(form) >= 0;
    });
  }

  function textNodesForVisualPage(pageIndex, includeGlossaryTerms) {
    if (!content) return [];
    var nodes = [];
    var pageCache = new WeakMap();
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (
          !parent ||
          glossaryExcludedElement(parent, includeGlossaryTerms) ||
          !node.textContent.trim()
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        var pages = pageCache.get(parent);
        if (!pages) {
          pages = pagesForElement(parent);
          pageCache.set(parent, pages);
        }
        return pages.indexOf(pageIndex) >= 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });
    var node = walker.nextNode();
    while (node) {
      nodes.push(node);
      node = walker.nextNode();
    }
    return nodes;
  }

  function textForVisualPage(pageIndex) {
    /* The page glossary must also read text already wrapped by the visual
       highlighter. Highlight creation itself keeps those nodes excluded to
       prevent nested glossary spans. */
    return textNodesForVisualPage(pageIndex, true).map(function (node) {
      return node.textContent;
    }).join(" ");
  }

  function escapeGlossaryPattern(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function clearReflowGlossaryHighlights() {
    window.cancelAnimationFrame(state.glossaryHighlightFrame);
    state.glossaryHighlightFrame = 0;
    if (!content) return;
    var parents = new Set();
    var highlights = content.querySelectorAll(".glossary-term[data-glossary-key]");
    state.glossaryHighlightedPage = -1;
    state.glossaryHighlightedLayoutRevision = -1;
    state.glossaryHighlightedCount = 0;
    if (!highlights.length) return;
    var focusedHighlight = document.activeElement && document.activeElement.closest &&
      document.activeElement.closest(".glossary-term[data-glossary-key]");
    if (focusedHighlight && content.contains(focusedHighlight)) {
      var focusedKey = focusedHighlight.getAttribute("data-glossary-key") || "";
      var focusedMatches = Array.prototype.slice.call(highlights).filter(function (term) {
        return term.getAttribute("data-glossary-key") === focusedKey;
      });
      state.glossaryHighlightFocusKey = focusedKey;
      state.glossaryHighlightFocusText = String(focusedHighlight.textContent || "");
      state.glossaryHighlightFocusOrdinal = Math.max(0, focusedMatches.indexOf(focusedHighlight));
      state.glossaryHighlightFocusPage = visiblePageIndex();
      state.glossaryHighlightFocusUntil = Date.now() + 1600;
    }
    state.glossaryMarkupIgnoreUntil = Date.now() + 600;
    Array.prototype.slice.call(highlights).forEach(function (highlight) {
      var parent = highlight.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(highlight.textContent || ""), highlight);
      parents.add(parent);
    });
    parents.forEach(function (parent) { parent.normalize(); });
  }

  function highlightGlossaryOnVisualPage() {
    if (!state.glossaryHighlightEnabled || !state.glossaryEntries || !content) {
      clearReflowGlossaryHighlights();
      return;
    }
    var pageIndex = visiblePageIndex();
    var existingHighlightCount = content.querySelectorAll(
      ".glossary-term[data-glossary-key]"
    ).length;
    if (
      state.glossaryHighlightedPage === pageIndex &&
      state.glossaryHighlightedLayoutRevision === state.ttsLayoutRevision &&
      state.glossaryHighlightedCount === existingHighlightCount
    ) return;

    clearReflowGlossaryHighlights();
    if (state.total <= 1 && sections.length > 1) {
      /* The glossary runtime can mount before column pagination is ready.
         Highlighting in that transient 1 / 1 state would wrap terms from the
         entire book, block the UI and later destroy the focused term. */
      window.clearTimeout(state.glossaryPaginationWaitTimer);
      state.glossaryPaginationWaitTimer = window.setTimeout(function () {
        state.glossaryPaginationWaitTimer = 0;
        if (state.glossaryHighlightEnabled) scheduleGlossaryPageHighlight();
      }, 240);
      return;
    }

    var textNodes = textNodesForVisualPage(pageIndex);
    var pageText = textNodes.map(function (node) { return node.textContent; }).join(" ");
    var formOwners = new Map();

    Object.keys(state.glossaryEntries).forEach(function (termKey) {
      var entry = state.glossaryEntries[termKey] || {};
      var searchableEntry = { word: termKey, variations: entry.variations || [] };
      if (!glossaryEntryMatchesText(searchableEntry, pageText)) return;
      glossaryForms(searchableEntry).forEach(function (form) {
        var normalized = form.trim();
        if (normalized && !formOwners.has(normalized)) formOwners.set(normalized, termKey);
      });
    });

    var forms = Array.from(formOwners.keys()).sort(function (left, right) {
      return right.length - left.length;
    });
    if (!forms.length) {
      state.glossaryHighlightedPage = pageIndex;
      state.glossaryHighlightedLayoutRevision = state.ttsLayoutRevision;
      state.glossaryHighlightedCount = 0;
      return;
    }

    var matcher = new RegExp(
      "(?<![\\p{L}\\p{N}\\p{M}_])(?:" +
        forms.map(escapeGlossaryPattern).join("|") +
        ")(?![\\p{L}\\p{N}\\p{M}_])",
      "giu"
    );
    state.glossaryMarkupIgnoreUntil = Date.now() + 600;

    textNodes.forEach(function (textNode) {
      if (!textNode.parentNode) return;
      var source = textNode.textContent || "";
      var fragment = document.createDocumentFragment();
      var cursor = 0;
      var matched = false;
      matcher.lastIndex = 0;
      var match = matcher.exec(source);
      while (match) {
        matched = true;
        if (match.index > cursor) fragment.appendChild(
          document.createTextNode(source.slice(cursor, match.index))
        );
        var highlight = document.createElement("span");
        /* Match the stock glossary presentation while keeping the page-scoped
           implementation that avoids the full-book highlighting freeze. */
        highlight.className =
          "glossary-term bg-emerald-100/80 text-emerald-800 rounded cursor-pointer";
        highlight.setAttribute("role", "button");
        highlight.setAttribute("tabindex", "0");
        highlight.setAttribute("aria-haspopup", "dialog");
        highlight.dataset.glossaryKey = formOwners.get(
          match[0].toLocaleLowerCase("es")
        );
        highlight.textContent = match[0];
        fragment.appendChild(highlight);
        cursor = match.index + match[0].length;
        match = matcher.exec(source);
      }
      if (!matched) return;
      if (cursor < source.length) fragment.appendChild(document.createTextNode(source.slice(cursor)));
      textNode.parentNode.replaceChild(fragment, textNode);
    });

    if (
      state.glossaryHighlightFocusKey &&
      state.glossaryHighlightFocusPage === visiblePageIndex() &&
      Date.now() <= state.glossaryHighlightFocusUntil
    ) {
      var focusCandidates = Array.prototype.slice.call(content.querySelectorAll(
        '.glossary-term[data-glossary-key="' +
          CSS.escape(state.glossaryHighlightFocusKey) + '"]'
      ));
      var exactFocusCandidates = focusCandidates.filter(function (term) {
        return String(term.textContent || "") === state.glossaryHighlightFocusText;
      });
      var focusMatches = exactFocusCandidates.length ? exactFocusCandidates : focusCandidates;
      var replacementFocus = focusMatches[
        Math.min(state.glossaryHighlightFocusOrdinal, Math.max(0, focusMatches.length - 1))
      ];
      if (replacementFocus) {
        try {
          replacementFocus.focus({ preventScroll: true });
        } catch (_error) {
          replacementFocus.focus();
        }
      }
    }
    state.glossaryHighlightFocusKey = "";
    state.glossaryHighlightFocusText = "";
    state.glossaryHighlightFocusOrdinal = 0;
    state.glossaryHighlightFocusPage = null;
    state.glossaryHighlightFocusUntil = 0;
    state.glossaryHighlightedPage = pageIndex;
    state.glossaryHighlightedLayoutRevision = state.ttsLayoutRevision;
    state.glossaryHighlightedCount = content.querySelectorAll(
      ".glossary-term[data-glossary-key]"
    ).length;
  }

  function scheduleGlossaryPageHighlight() {
    window.cancelAnimationFrame(state.glossaryHighlightFrame);
    state.glossaryHighlightFrame = window.requestAnimationFrame(function () {
      state.glossaryHighlightFrame = window.requestAnimationFrame(function () {
        state.glossaryHighlightFrame = 0;
        highlightGlossaryOnVisualPage();
      });
    });
  }

  function installReflowGlossaryBridge() {
    window.__adtReflowSetGlossaryHighlight = function (enabled, entries) {
      var generation = ++state.glossaryHighlightGeneration;
      state.glossaryHighlightEnabled = Boolean(enabled);
      state.glossaryEntries = entries || null;
      if (state.glossaryHighlightEnabled) scheduleGlossaryPageHighlight();
      else clearReflowGlossaryHighlights();
      return function () {
        if (generation !== state.glossaryHighlightGeneration) return;
        state.glossaryHighlightEnabled = false;
        state.glossaryEntries = null;
        clearReflowGlossaryHighlights();
      };
    };

    window.__adtReflowGlossaryEntriesForCurrentPage = function (entries, filter) {
      var pageText = textForVisualPage(visiblePageIndex());
      var query = String(filter || "").trim().toLocaleLowerCase("es");
      return (entries || []).filter(function (entry) {
        if (!glossaryEntryMatchesText(entry, pageText)) return false;
        if (!query) return true;
        return [entry.word, entry.definition].concat(entry.variations || []).some(function (value) {
          return String(value || "").toLocaleLowerCase("es").indexOf(query) >= 0;
        });
      });
    };

    window.__adtReflowLocateGlossaryTerm = function (entry) {
      if (!entry || !content) return false;
      var forms = glossaryForms(entry);
      var candidates = Array.prototype.slice.call(content.querySelectorAll(
      ".glossary-term[data-glossary-key]"
      )).filter(function (element) {
        return !glossaryExcludedElement(element, true) &&
          glossaryEntryMatchesText(entry, element.textContent);
      });

      if (!candidates.length) {
        var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            var parent = node.parentElement;
            if (!parent || glossaryExcludedElement(parent)) return NodeFilter.FILTER_REJECT;
            var text = String(node.textContent || "").toLocaleLowerCase("es");
            return forms.some(function (form) { return text.indexOf(form) >= 0; })
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          }
        });
        var textNode = walker.nextNode();
        while (textNode) {
          candidates.push(textNode.parentElement);
          textNode = walker.nextNode();
        }
      }

      if (!candidates.length) return false;
      var currentPage = visiblePageIndex();
      var target = candidates.find(function (element) {
        return pagesForElement(element).indexOf(currentPage) >= 0;
      }) || candidates[0];
      var targetPages = pagesForElement(target);
      if (!targetPages.length) return false;
      var targetPage = targetPages[0];
      var targetAnchor = target.closest("[data-id]");
      if (targetAnchor && targetAnchor.dataset.id) state.currentAnchorId = targetAnchor.dataset.id;
      clearExplicitPageLock();
      goToPage(targetPage, { announce: true });
      /* Closing the React popover restores focus one frame later. Some
         browsers then scroll back to the column that owned the old focus.
         Reconcile once after teardown, but only if the target was displaced. */
      window.setTimeout(function () {
        if (visiblePageIndex() !== targetPage) {
          goToPage(targetPage, { announce: false, preserveHash: true });
        }
      }, 140);
      target.classList.add("reflow-glossary-target");
      window.setTimeout(function () {
        target.classList.remove("reflow-glossary-target");
      }, 2800);
      return true;
    };
  }

  function installGlossaryDefinitionFocusManagement() {
    if (document.documentElement.dataset.reflowGlossaryFocus === "true") return;
    document.documentElement.dataset.reflowGlossaryFocus = "true";

    function isDefinitionDialog(dialog) {
      if (!dialog || !dialog.matches || !dialog.matches('[role="dialog"]')) return false;
      if (/^definition for\b/i.test(dialog.getAttribute("aria-label") || "")) return true;
      return Array.prototype.slice.call(dialog.querySelectorAll("button")).some(function (button) {
        return /^ver en glosario$/i.test(String(button.textContent || "").trim());
      });
    }

    function definitionDialogWithin(node) {
      if (!node || node.nodeType !== 1) return null;
      if (isDefinitionDialog(node)) return node;
      return Array.prototype.slice.call(node.querySelectorAll('[role="dialog"]')).find(
        isDefinitionDialog
      ) || null;
    }

    function glossaryTermsForKey(key) {
      return Array.prototype.slice.call(
        content.querySelectorAll(".glossary-term[data-glossary-key]")
      ).filter(function (term) {
        return term.getAttribute("data-glossary-key") === key;
      });
    }

    function rememberGlossaryOrigin(term) {
      window.clearTimeout(state.glossaryFocusRestoreTimer);
      var key = term.getAttribute("data-glossary-key") || "";
      var sameKey = glossaryTermsForKey(key);
      state.glossaryFocusOrigin = term;
      state.glossaryFocusKey = key;
      state.glossaryFocusText = String(term.textContent || "");
      state.glossaryFocusPage = visiblePageIndex();
      state.glossaryFocusOrdinal = Math.max(0, sameKey.indexOf(term));
      state.glossaryFocusSuppressUntil = 0;
      document.documentElement.dataset.reflowGlossaryFocusOrigin = key;
    }

    function clearGlossaryOrigin() {
      state.glossaryFocusOrigin = null;
      state.glossaryFocusKey = "";
      state.glossaryFocusText = "";
      state.glossaryFocusPage = null;
      state.glossaryFocusOrdinal = 0;
    }

    function glossaryFocusTarget() {
      var samePage = state.glossaryFocusPage === visiblePageIndex();
      if (
        samePage && state.glossaryFocusOrigin && state.glossaryFocusOrigin.isConnected &&
        state.glossaryFocusOrigin.getClientRects().length
      ) return state.glossaryFocusOrigin;

      if (samePage && state.glossaryFocusKey) {
        /* Closing a definition can make the page highlighter rebuild every
           glossary span. At that point its column geometry may still be
           settling, so identify the replacement by its stable key/text and
           ordinal instead of rejecting it because of a transient page value. */
        var candidates = glossaryTermsForKey(state.glossaryFocusKey);
        var exactText = candidates.filter(function (term) {
          return String(term.textContent || "") === state.glossaryFocusText;
        });
        var matching = exactText.length ? exactText : candidates;
        if (matching.length) {
          return matching[Math.min(state.glossaryFocusOrdinal, matching.length - 1)];
        }
      }
      return document.getElementById("reflow-tools");
    }

    function scheduleGlossaryOriginRestore() {
      window.clearTimeout(state.glossaryFocusRestoreTimer);
      document.documentElement.dataset.reflowGlossaryFocusRestore = "scheduled";
      state.glossaryFocusRestoreTimer = window.setTimeout(function () {
        state.glossaryFocusRestoreTimer = 0;
        if (
          state.glossaryDefinitionDialog &&
          isDefinitionDialog(state.glossaryDefinitionDialog) &&
          state.glossaryDefinitionDialog.getClientRects().length
        ) return;
        if (Date.now() <= state.glossaryFocusSuppressUntil) {
          document.documentElement.dataset.reflowGlossaryFocusRestore = "suppressed";
          clearGlossaryOrigin();
          return;
        }
        var restoreKey = state.glossaryFocusKey;
        function restoreAttempt(finalAttempt) {
          if (!restoreKey || state.glossaryFocusKey !== restoreKey) return;
          if (visibleDefinitionDialog()) return;
          if (Date.now() <= state.glossaryFocusSuppressUntil) {
            clearGlossaryOrigin();
            return;
          }
          var target = glossaryFocusTarget();
          if (target && target.isConnected) {
            try {
              target.focus({ preventScroll: true });
            } catch (_error) {
              target.focus();
            }
            document.documentElement.dataset.reflowGlossaryFocusRestore =
              target.getAttribute("data-glossary-key") || target.id || "fallback";
          }
          if (finalAttempt) clearGlossaryOrigin();
        }
        /* The dialog library performs its own focus cleanup after closing.
           Repeat the restoration after those deferred effects, retaining the
           exact term identity until the final attempt. */
        restoreAttempt(false);
        window.setTimeout(function () { restoreAttempt(false); }, 120);
        window.setTimeout(function () { restoreAttempt(false); }, 600);
        window.setTimeout(function () { restoreAttempt(false); }, 1200);
        window.setTimeout(function () { restoreAttempt(true); }, 1800);
      }, 240);
    }

    function visibleDefinitionDialog() {
      return Array.prototype.slice.call(document.querySelectorAll('[role="dialog"]')).find(
        function (dialog) {
          return isDefinitionDialog(dialog) && dialog.getClientRects().length;
        }
      ) || null;
    }

    function verifyGlossaryDefinitionClosed() {
      window.setTimeout(function () {
        var liveDialog = visibleDefinitionDialog();
        state.glossaryDefinitionDialog = liveDialog;
        if (!liveDialog) scheduleGlossaryOriginRestore();
      }, 160);
    }
    window.__adtReflowGlossaryDefinitionClosed = function () {
      document.documentElement.dataset.reflowGlossaryCloseSignal = "received";
      verifyGlossaryDefinitionClosed();
    };

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var term = target.closest(".glossary-term[data-glossary-key]");
      if (term && content.contains(term)) {
        rememberGlossaryOrigin(term);
        return;
      }

      var dialog = state.glossaryDefinitionDialog;
      if (!dialog || !dialog.isConnected) return;
      var viewInGlossary = target.closest("button");
      if (
        viewInGlossary && dialog.contains(viewInGlossary) &&
        /^ver en glosario$/i.test(String(viewInGlossary.textContent || "").trim())
      ) {
        state.glossaryFocusSuppressUntil = Date.now() + 1600;
        return;
      }
      if (!dialog.contains(target) && target.closest(
        "a[href], button, input, select, textarea, [contenteditable='true'], " +
        "[role='button'], [role='link'], [role='tab']"
      )) {
        state.glossaryFocusSuppressUntil = Date.now() + 800;
      }
      if (!dialog.contains(target)) verifyGlossaryDefinitionClosed();
    }, true);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        var activeDialog = event.target && event.target.closest &&
          event.target.closest('[role="dialog"]');
        if (isDefinitionDialog(activeDialog)) {
          state.glossaryDefinitionDialog = activeDialog;
          verifyGlossaryDefinitionClosed();
        }
      }
      var term = event.target && event.target.closest &&
        event.target.closest(".glossary-term[data-glossary-key]");
      if (!term || !content.contains(term)) return;
      if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      term.click();
    }, true);

    document.addEventListener("focusin", function (event) {
      var dialog = event.target && event.target.closest && event.target.closest('[role="dialog"]');
      if (isDefinitionDialog(dialog)) {
        state.glossaryDefinitionDialog = dialog;
        document.documentElement.dataset.reflowGlossaryDialogTracked = "true";
      }
    }, true);

    var observer = new MutationObserver(function (mutations) {
      var removedActiveDialog = false;
      var addedDialog = null;
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
          if (
            mutation.target === state.glossaryDefinitionDialog &&
            !isDefinitionDialog(mutation.target)
          ) removedActiveDialog = true;
          var attributedDialog = definitionDialogWithin(mutation.target);
          if (attributedDialog) addedDialog = attributedDialog;
          return;
        }
        Array.prototype.slice.call(mutation.removedNodes).forEach(function (node) {
          if (
            state.glossaryDefinitionDialog &&
            (node === state.glossaryDefinitionDialog ||
              (node.contains && node.contains(state.glossaryDefinitionDialog)))
          ) removedActiveDialog = true;
        });
        Array.prototype.slice.call(mutation.addedNodes).some(function (node) {
          addedDialog = definitionDialogWithin(node);
          return Boolean(addedDialog);
        });
      });

      if (addedDialog) state.glossaryDefinitionDialog = addedDialog;
      if (removedActiveDialog && !addedDialog) {
        var replacement = Array.prototype.slice.call(
          document.querySelectorAll('[role="dialog"]')
        ).find(isDefinitionDialog);
        state.glossaryDefinitionDialog = replacement || null;
        if (!replacement) scheduleGlossaryOriginRestore();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role", "aria-label"]
    });
  }

  function elementOccupiesPage(element, page) {
    return pagesForElement(element).indexOf(page) >= 0;
  }

  function updateQuizPageBackground() {
    /* Intermediate columns can briefly point at a different quiz while a
       settings reflow settles. Never let that transient state repaint the
       reader behind the frozen quiz that the reader was actually viewing. */
    if (state.quizRepaginationOverlay) {
      document.body.classList.remove("reflow-quiz-page");
      return;
    }
    var active = Array.prototype.slice.call(
      content.querySelectorAll(".quiz-panel")
    ).some(function (panel) {
      return elementOccupiesPage(panel, state.current);
    });
    document.body.classList.toggle("reflow-quiz-page", active);
  }

  function updateBackMatterPageBackground() {
    var active = Array.prototype.slice.call(content.querySelectorAll(
      ".reflow-back-cover-page, .reflow-collaborators-page"
    )).some(function (page) {
      return elementOccupiesPage(page, state.current);
    });
    document.body.classList.toggle("reflow-back-matter-page", active);
  }

  function ttsPlaybackIsRunning() {
    var api = window.__adtReflowAudio;
    return Boolean(
      (api && api.isPlaying) ||
      document.querySelector('button[aria-label="Pausa"], button[aria-label="Pause"]') ||
      (state.ttsAudio && !state.ttsAudio.paused && !state.ttsAudio.ended)
    );
  }

  var readAloudEnabledSelector = [
    'button[aria-label="Desactivar texto a voz"]',
    'button[aria-label="Desactivar lectura en voz alta"]'
  ].join(",");
  var readAloudDisabledSelector = [
    'button[aria-label="Activar texto a voz"]',
    'button[aria-label="Activar lectura en voz alta"]'
  ].join(",");

  function readAloudSettingIsEnabled() {
    if (document.querySelector(readAloudEnabledSelector)) return true;
    if (document.querySelector(readAloudDisabledSelector)) return false;
    var labelledSwitch = Array.prototype.slice.call(
      document.querySelectorAll('[role="switch"][aria-checked]')
    ).find(function (control) {
      var labelledBy = control.getAttribute("aria-labelledby");
      var label = labelledBy && document.getElementById(labelledBy);
      return label && /lectura en voz alta/i.test(label.textContent || "");
    });
    if (labelledSwitch) return labelledSwitch.getAttribute("aria-checked") === "true";
    /* React briefly unmounts the dock while repaginating. Preserve the last
       confirmed session state during that gap instead of hiding and showing
       the player repeatedly. */
    return state.ttsPlayerVisible;
  }

  function clearTtsAlignmentState() {
    window.clearTimeout(state.ttsTimer);
    window.clearTimeout(state.ttsNavigationUnlockTimer);
    state.ttsAligning = false;
    state.ttsDesiredPage = null;
    state.ttsSeeking = false;
    state.ttsResumeAfterSeek = false;
    state.ttsNavigationLockPage = null;
    state.ttsNavigationLockUntil = 0;
    if (state.ttsAudio) state.ttsAudio.muted = false;
  }

  function activeTtsNavigationLockPage() {
    if (
      state.ttsNavigationLockPage === null ||
      Date.now() > state.ttsNavigationLockUntil
    ) {
      state.ttsNavigationLockPage = null;
      state.ttsNavigationLockUntil = 0;
      return null;
    }
    return state.ttsNavigationLockPage;
  }

  function lockTtsToExplicitNavigation(page) {
    window.clearTimeout(state.ttsNavigationUnlockTimer);
    state.ttsNavigationLockPage = page;
    state.ttsNavigationLockUntil = Date.now() + 2200;
    state.ttsNavigationUnlockTimer = window.setTimeout(function () {
      state.ttsNavigationLockPage = null;
      state.ttsNavigationLockUntil = 0;
    }, 2200);
  }

  function releaseTtsNavigationLockSoon(page) {
    window.clearTimeout(state.ttsNavigationUnlockTimer);
    state.ttsNavigationUnlockTimer = window.setTimeout(function () {
      if (state.ttsNavigationLockPage !== page) return;
      state.ttsNavigationLockPage = null;
      state.ttsNavigationLockUntil = 0;
    }, 400);
  }

  /* A page change while paused must not call playAtIndex(), even muted. Park
     the old track so the next explicit Play starts from the currently visible
     page through the runtime's target-index adapter. Read-aloud stays enabled. */
  function parkPausedTtsForNavigation() {
    clearTtsAlignmentState();
    stopQuizFeedbackAudio();
    var api = window.__adtReflowAudio;
    if (api && api.stop) {
      api.stop();
    } else if (state.ttsAudio) {
      state.ttsAudio.pause();
      state.ttsAudio.removeAttribute("src");
      state.ttsAudio.load();
    }
    state.ttsCurrentItemIndex = -1;
  }

  function startTtsFromSettings(attempts) {
    window.clearTimeout(state.ttsActivationTimer);
    var remaining = typeof attempts === "number" ? attempts : 40;
    var enabled = readAloudSettingIsEnabled();
    var api = window.__adtReflowAudio;
    if (!enabled || !api || !api.play) {
      if (remaining > 0) {
        state.ttsActivationTimer = window.setTimeout(function () {
          startTtsFromSettings(remaining - 1);
        }, 50);
      }
      return;
    }
    state.ttsManuallyPaused = false;
    state.ttsResumeAfterSeek = true;
    if (!ttsPlaybackIsRunning()) {
      /* Starting from Settings must use the currently visible visual page.
         Resuming the runtime's former item can otherwise pull the reader back
         to a stale page after the explicit-navigation lock expires. */
      lockTtsToExplicitNavigation(state.current);
      scheduleTtsAlignment(state.current, true);
    }
  }

  function startTtsFromUserGesture() {
    state.ttsExplicitlyStarted = true;
    var api = window.__adtReflowAudio;
    if (!api || !api.items || !api.playAtIndex) {
      startTtsFromSettings();
      return;
    }
    state.ttsManuallyPaused = false;
    state.ttsResumeAfterSeek = true;
    lockTtsToExplicitNavigation(state.current);
    /* Chrome grants unmuted playback only while the activating click is still
       on the stack. Start the selected item now; alignment cleanup may remain
       asynchronous after play() has already received that authorization. */
    scheduleTtsAlignment(state.current, true, true);
  }

  function activateTtsFromSettings() {
    window.clearTimeout(state.ttsActivationTimer);
    clearTtsAlignmentState();
    state.ttsPlayerStopPendingUntil = 0;
    state.ttsManuallyPaused = true;
    state.ttsResumeAfterSeek = false;
    state.ttsExplicitlyStarted = false;
    var api = window.__adtReflowAudio;
    if (api && api.pause) api.pause();
    if (announcer) {
      announcer.textContent =
        "Lectura en voz alta activada. Pulse Reproducir para comenzar.";
    }
    requestAnimationFrame(syncPrimaryToolbar);
    window.setTimeout(syncPrimaryToolbar, 160);
  }

  function stopTtsFromSettings() {
    window.clearTimeout(state.ttsActivationTimer);
    clearTtsAlignmentState();
    stopQuizFeedbackAudio();
    var api = window.__adtReflowAudio;
    if (api && api.stop) {
      api.stop();
    } else if (state.ttsAudio) {
      state.ttsAudio.pause();
      state.ttsAudio.removeAttribute("src");
      state.ttsAudio.load();
    }
    state.ttsManuallyPaused = false;
    state.ttsExplicitlyStarted = false;
    state.ttsCurrentItemIndex = -1;
    window.setTimeout(clearTtsRangeHighlight, 0);
  }

  function syncReadAloudSetting(enabled) {
    if (window.__adtReflowSetReadAloud) {
      window.__adtReflowSetReadAloud(Boolean(enabled));
    }
  }

  function updateControls(announce) {
    previousButton.disabled = state.current <= 0;
    nextButton.disabled = state.current >= state.total - 1;
    currentOutput.textContent = String(state.current + 1);
    totalOutput.textContent = String(state.total);
    currentOutput.parentElement.setAttribute(
      "aria-label",
      "Página " + (state.current + 1) + " de " + state.total
    );
    syncPrimaryToolbar();
    updateQuizPageBackground();
    updateBackMatterPageBackground();
    if (state.runtimeMenuRefresh) state.runtimeMenuRefresh();
    if (state.glossaryHighlightEnabled) scheduleGlossaryPageHighlight();

    if (announce) {
      announcer.textContent = "Página " + (state.current + 1) + " de " + state.total;
    }
  }

  function saveProgress() {
    try {
      var ratio = state.total > 1 ? state.current / (state.total - 1) : 0;
      localStorage.setItem(progressStorageKey, String(ratio));
    } catch (_error) {
      // Storage is optional in offline and private browsing contexts.
    }
  }

  function clearExplicitPageLock() {
    window.clearTimeout(state.explicitPageLockTimer);
    state.explicitPageLockPage = null;
    state.explicitPageLockUntil = 0;
  }

  function goToPage(page, options) {
    var settings = options || {};
    var nextPage = Math.max(0, Math.min(state.total - 1, Math.round(page)));
    if (settings.fromTts && ttsPlaybackIsRunning()) {
      clearExplicitPageLock();
    }
    if (settings.explicit) {
      /* A deliberate page command supersedes any typography/easy-read
         restoration still waiting for the full-book layout to settle. */
      clearPendingSettingsAnchor();
      /* The initial hash is only a loading destination. Once the reader uses
         a page control it must stop participating in late font/image layout
         reconciliations, otherwise the scheduled startup passes can return
         the book to the first column of that source section. */
      state.initialHashSectionId = null;
      window.clearTimeout(state.explicitPageLockTimer);
      state.explicitPageLockPage = nextPage;
      /* Keep this lock until a different semantic command (settings, TOC,
         glossary or TTS) explicitly supersedes it. Resize/Mutation observers
         can legitimately settle several seconds after a large chat is first
         painted, so a time-only guard still allowed a late bounce. */
      state.explicitPageLockUntil = Number.POSITIVE_INFINITY;
    } else if (
      !(settings.fromTts && ttsPlaybackIsRunning()) &&
      state.explicitPageLockPage !== null &&
      Date.now() <= state.explicitPageLockUntil
    ) {
      /* Layout observers can finish an earlier anchor restoration after a
         reader has already pressed Previous/Next. During this short commit
         window, the explicit visual-page command is authoritative. */
      nextPage = Math.max(0, Math.min(state.total - 1, state.explicitPageLockPage));
    }
    var previousPage = state.current;
    /* A panel interaction briefly locks the visual column while its floating
       dialog is mounted. That lock must never survive a deliberate page
       command: on the reconstructed WhatsApp spread it could otherwise run
       after scrollLeft changed and restore the page the reader was leaving. */
    if (nextPage !== previousPage) {
      window.clearTimeout(state.panelToggleRestoreTimer);
      state.panelToggleLockPage = null;
      state.panelToggleLockUntil = 0;
    }
    /* The quiz clone protects only a typography-driven repagination. If an
       explicit page control is pressed while a stale guard exists, remove it
       before scrolling; otherwise the previous quiz masks the new one until
       the fallback timeout expires. */
    if (
      nextPage !== previousPage &&
      state.quizRepaginationOverlay &&
      settings.announce !== false &&
      !settings.instant
    ) {
      finishQuizRepaginationGuard();
    }
    state.current = nextPage;
    if (
      nextPage !== previousPage &&
      !settings.preserveHash &&
      window.location.hash &&
      history.replaceState
    ) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    var nextLeft = nextPage * pageWidth();
    /* The scroll listener derives the current page from scrollLeft. A smooth
       transition reports intermediate columns and can overwrite state.current
       before the next explicit navigation click (especially after uppercase
       and Easy Read repaginate the book). Keep every page change atomic; the
       reader's page controls are discrete, not a continuous scroll gesture. */
    var ttsIsActive = readAloudSettingIsEnabled();
    if (nextPage !== previousPage && !settings.fromTts && ttsIsActive) {
      /* An explicit visual-page change invalidates the former semantic audio
         cursor immediately. The target playback installs its new index. */
      state.ttsCurrentItemIndex = -1;
      lockTtsToExplicitNavigation(nextPage);
    }
    var inheritedScrollBehavior = content.style.scrollBehavior;
    content.style.scrollBehavior = "auto";
    content.scrollLeft = nextLeft;
    content.style.scrollBehavior = inheritedScrollBehavior;
    var paintedAnchorId = paintedSemanticAnchorId();
    state.currentAnchorId = paintedAnchorId || state.currentAnchorId;
    if (settings.explicit && state.settingsRepaginationActive && paintedAnchorId) {
      state.settingsRepaginationAnchorId = paintedAnchorId;
      rememberSettingsAnchor(paintedAnchorId);
    }
    updateControls(settings.announce !== false);
    saveProgress();
    if (
      nextPage !== previousPage &&
      !settings.fromTts &&
      readAloudSettingIsEnabled()
    ) {
      if (state.ttsManuallyPaused) {
        /* Enabled-but-idle TTS can still retain a stale active element. Clear
           it before observers run, otherwise that old element becomes an
           anchor and silently returns the reader to the former page. */
        parkPausedTtsForNavigation();
      } else if (ttsPlaybackIsRunning()) {
        /* An already-running narration follows the explicit page change. */
        scheduleTtsAlignment(nextPage, false);
      } else if (
        state.ttsExplicitlyStarted &&
        window.__adtReflowGetAutoplay &&
        window.__adtReflowGetAutoplay()
      ) {
        /* Autoplay applies only while Read Aloud is enabled and idle. A manual
           pause always wins and is handled by the first branch above. */
        scheduleTtsAlignment(nextPage, true);
      } else {
        parkPausedTtsForNavigation();
      }
    }
  }

  function pageForElement(element) {
    var pages = pagesForElement(element);
    return pages.length ? pages[0] : 0;
  }

  function captureTtsPageMap(items, force) {
    if (!items || !items.length) return;
    if (
      !force &&
      state.ttsPageMapRevision === state.ttsLayoutRevision &&
      state.ttsPageItemCount === items.length
    ) {
      return;
    }
    var pageMap = new WeakMap();
    items.forEach(function (item) {
      var geometryElement = item && paginationGeometryElement(item.el);
      if (!item || !item.el || !geometryElement || !geometryElement.getClientRects().length) return;
      pageMap.set(item.el, pageForElement(item.el));
    });
    state.ttsPageMap = pageMap;
    state.ttsPageMapRevision = state.ttsLayoutRevision;
    state.ttsPageItemCount = items.length;
  }

  function stablePageForTtsElement(element) {
    if (!element) return 0;
    var stablePage = state.ttsPageMap.get(element);
    return Number.isFinite(stablePage) ? stablePage : pageForElement(element);
  }

  /* Font-size and easy-read changes can repaginate content while the audio
     queue keeps the same element references. Prefer live column geometry at
     playback time and retain the captured map only as a hidden-item fallback. */
  function livePageForTtsElement(element) {
    if (!element) return 0;
    var livePages = pagesForElement(element);
    /* A synchronized sentence may legitimately span two visual pages. Keep
       the user's current page whenever it is one of them; choosing the first
       fragment unconditionally makes Next appear to bounce backwards. */
    if (livePages.indexOf(state.current) >= 0) return state.current;
    return livePages.length ? livePages[0] : stablePageForTtsElement(element);
  }

  function anchorIdForPage(pageIndex) {
    var candidates = Array.prototype.slice.call(content.querySelectorAll(
      '.reading-sentence[data-id], .quiz-question[data-id], .quiz-option-text[data-id], ' +
      'h1[data-id], h2[data-id], img[data-id], [data-reflow-anchor-id]'
    ));
    for (var index = 0; index < candidates.length; index += 1) {
      var candidate = candidates[index];
      if (!candidate.getClientRects().length) continue;
      if (pageForElement(candidate) === pageIndex) {
        return candidate.dataset.reflowAnchorId || candidate.dataset.id || null;
      }
    }
    return null;
  }

  /* Typography changes alter the number and boundaries of visual pages. The
     old page number is therefore not a stable destination. Capture the
     semantic item nearest the vertical centre of the current viewport and
     relocate that exact item after repagination. */
  function visibleSemanticAnchorId() {
    if (!content) return null;
    var currentPage = visiblePageIndex();
    var contentRect = content.getBoundingClientRect();
    var centreY = contentRect.top + (contentRect.height / 2);
    var best = null;
    var bestScore = Infinity;
    var candidates = Array.prototype.slice.call(content.querySelectorAll(
      '.reading-sentence[data-id], .quiz-question[data-id], ' +
      '.quiz-option-text[data-id], h1[data-id], h2[data-id], img[data-id], ' +
      '[data-reflow-anchor-id]'
    ));

    candidates.forEach(function (candidate) {
      if (candidate.closest('[aria-hidden="true"], .quiz-explanation-bank')) return;
      var id = candidate.dataset.reflowAnchorId || candidate.dataset.id;
      if (!id || pagesForElement(candidate).indexOf(currentPage) < 0) return;
      Array.prototype.slice.call(candidate.getClientRects()).forEach(function (rect) {
        if (rect.width <= 1 || rect.height <= 1) return;
        var absoluteLeft = content.scrollLeft + rect.left - contentRect.left;
        var rectPage = Math.max(0, Math.floor((absoluteLeft + 1) / pageWidth()));
        if (rectPage !== currentPage) return;
        var score = Math.abs((rect.top + (rect.height / 2)) - centreY);
        if (score < bestScore) {
          best = id;
          bestScore = score;
        }
      });
    });
    return best || anchorIdForPage(currentPage);
  }

  function livePendingSettingsAnchorId() {
    if (
      !state.pendingSettingsAnchorId ||
      Date.now() > state.pendingSettingsAnchorUntil ||
      !content.querySelector('[data-id="' + state.pendingSettingsAnchorId + '"], ' +
        '[data-reflow-anchor-id="' + state.pendingSettingsAnchorId + '"]')
    ) return null;
    return state.pendingSettingsAnchorId;
  }

  function rememberSettingsAnchor(anchorId) {
    if (!anchorId) return;
    state.pendingSettingsAnchorId = anchorId;
    /* Easy Read replaces thousands of text nodes. On the complete book that
       transaction can legitimately outlive the former 2.4-second window,
       after which a late observer fell back to the obsolete page ratio and
       could land at the end of the book. Keep the semantic anchor alive for
       the whole settling period; an explicit page command cancels it. */
    state.pendingSettingsAnchorUntil = Date.now() + 8000;
    window.clearTimeout(state.pendingSettingsAnchorTimer);
    state.pendingSettingsAnchorTimer = window.setTimeout(function () {
      state.pendingSettingsAnchorId = null;
      state.pendingSettingsAnchorUntil = 0;
    }, 8000);
  }

  function clearPendingSettingsAnchor() {
    window.clearTimeout(state.pendingSettingsAnchorTimer);
    state.pendingSettingsAnchorTimer = 0;
    state.pendingSettingsAnchorId = null;
    state.pendingSettingsAnchorUntil = 0;
  }

  /* Easy Read replaces a large part of the semantic tree. Treat that work as
     one transaction: mutation and size observers may report many partial
     layouts, but only the final quiet layout is allowed to change the page
     count or relocate the reading anchor. */
  function beginSettingsRepagination(anchorId) {
    state.settingsRepaginationGeneration += 1;
    state.settingsRepaginationActive = true;
    state.settingsRepaginationFinalizing = false;
    state.settingsRepaginationAnchorId = anchorId || visibleSemanticAnchorId() ||
      state.currentAnchorId || anchorIdForPage(visiblePageIndex());
    state.settingsRepaginationIgnoreUntil = 0;
    if (document.body.classList.contains("reflow-back-matter-page")) {
      /* The multicolumn engine exposes intermediate columns while thousands
         of line boxes are rebuilt. On the black closing pages that used to
         reveal a WhatsApp card from elsewhere in the book for one frame.
         Hide the live columns against the already-black canvas until the
         final semantic anchor has been restored. */
      document.body.classList.add("reflow-backmatter-repaginating");
    }
    if (state.settingsRepaginationAnchorId) {
      rememberSettingsAnchor(state.settingsRepaginationAnchorId);
    }
    window.clearTimeout(state.mutationTimer);
    window.clearTimeout(state.layoutObserverTimer);
    scheduleSettingsRepaginationFinalize(280);
  }

  function scheduleSettingsRepaginationFinalize(delay) {
    if (!state.settingsRepaginationActive || state.settingsRepaginationFinalizing) return;
    var generation = state.settingsRepaginationGeneration;
    window.clearTimeout(state.settingsRepaginationTimer);
    state.settingsRepaginationTimer = window.setTimeout(function () {
      finalizeSettingsRepagination(generation);
    }, typeof delay === "number" ? delay : 280);
  }

  function finalizeSettingsRepagination(generation) {
    if (
      !state.settingsRepaginationActive ||
      state.settingsRepaginationFinalizing ||
      generation !== state.settingsRepaginationGeneration
    ) return;
    state.settingsRepaginationFinalizing = true;
    window.clearTimeout(state.mutationTimer);
    window.clearTimeout(state.layoutObserverTimer);
    var anchorId = state.settingsRepaginationAnchorId ||
      livePendingSettingsAnchorId() || state.currentAnchorId;

    updateEasyReadClass();
    normalizeLaterBookStructure();
    fitChapterFiveChat();
    settleAllIllustratedPages();
    repairParagraphMarkers();
    normalizeSemanticChainSpacing();
    updateReadingBlockSizing();
    balanceCoverMargins();

    /* If the reader deliberately changed pages while this repagination was
       settling, that command is newer than the settings anchor and must win.
       Clearing it here used to make the last page bounce back one column and
       could also produce very large TTS/navigation jumps. */
    var explicitPageAfterSettings = state.explicitPageLockPage;
    if (explicitPageAfterSettings === null) {
      clearExplicitPageLock();
      recalculate({
        anchorId: anchorId,
        preserveTts: readAloudSettingIsEnabled()
      });
    } else {
      recalculate({ preserveTts: true });
      goToPage(explicitPageAfterSettings, {
        announce: false,
        instant: true,
        preserveHash: true,
        explicit: true
      });
    }
    /* Recalculation can repack the horizontal columns after the preflight
       measurement above. Align the illustrated pairs once more against that
       final pagination geometry, especially after Easy Read replacements. */
    scheduleIllustratedSettlement();
    state.lastContentReflowAt = Date.now();
    /* The last illustrated-page measurement runs 650 ms after the main
       recalculation.  Keep observers quiet beyond that pass: otherwise the
       size change generated one more resize callback, which launched a new
       whole-book recalculation and could repeat indefinitely on the complete
       edition. */
    state.settingsRepaginationIgnoreUntil = Date.now() + 1200;
    state.settingsRepaginationActive = false;
    state.settingsRepaginationFinalizing = false;
    state.settingsRepaginationAnchorId = null;
    if (state.quizRepaginationOverlay) finishQuizRepaginationAfterPaint();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.remove("reflow-backmatter-repaginating");
      });
    });
  }

  function visiblePageForSection(sectionId) {
    var roots = Array.prototype.slice.call(content.querySelectorAll(
      '[data-section-id="' + sectionId + '"], ' +
      '[data-section-type="activity_quiz"][data-id="' + sectionId + '"]'
    ));
    var candidates = [];

    roots.forEach(function (root) {
      candidates.push.apply(candidates, Array.prototype.slice.call(root.querySelectorAll(
        "[data-id], h1, h2, h3, h4, p, li, img, .quiz-question, [data-activity-item]"
      )));
      candidates.push(root);
    });

    /* Some sentences are deliberately joined across their original section
       wrappers so they cannot be orphaned by column pagination. Their stable
       source marker is the authoritative way to find the real first page. */
    candidates.push.apply(candidates, Array.prototype.slice.call(content.querySelectorAll(
      '[data-source-section="' + sectionId + '"]'
    )));

    var firstPage = null;
    candidates.forEach(function (candidate) {
      if (!candidate || candidate.closest('[aria-hidden="true"], .quiz-explanation-bank')) return;
      var style = getComputedStyle(candidate);
      if (style.display === "none" || style.visibility === "hidden") return;
      var hasVisibleBox = Array.prototype.slice.call(candidate.getClientRects()).some(function (rect) {
        return rect.width > 1 && rect.height > 1;
      });
      if (!hasVisibleBox) return;
      pagesForElement(candidate).forEach(function (page) {
        firstPage = firstPage === null ? page : Math.min(firstPage, page);
      });
    });

    return firstPage;
  }

  function goToSection(sectionId, pushHistory) {
    clearExplicitPageLock();
    /* A TOC section can begin with continuation text from the previous
       heading. Its chapter_id is therefore a more precise destination than
       the section wrapper. Non-TOC links keep the visible section fallback. */
    var toc = window.__adtReflowTocEntries || [];
    var tocEntry = toc.find(function (entry) {
      return entry.section_id === sectionId;
    });
    var chapter = tocEntry && tocEntry.chapter_id
      ? content.querySelector('[data-id="' + tocEntry.chapter_id + '"]')
      : null;
    var chapterPages = chapter ? pagesForElement(chapter) : [];
    var destinationPage = chapterPages.length ? chapterPages[0] : visiblePageForSection(sectionId);
    if (destinationPage === null) return false;

    goToPage(destinationPage, {
      announce: true,
      instant: !pushHistory,
      preserveHash: true
    });
    if (pushHistory && history.pushState) {
      history.pushState(null, "", "#" + sectionId);
    }

    return true;
  }

  function recalculate(options) {
    var settings = options || {};
    var oldRatio = state.total > 1 ? state.current / (state.total - 1) : 0;
    fitChapterFiveChat();
    stabilizeSentencePagination();
    state.total = Math.max(1, Math.ceil((content.scrollWidth - 1) / pageWidth()));
    state.ttsLayoutRevision += 1;
    state.ttsPageMapRevision = -1;
    var audioApi = window.__adtReflowAudio;
    if (audioApi && audioApi.items) captureTtsPageMap(audioApi.items, true);

    if (settings.sectionId) {
      goToSection(settings.sectionId, false);
      return;
    }

    if (settings.anchorId) {
      var anchor = content.querySelector(
        '[data-id="' + settings.anchorId + '"], ' +
        '[data-reflow-anchor-id="' + settings.anchorId + '"]'
      );
      if (anchor && anchor.getClientRects().length) {
        goToPage(pageForElement(anchor), {
          instant: true,
          announce: false,
          preserveHash: true,
          fromTts: settings.preserveTts === true
        });
        return;
      }
    }

    if (settings.restore) {
      var stored = 0;
      try {
        stored = Number(localStorage.getItem(progressStorageKey)) || 0;
      } catch (_error) {
        stored = 0;
      }
      goToPage(stored * Math.max(0, state.total - 1), { instant: true, announce: false });
      return;
    }

    goToPage(oldRatio * Math.max(0, state.total - 1), {
      instant: true,
      announce: false,
      fromTts: settings.preserveTts === true
    });
  }

  /* A complete sentence should not begin at the foot of one visual page and
     continue at the top of the next. Keeping every sentence as an
     inline-block would introduce false line breaks throughout the book, so
     promote only the sentences that the current font size actually splits.
     The class is rebuilt on every repagination and therefore adapts to all
     three reading sizes without leaving stale breaks behind. */
  function stabilizeSentencePagination() {
    var sentences = Array.prototype.slice.call(content.querySelectorAll(
      ".reading-sentence[data-id]"
    )).filter(function (sentence) {
      if (sentence.closest(".whatsapp-chat-window, [aria-hidden='true']")) return false;
      var chain = sentence.closest(".sentence-chain");
      return !chain ||
        chain.classList.contains("sentence-chain-list-followup") ||
        sentence.dataset.id === "pg045_n0013";
    });
    /* Several observers may request a second repagination without changing
       the column geometry. Do not erase the sentence promotions calculated
       by the previous pass in that case: doing so made a sentence briefly
       correct and then split it again on the next identical reflow. A real
       size/Easy Read/viewport change produces a new key and starts clean. */
    var paginationKey = [
      state.fontSize,
      document.body.classList.contains("reflow-easy-read") ? "easy" : "full",
      content.clientWidth,
      content.clientHeight,
      sentences.length
    ].join(":");
    var geometryChanged = state.sentencePaginationKey !== paginationKey;
    state.sentencePaginationKey = paginationKey;
    sentences.forEach(function (sentence) {
      if (geometryChanged) sentence.classList.remove("reflow-avoid-page-split");
      sentence.classList.remove("reflow-keep-with-next");
    });
    var pageLimit = Math.max(1, content.clientHeight - 64);
    /* Promoting one split sentence can move every later sentence forward by
       a column and expose a new split that did not exist in the previous
       geometry. Two passes were therefore insufficient in Extra grande.
       Iterate until the layout converges, with a defensive ceiling for a
       pathological browser/font combination. */
    for (var pass = 0; pass < 12; pass += 1) {
      var contentRect = content.getBoundingClientRect();
      var currentScrollLeft = content.scrollLeft;
      var currentPageWidth = pageWidth();
      var toPromote = [];
      sentences.forEach(function (sentence) {
        if (sentence.classList.contains("reflow-avoid-page-split")) return;
        var rects = Array.prototype.slice.call(sentence.getClientRects());
        var firstOccupiedPage = null;
        var spansPages = rects.some(function (rect) {
          if (rect.width <= 0 && rect.height <= 0) return false;
          var absoluteLeft = currentScrollLeft + rect.left - contentRect.left;
          var firstPage = Math.max(0, Math.floor((absoluteLeft + 1) / currentPageWidth));
          var lastPage = Math.max(
            firstPage,
            Math.floor((absoluteLeft + Math.max(1, rect.width) - 1) / currentPageWidth)
          );
          if (firstOccupiedPage === null) firstOccupiedPage = firstPage;
          return firstPage !== firstOccupiedPage || lastPage !== firstOccupiedPage;
        });
        if (!spansPages) return;
        var occupiedHeight = rects.reduce(
          function (total, rect) { return total + rect.height; },
          0
        );
        if (occupiedHeight > pageLimit) return;
        toPromote.push(sentence);
      });
      if (!toPromote.length) break;
      /* Batch class writes after all geometry reads. Interleaving them made
         every sentence invalidate the layout for the next measurement. */
      toPromote.forEach(function (sentence) {
        sentence.classList.add("reflow-avoid-page-split");
      });
    }
    stabilizeShortLineOrphans(sentences);
  }

  /* A single short sentence must not occupy a whole visual page by itself.
     Detect that exact geometry (previous sentence ends on an earlier page
     and the next begins on a later one) and ask the column engine to keep the
     short bridge with the following prose. The rule is measured, so normal
     dialogue made of several short lines remains freely pageable. */
  function stabilizeShortLineOrphans(sentences) {
    /* These are editorially short transition actions that may become a lone
       page at the largest scale. Keep the candidate list explicit and verify
       the live geometry before applying the rule; scanning every short line
       in the complete novel would itself make repagination sluggish. */
    [
      "pg091_n0029",
      "pg121_n0012",
      "pg133_n0010",
      "pg137_n0021",
      "pg137_n0022"
    ].forEach(function (id) {
      var sentence = content.querySelector('[data-id="' + id + '"]');
      var index = sentences.indexOf(sentence);
      if (!sentence || index <= 0 || index >= sentences.length - 1) return;
      var rects = Array.prototype.slice.call(sentence.getClientRects()).filter(
        function (rect) { return rect.width > 1 && rect.height > 1; }
      );
      if (rects.length !== 1) return;
      var page = pageForElement(sentence);
      var previousPages = pagesForElement(sentences[index - 1]);
      var nextPages = pagesForElement(sentences[index + 1]);
      var nextRects = Array.prototype.slice.call(
        sentences[index + 1].getClientRects()
      ).filter(function (rect) { return rect.width > 1 && rect.height > 1; });
      var pairHeight = rects.concat(nextRects).reduce(
        function (total, rect) { return total + rect.height; },
        0
      );
      var safePageHeight = Math.max(1, content.clientHeight - 96);
      if (
        previousPages.length && nextPages.length &&
        previousPages[previousPages.length - 1] < page &&
        nextPages[0] > page &&
        nextRects.length &&
        pairHeight <= safePageHeight
      ) {
        sentence.classList.add("reflow-keep-with-next");
      }
    });
  }

  /* React replaces Easy Read text and CSS changes text case before the new
     column geometry is restored. At the end of the book the old scrollLeft
     then points to the neighbouring quiz for one or more painted frames. Keep
     a visual clone of the current quiz above the reflow while its stable
     question ID is relocated, and reveal the live content only afterwards. */
  function quizPanelForCurrentPage() {
    return Array.prototype.slice.call(content.querySelectorAll(".quiz-panel")).find(
      function (panel) { return elementOccupiesPage(panel, state.current); }
    ) || null;
  }

  function stripRepaginationCloneSemantics(root) {
    root.removeAttribute("id");
    root.removeAttribute("data-id");
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("inert", "");
    Array.prototype.slice.call(root.querySelectorAll("[id], [data-id], [name]")).forEach(
      function (element) {
        element.removeAttribute("id");
        element.removeAttribute("data-id");
        element.removeAttribute("name");
        if ("disabled" in element) element.disabled = true;
        element.setAttribute("tabindex", "-1");
      }
    );
  }

  function beginQuizRepaginationGuard() {
    /* Settings alter column geometry before the semantic anchor can be
       restored. Freeze only the quiz that is actually on screen, on a white
       canvas, rather than exposing an unrelated intermediate column or the
       old turquoise full-page mask. The real quiz remains in place beneath
       the inert copy and becomes visible again after its own anchor is
       repaginated. */
    finishQuizRepaginationGuard();
    var currentPage = visiblePageIndex();
    var contentRect = content.getBoundingClientRect();
    var panels = Array.prototype.slice.call(content.querySelectorAll(".quiz-panel"));
    var panel = panels.find(function (candidate) {
      return Array.prototype.slice.call(candidate.getClientRects()).some(function (rect) {
        return rect.width > 1 && rect.height > 1 &&
          rect.right > contentRect.left && rect.left < contentRect.right &&
          rect.bottom > contentRect.top && rect.top < contentRect.bottom;
      });
    }) || panels.find(function (candidate) {
      return elementOccupiesPage(candidate, currentPage);
    });
    if (!panel) return null;

    var anchor = panel.querySelector(".quiz-question[data-id], [data-id]");
    if (!anchor || !anchor.dataset.id) return null;
    state.quizRepaginationAnchorId = anchor.dataset.id;
    rememberSettingsAnchor(state.quizRepaginationAnchorId);
    var card = panel.querySelector(".quiz-card");
    if (!card) return state.quizRepaginationAnchorId;
    var rect = card.getBoundingClientRect();
    var overlay = document.createElement("div");
    overlay.className = "reflow-quiz-repagination-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.setProperty("--reflow-frozen-card-left", rect.left + "px");
    overlay.style.setProperty("--reflow-frozen-card-top", rect.top + "px");
    overlay.style.setProperty("--reflow-frozen-card-width", rect.width + "px");
    overlay.style.setProperty("--reflow-frozen-card-height", rect.height + "px");
    var frozenCard = card.cloneNode(true);
    frozenCard.classList.add("reflow-quiz-repagination-card");
    stripCloneInteractivity(frozenCard);
    overlay.appendChild(frozenCard);
    content.appendChild(overlay);
    state.quizRepaginationOverlay = overlay;
    document.body.classList.add("reflow-quiz-repaginating");
    return state.quizRepaginationAnchorId;
  }

  function finishQuizRepaginationGuard() {
    window.clearTimeout(state.quizRepaginationTimer);
    state.quizRepaginationTimer = 0;
    var overlay = state.quizRepaginationOverlay;
    state.quizRepaginationOverlay = null;
    state.quizRepaginationAnchorId = null;
    document.body.classList.remove("reflow-quiz-repaginating");
    if (overlay && overlay.isConnected) overlay.remove();
  }

  function finishQuizRepaginationAfterPaint() {
    requestAnimationFrame(function () {
      requestAnimationFrame(finishQuizRepaginationGuard);
    });
  }

  function isQuizRepaginationOverlayMutation(mutation) {
    var nodes = Array.prototype.slice.call(mutation.addedNodes || []).concat(
      Array.prototype.slice.call(mutation.removedNodes || [])
    );
    return nodes.length > 0 && nodes.every(function (node) {
      return node.nodeType === 1 && node.classList &&
        node.classList.contains("reflow-quiz-repagination-overlay");
    });
  }

  /* Center the cover against the real visible reading area rather than the
     nominal column box. Runtime navigation bars can differ slightly from the
     configured --nav-height, which otherwise leaves unequal white margins.
     A fixed four-percent breathing space keeps both margins equal and no
     larger than the approved upper margin on ordinary desktop viewports. */
  function balanceCoverMargins() {
    if (!content) return;
    var cover = content.querySelector(".book-cover-final .book-cover-layout");
    var main = document.querySelector("main");
    if (!cover || !main) return;

    var mainRect = main.getBoundingClientRect();
    var availableTop = Math.max(0, mainRect.top);
    var availableBottom = Math.min(window.innerHeight, mainRect.bottom);
    var detectedNavTop = null;
    var navContainer = document.getElementById("nav-container");
    if (navContainer) {
      Array.prototype.slice.call(navContainer.querySelectorAll("*")).forEach(function (element) {
        var rect = element.getBoundingClientRect();
        var isBottomBar = rect.width >= window.innerWidth * .75 &&
          rect.height >= 40 && rect.height <= 160 &&
          rect.bottom >= window.innerHeight - 3 &&
          rect.top > window.innerHeight * .55;
        if (isBottomBar) {
          detectedNavTop = detectedNavTop === null ? rect.top : Math.min(detectedNavTop, rect.top);
        }
      });
    }
    /* The reading column can end slightly above the visible toolbar. When a
       real bottom bar exists, its upper edge is the visual limit that matters
       for the requested equal white margins. */
    if (detectedNavTop !== null) availableBottom = detectedNavTop;

    var availableHeight = Math.max(1, availableBottom - availableTop);
    var targetGap = Math.max(18, Math.min(42, window.innerHeight * .04));
    var contentStyle = getComputedStyle(content);
    var horizontalRoom = Math.max(
      1,
      content.clientWidth -
        (parseFloat(contentStyle.paddingLeft) || 0) -
        (parseFloat(contentStyle.paddingRight) || 0)
    );
    var coverRatio = 738 / 1078;
    var coverHeight = Math.max(1, availableHeight - (2 * targetGap));
    coverHeight = Math.min(coverHeight, horizontalRoom / coverRatio);
    var coverWidth = coverHeight * coverRatio;

    cover.style.transform = "none";
    cover.style.width = coverWidth + "px";
    cover.style.height = coverHeight + "px";
    cover.style.maxWidth = "none";
    cover.style.maxHeight = "none";
    cover.style.flex = "0 0 auto";

    var coverRect = cover.getBoundingClientRect();
    var desiredTop = availableTop + ((availableHeight - coverHeight) / 2);
    cover.style.transform = "translateY(" + (desiredTop - coverRect.top) + "px)";
  }

  function hideOriginalPagination() {
    var selectors = [
      'button[aria-label="Next page"]',
      'button[aria-label="Previous page"]',
      'button[aria-label="Página siguiente"]',
      'button[aria-label="Página anterior"]'
    ];
    var interfaceContainer = document.getElementById("interface-container");
    var nativeButton = interfaceContainer && interfaceContainer.querySelector(selectors.join(","));
    if (!nativeButton) return;
    var nativeGroup = nativeButton.parentElement;
    if (nativeGroup) {
      nativeGroup.hidden = true;
      nativeGroup.setAttribute("aria-hidden", "true");
    }
  }

  function runtimeDockButton(labels) {
    var wanted = Array.isArray(labels) ? labels : [labels];
    return Array.prototype.slice.call(document.querySelectorAll("button[aria-label]")).find(
      function (button) {
        if (button.closest("#reflow-pagination")) return false;
        return wanted.indexOf(button.getAttribute("aria-label")) >= 0;
      }
    ) || null;
  }

  function pressedRuntimeDockButton(labels) {
    var wanted = Array.isArray(labels) ? labels : [labels];
    return Array.prototype.slice.call(document.querySelectorAll('button[aria-pressed="true"][aria-label]')).find(
      function (button) {
        if (button.closest("#reflow-pagination")) return false;
        return wanted.indexOf(button.getAttribute("aria-label")) >= 0;
      }
    ) || null;
  }

  function markUpstreamDock() {
    var trigger = runtimeDockButton(["Menú principal", "Main Menu"]);
    var dock = trigger && trigger.closest('[role="group"]');
    if (!dock) return;
    if (!dock.classList.contains("reflow-upstream-dock")) {
      dock.classList.add("reflow-upstream-dock");
    }
    if (dock.getAttribute("aria-hidden") !== "true") {
      dock.setAttribute("aria-hidden", "true");
    }
    dock.querySelectorAll("button, a, input, select, textarea, [tabindex]").forEach(function (control) {
      if (control.getAttribute("tabindex") !== "-1") {
        control.setAttribute("tabindex", "-1");
      }
    });
    if (dock.dataset.reflowAutoHideObserved !== "true") {
      dock.dataset.reflowAutoHideObserved = "true";
      new MutationObserver(syncPrimaryToolbar).observe(dock, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }
  }

  function setAttributeIfChanged(element, name, value) {
    var normalized = String(value);
    if (element.getAttribute(name) !== normalized) element.setAttribute(name, normalized);
  }

  function restoreIndexFocus() {
    requestAnimationFrame(function () {
      if (!indexButton || !document.documentElement.contains(indexButton)) return;
      try {
        indexButton.focus({ preventScroll: true });
      } catch (_error) {
        indexButton.focus();
      }
    });
  }

  function restoreIndexFocusAfterResult() {
    [0, 80, 240].forEach(function (delay) {
      window.setTimeout(function () {
        var currentMenu = typeof window.__adtReflowGetDockMenu === "function"
          ? window.__adtReflowGetDockMenu()
          : "";
        if (currentMenu !== "" || indexButton.getAttribute("aria-expanded") !== "false") return;
        var active = document.activeElement;
        var focusWasLost = !active || active === document.body ||
          active === document.documentElement || !active.isConnected || Boolean(
            active.closest && active.closest(
              ".reflow-navigation-panel, .reflow-upstream-dock"
            )
          );
        /* Do not steal focus if the reader has already moved deliberately to
           another visible control during the short closing transition. */
        if (active !== indexButton && !focusWasLost) return;
        restoreIndexFocus();
      }, delay);
    });
  }

  function ttsSessionIsActive() {
    if (Date.now() < state.ttsPlayerStopPendingUntil) return false;
    return readAloudSettingIsEnabled();
  }

  function focusVisibleReadingContent() {
    var target = activeTtsElement();
    if (!target || !target.getClientRects().length) {
      var anchorId = visibleSemanticAnchorId() || state.currentAnchorId;
      target = anchorId && content.querySelector(
        '[data-id="' + CSS.escape(anchorId) + '"]'
      );
    }
    if (!target || !target.getClientRects().length) target = content;
    var temporaryTabIndex = !target.hasAttribute("tabindex");
    if (temporaryTabIndex) target.setAttribute("tabindex", "-1");
    requestAnimationFrame(function () {
      try {
        target.focus({ preventScroll: true });
      } catch (_error) {
        target.focus();
      }
      if (temporaryTabIndex) {
        window.setTimeout(function () {
          if (target !== document.activeElement) target.removeAttribute("tabindex");
        }, 0);
      }
    });
  }

  function syncToolbarReserve() {
    var pagination = document.getElementById("reflow-pagination");
    if (!pagination) return;
    var toolbarHeight = Math.ceil(pagination.getBoundingClientRect().height);
    var rootStyles = getComputedStyle(document.documentElement);
    var laneValue = rootStyles
      .getPropertyValue("--reflow-tts-player-lane")
      .trim();
    var playerLane = parseFloat(laneValue);
    if (laneValue.endsWith("rem")) {
      playerLane *= parseFloat(rootStyles.fontSize) || 16;
    }
    if (!playerLane) playerLane = 72;
    var reserve = toolbarHeight + playerLane;
    document.documentElement.style.setProperty(
      "--reflow-primary-toolbar-height",
      toolbarHeight + "px"
    );
    if (reserve <= 0 || reserve === state.ttsPlayerReserve) return;
    state.ttsPlayerReserve = reserve;
    document.documentElement.style.setProperty(
      "--reflow-toolbar-reserve",
      reserve + "px"
    );
  }

  function syncFloatingTtsPlayer() {
    if (!ttsPlayer || !ttsPlayerToggleButton) return;
    var active = ttsSessionIsActive();
    var playing = active && ttsPlaybackIsRunning();
    var visibilityChanged = active !== state.ttsPlayerVisible;
    state.ttsPlayerVisible = active;
    ttsPlayer.hidden = !active;
    ttsPlayer.setAttribute("aria-hidden", String(!active));
    document.body.classList.toggle("reflow-tts-session-active", active);

    var playLabel = playing ? "Pausar" : "Reproducir";
    setAttributeIfChanged(ttsPlayerToggleButton, "aria-label", playLabel);
    setAttributeIfChanged(ttsPlayerToggleButton, "aria-pressed", playing);
    var playIcon = ttsPlayerToggleButton.querySelector(".reflow-tts-player-icon");
    var playText = ttsPlayerToggleButton.querySelector(".reflow-tts-player-label");
    if (playIcon) playIcon.textContent = playing ? "❚❚" : "▶";
    if (playText) playText.textContent = playLabel;

    var api = window.__adtReflowAudio;
    var canStep = Boolean(active && api && api.items && api.items.length && api.playAtIndex);
    ttsPlayerPreviousButton.disabled = !canStep;
    ttsPlayerNextButton.disabled = !canStep;
    ttsPlayerToggleButton.disabled = !active;
    ttsPlayerStopButton.disabled = !active;
    syncToolbarReserve();

    if (
      visibilityChanged && active &&
      typeof window.__adtReflowGetDockMenu === "function" &&
      typeof window.__adtReflowSetDockMenu === "function" &&
      window.__adtReflowGetDockMenu() === "settings"
    ) {
      window.__adtReflowSetDockMenu("");
      window.setTimeout(function () {
        if (!ttsPlayer.hidden) ttsPlayerToggleButton.focus({ preventScroll: true });
      }, 0);
    }
  }

  function syncPrimaryToolbar() {
    if (!indexButton || !toolsButton) return;
    var indexTrigger = runtimeDockButton(["Menú principal", "Main Menu"]);
    var toolsTrigger = runtimeDockButton(["Configuración", "Settings"]);
    var glossaryTrigger = runtimeDockButton(["Glosario", "Glossary"]);
    var upstreamDock = indexTrigger && indexTrigger.closest('[role="group"]');
    var primaryToolbar = indexButton.closest("#reflow-pagination");
    var playing = ttsPlaybackIsRunning();
    var runtimeMenuReady = Boolean(
      indexTrigger && toolsTrigger &&
      typeof window.__adtReflowSetDockMenu === "function" &&
      typeof window.__adtReflowGetDockMenu === "function"
    );
    var currentMenu = runtimeMenuReady ? window.__adtReflowGetDockMenu() : "";
    var previousMenu = state.runtimeMenu;
    state.runtimeMenu = currentMenu;
    var toolbarHasFocus = Boolean(primaryToolbar && primaryToolbar.matches(":focus-within"));
    var upstreamWantsHidden = Boolean(
      upstreamDock && upstreamDock.classList.contains("opacity-0")
    );

    primaryToolbar.classList.toggle("reflow-primary-toolbar-pending", !runtimeMenuReady);
    setAttributeIfChanged(primaryToolbar, "aria-busy", !runtimeMenuReady);
    setAttributeIfChanged(indexButton, "aria-expanded", currentMenu === "toc");
    setAttributeIfChanged(
      toolsButton,
      "aria-expanded",
      currentMenu === "settings" || currentMenu === "glossary"
    );
    primaryToolbar.classList.toggle(
      "reflow-primary-toolbar-hidden",
      upstreamWantsHidden && !toolbarHasFocus
    );
    document.body.classList.toggle("reflow-tts-playing", playing);
    syncFloatingTtsPlayer();
    markUpstreamDock();
    /* Closing the index can happen through its button, Escape, an outside
       click or after choosing a result. Only return focus when the panel was
       actually dismissed; switching directly to Tools must keep focus on the
       newly requested control instead. */
    if (previousMenu === "toc" && currentMenu === "") restoreIndexFocus();
  }

  function toggleRuntimePanel(labels) {
    var wanted = Array.isArray(labels) ? labels : [labels];
    var joined = wanted.join(" ").toLowerCase();
    var menuValue = /menú principal|main menu/.test(joined) ? "toc" :
      /configuración|settings/.test(joined) ? "settings" :
      /glosario|glossary/.test(joined) ? "glossary" :
      /idioma|language/.test(joined) ? "language" : "";
    if (
      menuValue &&
      typeof window.__adtReflowSetDockMenu === "function" &&
      typeof window.__adtReflowGetDockMenu === "function"
    ) {
      var currentMenu = window.__adtReflowGetDockMenu();
      window.__adtReflowSetDockMenu(currentMenu === menuValue ? "" : menuValue);
      requestAnimationFrame(syncPrimaryToolbar);
      window.setTimeout(syncPrimaryToolbar, 120);
      return true;
    }
    var trigger = runtimeDockButton(labels);
    if (!trigger) return false;
    trigger.click();
    requestAnimationFrame(syncPrimaryToolbar);
    window.setTimeout(syncPrimaryToolbar, 120);
    return true;
  }

  function openRuntimePanel(labels) {
    var wanted = Array.isArray(labels) ? labels : [labels];
    var joined = wanted.join(" ").toLowerCase();
    var menuValue = /menú principal|main menu/.test(joined) ? "toc" :
      /configuración|settings/.test(joined) ? "settings" :
      /glosario|glossary/.test(joined) ? "glossary" :
      /idioma|language/.test(joined) ? "language" : "";
    if (
      menuValue &&
      typeof window.__adtReflowSetDockMenu === "function" &&
      typeof window.__adtReflowGetDockMenu === "function"
    ) {
      if (window.__adtReflowGetDockMenu() !== menuValue) {
        window.__adtReflowSetDockMenu(menuValue);
      }
      requestAnimationFrame(syncPrimaryToolbar);
      window.setTimeout(syncPrimaryToolbar, 120);
      return true;
    }
    var trigger = runtimeDockButton(wanted);
    if (!trigger) return false;
    if (trigger.getAttribute("aria-pressed") !== "true") trigger.click();
    requestAnimationFrame(syncPrimaryToolbar);
    window.setTimeout(syncPrimaryToolbar, 120);
    return true;
  }

  function switchRuntimePanel(labels, competingLabels) {
    if (
      typeof window.__adtReflowSetDockMenu === "function" &&
      typeof window.__adtReflowGetDockMenu === "function"
    ) {
      toggleRuntimePanel(labels);
      return;
    }
    var competing = pressedRuntimeDockButton(competingLabels);
    if (competing) {
      competing.click();
      window.setTimeout(function () { toggleRuntimePanel(labels); }, 80);
      return;
    }
    toggleRuntimePanel(labels);
  }

  function toggleFloatingReadAloud() {
    var api = window.__adtReflowAudio;
    if (ttsPlaybackIsRunning()) {
      state.ttsManuallyPaused = true;
      state.ttsResumeAfterSeek = false;
      if (api && api.pause) api.pause();
      else if (state.ttsAudio) state.ttsAudio.pause();
    } else {
      state.ttsManuallyPaused = false;
      syncReadAloudSetting(true);
      startTtsFromUserGesture();
    }
    requestAnimationFrame(syncPrimaryToolbar);
    window.setTimeout(syncPrimaryToolbar, 160);
  }

  function stepFloatingReadAloud(direction) {
    var api = window.__adtReflowAudio;
    if (!api || !api.items || !api.items.length || !api.playAtIndex) return;
    state.ttsStepShouldRemainPaused = state.ttsManuallyPaused || !ttsPlaybackIsRunning();
    if (state.ttsStepShouldRemainPaused) state.ttsManuallyPaused = true;
    syncReadAloudSetting(true);
    var destination = resolveTtsStepIndex(
      api.items,
      Number.isFinite(Number(api.currentIndex)) ? Number(api.currentIndex) : state.ttsCurrentItemIndex,
      direction
    );
    api.playAtIndex(destination);
    if (window.__adtReflowAfterTtsStep) window.__adtReflowAfterTtsStep(destination);
    if (announcer) {
      announcer.textContent = direction < 0 ? "Audio anterior" : "Audio siguiente";
    }
    requestAnimationFrame(syncPrimaryToolbar);
    window.setTimeout(syncPrimaryToolbar, 180);
  }

  function stopFloatingReadAloud() {
    state.ttsPlayerStopPendingUntil = Date.now() + 600;
    syncReadAloudSetting(false);
    stopTtsFromSettings();
    syncFloatingTtsPlayer();
    focusVisibleReadingContent();
    window.setTimeout(syncPrimaryToolbar, 180);
    window.setTimeout(function () {
      state.ttsPlayerStopPendingUntil = 0;
      syncPrimaryToolbar();
    }, 650);
  }

  function createPagination() {
    var pagination = document.createElement("nav");
    pagination.id = "reflow-pagination";
    pagination.className = "reflow-primary-toolbar reflow-primary-toolbar-pending";
    pagination.setAttribute("aria-label", "Controles principales del libro");
    pagination.setAttribute("aria-busy", "true");
    pagination.innerHTML =
      '<button id="reflow-index" class="reflow-toolbar-action" type="button" ' +
        'aria-label="Índice" aria-haspopup="dialog" aria-expanded="false">' +
        '<span class="reflow-toolbar-icon" aria-hidden="true">☰</span>' +
        '<span class="reflow-toolbar-label">Índice</span>' +
      '</button>' +
      '<button id="reflow-previous" class="reflow-toolbar-action" type="button" ' +
        'aria-label="Página anterior" aria-keyshortcuts="ArrowLeft PageUp">' +
        '<span class="reflow-toolbar-icon" aria-hidden="true">←</span>' +
        '<span class="reflow-toolbar-label">Anterior</span>' +
      '</button>' +
      '<output id="reflow-page-status" aria-live="off" aria-label="Página 1 de 1">' +
        '<span id="reflow-current-page">1</span> / <span id="reflow-total-pages">1</span>' +
      '</output>' +
      '<button id="reflow-next" class="reflow-toolbar-action" type="button" ' +
        'aria-label="Página siguiente" aria-keyshortcuts="ArrowRight PageDown">' +
        '<span class="reflow-toolbar-icon" aria-hidden="true">→</span>' +
        '<span class="reflow-toolbar-label">Siguiente</span>' +
      '</button>' +
      '<button id="reflow-tools" class="reflow-toolbar-action" type="button" ' +
        'aria-label="Herramientas" aria-haspopup="dialog" aria-expanded="false">' +
        '<span class="reflow-toolbar-icon" aria-hidden="true">⚙</span>' +
        '<span class="reflow-toolbar-label">Herramientas</span>' +
      '</button>';

    ttsPlayer = document.createElement("section");
    ttsPlayer.id = "reflow-tts-player";
    ttsPlayer.setAttribute("role", "region");
    ttsPlayer.setAttribute("aria-label", "Controles de lectura en voz alta");
    ttsPlayer.setAttribute("aria-hidden", "true");
    ttsPlayer.hidden = true;
    ttsPlayer.innerHTML =
      '<button id="reflow-tts-previous" type="button" aria-label="Audio anterior">' +
        '<span class="reflow-tts-player-icon" aria-hidden="true">⏮</span>' +
        '<span class="reflow-tts-player-label">Anterior</span>' +
      '</button>' +
      '<button id="reflow-tts-toggle" type="button" aria-label="Reproducir" aria-pressed="false">' +
        '<span class="reflow-tts-player-icon" aria-hidden="true">▶</span>' +
        '<span class="reflow-tts-player-label">Reproducir</span>' +
      '</button>' +
      '<button id="reflow-tts-next" type="button" aria-label="Audio siguiente">' +
        '<span class="reflow-tts-player-icon" aria-hidden="true">⏭</span>' +
        '<span class="reflow-tts-player-label">Siguiente</span>' +
      '</button>' +
      '<button id="reflow-tts-settings" type="button" aria-label="Voz y velocidad">' +
        '<span class="reflow-tts-player-icon" aria-hidden="true">⚙</span>' +
        '<span class="reflow-tts-player-label">Voz y velocidad</span>' +
      '</button>' +
      '<button id="reflow-tts-stop" type="button" aria-label="Detener">' +
        '<span class="reflow-tts-player-icon" aria-hidden="true">■</span>' +
        '<span class="reflow-tts-player-label">Detener</span>' +
      '</button>';

    announcer = document.createElement("div");
    announcer.className = "sr-only";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");

    document.body.appendChild(pagination);
    document.body.appendChild(ttsPlayer);
    document.body.appendChild(announcer);

    syncToolbarReserve();
    if (typeof ResizeObserver === "function") {
      var toolbarResizeObserver = new ResizeObserver(syncToolbarReserve);
      toolbarResizeObserver.observe(pagination);
      toolbarResizeObserver.observe(ttsPlayer);
    }
    window.addEventListener("resize", syncToolbarReserve);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncToolbarReserve);
    }

    previousButton = document.getElementById("reflow-previous");
    nextButton = document.getElementById("reflow-next");
    currentOutput = document.getElementById("reflow-current-page");
    totalOutput = document.getElementById("reflow-total-pages");
    indexButton = document.getElementById("reflow-index");
    toolsButton = document.getElementById("reflow-tools");
    ttsPlayerPreviousButton = document.getElementById("reflow-tts-previous");
    ttsPlayerToggleButton = document.getElementById("reflow-tts-toggle");
    ttsPlayerNextButton = document.getElementById("reflow-tts-next");
    ttsPlayerSettingsButton = document.getElementById("reflow-tts-settings");
    ttsPlayerStopButton = document.getElementById("reflow-tts-stop");

    indexButton.addEventListener("click", function () {
      switchRuntimePanel(
        ["Menú principal", "Main Menu"],
        ["Configuración", "Settings", "Glosario", "Glossary"]
      );
    });
    toolsButton.addEventListener("click", function () {
      switchRuntimePanel(
        ["Configuración", "Settings"],
        ["Menú principal", "Main Menu"]
      );
    });
    ttsPlayerPreviousButton.addEventListener("click", function () {
      stepFloatingReadAloud(-1);
    });
    ttsPlayerToggleButton.addEventListener("click", toggleFloatingReadAloud);
    ttsPlayerNextButton.addEventListener("click", function () {
      stepFloatingReadAloud(1);
    });
    ttsPlayerSettingsButton.addEventListener("click", function () {
      switchRuntimePanel(
        ["Configuración", "Settings"],
        ["Menú principal", "Main Menu"]
      );
    });
    ttsPlayerStopButton.addEventListener("click", function (event) {
      event.stopPropagation();
      stopFloatingReadAloud();
    });

    document.addEventListener("keydown", function (event) {
      if (!event.altKey || !event.shiftKey || String(event.key).toLowerCase() !== "l") return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    document.addEventListener("play", syncPrimaryToolbar, true);
    document.addEventListener("pause", syncPrimaryToolbar, true);
    document.addEventListener("ended", syncPrimaryToolbar, true);
    pagination.addEventListener("focusin", syncPrimaryToolbar);
    pagination.addEventListener("focusout", function () {
      requestAnimationFrame(syncPrimaryToolbar);
    });
    var runtimeNavigation = document.getElementById("nav-container");
    if (runtimeNavigation) {
      new MutationObserver(syncPrimaryToolbar).observe(runtimeNavigation, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-label", "aria-pressed"]
      });
    }
    syncPrimaryToolbar();

    /* Page clicks are routed once by the document-level adapter installed
       below. Registering a second handler here made one physical click move
       two columns: this left state.current and the TTS cursor out of phase and
       surfaced as a flash on the next WhatsApp sentence. */
  }

  function loadFontPreference() {
    try {
      var stored = localStorage.getItem(fontStorageKey);
      if (Object.prototype.hasOwnProperty.call(fontScales, stored)) state.fontSize = stored;
    } catch (_error) {
      state.fontSize = "normal";
    }
    content.style.setProperty("--reflow-font-scale", String(fontScales[state.fontSize]));
    document.body.dataset.reflowFontSize = state.fontSize;
  }

  /* A new delivered build starts in the agreed baseline even when the same
     browser previously opened an experimental bundle under this origin.
     Apply the reset only once: subsequent choices made by the reader remain
     persistent as expected. The ADT runtime stores Easy Read in this key and
     falls back to false when it is absent. */
  function migrateDefaultReaderState() {
    try {
      if (localStorage.getItem(defaultReaderStateMigrationKey) === "done") return;
      localStorage.removeItem(fontStorageKey);
      localStorage.setItem("easyReadMode", "false");
      localStorage.setItem(defaultReaderStateMigrationKey, "done");
    } catch (_error) {}
    state.fontSize = "normal";
  }

  function retireTextCasePreference() {
    /* v46 no longer exposes a global uppercase transformation. Clear the old
       preference before first paint so a saved v44/v45 choice cannot leak
       into the new, editorially cased layout. */
    document.body.dataset.reflowTextCase = "mixed";
    try { localStorage.removeItem(retiredTextCaseStorageKey); } catch (_error) {}
  }

  function loadTtsVoicePreference() {
    try {
      var stored = localStorage.getItem(ttsVoiceStorageKey);
      if (Object.prototype.hasOwnProperty.call(ttsVoices, stored)) state.ttsVoice = stored;
    } catch (_error) {
      state.ttsVoice = "valentina";
    }
    document.body.dataset.reflowTtsVoice = state.ttsVoice;
    window.__adtReflowTtsVoice = state.ttsVoice;
  }

  async function loadTtsVoiceCatalogs() {
    await Promise.all(Object.keys(ttsVoices).map(async function (voiceKey) {
      var root = "./content/i18n/es-UY/voices/" + voiceKey + "/";
      try {
        var responses = await Promise.all([
          fetch(root + "audios.json?v=47-full-book-132-uatsap-no-e"),
          fetch(root + "timecodes.json?v=47-full-book-132-uatsap-no-e")
        ]);
        if (!responses[0].ok || !responses[1].ok) throw new Error("missing catalogue");
        ttsVoiceCatalogs[voiceKey].audios = await responses[0].json();
        ttsVoiceCatalogs[voiceKey].timecodes = await responses[1].json();
        var easyReadNormalAudioAliases = {
          pg070_n0026_easy_read: "pg070_n0026",
          pg071_n0002_easy_read: "pg071_n0002",
          pg136_n0048_easy_read: "pg136_n0048",
          pg137_n0002_easy_read: "pg137_n0002",
          pg152_n0002_easy_read: "pg152_n0002",
          pg155_n0021_easy_read: "pg155_n0021",
          pg156_n0002_easy_read: "pg156_n0002",
          pg174_n0035_easy_read: "pg174_n0035",
          pg175_n0002_easy_read: "pg175_n0002",
          pg184_n0032_easy_read: "pg184_n0032",
          pg185_n0002_easy_read: "pg185_n0002"
        };
        Object.keys(easyReadNormalAudioAliases).forEach(function (easyId) {
          var normalId = easyReadNormalAudioAliases[easyId];
          if (ttsVoiceCatalogs[voiceKey].audios[normalId]) {
            ttsVoiceCatalogs[voiceKey].audios[easyId] = ttsVoiceCatalogs[voiceKey].audios[normalId];
          }
          if (ttsVoiceCatalogs[voiceKey].timecodes[normalId]) {
            ttsVoiceCatalogs[voiceKey].timecodes[easyId] = ttsVoiceCatalogs[voiceKey].timecodes[normalId];
          }
        });
        ttsVoiceCatalogs[voiceKey].available = true;
      } catch (_error) {
        ttsVoiceCatalogs[voiceKey].available = false;
      }
    }));
    var availableVoice = Object.keys(ttsVoices).find(function (voiceKey) {
      return ttsVoiceCatalogs[voiceKey].available;
    });
    if (
      availableVoice &&
      (!ttsVoiceCatalogs[state.ttsVoice] || !ttsVoiceCatalogs[state.ttsVoice].available)
    ) {
      state.ttsVoice = availableVoice;
      document.body.dataset.reflowTtsVoice = availableVoice;
      window.__adtReflowTtsVoice = availableVoice;
      try { localStorage.setItem(ttsVoiceStorageKey, availableVoice); } catch (_error) {}
    }
  }

  var modernWhatsAppWindowAudioIds = [
    "pg068_im004", "pg069_im004", "pg069_im005", "pg079_im002",
    "pg127_im002", "whatsapp_chat_intro_pg020", "whatsapp_chat_intro_pg021",
    "whatsapp_chat_intro_pg029", "whatsapp_chat_intro_pg070"
  ];
  var historicalWhatsAppWindowAudioIds = [
    "pg083_im002", "pg084_im002", "pg094_im002", "pg094_im003",
    "pg095_im002", "pg117_im002", "pg117_im002_continuation",
    "pg183_im002", "pg183_im003"
  ];

  function whatsAppWindowAudioKind(audioId) {
    var canonicalId = String(audioId || "").replace(/_easy_read$/, "");
    if (historicalWhatsAppWindowAudioIds.indexOf(canonicalId) >= 0 ||
        canonicalId === "whatsapp_chat_intro_historical") return "historical";
    if (/^whatsapp_chat_(?:intro|continuation)(?:_|$)/.test(canonicalId) ||
        modernWhatsAppWindowAudioIds.indexOf(canonicalId) >= 0) return "modern";
    return "";
  }

  function isWhatsAppWindowAudioId(audioId) {
    return Boolean(whatsAppWindowAudioKind(audioId));
  }

  function ttsEffectiveAudioId(audioId) {
    var requestedId = String(audioId || "");
    if (!requestedId || isSceneSeparatorAudioId(requestedId) ||
        isWhatsAppWindowAudioId(requestedId)) return requestedId;
    /* The reader can retain an Easy Read id in its queue while the user
       switches LF off. Resolve through the normal id first so that queue
       never keeps narrating the simplified asset in ordinary reading. */
    var baseId = requestedId.replace(/_easy_read$/, "");
    if (!document.body.classList.contains("reflow-easy-read")) return baseId;
    var catalogue = ttsVoiceCatalogs[state.ttsVoice] || ttsVoiceCatalogs.valentina;
    var easyId = baseId + "_easy_read";
    if ((catalogue.audios && catalogue.audios[easyId]) ||
        (window.__adtReflowAudioFiles && window.__adtReflowAudioFiles[easyId])) {
      return easyId;
    }
    return baseId;
  }

  function ttsVoiceFilename(audioId) {
    if (isSceneSeparatorAudioId(audioId)) {
      var sceneCatalogue = ttsVoiceCatalogs[state.ttsVoice] || ttsVoiceCatalogs.valentina;
      return sceneCatalogue.audios.pg166_n0007 ||
        ("voices/" + state.ttsVoice +
          "/audio/pg166_n0007.mp3?v=47-scene-separator-2");
    }
    var catalogue = ttsVoiceCatalogs[state.ttsVoice] || ttsVoiceCatalogs.valentina;
    var whatsAppKind = whatsAppWindowAudioKind(audioId);
    if (whatsAppKind) {
      var sharedWhatsAppId = whatsAppKind === "historical"
        ? "whatsapp_chat_intro_historical"
        : "whatsapp_chat_intro";
      return catalogue.audios[sharedWhatsAppId] ||
        (window.__adtReflowAudioFiles &&
          window.__adtReflowAudioFiles[sharedWhatsAppId]) || null;
    }
    var effectiveId = ttsEffectiveAudioId(audioId);
    return catalogue.audios[effectiveId] ||
      (window.__adtReflowAudioFiles && window.__adtReflowAudioFiles[effectiveId]) || null;
  }

  function ttsTimingsForItem(audioId, fallback) {
    var catalogue = ttsVoiceCatalogs[state.ttsVoice] || ttsVoiceCatalogs.valentina;
    var whatsAppKind = whatsAppWindowAudioKind(audioId);
    var effectiveId = ttsEffectiveAudioId(audioId);
    var timings = isSceneSeparatorAudioId(audioId)
      ? (catalogue.timecodes.pg166_n0007 || fallback || [])
      : (whatsAppKind
        ? (catalogue.timecodes[whatsAppKind === "historical"
          ? "whatsapp_chat_intro_historical"
          : "whatsapp_chat_intro"] || fallback || [])
        : (catalogue.timecodes[effectiveId] || fallback || []));
    document.body.dataset.reflowTtsTimingId = effectiveId || "";
    document.body.dataset.reflowTtsTimingCount = String(timings.length || 0);
    return timings;
  }

  function ttsHasTimingsForItem(audioId, fallback) {
    return ttsTimingsForItem(audioId, fallback).length > 0;
  }

  function bindTtsAudioForItem(audioId, audio) {
    var filename = ttsVoiceFilename(audioId);
    if (!audio || !filename) return;
    state.ttsAudio = audio;
    state.ttsCurrentAudioId = String(audioId || "");
    document.body.dataset.reflowTtsAudioId = ttsEffectiveAudioId(audioId) || "";
    document.body.dataset.reflowTtsAudioSource = filename;
    var base = filename.indexOf("voices/") === 0
      ? "./content/i18n/es-UY/"
      : "./content/i18n/es-UY/audio/";
    var desiredUrl = new URL(base + filename, window.location.href).href;
    if (audio.src === desiredUrl) return;
    /* Abort a pending stock-audio play before assigning the selected voice.
       Merely writing src is normally enough, but some WebKit timing paths can
       emit the first buffered words of the prior resource before the new load
       wins. Removing the resource first makes this transition unambiguous. */
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.src = desiredUrl;
    audio.load();
  }

  function updateTtsVoiceControls() {
    var selector = document.getElementById("reflow-tts-voice-setting");
    var cataloguesReady = Object.keys(ttsVoices).some(function (voiceKey) {
      return ttsVoiceCatalogs[voiceKey].available;
    });
    if (selector) selector.hidden = !cataloguesReady;
    Array.prototype.slice.call(document.querySelectorAll("[data-reflow-tts-voice]")).forEach(
      function (button) {
        var selected = button.dataset.reflowTtsVoice === state.ttsVoice;
        var catalogue = ttsVoiceCatalogs[button.dataset.reflowTtsVoice];
        button.hidden = !catalogue || !catalogue.available;
        button.setAttribute("aria-checked", String(selected));
        button.setAttribute("aria-pressed", String(selected));
        button.disabled = !catalogue || !catalogue.available;
      }
    );
  }

  function applyTtsVoice(voiceKey) {
    if (
      !Object.prototype.hasOwnProperty.call(ttsVoices, voiceKey) ||
      !ttsVoiceCatalogs[voiceKey].available ||
      voiceKey === state.ttsVoice
    ) {
      updateTtsVoiceControls();
      return;
    }
    var api = window.__adtReflowAudio;
    var audio = state.ttsAudio;
    var wasPlaying = Boolean(audio && !audio.paused && !audio.ended);
    var itemIndex = api && Number.isFinite(Number(api.currentIndex))
      ? Number(api.currentIndex)
      : state.ttsCurrentItemIndex;
    var item = api && api.items && api.items[itemIndex];
    if (audio) audio.pause();
    stopQuizFeedbackAudio();
    clearTtsRangeHighlight();
    state.ttsVoice = voiceKey;
    document.body.dataset.reflowTtsVoice = voiceKey;
    window.__adtReflowTtsVoice = voiceKey;
    try { localStorage.setItem(ttsVoiceStorageKey, voiceKey); } catch (_error) {}
    updateTtsVoiceControls();
    if (item && audio) {
      bindTtsAudioForItem(item.id, audio);
      if (wasPlaying && !state.ttsManuallyPaused) {
        var playResult = audio.play();
        if (playResult && playResult.catch) playResult.catch(function () {});
      }
    }
  }

  function updateFontControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-reflow-font-size]")).forEach(function (button) {
      var selected = button.dataset.reflowFontSize === state.fontSize;
      button.setAttribute("aria-pressed", String(selected));
      if (button.getAttribute("role") === "radio") button.setAttribute("aria-checked", String(selected));
    });
  }

  function clearQuizInteractionHeights() {
    Array.prototype.slice.call(content.querySelectorAll(".quiz-card")).forEach(
      function (card) {
        card.style.removeProperty("--reflow-quiz-interaction-height");
        card.style.removeProperty("--reflow-quiz-content-shift");
        delete card.dataset.reflowQuizQuestionTop;
        Array.prototype.slice.call(card.querySelectorAll(".quiz-option")).forEach(
          function (option) {
            option.style.removeProperty("--reflow-quiz-option-interaction-height");
            option.style.removeProperty("--reflow-quiz-option-gap");
            option.style.removeProperty("--reflow-quiz-option-padding-top");
            option.style.removeProperty("--reflow-quiz-option-padding-right");
            option.style.removeProperty("--reflow-quiz-option-padding-bottom");
            option.style.removeProperty("--reflow-quiz-option-padding-left");
          }
        );
      }
    );
  }

  /* Submitting replaces the button with feedback whose natural height can be
     a few pixels shorter. Capture the exact pre-submit card height during the
     click's capture phase, before the activity runtime mutates the DOM. The
     card may still grow for long feedback, but never contracts mid-action. */
  function installQuizCardHeightLock() {
    if (document.documentElement.dataset.reflowQuizHeightLock === "true") return;
    document.documentElement.dataset.reflowQuizHeightLock = "true";
    document.addEventListener("click", function (event) {
      var submit = event.target.closest && event.target.closest(".quiz-submit");
      if (!submit) return;
      var card = submit.closest(".quiz-card");
      if (!card) return;
      var cardRect = card.getBoundingClientRect();
      var question = card.querySelector(".quiz-question");
      card.style.setProperty(
        "--reflow-quiz-interaction-height",
        cardRect.height + "px"
      );
      if (question) {
        card.dataset.reflowQuizQuestionTop = String(
          question.getBoundingClientRect().top - cardRect.top
        );
      }
      Array.prototype.slice.call(card.querySelectorAll(".quiz-option")).forEach(
        function (option) {
          var optionStyle = getComputedStyle(option);
          option.style.setProperty(
            "--reflow-quiz-option-interaction-height",
            option.getBoundingClientRect().height + "px"
          );
          option.style.setProperty("--reflow-quiz-option-gap", optionStyle.gap);
          option.style.setProperty(
            "--reflow-quiz-option-padding-top",
            optionStyle.paddingTop
          );
          option.style.setProperty(
            "--reflow-quiz-option-padding-right",
            optionStyle.paddingRight
          );
          option.style.setProperty(
            "--reflow-quiz-option-padding-bottom",
            optionStyle.paddingBottom
          );
          option.style.setProperty(
            "--reflow-quiz-option-padding-left",
            optionStyle.paddingLeft
          );
        }
      );

      /* The runtime replaces Enviar with feedback after this capture handler.
         Its different natural height used to make the centred contents drift
         a few pixels. Preserve the original question origin after each phase
         of that mutation; account for an already applied transform so the
         correction cannot oscillate. */
      function restoreQuizContentOrigin() {
        if (!question || !card.dataset.reflowQuizQuestionTop) return;
        var feedback = card.querySelector(".quiz-feedback");
        if (!feedback || !feedback.textContent.trim()) return;
        var currentShift = parseFloat(
          card.style.getPropertyValue("--reflow-quiz-content-shift")
        ) || 0;
        var unshiftedTop = question.getBoundingClientRect().top -
          card.getBoundingClientRect().top - currentShift;
        var targetTop = Number(card.dataset.reflowQuizQuestionTop);
        card.style.setProperty(
          "--reflow-quiz-content-shift",
          (targetTop - unshiftedTop) + "px"
        );
      }
      requestAnimationFrame(function () {
        restoreQuizContentOrigin();
        requestAnimationFrame(restoreQuizContentOrigin);
      });
      [80, 180, 360].forEach(function (delay) {
        window.setTimeout(restoreQuizContentOrigin, delay);
      });
    }, true);
  }

  /* The source export wraps arbitrary groups of sentences in block-level
     containers. Those wrappers do not correspond to PDF paragraphs and can
     therefore turn a punto seguido into a false line break even when their
     margins are zero. Flatten only plain narrative sections whose semantic
     content consists exclusively of reading sentences. Covers, headings,
     illustrations, chats and activities retain their authored structure. */
  function flattenPlainProseSections() {
    var safeSectionSelector = [
      'section[data-section-type="text_only"]',
      'section[data-section-type="boxed_text"]',
      'section[data-section-type="text_and_single_image"]'
    ].join(",");
    Array.prototype.slice.call(content.querySelectorAll(safeSectionSelector)).forEach(
      function (section) {
        var sectionMatch = (section.dataset.sectionId || "").match(/^pg(\d{3})_/);
        var sourcePage = sectionMatch ? Number(sectionMatch[1]) : 0;
        if (
        sourcePage < 19 ||
        sourcePage >= 216 ||
        section.classList.contains("reflow-backmatter-page")
      ) return;
        if (section.classList.contains("reflow-flat-prose")) return;
        if (section.querySelector(
          "img, .illustrated-page, .attic-illustrated-page, .whatsapp-chat-window, " +
          ".quiz-panel, .chapter-cover"
        )) return;
        var hasNonReadingSemanticNode = Array.prototype.slice.call(
          section.querySelectorAll("[data-id]")
        ).some(function (element) {
          return !element.classList.contains("reading-sentence") &&
            !element.closest(".reading-sentence");
        });
        if (hasNonReadingSemanticNode) return;

        var seen = new Set();
        var units = [];
        Array.prototype.slice.call(section.querySelectorAll(".reading-sentence")).forEach(
          function (sentence) {
            var chain = sentence.closest(".sentence-chain");
            var unit = chain && section.contains(chain) ? chain : sentence;
            if (seen.has(unit)) return;
            seen.add(unit);
            units.push(unit);
          }
        );
        if (!units.length) return;

        var fragment = document.createDocumentFragment();
        units.forEach(function (unit, index) {
          if (index) fragment.appendChild(document.createTextNode(" "));
          fragment.appendChild(unit);
        });
        section.replaceChildren(fragment);
        section.classList.add("reflow-flat-prose");
      }
    );
  }

  /* Paragraph starts are semantic, but the illustrated-page balancers move
     their sentences between the side copy and a continuation container.
     Rebuild the purely visual separators after every such move so a marker
     can never remain behind in the old container. A start already at a real
     block boundary needs no extra marker. */
  function repairParagraphMarkers() {
    Array.prototype.slice.call(
      content.querySelectorAll(".reflow-paragraph-break")
    ).forEach(function (marker) { marker.remove(); });

    Array.prototype.slice.call(content.querySelectorAll(".reading-block")).forEach(
      function (block) {
        block.classList.remove("reflow-original-paragraph-block");
        var firstSentence = block.querySelector(
          ":scope > .reading-sentence, :scope > .sentence-chain > .reading-sentence"
        );
        if (!firstSentence) firstSentence = block.querySelector(".reading-sentence");
        if (firstSentence && firstSentence.classList.contains("reflow-paragraph-start")) {
          block.classList.add("reflow-original-paragraph-block");
        }
      }
    );

    Array.prototype.slice.call(
      content.querySelectorAll(".reflow-paragraph-start")
    ).forEach(function (sentence) {
      if (sentence.closest(".whatsapp-chat-window")) return;
      var unit = sentence;
      var parent = sentence.parentElement;
      if (
        parent && parent.classList.contains("sentence-chain") &&
        parent.firstElementChild === sentence
      ) {
        unit = parent;
      }
      if (!unit.parentElement) return;
      if (
        !unit.previousElementSibling &&
        !unit.parentElement.classList.contains("reflow-flat-prose")
      ) return;
      var marker = document.createElement("span");
      marker.className = "reflow-paragraph-break";
      marker.setAttribute("aria-hidden", "true");
      unit.parentElement.insertBefore(marker, unit);
    });
  }

  function applyFontSize(size) {
    if (!Object.prototype.hasOwnProperty.call(fontScales, size)) return;
    var anchorId = state.quizRepaginationAnchorId ||
      livePendingSettingsAnchorId() || visibleSemanticAnchorId() ||
      state.currentAnchorId || anchorIdForPage(state.current);
    state.fontSize = size;
    content.style.setProperty("--reflow-font-scale", String(fontScales[size]));
    document.body.dataset.reflowFontSize = size;
    syncChapterOneChatContinuation();
    try { localStorage.setItem(fontStorageKey, size); } catch (_error) {}
    updateFontControls();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        rebalanceIllustratedPage();
        rebalanceChapterTwoIllustrations();
        rebalanceAtticIllustration();
        repairParagraphMarkers();
        updateReadingBlockSizing();
        recalculate({ anchorId: anchorId, preserveTts: true });
        state.lastContentReflowAt = Date.now();
        state.settingsRepaginationIgnoreUntil = Date.now() + 500;
        if (state.quizRepaginationOverlay) finishQuizRepaginationAfterPaint();
      });
    });
  }

  function createFontControls() {
    var interfaceContainer = document.getElementById("interface-container");

    document.addEventListener("click", function (event) {
      var control = event.target.closest("[data-reflow-font-size]");
      /* Role-based widgets also exist inside quizzes. Only accessibility
         controls mounted in the interface may start a visual repagination;
         otherwise selecting an answer briefly darkens the whole viewport. */
      if (!control || !interfaceContainer || !interfaceContainer.contains(control)) return;
      if (control.hasAttribute("data-reflow-font-size")) {
        clearQuizInteractionHeights();
        clearExplicitPageLock();
        var active = activeTtsElement();
        var ttsEnabled = readAloudSettingIsEnabled();
        var settingsAnchorId = active && active.dataset.id && ttsEnabled
          ? active.dataset.id
          : visibleSemanticAnchorId();
        rememberSettingsAnchor(settingsAnchorId);
        if (
          active && active.dataset.id &&
          ttsEnabled
        ) {
          lockTtsToExplicitNavigation(livePageForTtsElement(active));
        }
        beginQuizRepaginationGuard();
      }
    }, true);

    function mountInSettingsPanel() {
      var settingsTab = interfaceContainer && interfaceContainer.querySelector(
        ".flex.flex-col.gap-1.px-4.pb-6"
      );
      if (!settingsTab) return;
      var section = document.getElementById("reflow-font-settings");
      if (!section) {
        section = document.createElement("section");
        section.id = "reflow-font-settings";
        section.innerHTML =
          '<header><h3>Accesibilidad</h3></header>' +
          '<div class="reflow-font-settings-card">' +
            '<span id="reflow-font-settings-label">Tamaño de letra</span>' +
            '<div class="reflow-font-settings-options" role="radiogroup" ' +
              'aria-labelledby="reflow-font-settings-label">' +
              '<button type="button" role="radio" data-reflow-font-size="normal" aria-pressed="false">Normal</button>' +
              '<button type="button" role="radio" data-reflow-font-size="large" aria-pressed="false">Grande</button>' +
              '<button type="button" role="radio" data-reflow-font-size="xlarge" aria-pressed="false">Extra grande</button>' +
            '</div>' +
          '</div>';
        var firstSection = settingsTab.querySelector(":scope > section");
        if (firstSection && firstSection.nextSibling) {
          settingsTab.insertBefore(section, firstSection.nextSibling);
        } else {
          settingsTab.appendChild(section);
        }
      }

      var readingSection = Array.prototype.slice.call(
        settingsTab.querySelectorAll(":scope > section")
      ).find(function (candidate) {
        var heading = candidate.querySelector("h3");
        return heading && /^lectura$/i.test(heading.textContent.trim());
      });
      var readingCard = readingSection && readingSection.querySelector(":scope > div");
      if (readingCard && !document.getElementById("reflow-tts-voice-setting")) {
        var voiceRow = document.createElement("div");
        voiceRow.id = "reflow-tts-voice-setting";
        voiceRow.innerHTML =
          '<span id="reflow-tts-voice-label">Voz del narrador</span>' +
          '<div class="reflow-tts-voice-options" role="radiogroup" ' +
            'aria-labelledby="reflow-tts-voice-label">' +
            '<button type="button" role="radio" data-reflow-tts-voice="valentina" ' +
              'aria-checked="false" aria-pressed="false">Valentina</button>' +
            '<button type="button" role="radio" data-reflow-tts-voice="mateo" ' +
              'aria-checked="false" aria-pressed="false">Mateo</button>' +
          '</div>';
        var readAloudRow = Array.prototype.slice.call(readingCard.children).find(
          function (candidate) {
            return /^texto a voz\b/i.test(candidate.textContent.trim());
          }
        );
        if (readAloudRow && readAloudRow.nextSibling) {
          readingCard.insertBefore(voiceRow, readAloudRow.nextSibling);
        } else {
          readingCard.appendChild(voiceRow);
        }
      }
      if (readingCard && !document.getElementById("reflow-tts-speed-setting")) {
        var speedRow = document.createElement("div");
        speedRow.id = "reflow-tts-speed-setting";
        speedRow.innerHTML =
          '<span id="reflow-tts-speed-label">Velocidad</span>' +
          '<div class="reflow-tts-speed-options" role="radiogroup" ' +
            'aria-labelledby="reflow-tts-speed-label">' +
            '<button type="button" role="radio" data-reflow-tts-speed="0.5" aria-checked="false">Lenta</button>' +
            '<button type="button" role="radio" data-reflow-tts-speed="1" aria-checked="false">Normal</button>' +
            '<button type="button" role="radio" data-reflow-tts-speed="1.5" aria-checked="false">Rápida</button>' +
            '<button type="button" role="radio" data-reflow-tts-speed="2" aria-checked="false">Muy rápida</button>' +
          '</div>';
        readingCard.appendChild(speedRow);
      }
      if (!document.getElementById("reflow-reference-tools")) {
        var referenceSection = document.createElement("section");
        referenceSection.id = "reflow-reference-tools";
        referenceSection.innerHTML =
          '<header><h3>Consulta</h3></header>' +
          '<div class="reflow-reference-tools-card">' +
            '<button id="reflow-open-glossary" type="button" aria-keyshortcuts="G">' +
              '<span aria-hidden="true">⌕</span><span>Glosario</span>' +
            '</button>' +
          '</div>';
        settingsTab.appendChild(referenceSection);
      }

      Array.prototype.slice.call(settingsTab.querySelectorAll("span")).forEach(function (label) {
        if (!/^(abrir idioma|open language)$/i.test(label.textContent.trim())) return;
        var shortcutRow = label.parentElement;
        if (shortcutRow) shortcutRow.remove();
      });
      var shortcutHeading = Array.prototype.slice.call(settingsTab.querySelectorAll("h3")).find(
        function (heading) {
          return /^(atajos de teclado|keyboard shortcuts)$/i.test(heading.textContent.trim());
        }
      );
      var shortcutCard = shortcutHeading && shortcutHeading.closest("section") &&
        shortcutHeading.closest("section").querySelector(":scope > div");
      if (shortcutCard && !document.getElementById("reflow-glossary-shortcut")) {
        var closeShortcutRow = Array.prototype.slice.call(shortcutCard.children).find(
          function (row) { return /^(cerrar panel|close panel)/i.test(row.textContent.trim()); }
        );
        var templateShortcutRow = closeShortcutRow || shortcutCard.firstElementChild;
        if (templateShortcutRow) {
          var glossaryShortcutRow = templateShortcutRow.cloneNode(true);
          glossaryShortcutRow.id = "reflow-glossary-shortcut";
          var glossaryShortcutLabel = glossaryShortcutRow.querySelector("span");
          var glossaryShortcutKey = glossaryShortcutRow.querySelector('kbd[data-slot="kbd"]');
          if (glossaryShortcutLabel) glossaryShortcutLabel.textContent = "Abrir glosario";
          if (glossaryShortcutKey) glossaryShortcutKey.textContent = "G";
          shortcutCard.insertBefore(glossaryShortcutRow, closeShortcutRow || null);
        }
      }
      updateFontControls();
      updateTtsVoiceControls();
      updateTtsSpeedControls();
      syncEasyReadSwitchVisual();
    }

    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-reflow-font-size]");
      if (!button) return;
      applyFontSize(button.dataset.reflowFontSize);
    });

    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-reflow-tts-voice]");
      if (!button) return;
      applyTtsVoice(button.dataset.reflowTtsVoice);
    });

    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-reflow-tts-speed]");
      if (!button || typeof window.__adtReflowSetAudioSpeed !== "function") return;
      window.__adtReflowSetAudioSpeed(Number(button.dataset.reflowTtsSpeed));
      updateTtsSpeedControls();
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest("#reflow-open-glossary")) return;
      toggleRuntimePanel(["Glosario", "Glossary"]);
    });

    mountInSettingsPanel();
    if (interfaceContainer) {
      new MutationObserver(mountInSettingsPanel).observe(interfaceContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  function updateTtsSpeedControls() {
    var speed = typeof window.__adtReflowGetAudioSpeed === "function"
      ? Number(window.__adtReflowGetAudioSpeed())
      : 1;
    if (!Number.isFinite(speed)) speed = 1;
    document.querySelectorAll("[data-reflow-tts-speed]").forEach(function (button) {
      var selected = Number(button.dataset.reflowTtsSpeed) === speed;
      setAttributeIfChanged(button, "aria-checked", selected);
      setAttributeIfChanged(button, "aria-pressed", selected);
    });
  }

  /* Word-by-word tracking becomes visually unreliable once narration is
     faster than the normal rate. Keep the runtime setting authoritative,
     expose the restriction in Settings, and re-enable the choice as soon as
     the reader returns to Slow or Normal. */
  function installTtsSpeedHighlightRestriction() {
    var lastRestricted = null;
    var restoreWordAfterRestriction = false;
    var scheduled = false;

    function normalized(value) {
      return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
    }

    function currentSpeed() {
      if (window.__adtReflowGetAudioSpeed) {
        var speed = Number(window.__adtReflowGetAudioSpeed());
        if (Number.isFinite(speed)) return speed;
      }
      var speedButton = document.querySelector(
        'button[data-slot="dropdown-menu-trigger"][aria-label*="Velocidad"], ' +
        'button[data-slot="dropdown-menu-trigger"][aria-label*="Playback speed"]'
      );
      var label = normalized(
        speedButton && (speedButton.getAttribute("aria-label") || speedButton.textContent)
      );
      if (/muy r[aá]pid|very fast/.test(label)) return 1.5;
      if (/r[aá]pid|fast/.test(label)) return 1.25;
      if (/lent|slow/.test(label)) return 0.75;
      return 1;
    }

    function wordHighlightButtons() {
      return Array.prototype.slice.call(document.querySelectorAll(
        '.reflow-accessibility-panel [role="radio"]'
      )).filter(function (button) {
        return /^(palabra|word)$/.test(normalized(button.textContent));
      });
    }

    function wordHighlightActive() {
      if (window.__adtReflowGetWordHighlight) {
        return Boolean(window.__adtReflowGetWordHighlight());
      }
      return wordHighlightButtons().some(function (button) {
        return button.getAttribute("aria-checked") === "true";
      });
    }

    function sync() {
      scheduled = false;
      var restricted = currentSpeed() > 1;
      document.body.dataset.reflowWordHighlightRestricted = String(restricted);

      wordHighlightButtons().forEach(function (button) {
        button.disabled = restricted;
        button.setAttribute("aria-disabled", String(restricted));
        button.classList.toggle("reflow-speed-disabled", restricted);
        if (restricted) {
          button.title = "Disponible sólo con velocidad Lenta o Normal";
        } else {
          button.removeAttribute("title");
        }
      });

      if (restricted && lastRestricted !== true && window.__adtReflowSetWordHighlight) {
        var wasWordHighlight = wordHighlightActive();
        restoreWordAfterRestriction = wasWordHighlight;
        if (wasWordHighlight) window.__adtReflowSetWordHighlight(false);
      } else if (!restricted && lastRestricted === true) {
        if (restoreWordAfterRestriction && window.__adtReflowSetWordHighlight) {
          window.__adtReflowSetWordHighlight(true);
        }
        restoreWordAfterRestriction = false;
      }
      lastRestricted = restricted;
      window.setTimeout(function () {
        document.body.dataset.reflowHighlightMode = wordHighlightActive()
          ? "word"
          : "sentence";
      }, 0);
    }

    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(sync);
    }

    document.addEventListener("click", function (event) {
      var choice = event.target.closest('[role="menuitemradio"]');
      if (!choice) return;
      if (/r[aá]pid|fast/.test(normalized(choice.textContent))) {
        window.setTimeout(schedule, 0);
      } else if (/lent|normal|slow/.test(normalized(choice.textContent))) {
        window.setTimeout(schedule, 0);
      }
    });

    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-label", "aria-checked"]
    });
    sync();
  }

  function installCompactRuntimePanels() {
    var scheduled = false;

    function normalized(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    }

    function classifyPanel(panel) {
      panel.classList.remove(
        "reflow-navigation-panel",
        "reflow-accessibility-panel",
        "reflow-glossary-panel",
        "reflow-language-panel"
      );
      var heading = panel.querySelector("h1, h2, h3, h4, h5, h6");
      var headingText = normalized(heading && heading.textContent);
      var controls = Array.prototype.slice.call(panel.querySelectorAll('button, [role="tab"]'));
      var pressedDockButton = Array.prototype.slice.call(document.querySelectorAll(
        'button[aria-pressed="true"], [role="button"][aria-pressed="true"]'
      )).find(function (button) {
        return /^idioma$/i.test(normalized(button.getAttribute("aria-label") || button.textContent));
      });
      var pressedDockLabel = normalized(
        pressedDockButton && (pressedDockButton.getAttribute("aria-label") || pressedDockButton.textContent)
      );
      var hasSearch = Boolean(panel.querySelector('input[placeholder="Buscar"], input[type="search"]'));

      /* The language panel initially mounts as a search-only shell. The
         pressed dock control is stable during that frame and lets us hide
         the shell until Español and Lectura fácil have mounted. */
      if (/^idioma$/i.test(pressedDockLabel) && hasSearch) {
        panel.classList.add("reflow-language-panel");
        return;
      }
      var isNavigation = controls.some(function (control) {
        return /^(índice|lista de páginas|páginas)$/i.test(normalized(control.textContent));
      });
      /* On the first frame the tabs may not exist yet, but the heading and
         search field already do. Classify from the stable heading so the
         panel does not need a second click to receive its complete layout. */
      if (/^índice$/i.test(headingText) || isNavigation) {
        panel.classList.add("reflow-navigation-panel");
        return;
      }

      var text = normalized(panel.textContent);
      if (/configuración|lectura fácil|texto a voz|tamaño de letra/i.test(text)) {
        panel.classList.add("reflow-accessibility-panel");
        if (heading && /^configuración$/i.test(headingText)) heading.textContent = "Herramientas";
        panel.setAttribute("aria-label", "Herramientas");
        return;
      }

      if (/^glosario\b|resaltar palabras|glosario del libro/i.test(text)) {
        panel.classList.add("reflow-glossary-panel");
      }
    }

    function dockPanelToViewport(panel) {
      var anchor = panel.parentElement;
      if (!anchor || anchor.getAttribute("role") !== "presentation") return;
      var rect = panel.getBoundingClientRect();
      /* Popper keeps its intended vertical coordinate in the inline
         translate(). Read that value instead of the already-docked box, so
         repeated observer passes cannot accumulate a vertical offset. */
      var popperTransform = anchor.style.transform || "";
      var translated = popperTransform.match(
        /translate(?:3d)?\(\s*[-\d.]+px\s*,\s*([-\d.]+)px/i
      );
      var intendedTop = translated ? Number(translated[1]) : rect.top;

      /* The language options are resolved asynchronously. If Popper measured
         only the initial search shell, its old top leaves the completed menu
         below the viewport. Fit the final panel immediately above Idioma so
         the first click reveals Buscar, the language and Lectura fácil. */
      if (panel.classList.contains("reflow-language-panel")) {
        var languageButton = document.querySelector('button[aria-label="Idioma"]');
        if (languageButton) {
          var languageButtonRect = languageButton.getBoundingClientRect();
          intendedTop = Math.min(
            intendedTop,
            languageButtonRect.top - 12 - rect.height
          );
        }
      }
      anchor.style.setProperty(
        "--reflow-panel-top",
        Math.max(0, Math.round(intendedTop)) + "px"
      );
      anchor.classList.add("reflow-panel-anchor");
      anchor.classList.toggle(
        "reflow-panel-anchor-left",
        panel.classList.contains("reflow-navigation-panel")
      );
      anchor.classList.toggle(
        "reflow-panel-anchor-right",
        !panel.classList.contains("reflow-navigation-panel")
      );
    }

    function panelContentsReady(panel) {
      if (panel.classList.contains("reflow-navigation-panel")) {
        return Boolean(
          panel.querySelector('input[placeholder="Buscar"], input[type="search"]') &&
          panel.querySelector('[role="tablist"]') &&
          panel.querySelector('[role="tabpanel"]')
        );
      }
      if (panel.classList.contains("reflow-glossary-panel")) {
        var glossaryListReady = Boolean(
          panel.querySelector('[role="tablist"]') &&
          panel.querySelector('[role="tabpanel"]')
        );
        /* Selecting a highlighted word replaces the list with a compact
           definition card. Treat that card as a complete glossary state;
           otherwise the readiness guard leaves it undocked/off-screen and
           subsequent clicks appear to stop opening the glossary. */
        var glossaryDetailReady = Boolean(
          panel.querySelector('[aria-label="glossary-term-details"]') ||
          Array.prototype.slice.call(panel.querySelectorAll("button")).some(function (button) {
            return /mostrar en la p[aá]gina|show on page/i.test(normalized(button.textContent));
          })
        );
        return glossaryListReady || glossaryDetailReady;
      }
      if (panel.classList.contains("reflow-accessibility-panel")) {
        return Boolean(panel.querySelector("section, [role=\"switch\"]"));
      }
      if (panel.classList.contains("reflow-language-panel")) {
        var languageOption = Array.prototype.slice.call(panel.querySelectorAll("button, [role=\"option\"]")).some(
          function (control) { return /español\s*\(uruguay\)/i.test(normalized(control.textContent)); }
        );
        var easyReadSwitch = Array.prototype.slice.call(panel.querySelectorAll('[role="switch"]')).some(
          function (control) {
            var labelledBy = control.getAttribute("aria-labelledby");
            var labelledText = labelledBy && document.getElementById(labelledBy)
              ? document.getElementById(labelledBy).textContent
              : "";
            var rowText = control.parentElement && control.parentElement.parentElement
              ? control.parentElement.parentElement.textContent
              : "";
            return /lectura fácil/i.test(normalized([
              control.getAttribute("aria-label"), labelledText, control.textContent, rowText
            ].join(" ")));
          }
        );
        return Boolean(
          panel.querySelector('input[placeholder="Buscar"], input[type="search"]') &&
          languageOption && easyReadSwitch
        );
      }
      return true;
    }

    function syncReadingShift() {
      document.body.classList.remove("reflow-panel-left-open", "reflow-panel-right-open");
      document.body.style.removeProperty("--reflow-panel-shift");
    }

    function updatePanels() {
      scheduled = false;
      document.querySelectorAll('[role="dialog"][data-slot="popover-content"]').forEach(function (panel) {
        classifyPanel(panel);
        var isTargetPanel = panel.classList.contains("reflow-navigation-panel") ||
          panel.classList.contains("reflow-accessibility-panel") ||
          panel.classList.contains("reflow-glossary-panel") ||
          panel.classList.contains("reflow-language-panel");
        /* Do not compact a target while React has mounted only its heading
           and search field. Wait for the tabs/content, then apply the exact
           same natural height the complete panel used before. */
        if (isTargetPanel && !panelContentsReady(panel)) {
          panel.classList.add("reflow-panel-pending");
          var readinessAttempts = Number(panel.dataset.reflowReadinessAttempts || 0);
          if (readinessAttempts < 240) {
            panel.dataset.reflowReadinessAttempts = String(readinessAttempts + 1);
            requestAnimationFrame(scheduleUpdate);
          } else {
            panel.classList.remove("reflow-panel-pending");
          }
          return;
        }
        panel.classList.remove("reflow-panel-pending");
        panel.removeAttribute("data-reflow-readiness-attempts");
        if (!panel.classList.contains("reflow-reader-panel")) {
          var rect = panel.getBoundingClientRect();
          if (!isTargetPanel && rect.width < 480) return;
          panel.classList.add("reflow-reader-panel");
          if (rect.height >= 300) panel.classList.add("reflow-reader-panel-tall");
        }
        dockPanelToViewport(panel);
      });
      requestAnimationFrame(syncReadingShift);
    }

    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updatePanels);
    }

    function primePanels() {
      document.querySelectorAll('[role="dialog"][data-slot="popover-content"]').forEach(function (panel) {
        classifyPanel(panel);
        var isTargetPanel = panel.classList.contains("reflow-navigation-panel") ||
          panel.classList.contains("reflow-accessibility-panel") ||
          panel.classList.contains("reflow-glossary-panel") ||
          panel.classList.contains("reflow-language-panel");
        if (isTargetPanel && !panelContentsReady(panel)) panel.classList.add("reflow-panel-pending");
      });
      scheduleUpdate();
    }

    new MutationObserver(primePanels).observe(document.body, {
      childList: true,
      subtree: true
    });
    window.addEventListener("resize", scheduleUpdate);
    primePanels();
  }

  /* The source manifest has one entry per imported source page, while this
     book paginates into CSS columns. Those coordinate systems are not 1:1.
     Build the page list from the live visual columns and use chapter_id only
     for TOC headings; never infer a visual page from a manifest array index. */
  function installRuntimeMenuAdapter() {
    var refreshScheduled = false;
    var pageButtonClass =
      "w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-md " +
      "text-base text-left hover:bg-accent hover:text-accent-foreground " +
      "focus:outline-none focus:bg-accent focus:text-accent-foreground " +
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";
    var currentPageClass = " bg-accent text-accent-foreground font-medium";
    var chapterLabelClass = "reflow-index-group";

    function normalized(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    }

    function tocLevel(entry) {
      var level = Number(entry && entry.level);
      return level >= 1 && level <= 3 ? level : 2;
    }

    function tocKind(entry) {
      var level = tocLevel(entry);
      return level === 1 ? "chapter" : level === 2 ? "section" : "page";
    }

    function isNavigationPanel(panel) {
      if (!panel) return false;
      if (panel.id === "navPopup") return true;
      return Array.prototype.slice.call(panel.querySelectorAll('button, [role="tab"]')).some(function (item) {
        return /^(índice|lista de páginas|páginas)$/i.test(normalized(item.textContent));
      });
    }

    function navigationPanelFor(element) {
      if (!element || !element.closest) return null;
      var panel = element.closest('#navPopup, [role="dialog"], [data-slot="popover-content"]');
      return isNavigationPanel(panel) ? panel : null;
    }

    function navigationMode(panel) {
      var selectedTab = panel && panel.querySelector('[role="tab"][aria-selected="true"]');
      return selectedTab && /lista de páginas|páginas/i.test(normalized(selectedTab.textContent))
        ? "pages"
        : "toc";
    }

    function pageNumberForButton(button) {
      var ariaLabel = normalized(button.getAttribute("aria-label"));
      var visibleLabel = normalized(button.textContent).replace(/\bimprimir\b/ig, "").trim();
      var match = ariaLabel.match(/^(?:page|página)\s+(\d+)/i) ||
        visibleLabel.match(/^(\d+)(?:\s*\([^)]*\))?$/);
      return match ? Number(match[1]) : 0;
    }

    function tocEntryForButton(button, panel) {
      if (!button) return null;
      var toc = window.__adtReflowTocEntries || [];
      var sectionId = button.dataset.reflowTocSectionId;
      var anchorId = button.dataset.reflowAnchorId;
      var explicit = toc.find(function (entry) {
        return (sectionId && entry.section_id === sectionId) ||
          (anchorId && entry.chapter_id === anchorId);
      });
      if (explicit) return explicit;

      var label = normalized(button.textContent);
      var match = toc.find(function (entry) {
        return normalized(entry.title).toLocaleLowerCase("es") === label.toLocaleLowerCase("es");
      });
      if (match) return match;

      var tabpanel = button.closest('[role="tabpanel"]');
      if (!tabpanel || navigationMode(panel) !== "toc") return null;
      var buttons = Array.prototype.slice.call(tabpanel.querySelectorAll("button"));
      var index = buttons.indexOf(button);
      return toc[index] || null;
    }

    function visualChapters() {
      var toc = window.__adtReflowTocEntries || [];
      var chapters = toc.map(function (entry) {
        var heading = entry.chapter_id
          ? content.querySelector('[data-id="' + entry.chapter_id + '"]')
          : null;
        var headingPages = heading ? pagesForElement(heading) : [];
        var pageIndex = headingPages.length ? headingPages[0] : visiblePageForSection(entry.section_id);
        return pageIndex === null ? null : { entry: entry, pageIndex: pageIndex };
      }).filter(Boolean).sort(function (left, right) {
        return left.pageIndex - right.pageIndex;
      });

      if (!chapters.length || chapters[0].pageIndex > 0) {
        chapters.unshift({
          entry: { title: "Páginas", chapter_id: "", section_id: "", level: 1 },
          pageIndex: 0
        });
      }
      return chapters;
    }

    function matchingVisualGroups(panel) {
      var search = panel.querySelector('input[placeholder="Buscar"], input[type="search"], input');
      var query = normalized(search && search.value).toLocaleLowerCase("es");
      var numericQuery = query.replace(/^página\s+/, "");
      var chapters = visualChapters();
      var groups = [];

      chapters.forEach(function (chapter, index) {
        var start = Math.max(0, chapter.pageIndex);
        var end = index + 1 < chapters.length
          ? Math.min(state.total, chapters[index + 1].pageIndex)
          : state.total;
        var title = normalized(chapter.entry.title);
        var titleMatches = !query || title.toLocaleLowerCase("es").indexOf(query) >= 0;
        var pages = [];
        for (var pageIndex = start; pageIndex < end; pageIndex += 1) {
          var pageNumber = String(pageIndex + 1);
          if (titleMatches || pageNumber.indexOf(numericQuery) >= 0) pages.push(pageIndex);
        }
        if (pages.length) groups.push({ chapter: chapter, pages: pages });
      });
      return { groups: groups, query: query };
    }

    function rebuildVisualPageList(panel) {
      var tabpanel = panel.querySelector('[role="tabpanel"]');
      var list = tabpanel && tabpanel.querySelector("ol, ul");
      if (!list) return;

      var result = matchingVisualGroups(panel);
      var signature = [
        state.total,
        state.current,
        result.query,
        result.groups.map(function (group) {
          return group.chapter.entry.title + ":" + group.pages.join(",");
        }).join("|")
      ].join(";");
      var expectedButtons = result.groups.reduce(function (total, group) {
        return total + group.pages.length;
      }, 0);
      if (
        list.dataset.reflowVisualSignature === signature &&
        list.querySelectorAll("button[data-reflow-page-index]").length === expectedButtons
      ) return;

      var fragment = document.createDocumentFragment();
      result.groups.forEach(function (group) {
        var chapterItem = document.createElement("li");
        var chapterHeading = document.createElement("span");
        var groupLevel = tocLevel(group.chapter.entry);
        chapterItem.className = chapterLabelClass;
        chapterItem.dataset.reflowIndexLevel = String(groupLevel);
        if (group.chapter.entry.chapter_id) {
          chapterItem.dataset.chapterId = group.chapter.entry.chapter_id;
        }
        chapterHeading.className = "reflow-index-group-title";
        chapterHeading.setAttribute("role", "heading");
        chapterHeading.setAttribute("aria-level", String(Math.min(6, groupLevel + 1)));
        chapterHeading.textContent = group.chapter.entry.title;
        chapterItem.appendChild(chapterHeading);
        fragment.appendChild(chapterItem);

        group.pages.forEach(function (pageIndex) {
          var pageNumber = pageIndex + 1;
          var pageLabel = pageNumber === 1 ? "1 (Portada)" : String(pageNumber);
          var item = document.createElement("li");
          var button = document.createElement("button");
          var span = document.createElement("span");
          button.type = "button";
          button.className = pageButtonClass + (pageIndex === state.current ? currentPageClass : "");
          button.dataset.reflowPageIndex = String(pageIndex);
          button.dataset.reflowEntryKind = "page";
          button.classList.add("reflow-index-page-button");
          button.setAttribute("aria-label", "Página " + pageLabel);
          button.setAttribute("title", "Ir a la página " + pageLabel);
          if (pageIndex === state.current) button.setAttribute("aria-current", "page");
          span.className = "truncate";
          span.textContent = pageLabel;
          button.appendChild(span);
          item.appendChild(button);
          fragment.appendChild(item);
        });
      });

      list.replaceChildren(fragment);
      list.dataset.reflowVisualSignature = signature;
      list.dataset.reflowVisualPages = "true";
      panel.dataset.reflowPageCount = String(state.total);
    }

    function decorateToc(panel) {
      var toc = window.__adtReflowTocEntries || [];
      var chapters = visualChapters();
      var activeChapter = null;
      chapters.forEach(function (chapter, index) {
        var nextPage = index + 1 < chapters.length ? chapters[index + 1].pageIndex : state.total;
        if (state.current >= chapter.pageIndex && state.current < nextPage) {
          activeChapter = chapter.entry;
        }
      });
      var tabpanel = panel.querySelector('[role="tabpanel"]');
      if (!tabpanel) return;
      Array.prototype.slice.call(tabpanel.querySelectorAll("button")).forEach(function (button, index) {
        var entry = tocEntryForButton(button, panel) || toc[index];
        if (!entry) return;
        var level = tocLevel(entry);
        button.dataset.reflowTocSectionId = entry.section_id;
        button.dataset.reflowTocLevel = String(level);
        button.dataset.reflowEntryKind = tocKind(entry);
        button.classList.add("reflow-toc-entry");
        if (entry.chapter_id) button.dataset.reflowAnchorId = entry.chapter_id;
        button.removeAttribute("aria-current");
        if (
          activeChapter &&
          entry.section_id === activeChapter.section_id &&
          entry.chapter_id === activeChapter.chapter_id
        ) {
          button.setAttribute("aria-current", "location");
        }
        var label = button.querySelector("span") || button;
        if (normalized(label.textContent) !== normalized(entry.title)) label.textContent = entry.title;
      });
    }

    function closeNavigationPanel() {
      var legacyClose = document.getElementById("nav-close");
      if (legacyClose && legacyClose.getClientRects().length) {
        legacyClose.click();
        restoreIndexFocusAfterResult();
        return;
      }
      var trigger = document.querySelector(
        'button[aria-label="Menú principal"][aria-pressed="true"], ' +
        'button[title="Menú principal"][aria-pressed="true"]'
      );
      if (!trigger) {
        trigger = Array.prototype.slice.call(
          document.querySelectorAll('[data-dock-trigger][aria-pressed="true"]')
        ).find(function (candidate) {
          var label = normalized(candidate.getAttribute("aria-label") + " " + candidate.getAttribute("title"));
          return /menú principal|navegación|índice/i.test(label);
        });
      }
      if (trigger) {
        trigger.click();
        restoreIndexFocusAfterResult();
      }
    }

    function removePrintLabel(button) {
      Array.prototype.slice.call(button.querySelectorAll("span, small")).forEach(function (label) {
        if (/^imprimir$/i.test(normalized(label.textContent))) label.remove();
      });
      Array.prototype.slice.call(button.childNodes).forEach(function (node) {
        if (node.nodeType === 3 && /^imprimir$/i.test(normalized(node.nodeValue))) node.remove();
      });
    }

    function refreshMenus() {
      refreshScheduled = false;
      var candidates = document.querySelectorAll('#navPopup, [role="dialog"], [data-slot="popover-content"]');
      Array.prototype.slice.call(candidates).forEach(function (panel) {
        if (!isNavigationPanel(panel)) return;
        panel.dataset.reflowNavigationPanel = "true";
        panel.querySelectorAll('[role="tabpanel"] button').forEach(removePrintLabel);
        if (navigationMode(panel) === "pages") rebuildVisualPageList(panel);
        else decorateToc(panel);
      });
    }

    function scheduleRefresh() {
      if (refreshScheduled) return;
      refreshScheduled = true;
      requestAnimationFrame(refreshMenus);
    }

    document.addEventListener("click", function (event) {
      var button = event.target && event.target.closest
        ? event.target.closest("button")
        : null;
      var panel = navigationPanelFor(button);
      if (!panel || !button.closest('[role="tabpanel"]')) return;

      if (navigationMode(panel) === "pages") {
        var pageIndex = Number(button.dataset.reflowPageIndex);
        if (!Number.isInteger(pageIndex)) pageIndex = pageNumberForButton(button) - 1;
        if (pageIndex < 0 || pageIndex >= state.total) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        goToPage(pageIndex, { announce: true });
        requestAnimationFrame(closeNavigationPanel);
        return;
      }

      var tocEntry = tocEntryForButton(button, panel);
      if (!tocEntry || !tocEntry.section_id) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (goToSection(tocEntry.section_id, true)) requestAnimationFrame(closeNavigationPanel);
    }, true);

    document.addEventListener("input", function (event) {
      if (navigationPanelFor(event.target)) scheduleRefresh();
    }, true);

    state.runtimeMenuObserver = new MutationObserver(scheduleRefresh);
    state.runtimeMenuObserver.observe(document.body, { childList: true, subtree: true });
    state.runtimeMenuRefresh = scheduleRefresh;
    scheduleRefresh();
  }

  function wireNavigation() {
    function pageStablePanelInteraction(target) {
      if (!target || !target.closest) return null;
      var dockTrigger = target.closest(
        '#reflow-index, #reflow-tools, #reflow-open-glossary, ' +
        'button[aria-label="Menú principal"], button[aria-label="Glosario"], ' +
        readAloudDisabledSelector + "," + readAloudEnabledSelector + "," +
        'button[aria-label="Idioma"], button[aria-label="Configuración"]'
      );
      if (dockTrigger) return dockTrigger;

      var dialog = target.closest('[role="dialog"]');
      if (!dialog) return null;
      /* Tabs and search focus do not change typography, so they preserve the
         exact visual page. Settings that repaginate are deliberately omitted:
         they must preserve the semantic anchor, not an obsolete page number. */
      var stableField = target.closest(
        '[role="tab"], input[type="search"], input[placeholder="Buscar"], ' +
        'input[aria-label="Buscar"]'
      );
      if (stableField) return stableField;
      var settingsControl = target.closest('[role="switch"], [role="radio"], button');
      if (!settingsControl) return null;
      if (
        isEasyReadSwitch(settingsControl) ||
        settingsControl.hasAttribute("data-reflow-font-size")
      ) return null;
      /* Voice, autoplay, image descriptions, highlighting and menu behavior
         may rebuild runtime state, but none changes the printed geometry.
         Keep the exact visual page while those controls settle. */
      return settingsControl;
    }

    function restorePanelTogglePage() {
      if (state.panelToggleLockPage === null || Date.now() > state.panelToggleLockUntil) return;
      var page = Math.max(0, Math.min(state.total - 1, state.panelToggleLockPage));
      content.style.scrollBehavior = "auto";
      content.scrollLeft = page * pageWidth();
      state.current = page;
      state.currentAnchorId = paintedSemanticAnchorId() || state.currentAnchorId;
      updateControls(false);
    }

    function schedulePanelToggleRestore() {
      window.clearTimeout(state.panelToggleRestoreTimer);
      restorePanelTogglePage();
      requestAnimationFrame(function () {
        restorePanelTogglePage();
        requestAnimationFrame(restorePanelTogglePage);
      });
      [80, 220, 480, 900, 1600, 2400, 3100].forEach(function (delay) {
        window.setTimeout(restorePanelTogglePage, delay);
      });
      state.panelToggleRestoreTimer = window.setTimeout(function () {
        restorePanelTogglePage();
        state.panelToggleLockPage = null;
        state.panelToggleLockUntil = 0;
      }, 3400);
    }

    function primePanelToggleLock(event) {
      var stableInteraction = pageStablePanelInteraction(event.target);
      if (!stableInteraction) {
        if (event.target && event.target.closest && event.target.closest('[role="dialog"]')) {
          window.clearTimeout(state.panelToggleRestoreTimer);
          state.panelToggleLockPage = null;
          state.panelToggleLockUntil = 0;
        }
        return;
      }
      if (state.panelToggleLockPage === null || Date.now() > state.panelToggleLockUntil) {
        state.panelToggleLockPage = visiblePageIndex();
      }
      /* Some runtime settings rebuild their audio queue for roughly two
         seconds before committing. Keep the visual page protected across the
         whole async window; an explicit Previous/Next command clears this
         lock immediately, so it can never trap navigation. */
      state.panelToggleLockUntil = Date.now() + 3600;

      /* Some panels open on pointerdown while others open on click, so neither
         native event can be cancelled. The page lock instead restores the
         committed visual page during every layout frame of the interaction. */
      if (event.type === "click") schedulePanelToggleRestore();
    }

    document.addEventListener("pointerdown", primePanelToggleLock, true);
    document.addEventListener("mousedown", primePanelToggleLock, true);
    document.addEventListener("touchstart", primePanelToggleLock, true);
    document.addEventListener("click", primePanelToggleLock, true);

    function closeOpenRuntimePanel() {
      var dialogs = Array.prototype.slice.call(document.querySelectorAll('[role="dialog"]')).filter(
        function (dialog) { return dialog.getClientRects().length > 0; }
      );
      var dialog = dialogs[dialogs.length - 1];
      if (!dialog) return false;

      var dialogText = String(dialog.textContent || "").replace(/\s+/g, " ").trim();
      var triggerLabel = null;
      if (
        dialog.classList.contains("reflow-navigation-panel") ||
        /^índice\b/i.test(dialogText)
      ) {
        triggerLabel = "Menú principal";
      } else if (
        dialog.classList.contains("reflow-glossary-panel") ||
        /^glosario\b/i.test(dialogText)
      ) {
        triggerLabel = "Glosario";
      } else if (
        dialog.classList.contains("reflow-language-panel") ||
        /español\s*\(uruguay\).*lectura fácil/i.test(dialogText)
      ) {
        triggerLabel = "Idioma";
      } else if (
        dialog.classList.contains("reflow-accessibility-panel") ||
        /^configuración\b/i.test(dialogText)
      ) {
        triggerLabel = "Configuración";
      } else if (
        /controles de lectura en voz alta/i.test(dialogText) ||
        dialog.querySelector('button[aria-label="Audio anterior"], button[aria-label="Previous audio"]')
      ) {
        var readAloudTrigger = document.querySelector(
          readAloudEnabledSelector + "," + readAloudDisabledSelector
        );
        triggerLabel = readAloudTrigger && readAloudTrigger.getAttribute("aria-label");
      }
      if (!triggerLabel) return false;

      var trigger = document.querySelector('button[aria-label="' + triggerLabel + '"]');
      if (!trigger) return false;
      trigger.click();
      return true;
    }

    function preserveTtsPanel(event) {
      var target = event.target;
      if (
        !target || !target.closest ||
        !target.closest("#reflow-pagination, #reflow-tts-player")
      ) return;
      /* The upstream fixed-layout shell also listens to pointer gestures and
         interprets them as its own page navigation. On the reconstructed chat
         that source-level movement races the reflow column change and restores
         the page being left. The custom paginator owns its complete pointer
         sequence whether TTS is active or not; the later click handler performs
         the single intended reflow movement. */
      event.stopImmediatePropagation();
    }

    document.addEventListener("pointerdown", preserveTtsPanel, true);
    document.addEventListener("mousedown", preserveTtsPanel, true);
    document.addEventListener("touchstart", preserveTtsPanel, true);

    function movePrimaryToolbarFocus(event) {
      var toolbar = event.target && event.target.closest
        ? event.target.closest("#reflow-pagination, #reflow-tts-player")
        : null;
      if (!toolbar || !/^Arrow(?:Left|Right|Up|Down)$/.test(event.key)) return false;
      var controls = Array.prototype.slice.call(
        toolbar.querySelectorAll("button:not([disabled])")
      ).filter(function (button) {
        return button.getAttribute("aria-hidden") !== "true" && button.getClientRects().length;
      });
      var currentIndex = controls.indexOf(event.target.closest("button"));
      if (currentIndex < 0 || controls.length < 2) return false;
      var direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      var nextIndex = (currentIndex + direction + controls.length) % controls.length;
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        controls[nextIndex].focus({ preventScroll: true });
      } catch (_error) {
        controls[nextIndex].focus();
      }
      return true;
    }

    document.addEventListener("keydown", function (event) {
      if (movePrimaryToolbarFocus(event)) return;
      var typingContext = event.target && event.target.closest && event.target.closest(
        "input, textarea, select, [contenteditable='true'], [data-activity-item]"
      );
      if (
        !event.defaultPrevented && !event.repeat &&
        !event.altKey && !event.ctrlKey && !event.metaKey &&
        !typingContext && String(event.key || "").toLocaleLowerCase("es") === "g"
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openRuntimePanel(["Glosario", "Glossary"]);
        return;
      }
      var focusedInPrimaryToolbar = Boolean(
        event.target && event.target.closest && event.target.closest("#reflow-pagination")
      );
      var pageShortcutFromToolbar = focusedInPrimaryToolbar &&
        /^(?:PageUp|PageDown|Home|End)$/.test(event.key);
      if (
        event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
        (isInteractive(event.target) && !pageShortcutFromToolbar)
      ) {
        return;
      }

      var destination = null;
      if (event.key === "ArrowRight" || event.key === "PageDown") destination = visiblePageIndex() + 1;
      if (event.key === "ArrowLeft" || event.key === "PageUp") destination = visiblePageIndex() - 1;
      if (event.key === "Home") destination = 0;
      if (event.key === "End") destination = state.total - 1;
      if (destination === null) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      /* Outside the toolbar the horizontal arrows turn pages. Page Up/Down,
         Home and End remain explicit page shortcuts even while a toolbar
         control has focus. */
      goToPage(destination, { explicit: true });
    }, true);

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.closest) return;

      /* The upstream reader treats a click on otherwise inert page content as
         backward tap-navigation in some fragmented layouts. That makes an
         ordinary click anywhere on the easy-read WhatsApp page unexpectedly
         return to the preceding page. Consume only truly non-interactive
         content clicks; links, glossary terms, quizzes and form controls keep
         their native behaviour. */
      var inertContentClick = target.closest("#content") && !target.closest(
        "a[href], button, input, select, textarea, label, " +
        "[role=\"button\"], [role=\"link\"], [role=\"radio\"], " +
        "[role=\"checkbox\"], .glossary-term, .quiz-option"
      );
      if (inertContentClick) {
        closeOpenRuntimePanel();
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      /* Keep user intent separate from the internal pause/play cycle used to
         seek between visual pages. The runtime changes this button label as
         playback changes, so recording the click in capture phase is reliable
         even when React updates immediately afterwards. */
      var pauseAudio = target.closest(
        'button[aria-label="Pausa"], button[aria-label="Pause"]'
      );
      if (pauseAudio) {
        state.ttsManuallyPaused = true;
        state.ttsResumeAfterSeek = false;
      }

      var resumeAudio = target.closest(
        'button[aria-label="Reproducir"], button[aria-label="Play"]'
      );
      if (resumeAudio) {
        state.ttsManuallyPaused = false;
        syncReadAloudSetting(true);
      }

      var stepAudio = target.closest(
        'button[aria-label="Audio anterior"], button[aria-label="Previous audio"], ' +
        'button[aria-label="Audio siguiente"], button[aria-label="Next audio"]'
      );
      if (stepAudio) {
        /* Preserve the user's playback state. While paused, Previous/Next
           selects and highlights exactly one neighbouring sentence without
           silently resuming continuous narration. */
        state.ttsStepShouldRemainPaused = state.ttsManuallyPaused || !ttsPlaybackIsRunning();
        if (state.ttsStepShouldRemainPaused) state.ttsManuallyPaused = true;
        syncReadAloudSetting(true);
      }

      var activateTts = target.closest(readAloudDisabledSelector);
      if (activateTts) {
        /* The speaker icon is a menu trigger. Playback starts only from the
           Play button inside the audio panel. */
        return;
      }

      var deactivateTts = target.closest(readAloudEnabledSelector);
      if (deactivateTts) {
        /* When TTS is enabled this is still the same menu trigger; opening it
           must not clear a manual pause or change playback state. */
        return;
      }

      var stopAudio = target.closest(
        'button[aria-label="Detener"], button[aria-label="Stop"]'
      );
      if (stopAudio) {
        syncReadAloudSetting(false);
        state.ttsManuallyPaused = false;
        window.clearTimeout(state.ttsActivationTimer);
        clearTtsAlignmentState();
        stopQuizFeedbackAudio();
        window.setTimeout(clearTtsRangeHighlight, 0);
        return;
      }

      var ownNext = target.closest("#reflow-next");
      var ownPrevious = target.closest("#reflow-previous");
      if (ownNext || ownPrevious) {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToPage(visiblePageIndex() + (ownNext ? 1 : -1), { explicit: true });
        return;
      }

      var nativeNext = target.closest(
        'button[aria-label="Next page"], button[aria-label="Página siguiente"]'
      );
      var nativePrevious = target.closest(
        'button[aria-label="Previous page"], button[aria-label="Página anterior"]'
      );

      if (nativeNext && nativeNext.id !== "reflow-next") {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToPage(visiblePageIndex() + 1, { explicit: true });
        return;
      }

      if (nativePrevious && nativePrevious.id !== "reflow-previous") {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToPage(visiblePageIndex() - 1, { explicit: true });
        return;
      }

      var link = target.closest("a[href]");
      if (!link) return;
      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (_error) {
        return;
      }
      var linkedSectionId = decodeURIComponent(url.hash.slice(1));
      var linkedSection = sections.find(function (entry) {
        return entry[0] === linkedSectionId;
      });
      if (linkedSection) {
        event.preventDefault();
        event.stopImmediatePropagation();
        goToSection(linkedSectionId, true);
        return;
      }
      var filename = url.pathname.split("/").pop() || "index.html";
      var mapped = fileToSection[filename];
      if (!mapped) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      goToSection(mapped.id, true);
    }, true);

    content.addEventListener("wheel", function (event) {
      /* A trackpad gesture emits both horizontal and vertical wheel events,
         followed by a long inertial tail. Previously we intercepted only the
         vertical events; the horizontal events scrolled #content natively
         while our vertical handler also changed pages. Around the fragmented
         WhatsApp panel those two movements visibly fought each other and made
         the reader oscillate between both chat pages.

         Own both axes and keep one gesture latched until the complete wheel
         stream has been quiet for 260 ms. This gives one physical swipe (or
         one mouse-wheel notch) exactly one discrete page change. */
      var dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
      if (Math.abs(dominantDelta) < 0.5) return;

      event.preventDefault();
      window.clearTimeout(state.wheelGestureTimer);
      state.wheelGestureTimer = window.setTimeout(function () {
        state.wheelGestureActive = false;
        state.wheelGestureDistance = 0;
      }, 260);

      if (state.wheelGestureActive) return;
      state.wheelGestureDistance += dominantDelta;

      var activationDistance = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? 24 : 1;
      if (Math.abs(state.wheelGestureDistance) < activationDistance) return;

      state.wheelGestureActive = true;
      var direction = state.wheelGestureDistance > 0 ? 1 : -1;
      state.wheelGestureDistance = 0;
      goToPage(visiblePageIndex() + direction, { explicit: true });
    }, { passive: false });

    var scrollTimer = 0;
    content.addEventListener("scroll", function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        if (state.panelToggleLockPage !== null && Date.now() <= state.panelToggleLockUntil) {
          restorePanelTogglePage();
          return;
        }
        state.current = Math.max(
          0,
          Math.min(state.total - 1, Math.round(content.scrollLeft / pageWidth()))
        );
        state.currentAnchorId = paintedSemanticAnchorId() || state.currentAnchorId;
        updateControls(false);
        saveProgress();
      }, 80);
    }, { passive: true });

    window.addEventListener("resize", function () {
      window.clearTimeout(state.resizeTimer);
      state.resizeTimer = window.setTimeout(function () {
        balanceCoverMargins();
        recalculate({ anchorId: state.currentAnchorId, preserveTts: true });
      }, 140);
    });

    window.addEventListener("hashchange", function () {
      var sectionId = decodeURIComponent(window.location.hash.slice(1));
      if (sections.some(function (entry) { return entry[0] === sectionId; })) {
        goToSection(sectionId, false);
      }
    });
  }

  /* Watch rendered content boxes, not only DOM mutations. This catches pure
     CSS changes, late font metrics and image dimensions that alter column
     pagination without adding or removing nodes. ResizeObserver batches the
     work and preserves the active TTS item while rebuilding page geometry. */
  function installAutomaticLayoutObserver() {
    if (typeof ResizeObserver !== "function" || state.layoutObserver) return;
    var initialized = false;
    var layoutSignature = function () {
      return [
        Math.round(content.scrollWidth),
        Math.round(content.scrollHeight),
        Math.round(content.clientWidth),
        document.body.dataset.reflowFontSize || "normal",
        document.body.classList.contains("reflow-easy-read") ? "easy" : "standard"
      ].join("|");
    };
    var scheduleLayoutRefresh = function (entries) {
      if (!initialized || state.ttsMarkupRestoring) return;
      if (state.settingsRepaginationActive) {
        scheduleSettingsRepaginationFinalize(280);
        return;
      }
      if (Date.now() <= state.settingsRepaginationIgnoreUntil) return;
      /* Moving the yellow TTS range between WhatsApp bubbles can briefly
         replace inline wrappers. Those changes never alter pagination, but a
         ResizeObserver callback used to schedule a full reflow and produced
         a one-frame flash. Ignore only chat-local TTS transitions. */
      if (
        (state.ttsManualHandoffPending || Date.now() <= state.ttsChatTransitionUntil) &&
        Array.isArray(entries) && entries.length &&
        entries.every(function (entry) {
          return entry.target && entry.target.closest &&
            Boolean(entry.target.closest(".whatsapp-chat-window"));
        })
      ) return;
      window.clearTimeout(state.layoutObserverTimer);
      state.layoutObserverTimer = window.setTimeout(function () {
        if (state.settingsRepaginationActive) {
          scheduleSettingsRepaginationFinalize(280);
          return;
        }
        if (Date.now() <= state.settingsRepaginationIgnoreUntil) return;
        var signature = layoutSignature();
        if (Date.now() - state.lastContentReflowAt < 600) {
          state.layoutObserverSignature = signature;
          return;
        }
        if (signature === state.layoutObserverSignature) return;
        state.layoutObserverSignature = signature;
        var active = activeTtsElement();
        var anchorId = state.quizRepaginationAnchorId ||
          livePendingSettingsAnchorId() ||
          (active && active.dataset ? active.dataset.id : state.currentAnchorId);
        rebalanceIllustratedPage();
        rebalanceChapterTwoIllustrations();
        rebalanceAtticIllustration();
        repairParagraphMarkers();
        updateReadingBlockSizing();
        balanceCoverMargins();
        recalculate({
          sectionId: state.initialHashSectionId,
          anchorId: state.initialHashSectionId ? null : anchorId,
          preserveTts: !state.initialHashSectionId
        });
        requestAnimationFrame(function () {
          state.layoutObserverSignature = layoutSignature();
        });
      }, 120);
    };
    state.layoutObserver = new ResizeObserver(scheduleLayoutRefresh);
    /* Do not observe every semantic span.  The complete book contains many
       thousands of [data-id] nodes and one font-size change consequently
       delivered thousands of ResizeObserver entries.  Explicit settings
       repagination and the content MutationObserver already cover ordinary
       prose, so box observation is only needed for the composite layouts
       whose dimensions can change independently. */
    Array.prototype.slice.call(content.querySelectorAll(
      ".reading-block, .whatsapp-chat-window, .illustrated-page, " +
      ".chapter-cover, .quiz-panel"
    )).forEach(function (element) {
      state.layoutObserver.observe(element);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        state.layoutObserverSignature = layoutSignature();
        initialized = true;
      });
    });
    if (document.fonts && document.fonts.addEventListener) {
      document.fonts.addEventListener("loadingdone", scheduleLayoutRefresh);
    }
  }

  async function fetchSection(entry) {
    var separator = entry[1].indexOf("?") >= 0 ? "&" : "?";
    var response = await fetch(entry[1] + separator + "v=47-full-book-62");
    if (!response.ok) throw new Error("No se pudo cargar " + entry[1]);
    var source = await response.text();
    var documentFragment = new DOMParser().parseFromString(source, "text/html");
    var section = documentFragment.querySelector(
      '[data-section-id="' + entry[0] + '"], [data-section-type="activity_quiz"][data-id="' + entry[0] + '"]'
    );
    if (!section) throw new Error("No se encontró la sección " + entry[0]);
    return document.importNode(section, true);
  }

  function composePreliminaryTitle() {
    var firstLine = content.querySelector('[data-id="pg009_n0002"]');
    var secondLine = content.querySelector('[data-id="pg009_n0003"]');
    if (!firstLine || !secondLine) return;
    var firstText = firstLine.textContent.trim();
    var secondText = secondLine.textContent.trim();
    firstLine.replaceChildren(
      document.createTextNode(firstText),
      document.createElement("br"),
      document.createTextNode(secondText)
    );
    firstLine.classList.add("preliminary-title-continuous");
    secondLine.remove();
  }

  function composeChapterCover() {
    var firstHalf = content.querySelector('[data-section-id="pg016_sec001"]');
    var secondHalf = content.querySelector('[data-section-id="pg017_sec001"]');
    if (!firstHalf || !secondHalf || firstHalf.parentElement !== content || secondHalf.parentElement !== content) {
      return;
    }

    var cover = document.createElement("div");
    cover.className = "chapter-cover";
    cover.setAttribute("role", "group");

    var title = secondHalf.querySelector("h1");
    if (title) {
      title.id = "chapter-cover-heading";
      cover.setAttribute("aria-labelledby", title.id);
    }

    content.insertBefore(cover, firstHalf);
    cover.appendChild(firstHalf);
    cover.appendChild(secondHalf);

    var sourceImages = [];
    [firstHalf, secondHalf].forEach(function (section) {
      var sourceImage = section.querySelector("img");
      if (sourceImage) {
        sourceImage.classList.add("chapter-cover-source");
        sourceImages.push(sourceImage);
      }
    });

    var composite = document.createElement("img");
    composite.className = "chapter-cover-composite";
    composite.src = "images/chapter1_cover.png";
    composite.alt = "";
    composite.setAttribute("aria-hidden", "true");
    cover.appendChild(composite);

    /* The two source pages describe the same reconstructed cover. Keep only
       the complete second-half description and place it after the heading,
       subtitle and visible composite in semantic/TTS order. */
    var canonicalImage = sourceImages[sourceImages.length - 1];
    sourceImages.forEach(function (sourceImage) {
      if (sourceImage !== canonicalImage) sourceImage.remove();
    });
    if (canonicalImage) cover.appendChild(canonicalImage);
  }

  function composeChapterTwoCover() {
    var firstHalf = content.querySelector('[data-section-id="pg036_sec001"]');
    var secondHalf = content.querySelector('[data-section-id="pg037_sec001"]');
    if (!firstHalf || !secondHalf || firstHalf.parentElement !== content || secondHalf.parentElement !== content) {
      return;
    }

    var cover = document.createElement("div");
    cover.className = "chapter-cover chapter-two-cover";
    cover.setAttribute("role", "group");

    var title = secondHalf.querySelector("h1");
    if (title) {
      title.id = "chapter-two-cover-heading";
      cover.setAttribute("aria-labelledby", title.id);
    }

    content.insertBefore(cover, firstHalf);
    cover.appendChild(firstHalf);
    cover.appendChild(secondHalf);

    var sourceImages = [];
    [firstHalf, secondHalf].forEach(function (section) {
      var sourceImage = section.querySelector("img");
      if (sourceImage) {
        sourceImage.classList.add("chapter-cover-source");
        sourceImages.push(sourceImage);
      }
    });

    var composite = document.createElement("img");
    composite.className = "chapter-cover-composite";
    composite.src = "images/chapter2_cover.png";
    composite.alt = "";
    composite.setAttribute("aria-hidden", "true");
    cover.appendChild(composite);

    /* The page-37 description matches the complete chapter-two artwork. The
       partial page-36 description is removed so the title and subtitle are
       followed by exactly one image description. */
    var canonicalImage = sourceImages[sourceImages.length - 1];
    sourceImages.forEach(function (sourceImage) {
      if (sourceImage !== canonicalImage) sourceImage.remove();
    });
    if (canonicalImage) cover.appendChild(canonicalImage);
  }

  function removeDecorativeTextDuplicates() {
    [
      "pg003_n0002",
      "pg003_n0003",
      "pg016_n0003"
    ].forEach(function (textId) {
      var duplicate = content.querySelector('[data-id="' + textId + '"]');
      if (!duplicate) return;
      var wrapper = duplicate.parentElement;
      duplicate.remove();
      if (wrapper && !wrapper.textContent.trim() && !wrapper.querySelector("img")) wrapper.remove();
    });
  }

  /* The source contains two copies of this chat: one absolutely positioned
     for desktop and another for mobile. Rebuild it once as semantic content
     so font scaling, TTS and pagination all operate on the same nodes. */
  function composeChapterOneChat() {
    var section = content.querySelector('[data-section-id="pg029_sec001"]');
    if (!section) return;
    var sourceImage = section.querySelector('img[data-id="pg029_im003"]');
    var sourceWindow = sourceImage && sourceImage.parentElement;
    var dateCopies = section.querySelectorAll('[data-id="pg029_n0012"]');
    var mobileWindow = dateCopies.length > 1 && dateCopies[1].parentElement &&
      dateCopies[1].parentElement.parentElement;
    if (!sourceWindow || !dateCopies.length) return;

    function take(id) {
      return section.querySelector('[data-id="' + id + '"]');
    }

    var chat = document.createElement("div");
    chat.className = "whatsapp-chat-window chapter-one-chat-window";

    var firstPart = document.createElement("div");
    firstPart.className = "chapter-one-chat-part chapter-one-chat-part-first";
    firstPart.dataset.reflowAnchorId = "pg029_chat_part_1";
    var secondPart = document.createElement("div");
    secondPart.className = "chapter-one-chat-part chapter-one-chat-part-continuation";
    secondPart.dataset.reflowAnchorId = "pg029_chat_part_2";

    var intro = document.createElement("p");
    intro.className = "sr-only whatsapp-chat-intro";
    intro.dataset.id = "whatsapp_chat_intro_v33";
    intro.textContent = "Ventana de chat de Uatsáp.";
    firstPart.appendChild(intro);

    /* This announcement belongs to the second visual card only. Its TTS id
       is attached dynamically when the responsive layout really divides the
       chat, so an unsplit conversation is never announced as a continuation. */
    var continuationIntro = document.createElement("p");
    continuationIntro.className = "sr-only whatsapp-chat-continuation";
    continuationIntro.textContent = "Ventana de chat de Uatsáp.";
    continuationIntro.hidden = true;
    secondPart.appendChild(continuationIntro);

    var date = take("pg029_n0012");
    if (date) {
      date.className = "whatsapp-chat-date";
      firstPart.appendChild(date);
    }

    [
      ["pg029_n0013", "pg029_n0014", "incoming"],
      ["pg029_n0015", "pg029_n0016", "outgoing"],
      ["pg029_n0017", "pg029_n0018", "incoming"],
      ["pg029_n0019", "pg029_n0020", "outgoing"],
      ["pg029_n0021", "pg029_n0022", "incoming"],
      ["pg029_n0023", "pg029_n0024", "outgoing"]
    ].forEach(function (messageData, messageIndex) {
      var sender = take(messageData[0]);
      var text = take(messageData[1]);
      if (!sender || !text) return;
      var message = document.createElement("div");
      message.className = "whatsapp-message whatsapp-message-" + messageData[2];
      sender.className = "whatsapp-chat-sender";
      text.className = "whatsapp-chat-text";
      message.appendChild(sender);
      message.appendChild(text);
      (messageIndex < 3 ? firstPart : secondPart).appendChild(message);
    });

    chat.appendChild(firstPart);
    chat.appendChild(secondPart);

    sourceWindow.parentElement.insertBefore(chat, sourceWindow);
    sourceWindow.remove();
    if (mobileWindow && mobileWindow.isConnected) mobileWindow.remove();
    syncChapterOneChatContinuation();
  }

  function chapterOneChatIsSplit() {
    return false;
  }

  function syncChapterOneChatContinuation() {
    if (!content) return;
    var announcement = content.querySelector(".whatsapp-chat-continuation");
    if (!announcement) return;
    var split = chapterOneChatIsSplit();
    announcement.hidden = !split;
    if (split) {
      announcement.dataset.id = "whatsapp_chat_continuation_v45";
    } else {
      announcement.removeAttribute("data-id");
    }
    reconcileChapterOneChatContinuationTts(announcement, split);
  }

  function reconcileChapterOneChatContinuationTts(announcement, split) {
    var api = window.__adtReflowAudio;
    if (!api || !Array.isArray(api.items)) {
      announcement.dataset.reflowTtsQueued = "pending";
      return;
    }
    var itemId = "whatsapp_chat_continuation_v45";
    var existingIndex = api.items.findIndex(function (item) {
      return item && item.id === itemId;
    });
    if (!split) {
      if (existingIndex >= 0) api.items.splice(existingIndex, 1);
      announcement.dataset.reflowTtsQueued = "false";
      return;
    }
    if (existingIndex >= 0) {
      api.items[existingIndex].el = announcement;
      announcement.dataset.reflowTtsQueued = "true";
      return;
    }
    var secondPart = announcement.closest(".chapter-one-chat-part-continuation");
    var firstSpokenElement = secondPart && secondPart.querySelector(
      '[data-id]:not([data-id="' + itemId + '"])'
    );
    var insertionIndex = firstSpokenElement
      ? api.items.findIndex(function (item) {
        return item && (
          item.el === firstSpokenElement ||
          item.id === firstSpokenElement.dataset.id
        );
      })
      : -1;
    if (insertionIndex < 0) insertionIndex = api.items.length;
    api.items.splice(insertionIndex, 0, {
      el: announcement,
      id: itemId,
      filename: "whatsapp_chat_continuation_es-UY.mp3",
      useBlockWhenMissingTimecodes: true
    });
    announcement.dataset.reflowTtsQueued = "true";
  }

  function prepareIllustratedSection(sectionId, lastSideTextId) {
    var section = content.querySelector('[data-section-id="' + sectionId + '"]');
    if (!section) return;
    var image = section.querySelector("img[data-id]");
    var paragraphs = Array.prototype.slice.call(section.querySelectorAll("p[data-id]"));
    if (!image || !paragraphs.length) return;

    var illustratedPage = document.createElement("div");
    illustratedPage.className = "illustrated-page";
    var illustratedCopy = document.createElement("div");
    illustratedCopy.className = "illustrated-copy reading-block";
    var overflowBlocks = [];
    var overflowBlock = null;
    var placeAtSide = true;

    paragraphs.forEach(function (paragraph) {
      paragraph.dataset.sourceSection = sectionId;
      if (placeAtSide) {
        illustratedCopy.appendChild(paragraph);
        if (paragraph.dataset.id === lastSideTextId) placeAtSide = false;
        return;
      }
      if (!overflowBlock || paragraph.classList.contains("pt-1")) {
        overflowBlock = document.createElement("div");
        overflowBlock.className = "illustrated-overflow reading-block";
        overflowBlocks.push(overflowBlock);
      }
      overflowBlock.appendChild(paragraph);
    });

    illustratedPage.appendChild(image);
    illustratedPage.appendChild(illustratedCopy);
    section.replaceChildren(illustratedPage);
    overflowBlocks.forEach(function (block) { section.appendChild(block); });
  }

  function composeAtticIllustration() {
    var section = content.querySelector('[data-section-id="pg031_sec001"]');
    if (!section) return;
    var image = section.querySelector('img[data-id="pg031_im002"]');
    var sourceParagraph = section.querySelector('p:has(> span[data-id="pg031_n0002"])');
    if (!image || !sourceParagraph) return;

    var illustratedPage = document.createElement("div");
    illustratedPage.className = "illustrated-page attic-illustrated-page";
    var illustratedCopy = document.createElement("div");
    illustratedCopy.className = "illustrated-copy attic-illustrated-copy reading-block";
    sourceParagraph.classList.add("attic-illustrated-source");
    illustratedCopy.appendChild(sourceParagraph);
    illustratedPage.appendChild(image);
    illustratedPage.appendChild(illustratedCopy);

    var overflow = document.createElement("div");
    overflow.className = "attic-illustrated-overflow reading-block";
    overflow.hidden = true;
    var overflowParagraph = sourceParagraph.cloneNode(false);
    overflowParagraph.removeAttribute("id");
    overflowParagraph.classList.remove("attic-illustrated-source");
    overflowParagraph.classList.add("attic-overflow-source");
    overflow.appendChild(overflowParagraph);

    section.replaceChildren(illustratedPage, overflow);
  }

  function composeChapterTwoFinalPassage() {
    var section = content.querySelector('[data-section-id="pg057_sec001"]');
    if (!section) return;
    var tail = document.createElement("div");
    tail.className = "reading-block reading-tail";
    ["pg057_n0009", "pg057_n0011", "pg057_n0012", "pg057_n0014", "pg057_n0015"].forEach(
      function (paragraphId) {
        var paragraph = section.querySelector('[data-id="' + paragraphId + '"]');
        if (paragraph) tail.appendChild(paragraph);
      }
    );
    if (tail.children.length) section.appendChild(tail);
  }

  function prepareChapterTwoQuiz() {
    var panel = content.querySelector(
      '[data-section-type="activity_quiz"][data-id="qz007"]'
    );
    if (!panel) return;
    panel.classList.add("quiz-panel");
    panel.setAttribute("role", "article");

    var card = panel.querySelector(":scope > div > div");
    var question = panel.querySelector('[data-id="qz007_que"]');
    var options = panel.querySelector('[role="group"]');
    if (!card || !question || !options) return;
    card.classList.add("quiz-card");
    question.classList.add("quiz-question");
    panel.setAttribute("aria-label", question.textContent.trim());
    options.classList.add("quiz-options");
    options.setAttribute("role", "radiogroup");

    var answers = {};
    try { answers = JSON.parse(panel.dataset.correctAnswers || "{}"); } catch (_error) {}
    var explanationBank = document.createElement("div");
    explanationBank.className = "quiz-explanation-bank";
    explanationBank.setAttribute("aria-hidden", "true");

    Array.prototype.slice.call(panel.querySelectorAll(".activity-option")).forEach(
      function (option) {
        var input = option.querySelector('input[type="radio"]');
        var optionText = option.querySelector(".option-text");
        if (!input || !optionText) return;
        option.classList.add("quiz-option");
        input.classList.remove("sr-only");
        optionText.classList.add("quiz-option-text");
        option.dataset.correct = String(Boolean(answers[input.value]));
        var explanationId = option.dataset.explanationId;
        if (explanationId) {
          var explanation = document.createElement("span");
          explanation.dataset.id = explanationId;
          explanation.textContent = option.dataset.explanation || "";
          explanationBank.appendChild(explanation);
        }
      }
    );

    var submitTarget = panel.querySelector("[data-submit-target]");
    if (!submitTarget) return;
    submitTarget.removeAttribute("data-submit-target");
    var actions = submitTarget.parentElement || submitTarget;
    actions.classList.add("quiz-actions");
    submitTarget.replaceChildren();
    var submit = document.createElement("button");
    submit.type = "button";
    submit.className = "quiz-submit";
    submit.textContent = "Enviar";
    submit.disabled = true;
    submitTarget.appendChild(submit);

    var feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("aria-live", "polite");
    feedback.setAttribute("aria-hidden", "true");
    feedback.setAttribute("tabindex", "-1");
    card.appendChild(feedback);
    panel.appendChild(explanationBank);
  }

  function moveParagraphsToIllustration(sourceSectionId, targetSectionId, paragraphIds) {
    var target = content.querySelector(
      '[data-section-id="' + targetSectionId + '"] .illustrated-copy'
    );
    if (!target) return;
    var firstTargetParagraph = target.querySelector("p[data-id]");
    paragraphIds.forEach(function (paragraphId) {
      var paragraph = content.querySelector('[data-id="' + paragraphId + '"]');
      if (!paragraph) return;
      paragraph.dataset.sourceSection = sourceSectionId;
      target.insertBefore(paragraph, firstTargetParagraph);
    });
  }

  function keepParagraphWithWhatsApp(sectionId, paragraphId, chatSemanticId) {
    var section = content.querySelector('[data-section-id="' + sectionId + '"]');
    var paragraph = section && section.querySelector('[data-id="' + paragraphId + '"]');
    var chatSemantic = section && section.querySelector(
      '.whatsapp-chat-window [data-id="' + chatSemanticId + '"]'
    );
    var chat = chatSemantic && chatSemantic.closest(".whatsapp-chat-window");
    if (!section || !paragraph || !chat) return;

    /* A short narrative lead-in is part of the same editorial beat as the
       following chat.  Keeping the real semantic paragraph (instead of a
       visual clone) preserves TTS order, highlighting and Easy Read while
       preventing the lead-in from occupying a nearly empty page by itself. */
    var oldParent = paragraph.parentElement;
    var group = chat.closest(".reflow-chat-lead-group");
    if (!group) {
      group = document.createElement("div");
      group.className = "editorial-unit-group reflow-chat-lead-group";
      chat.parentElement.insertBefore(group, chat);
      group.appendChild(chat);
    }
    /* Flattening and the illustrated-page rebalancers may unwrap or move the
       semantic lead-in after the first structural pass. Repair the existing
       group instead of returning early, and keep its original semantic node
       immediately before the chat. */
    if (paragraph.parentElement !== group || paragraph.nextElementSibling !== chat) {
      group.insertBefore(paragraph, chat);
    }
    if (oldParent && oldParent !== group && !oldParent.textContent.trim()) oldParent.remove();
  }

  function moveSemanticGroupToIllustration(sourceSectionId, targetSectionId, semanticIds) {
    var target = content.querySelector(
      '[data-section-id="' + targetSectionId + '"] .illustrated-copy'
    );
    var nodes = semanticIds.map(function (id) {
      return content.querySelector('[data-id="' + id + '"]');
    }).filter(Boolean);
    if (!target || nodes.length !== semanticIds.length) return;
    var firstTargetParagraph = target.querySelector("p[data-id], p:has([data-id])");
    var sharedParagraph = nodes[0].closest("p");
    var unit = sharedParagraph && nodes.every(function (node) {
      return node.closest("p") === sharedParagraph;
    }) ? sharedParagraph : null;
    nodes.forEach(function (node) {
      node.dataset.sourceSection = sourceSectionId;
    });
    if (unit) {
      unit.dataset.sourceSection = sourceSectionId;
      target.insertBefore(unit, firstTargetParagraph);
      return;
    }
    nodes.forEach(function (node) {
      target.insertBefore(node, firstTargetParagraph);
    });
  }

  function composeFinalPassage() {
    var section = content.querySelector('[data-section-id="pg057_sec001"]');
    if (!section) return;
    var tail = document.createElement("div");
    tail.className = "reading-block reading-tail";
    ["pg057_n0009", "pg057_n0011", "pg057_n0012", "pg057_n0014", "pg057_n0015"].forEach(function (paragraphId) {
      var paragraph = section.querySelector('[data-id="' + paragraphId + '"]');
      if (paragraph) tail.appendChild(paragraph);
    });
    if (tail.children.length) section.appendChild(tail);
  }

  function hasTerminalPunctuation(text) {
    return /[.!?…](?:["'”’»)\]—]*)$/.test(String(text || "").trim());
  }

  function protectAtticEasyReadPhrase() {
    var opening = content.querySelector('[data-id="pg030_n0032"]');
    if (!opening) return;
    var easyRead = document.body.classList.contains("reflow-easy-read");
    var walker = document.createTreeWalker(opening, NodeFilter.SHOW_TEXT);
    var textNode;
    while ((textNode = walker.nextNode())) {
      var originalText = textNode.nodeValue;
      var protectedText;
      if (easyRead) {
        protectedText = originalText
          .replace(/\bun manojo\b/i, "un\u00a0manojo")
          .replace(/\bun\s+$/i, function (match) {
            return match.trimEnd() + "\u00a0";
          });
      } else {
        protectedText = originalText.replace(/\u00a0/g, " ");
      }
      if (protectedText !== originalText) textNode.nodeValue = protectedText;
    }
  }

  function accessibleControlLabel(control) {
    if (!control) return "";
    var labelledBy = String(control.getAttribute("aria-labelledby") || "").trim();
    if (labelledBy) {
      var labelledText = labelledBy.split(/\s+/).map(function (id) {
        var labelNode = document.getElementById(id);
        return labelNode ? String(labelNode.textContent || "") : "";
      }).join(" ").replace(/\s+/g, " ").trim();
      if (labelledText) return labelledText;
    }
    return String(control.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
  }

  function easyReadSwitchState() {
    var switches = Array.prototype.slice.call(document.querySelectorAll('[role="switch"]'));
    for (var index = 0; index < switches.length; index += 1) {
      var control = switches[index];
      if (/^Lectura fácil$/i.test(accessibleControlLabel(control))) {
        return control.getAttribute("aria-checked") === "true";
      }
      var ancestor = control.parentElement;
      for (var depth = 0; ancestor && depth < 4; depth += 1, ancestor = ancestor.parentElement) {
        var label = String(ancestor.textContent || "").replace(/\s+/g, " ").trim();
        if (/^Lectura fácil$/i.test(label)) {
          return control.getAttribute("aria-checked") === "true";
        }
      }
    }
    return null;
  }

  function isEasyReadSwitch(control) {
    if (/^Lectura fácil$/i.test(accessibleControlLabel(control))) return true;
    var ancestor = control && control.parentElement;
    for (var depth = 0; ancestor && depth < 4; depth += 1, ancestor = ancestor.parentElement) {
      var label = String(ancestor.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Lectura fácil$/i.test(label)) return true;
    }
    return false;
  }

  function setEasyReadSwitchVisual(control, enabled) {
    if (!control) return;
    control.setAttribute("aria-checked", String(enabled));
    control.toggleAttribute("data-checked", enabled);
    control.toggleAttribute("data-unchecked", !enabled);
    Array.prototype.slice.call(control.querySelectorAll("[data-slot=\"switch-thumb\"]")).forEach(
      function (thumb) {
        thumb.toggleAttribute("data-checked", enabled);
        thumb.toggleAttribute("data-unchecked", !enabled);
      }
    );
  }

  function syncEasyReadSwitchVisual() {
    var enabled = document.body.classList.contains("reflow-easy-read");
    Array.prototype.slice.call(document.querySelectorAll('[role="switch"]')).forEach(
      function (control) {
        if (isEasyReadSwitch(control)) setEasyReadSwitchVisual(control, enabled);
      }
    );
  }

  /* The generic runtime updates more than four thousand React components for
     this switch. The reflow export already has the complete keyed catalogue,
     so update the corresponding leaf nodes directly. This preserves the
     semantic IDs, TTS anchors and custom WhatsApp/illustration composition
     while avoiding a multi-second full-tree render. */
  function applyEasyReadTextDirectly(enabled) {
    var catalogue = state.textCatalog;
    if (!catalogue || !content) return false;
    Array.prototype.slice.call(content.querySelectorAll("[data-id]")).forEach(
      function (element) {
        var id = element.dataset.id;
        if (!id) return;
        var easyId = id + "_easy_read";
        var value = enabled && Object.prototype.hasOwnProperty.call(catalogue, easyId)
          ? catalogue[easyId]
          : catalogue[id];
        if (typeof value !== "string") return;
        if (element.tagName === "IMG") {
          if (element.alt !== value) element.alt = value;
          return;
        }
        element.classList.toggle(
          "reflow-empty-easy-read",
          Boolean(enabled && !value.trim())
        );
        if (element.textContent === value) return;
        if (enabled && value.indexOf("\n") >= 0) {
          var lines = value.split(/\n/);
          var fragment = document.createDocumentFragment();
          lines.forEach(function (line, index) {
            if (index) fragment.appendChild(document.createElement("br"));
            fragment.appendChild(document.createTextNode(line));
          });
          element.replaceChildren(fragment);
        } else {
          element.textContent = value;
        }
      }
    );
    return true;
  }

  function captureReadingAnchor() {
    if (!content) return "";
    /* In a horizontal multi-column book every column shares the same vertical
       range. Looking only at top/bottom therefore selected an arbitrary node
       from a distant column—often the back matter. Use the page-aware semantic
       locator that checks both axes and prefers the viewport centre. */
    return visibleSemanticAnchorId() || state.currentAnchorId ||
      anchorIdForPage(visiblePageIndex()) || "";
  }

  function restoreReadingAnchor(id) {
    if (!id || !content) return;
    var node = content.querySelector(
      '[data-id="' + id + '"], [data-reflow-anchor-id="' + id + '"]'
    );
    if (!node || !node.getClientRects().length) return;
    rememberSettingsAnchor(id);
    state.currentAnchorId = id;
    /* scrollIntoView is not column-aware and can move the outer document or
       the wrong visual column. Reuse the reader's atomic page navigation. */
    goToPage(pageForElement(node), {
      instant: true,
      announce: false,
      preserveHash: true,
      fromTts: readAloudSettingIsEnabled()
    });
  }

  function isFontSizeControl(control) {
    var ancestor = control;
    for (var depth = 0; ancestor && depth < 6; depth += 1, ancestor = ancestor.parentElement) {
      if (/Tamaño de letra/i.test(String(ancestor.textContent || ""))) return true;
    }
    return false;
  }

  document.addEventListener("click", function (event) {
    var control = event.target && event.target.closest
      ? event.target.closest('[role="switch"]')
      : null;
    if (!control || !isEasyReadSwitch(control)) return;
    if (!state.textCatalog) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var readingAnchor = captureReadingAnchor();
    clearQuizInteractionHeights();
    clearExplicitPageLock();
    rememberSettingsAnchor(readingAnchor);
    readingAnchor = beginQuizRepaginationGuard() || readingAnchor;
    beginSettingsRepagination(readingAnchor);
    var requested = control.getAttribute("aria-checked") !== "true";
    try { window.localStorage.setItem("easyReadMode", String(requested)); } catch (error) {}
    document.body.classList.toggle("reflow-easy-read", requested);
    setEasyReadSwitchVisual(control, requested);
    applyEasyReadTextDirectly(requested);
    normalizeSemanticChainSpacing();
    updateEasyReadClass.lastState = null;
    scheduleSettingsRepaginationFinalize(220);
  }, true);

  function updateEasyReadClass() {
    var probe = content.querySelector('[data-id="pg019_n0003"]');
    var liveState = easyReadSwitchState();
    var storedState = null;
    try {
      var storedEasyRead = window.localStorage.getItem("easyReadMode");
      if (storedEasyRead === "true" || storedEasyRead === "false") {
        storedState = storedEasyRead === "true";
      }
    } catch (error) {}
    var easyRead = liveState !== null
      ? liveState
      : (storedState !== null
        ? storedState
        : Boolean(probe && /Javier es un joven alto y delgado/i.test(probe.textContent)));
    if (updateEasyReadClass.lastState === easyRead) return;
    updateEasyReadClass.lastState = easyRead;
    document.body.classList.toggle("reflow-easy-read", easyRead);
    applyEasyReadTextDirectly(easyRead);
    normalizeSemanticChainSpacing();
    /* Locale reconciliation and sentence-chain composition finish shortly
       after the mode class changes. Run one quiet final pass so separators
       inserted by that late commit are collapsible before repagination. */
    window.setTimeout(normalizeSemanticChainSpacing, 260);
    syncChapterOneChatContinuation();
    protectAtticEasyReadPhrase();
    normalizeSceneSeparators();
    window.setTimeout(function () {
      /* The locale component commits its replacement text after the mode
         class changes. Restore the spoken discourse marker once that commit
         has settled, then keep the same TTS item attached to the live node. */
      normalizeSceneSeparators();
      reconcileSceneSeparatorTts();
    }, 160);
    Array.prototype.slice.call(content.querySelectorAll(".reading-sentence")).forEach(function (sentence) {
      sentence.classList.toggle("reading-sentence-multiline", Boolean(sentence.querySelector("br")));
    });
  }

  function updateReadingBlockSizing() {
    var easyRead = document.body.classList.contains("reflow-easy-read");
    var scale = fontScales[state.fontSize] || 1;
    var threshold = (easyRead ? 440 : 620) / scale;
    Array.prototype.slice.call(content.querySelectorAll(".reading-block")).forEach(function (block) {
      var explicitBreaks = block.querySelectorAll("br").length;
      var weightedLength = block.textContent.trim().length + (explicitBreaks * 70);
      var flexibleIllustratedOverflow = block.classList.contains("illustrated-overflow") &&
        (easyRead || state.fontSize !== "normal");
      block.classList.toggle(
        "reading-block-long",
        flexibleIllustratedOverflow || weightedLength > threshold
      );
    });
  }

  /* Estimate the natural Easy Read stack at the final side-column width. The
     0.65 average glyph factor is deliberately conservative for uppercase
     Atkinson; explicit line breaks remain independent rows. */
  function estimatedEasyReadStackHeight(units, width) {
    return units.reduce(function (total, unit) {
      var style = getComputedStyle(unit);
      var fontSize = parseFloat(style.fontSize) || 20;
      var lineHeight = parseFloat(style.lineHeight) || (fontSize * 1.55);
      var charactersPerLine = Math.max(10, Math.floor(width / (fontSize * 0.65)));
      var text = String(unit.innerText || unit.textContent || "").trim();
      var segments = text ? text.split(/\n+/) : [""];
      var lines = segments.reduce(function (count, segment) {
        return count + Math.max(1, Math.ceil(segment.trim().length / charactersPerLine));
      }, 0);
      return total + (lines * lineHeight) +
        (parseFloat(style.marginTop) || 0) +
        (parseFloat(style.marginBottom) || 0);
    }, 0);
  }

  /* In a multi-column book, getBoundingClientRect() is the union of every
     fragment occupied by an element. A copy block split across two visual
     pages can therefore appear thousands of pixels wide even though its
     real grid column is narrow. Always size illustrated prose from its first
     fragment: that is the column beside the image that must be filled. */
  function primaryFragmentRect(element) {
    if (!element) return null;
    var fragments = Array.prototype.slice.call(element.getClientRects()).filter(function (rect) {
      return rect.width > 1 && rect.height > 1;
    });
    return fragments[0] || element.getBoundingClientRect();
  }

  var illustratedInkCanvas = document.createElement("canvas");
  var illustratedInkContext = illustratedInkCanvas.getContext("2d");

  function collectVisibleTextNodes(element, result) {
    Array.prototype.slice.call(element.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        if (/\S/.test(node.nodeValue || "")) result.push(node);
        return;
      }
      if (node.nodeType !== 1) return;
      var style = getComputedStyle(node);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      ) return;
      collectVisibleTextNodes(node, result);
    });
    return result;
  }

  /* Return the first rendered text row in reading order, rather than the
     geometric topmost fragment. In the horizontal multi-column book, later
     fragments can recycle the same vertical coordinate on another visual
     page. Reading order is the stable definition of the paragraph that is
     actually paired with the illustration. */
  function firstVisibleTextRow(copy) {
    var textNodes = collectVisibleTextNodes(copy, []);
    var range = document.createRange();
    var firstRect = null;
    var firstNode = null;
    var firstOffset = -1;

    for (var nodeIndex = 0; nodeIndex < textNodes.length; nodeIndex += 1) {
      var node = textNodes[nodeIndex];
      var value = node.nodeValue || "";
      for (var offset = 0; offset < value.length; offset += 1) {
        if (/\s/.test(value.charAt(offset))) continue;
        range.setStart(node, offset);
        range.setEnd(node, offset + 1);
        firstRect = Array.prototype.slice.call(range.getClientRects()).find(
          function (rect) {
            return rect.width > 0 && rect.height > 0;
          }
        ) || null;
        if (firstRect) {
          firstNode = node;
          firstOffset = offset;
          break;
        }
      }
      if (firstRect) break;
    }
    if (!firstRect || !firstNode) return null;

    /* Canvas text metrics must describe the row that is actually visible at
       the top. Stop as soon as DOM layout reports the next line. */
    var sample = "";
    var started = false;
    for (var sampleNodeIndex = textNodes.indexOf(firstNode);
      sampleNodeIndex < textNodes.length && sample.length < 96;
      sampleNodeIndex += 1) {
      var sampleNode = textNodes[sampleNodeIndex];
      var sampleValue = sampleNode.nodeValue || "";
      var sampleStart = sampleNode === firstNode ? firstOffset : 0;
      for (var sampleOffset = sampleStart;
        sampleOffset < sampleValue.length && sample.length < 96;
        sampleOffset += 1) {
        range.setStart(sampleNode, sampleOffset);
        range.setEnd(sampleNode, sampleOffset + 1);
        var sampleRect = Array.prototype.slice.call(range.getClientRects()).find(function (entry) {
          return entry.height > 0;
        });
        if (!sampleRect) continue;
        if (Math.abs(sampleRect.top - firstRect.top) > 1) {
          return {
            rect: firstRect,
            element: firstNode.parentElement,
            sample: sample.trim() || firstNode.nodeValue.trim().slice(0, 32)
          };
        }
        sample += sampleValue.charAt(sampleOffset);
        started = true;
      }
      if (started) sample += " ";
    }
    return {
      rect: firstRect,
      element: firstNode.parentElement,
      sample: sample.trim() || firstNode.nodeValue.trim().slice(0, 32)
    };
  }

  /* Measure the real ascender/cap ink inside the browser's inline text box.
     This works for Atkinson at every supported size and for Easy Read too;
     unlike a fixed fraction of 1em, it also accounts for the actual first
     row (capital letters, accents and punctuation included). */
  function illustratedInkTopOffset(row) {
    if (!row || !row.element) return 0;
    var style = getComputedStyle(row.element);
    var fontSize = parseFloat(style.fontSize) || 16;
    if (!illustratedInkContext) return fontSize * 0.18;
    illustratedInkContext.font = style.font || [
      style.fontStyle,
      style.fontVariant,
      style.fontWeight,
      style.fontSize,
      style.fontFamily
    ].join(" ");
    var metrics = illustratedInkContext.measureText(row.sample || "H");
    var actualAscent = metrics.actualBoundingBoxAscent || (fontSize * 0.72);
    var fontAscent = metrics.fontBoundingBoxAscent || (fontSize * 0.8);
    var fontDescent = metrics.fontBoundingBoxDescent || (fontSize * 0.2);
    var fontBoxHeight = fontAscent + fontDescent;
    var centeredFontBox = Math.max(0, (row.rect.height - fontBoxHeight) / 2);
    return centeredFontBox + Math.max(0, fontAscent - actualAscent);
  }

  function alignIllustratedCopyTop(illustratedPage) {
    var copy = illustratedPage.querySelector(
      ".illustrated-copy, .attic-illustrated-copy"
    );
    var image = illustratedPage.querySelector(
      ".illustrated-media img, .attic-illustrated-media img, img"
    );
    if (!copy || !image) return;
    var imageElementRect = image.getBoundingClientRect();
    var paintedImageRect = ttsRenderedImageRect(image);
    illustratedPage.style.setProperty(
      "--illustrated-painted-top-offset",
      Math.max(0, paintedImageRect.top - imageElementRect.top) + "px"
    );
    var row = firstVisibleTextRow(copy);
    if (!row) return;
    var inkOffset = illustratedInkTopOffset(row);
    var copyRect = primaryFragmentRect(copy) || copy.getBoundingClientRect();
    /* Horizontal pagination can temporarily fragment the prose into a
       different visual column from its image. Absolute page coordinates
       would then produce translations of thousands of pixels. Compare both
       local boxes, not the typographic ink: aligning the glyph ink lifted
       the prose by 6--9 px and made it look higher than the illustration.
       The first visible line box is the stable visual reference requested
       for all six reading configurations. */
    var localInkTop = row.rect.top - copyRect.top;
    var localPaintedImageTop = paintedImageRect.top - imageElementRect.top;
    /* The grid already aligns the first prose line box with the image
       element.  Compensate only for transparent/blank pixels inside the
       bitmap.  Subtracting the line's internal leading here moved the prose
       3 px above images even after the larger ink correction was removed. */
    /* En Lectura fácil, la caja de la primera línea comienza a la altura
       correcta, pero el primer trazo visible queda apenas más abajo por el
       aire superior propio de la fuente. Compensar sólo esa fracción mínima
       mantiene intactas la altura y la paginación de la composición. */
    var rowFontSize = parseFloat(getComputedStyle(row.element).fontSize) || 16;
    var easyReadOpticalLift = document.body.classList.contains("reflow-easy-read")
      ? Math.min(3, Math.max(1.5, rowFontSize * 0.08))
      : 0;
    var translation = localPaintedImageTop - easyReadOpticalLift;
    illustratedPage.style.setProperty(
      "--illustrated-copy-translate-y",
      translation + "px"
    );
    illustratedPage.dataset.reflowOpticalInkOffset = inkOffset.toFixed(3);
    illustratedPage.dataset.reflowOpticalTranslation = translation.toFixed(3);
    illustratedPage.dataset.reflowOpticalRowTop = row.rect.top.toFixed(3);
    illustratedPage.dataset.reflowOpticalRowLeft = row.rect.left.toFixed(3);
    illustratedPage.dataset.reflowOpticalTextId =
      (row.element.closest("[data-id]") || row.element).getAttribute("data-id") || "";
  }


  function illustratedTargetHeight(illustratedPage, image, copy, baseHeight) {
    if (!illustratedPage || !image || !copy) return baseHeight;
    illustratedPage.style.removeProperty("--illustrated-target-height");
    copy.style.removeProperty("height");
    var imageRect = image.getBoundingClientRect();
    var columnWidth = Math.max(image.clientWidth || 0, imageRect.width || 0);
    var intrinsicHeight = image.naturalWidth && image.naturalHeight && columnWidth
      ? columnWidth * image.naturalHeight / image.naturalWidth
      : baseHeight;
    /* En las ilustraciones posteriores, la referencia debe ser el bitmap
       realmente visible. Una altura forzada con object-fit: contain deja
       franjas transparentes dentro del elemento y hace que el texto parezca
       comenzar más arriba aunque las cajas estén técnicamente alineadas. */
    var preserveIntrinsicImageRatio =
      !!illustratedPage.closest("section.reflow-later-illustrated");
    if (preserveIntrinsicImageRatio) {
      var paintedHeight = Math.ceil(
        imageRect.height || intrinsicHeight || baseHeight
      );
      /* Igual que en los capítulos iniciales, la imagen pintada es el límite
         visual de la columna lateral también en Lectura Fácil. Las unidades
         completas que no entran quedan en la continuación paginada. */
      var laterTargetHeight = paintedHeight;
      illustratedPage.style.setProperty(
        "--illustrated-target-height", laterTargetHeight + "px"
      );
      copy.style.height = laterTargetHeight + "px";
      return laterTargetHeight;
    }
    var pageLimit = Math.max(baseHeight, content.clientHeight - 96);
    var viewportTarget = Math.max(baseHeight, content.clientHeight * 0.58);
    var targetHeight = Math.min(
      Math.ceil(pageLimit),
      Math.ceil(Math.max(baseHeight, intrinsicHeight, viewportTarget))
    );
    illustratedPage.style.setProperty(
      "--illustrated-target-height",
      targetHeight + "px"
    );
    /* The image can still be capped by its CSS max-height.  The requested
       custom-property value is therefore not necessarily the height that is
       actually available to the adjacent text.  Always paginate against the
       rendered image box, which is the real lower boundary on screen. */
    var renderedHeight = Math.ceil(image.getBoundingClientRect().height || 0);
    if (renderedHeight > 0 && renderedHeight < targetHeight - 1) {
      targetHeight = renderedHeight;
      illustratedPage.style.setProperty(
        "--illustrated-target-height",
        targetHeight + "px"
      );
    }
    return targetHeight;
  }

  function settleIllustratedHeights() {
    /* Rounding line boxes to CSS pixels can leave a few hidden pixels even
       when image and copy report the same outer height.  Resolve that final
       discrepancy generically and keep both columns exactly equal. */
    var illustratedPages = Array.prototype.slice.call(
      content.querySelectorAll(".illustrated-page, .attic-illustrated-page")
    );
    /* Transforms do not affect layout, but they do affect every rectangle we
       use for optical alignment. The reader normally animates them; measuring
       while that transition is still interpolating feeds a stale offset into
       the next pass and makes some combinations drift up while others drift
       down. Suspend the transition only for this synchronous settlement,
       neutralize every copy, and restore it after the final transform has
       been committed. */
    var transitionStates = [];
    illustratedPages.forEach(function (illustratedPage) {
      var copy = illustratedPage.querySelector(
        ".illustrated-copy, .attic-illustrated-copy"
      );
      if (copy) {
        transitionStates.push({
          element: copy,
          value: copy.style.getPropertyValue("transition"),
          priority: copy.style.getPropertyPriority("transition")
        });
        copy.style.setProperty("transition", "none", "important");
        copy.getAnimations().forEach(function (animation) {
          animation.cancel();
        });
      }
      illustratedPage.style.setProperty("--illustrated-copy-translate-y", "0px");
    });
    /* Force the neutral transform to become the sole geometric reference
       before any line or painted-image measurement is taken. */
    void content.offsetWidth;
    illustratedPages.forEach(function (illustratedPage) {
      var copy = illustratedPage.querySelector(
        ".illustrated-copy, .attic-illustrated-copy"
      );
      var image = illustratedPage.querySelector(
        ".illustrated-media img, .attic-illustrated-media img, img"
      );
      if (!copy || !image) return;
      var imageHeight = Math.ceil(image.getBoundingClientRect().height || 0);
      var copyHeight = Math.ceil(copy.getBoundingClientRect().height || 0);
      if (
        illustratedPage.closest("section.reflow-later-illustrated") &&
        imageHeight > 0
      ) {
        var settledLaterHeight = imageHeight;
        illustratedPage.style.setProperty(
          "--illustrated-target-height", settledLaterHeight + "px"
        );
        copy.style.height = settledLaterHeight + "px";
        return;
      }
      /* A max-height may cap the image after a previous pass requested a
         taller shared column.  Clamp the copy immediately to that real image
         height; the next rebalance pass will move complete trailing units. */
      if (imageHeight > 0 && copyHeight > imageHeight + 1) {
        illustratedPage.style.setProperty(
          "--illustrated-target-height", imageHeight + "px"
        );
        copy.style.height = imageHeight + "px";
        return;
      }
      var hiddenPixels = Math.max(0, copy.scrollHeight - copy.clientHeight);
      if (hiddenPixels <= 1) return;
      var currentHeight = Math.max(imageHeight, copyHeight);
      var pageLimit = Math.max(currentHeight, content.clientHeight - 96);
      var targetHeight = Math.min(
        Math.ceil(currentHeight + hiddenPixels + 1),
        Math.ceil(pageLimit)
      );
      if (targetHeight <= currentHeight) return;
      illustratedPage.style.setProperty(
        "--illustrated-target-height", targetHeight + "px"
      );
      var renderedHeight = Math.ceil(image.getBoundingClientRect().height || 0);
      if (renderedHeight > 0 && renderedHeight < targetHeight - 1) {
        illustratedPage.style.setProperty(
          "--illustrated-target-height", renderedHeight + "px"
        );
        copy.style.height = renderedHeight + "px";
      }
    });
    /* Height changes above can recenter an entire grid. Measuring alignment
       earlier is what made the first illustrated pages drift by more than a
       hundred pixels in some configurations. This final pass sees the real,
       stable bitmap and first text row for every page. */
    illustratedPages.forEach(alignIllustratedCopyTop);
    void content.offsetWidth;
    transitionStates.forEach(function (entry) {
      if (entry.value) {
        entry.element.style.setProperty(
          "transition", entry.value, entry.priority || ""
        );
      } else {
        entry.element.style.removeProperty("transition");
      }
    });
  }

  function settleAllIllustratedPages() {
    /* Use the final, measured image height and move only complete sentence
       units. This keeps the largest prefix that really fits beside every
       illustration instead of relying on character-count heuristics. */
    rebalanceIllustratedPage();
    rebalanceChapterTwoIllustrations();
    rebalanceAtticIllustration();
    settleIllustratedHeights();
    observeIllustratedAlignment();
  }

  function observeIllustratedAlignment() {
    /* The horizontal paginator can finish changing the rendered image width
       after the normal settlement passes.  In that case the bitmap's
       transparent top inset changes while the previously calculated copy
       transform remains stale.  Observe only the two illustrated columns
       and refresh the cheap optical translation when either box is resized;
       this avoids another full repagination and keeps all six reading modes
       visually aligned. */
    if (!("ResizeObserver" in window)) return;
    if (!state.illustratedAlignmentObserver) {
      state.illustratedAlignmentObserver = new ResizeObserver(function (entries) {
        var affectedPages = [];
        entries.forEach(function (entry) {
          var page = entry.target.closest(
            ".illustrated-page, .attic-illustrated-page"
          );
          if (page && affectedPages.indexOf(page) < 0) affectedPages.push(page);
        });
        if (!affectedPages.length || state.illustratedAlignmentFrame) return;
        state.illustratedAlignmentFrame = window.requestAnimationFrame(function () {
          state.illustratedAlignmentFrame = 0;
          affectedPages.forEach(alignIllustratedCopyTop);
        });
      });
    }
    state.illustratedAlignmentObserver.disconnect();
    content.querySelectorAll(
      ".illustrated-page .illustrated-media img," +
      " .illustrated-page .illustrated-copy," +
      " .attic-illustrated-page .attic-illustrated-media img," +
      " .attic-illustrated-page .attic-illustrated-copy"
    ).forEach(function (element) {
      state.illustratedAlignmentObserver.observe(element);
    });
  }

  function scheduleIllustratedSettlement() {
    /* Easy Read replaces hundreds of semantic nodes asynchronously. The
       illustrated columns therefore need to be measured after React's text
       update, not only in the click frame. Two animation frames cover the
       immediate locale reconciliation; the short delayed pass covers the
       final font/layout flush without forcing continuous repagination. */
    if (!state.illustratedSettlementFrame) {
      state.illustratedSettlementFrame = window.requestAnimationFrame(function () {
        state.illustratedSettlementFrame = 0;
        settleAllIllustratedPages();
      });
    }
    window.clearTimeout(state.illustratedSettlementTimer);
    state.illustratedSettlementTimer = window.setTimeout(function () {
      state.illustratedSettlementTimer = 0;
      settleAllIllustratedPages();
    }, 140);
    /* At extra-large sizes Chromium can finish redistributing the last
       multicolumn fragment after the short font/layout flush above. A final
       quiet pass measures that settled geometry; without it the pg047 copy
       could retain the row position from the preceding column and appear
       about one half-line below its illustration. */
    window.clearTimeout(state.illustratedSettlementStabilizeTimer);
    state.illustratedSettlementStabilizeTimer = window.setTimeout(function () {
      state.illustratedSettlementStabilizeTimer = 0;
      settleAllIllustratedPages();
    }, 650);
    /* One last alignment-only pass is deliberately later than the full
       settlement. It catches Chromium's deferred multicolumn/image resize
       without moving text between pages or causing the visible rebound that
       a second repagination would introduce. */
    window.clearTimeout(state.illustratedAlignmentLateTimer);
    state.illustratedAlignmentLateTimer = window.setTimeout(function () {
      state.illustratedAlignmentLateTimer = 0;
      content.querySelectorAll(
        ".illustrated-page, .attic-illustrated-page"
      ).forEach(alignIllustratedCopyTop);
    }, 1500);
  }

  function rebalanceIllustratedPage() {
    var copy = content.querySelector('[data-section-id="pg025_sec001"] .illustrated-copy');
    var overflow = content.querySelector('[data-section-id="pg025_sec001"] .illustrated-overflow');
    if (!copy || !overflow) return;
    var movable = [
      "pg025_n0002",
      "pg025_n0003",
      "pg025_n0004",
      "pg025_n0005",
      "pg025_n0006",
      "pg025_n0007",
      "pg025_n0008",
      "pg025_n0009"
    ].map(function (id) {
      return content.querySelector('[data-id="' + id + '"]');
    }).filter(Boolean);
    var illustratedPage = copy.closest(".illustrated-page");
    if (!illustratedPage || !movable.length) return;
    var balanceKey = [
      state.fontSize,
      document.body.classList.contains("reflow-easy-read") ? "easy" : "standard",
      content.clientWidth,
      illustratedPage.clientHeight
    ].join(":");
    if (illustratedPage.dataset.reflowBalanceKey === balanceKey) return;

    /* Restore source order, then move only the minimum trailing passage
       needed to make the live rendered copy fit beside the illustration.
       This is measurement-based: uppercase, Easy Read and future font
       metrics no longer need a new table of hard-coded combinations. */
    movable.forEach(function (paragraph) { copy.appendChild(paragraph); });
    var image = illustratedPage.querySelector(":scope > img");
    var imageHeight = image ? image.getBoundingClientRect().height : 0;
    /* The paragraph must stay between the illustration's top and bottom
       edges, not merely inside the viewport that contains both columns. */
    var availableHeight = Math.max(
      0,
      Math.min(illustratedPage.clientHeight - 24, imageHeight || illustratedPage.clientHeight)
    );
    availableHeight = illustratedTargetHeight(
      illustratedPage, image, copy, availableHeight
    );
    /* The opening sentence originates on pg024 and is followed by one more
       pg024 semantic unit before the pg025 continuation. Treat every direct
       child after the first atomic sentence as movable; restricting this to
       pg025 ids left that extra unit clipped in large modes. */
    var sideUnits = Array.prototype.slice.call(copy.children).filter(function (unit) {
      return unit.matches('[data-id], .sentence-chain');
    });
    for (var index = sideUnits.length - 1; index > 0; index -= 1) {
      var renderedHeight = Math.max(copy.scrollHeight, copy.getBoundingClientRect().height);
      if (renderedHeight <= availableHeight) break;
      overflow.insertBefore(sideUnits[index], overflow.firstChild);
    }
    /* The side text column itself always shares the illustration's exact
       measured height. Its prose remains top-aligned and no text is clipped:
       only complete trailing units have already moved to the continuation. */
    copy.style.height = availableHeight + "px";
    illustratedPage.dataset.reflowBalanceKey = balanceKey;
  }

  function rebalanceChapterTwoIllustration(sectionId) {
    var section = content.querySelector('[data-section-id="' + sectionId + '"]');
    var illustratedPage = section && section.querySelector(":scope > .illustrated-page");
    var copy = illustratedPage && illustratedPage.querySelector(":scope > .illustrated-copy");
    var image = illustratedPage && illustratedPage.querySelector(":scope > img");
    if (!section || !illustratedPage || !copy || !image) return;

    /* pg142's LF wording contains two complete sentences under the one
       source/TTS id. At extra-large size the first fits beside the image but
       the second does not. Split its visual layout units while retaining the
       complete source text in the semantic node, so TTS and screen readers
       still encounter it once and the trailing sentence can move intact to
       the continuation page. */
    var pg142Source = sectionId === "pg142_sec001" && state.textCatalog &&
      content.querySelector('[data-id="pg142_n0002"]');
    var oldPg142Continuation = section.querySelector(
      ".reflow-pg142-easy-continuation"
    );
    if (!document.body.classList.contains("reflow-easy-read")) {
      if (oldPg142Continuation) oldPg142Continuation.remove();
      if (pg142Source) {
        pg142Source.classList.remove("reflow-pg142-easy-source");
        delete pg142Source.dataset.reflowVisualText;
      }
    } else if (pg142Source && pg142Source.dataset.reflowChapterTwoOrder != null) {
      var pg142Parts = String(
        state.textCatalog.pg142_n0002_easy_read || ""
      ).split(/\n+/).map(function (part) { return part.trim(); }).filter(Boolean);
      if (pg142Parts.length === 2) {
        if (!oldPg142Continuation) {
          oldPg142Continuation = document.createElement("p");
          oldPg142Continuation.className =
            "reading-sentence reflow-pg142-easy-continuation";
          oldPg142Continuation.setAttribute("aria-hidden", "true");
          oldPg142Continuation.dataset.reflowChapterTwoSide = "true";
          oldPg142Continuation.dataset.reflowChapterTwoOrder = String(
            Number(pg142Source.dataset.reflowChapterTwoOrder) + 0.1
          );
          pg142Source.insertAdjacentElement("afterend", oldPg142Continuation);
        }
        oldPg142Continuation.textContent = pg142Parts[1];
        var ttsOnly = document.createElement("span");
        ttsOnly.className = "reflow-tts-only";
        ttsOnly.textContent = pg142Parts[1];
        pg142Source.replaceChildren(
          document.createTextNode(pg142Parts[0] + " "),
          ttsOnly
        );
        pg142Source.classList.add("reflow-pg142-easy-source");
        pg142Source.dataset.reflowVisualText = pg142Parts[0];
      }
    }

    /* An Easy Read unit can contain several complete sentences under one
       audio/highlight id. If that intact unit does not fit in the narrow
       image-side column, a dedicated second grid row can hold it without
       cloning or splitting the semantic/audio node. Keep the row in the DOM
       (hidden while empty) so delayed balance passes can move the same node
       back and forth without changing its identity. */
    var belowCopy = illustratedPage.querySelector(":scope > .illustrated-below-copy");
    if (!belowCopy) {
      belowCopy = document.createElement("div");
      belowCopy.className = "illustrated-below-copy";
      illustratedPage.appendChild(belowCopy);
    }

    var overflow = section.querySelector(":scope > .illustrated-overflow");
    if (!overflow) {
      overflow = document.createElement("div");
      overflow.className = "illustrated-overflow reading-block";
      section.insertBefore(overflow, illustratedPage.nextSibling);
    } else if (overflow.previousElementSibling !== illustratedPage) {
      /* An initially empty continuation may be recreated after the generic
         cleanup pass. Keep it directly after the image/copy composition so
         later content such as the WhatsApp panel cannot overtake prose that
         belongs before it. */
      section.insertBefore(overflow, illustratedPage.nextSibling);
    }

    /* Editorial groupings (for example, a prompt followed by its reply) must
       remain a single pagination unit during every delayed settlement pass.
       The individual paragraphs keep their original side/order metadata, so
       map tagged descendants back to their outer editorial group before the
       rebalancer moves anything between the image column and its overflow. */
    var sideParagraphs = [];
    Array.prototype.slice.call(
      section.querySelectorAll('[data-reflow-chapter-two-side="true"]')
    ).forEach(function (paragraph) {
      var unit = paragraph.closest(".editorial-unit-group") ||
        paragraph.closest(".sentence-chain") || paragraph;
      if (sideParagraphs.indexOf(unit) === -1) sideParagraphs.push(unit);
    });
    sideParagraphs.forEach(function (unit) {
      if (unit.dataset.reflowChapterTwoOrder != null) return;
      var descendantOrders = Array.prototype.slice.call(
        unit.querySelectorAll('[data-reflow-chapter-two-order]')
      ).map(function (descendant) {
        return Number(descendant.dataset.reflowChapterTwoOrder);
      }).filter(function (order) { return isFinite(order); });
      if (descendantOrders.length) {
        unit.dataset.reflowChapterTwoSide = "true";
        unit.dataset.reflowChapterTwoOrder = String(
          Math.min.apply(Math, descendantOrders)
        );
      }
    });
    if (!sideParagraphs.length) {
      /* Begin with every complete unit in the illustrated page and its
         continuation. A short normal-size composition can therefore pull
         additional prose beside the image without splitting a sentence. */
      var sourceContainers = [copy, belowCopy].concat(Array.prototype.slice.call(
        section.querySelectorAll(":scope > .illustrated-overflow")
      ));
      sourceContainers.forEach(function (container) {
        Array.prototype.slice.call(container.children).forEach(function (element) {
          if (element.matches("p[data-id], .sentence-chain, .editorial-unit-group")) {
            sideParagraphs.push(element);
          }
        });
      });
      sideParagraphs.forEach(function (paragraph, index) {
        paragraph.dataset.reflowChapterTwoSide = "true";
        paragraph.dataset.reflowChapterTwoOrder = String(index);
      });
    }
    sideParagraphs.sort(function (left, right) {
      return Number(left.dataset.reflowChapterTwoOrder) -
        Number(right.dataset.reflowChapterTwoOrder);
    });
    var finalCopyRect = primaryFragmentRect(copy);
    var finalCopyWidth = finalCopyRect ? finalCopyRect.width : 0;
    if (finalCopyWidth < 160) {
      window.setTimeout(function () { rebalanceChapterTwoIllustration(sectionId); }, 80);
      return;
    }
    var balanceKey = [
      state.fontSize,
      document.body.classList.contains("reflow-easy-read") ? "easy" : "standard",
      content.clientWidth,
      illustratedPage.clientHeight,
      Math.round(ttsRenderedImageRect(image).height),
      Math.round(ttsRenderedImageRect(image).width),
      Math.round(finalCopyWidth),
      sideParagraphs.map(function (paragraph) {
        return paragraph.textContent.trim().length;
      }).join(",")
    ].join(":");
    if (illustratedPage.dataset.reflowChapterTwoBalanceKey === balanceKey) return;

    /* A previous settlement may have used the Easy Read second-row fallback
       below. Reset it only when the balance key actually changed;
       otherwise the early return above deliberately preserves the settled
       geometry without another visible reflow. */
    section.classList.remove("reflow-easy-illustrated-stacked");
    illustratedPage.style.removeProperty("--illustrated-target-height");
    copy.style.height = "";
    Array.prototype.slice.call(
      section.querySelectorAll(":scope > .illustrated-overflow")
    ).forEach(function (candidate) {
      if (candidate !== overflow && !candidate.children.length) candidate.remove();
    });

    var imageHeight = ttsRenderedImageRect(image).height;
    var availableHeight = Math.max(
      0,
      Math.min(illustratedPage.clientHeight - 24, imageHeight || illustratedPage.clientHeight)
    );
    /* Place the first atomic unit before measuring its minimum natural
       height. It may include both halves of a sentence joined from adjacent
       source pages and must never be clipped. */
    sideParagraphs.forEach(function (paragraph) { overflow.appendChild(paragraph); });
    if (sideParagraphs[0]) copy.appendChild(sideParagraphs[0]);
    availableHeight = illustratedTargetHeight(
      illustratedPage, image, copy, availableHeight
    );
    /* Insert the largest prefix that fits at the final side-column width. */
    var fittedParagraphs = [];
    if (document.body.classList.contains("reflow-easy-read")) {
      /* Measure the real rendered stack. The former character-count estimate
         was intentionally conservative and rejected a complete extra unit at
         larger sizes even when the painted column still had ample space. */
      sideParagraphs.forEach(function (paragraph) { overflow.appendChild(paragraph); });
      for (var fitIndex = 0; fitIndex < sideParagraphs.length; fitIndex += 1) {
        var candidateParagraph = sideParagraphs[fitIndex];
        copy.appendChild(candidateParagraph);
        var renderedStackHeight = Math.max(
          copy.scrollHeight,
          copy.getBoundingClientRect().height
        );
        if (fittedParagraphs.length && renderedStackHeight > availableHeight + 1) {
          break;
        }
        fittedParagraphs.push(candidateParagraph);
      }
    } else {
      sideParagraphs.forEach(function (paragraph) { copy.appendChild(paragraph); });
      for (var trimIndex = sideParagraphs.length - 1; trimIndex > 0; trimIndex -= 1) {
        if (Math.max(copy.scrollHeight, copy.getBoundingClientRect().height) <= availableHeight) break;
        overflow.insertBefore(sideParagraphs[trimIndex], overflow.firstChild);
      }
      fittedParagraphs = sideParagraphs.filter(function (paragraph) {
        return paragraph.parentElement === copy;
      });
    }
    sideParagraphs.forEach(function (paragraph) { overflow.appendChild(paragraph); });
    fittedParagraphs.forEach(function (paragraph) { copy.appendChild(paragraph); });

    /* A visually isolated sentence is not an acceptable illustrated page.
       Count grammatical endings rather than DOM wrappers: one semantic unit
       can contain more than one complete sentence in easy-reading mode. */
    function fittedSentenceCount(paragraphs) {
      var text = paragraphs.map(function (paragraph) {
        return String(
          paragraph.dataset.reflowVisualText || paragraph.textContent || ""
        ).replace(/\s+/g, " ").trim();
      }).filter(Boolean).join(" ");
      if (!text) return 0;
      var endings = text.match(/[.!?…]+(?:["»”’)\]]+)?(?=\s|$)/g);
      return endings && endings.length ? endings.length : 1;
    }

    function nextUnfittedParagraph() {
      for (var paragraphIndex = 0; paragraphIndex < sideParagraphs.length; paragraphIndex += 1) {
        if (fittedParagraphs.indexOf(sideParagraphs[paragraphIndex]) === -1) {
          return sideParagraphs[paragraphIndex];
        }
      }
      return null;
    }

    var safeIllustratedHeight = Math.max(
      availableHeight,
      Math.floor(
        content.getBoundingClientRect().bottom -
        illustratedPage.getBoundingClientRect().top - 28
      )
    );
    var preserveIntrinsicImageRatio =
      !!illustratedPage.closest("section.reflow-later-illustrated");
    var grewForMinimum = false;
    while (
      !preserveIntrinsicImageRatio &&
      fittedSentenceCount(fittedParagraphs) < 2
    ) {
      var minimumCandidate = nextUnfittedParagraph();
      if (!minimumCandidate) break;
      copy.appendChild(minimumCandidate);
      var requiredMinimumHeight = Math.ceil(copy.scrollHeight);
      if (requiredMinimumHeight > safeIllustratedHeight + 1) {
        overflow.appendChild(minimumCandidate);
        break;
      }
      fittedParagraphs.push(minimumCandidate);
      availableHeight = Math.max(availableHeight, requiredMinimumHeight);
      grewForMinimum = true;
    }

    /* Once the minimum has forced a safe growth, keep filling the new image
       height greedily with complete semantic sentences. */
    while (grewForMinimum) {
      var fillCandidate = nextUnfittedParagraph();
      if (!fillCandidate) break;
      copy.appendChild(fillCandidate);
      if (copy.scrollHeight > availableHeight + 1) {
        overflow.appendChild(fillCandidate);
        break;
      }
      fittedParagraphs.push(fillCandidate);
    }

    sideParagraphs.forEach(function (paragraph) { overflow.appendChild(paragraph); });
    fittedParagraphs.forEach(function (paragraph) { copy.appendChild(paragraph); });
    if (grewForMinimum) {
      illustratedPage.style.setProperty(
        "--illustrated-target-height", availableHeight + "px"
      );
      copy.style.height = availableHeight + "px";
    } else {
      copy.style.height = availableHeight + "px";
    }
    illustratedPage.dataset.reflowChapterTwoBalanceKey = balanceKey;
  }

  function rebalanceChapterTwoIllustrations() {
    var sectionIds = [
      "pg047_sec001", "pg052_sec001", "pg078_sec001", "pg092_sec001",
      "pg099_sec001", "pg110_sec001", "pg113_sec001", "pg132_sec001",
      "pg142_sec001", "pg150_sec001", "pg173_sec001", "pg190_sec001"
    ];
    Array.prototype.slice.call(
      content.querySelectorAll("section.reflow-later-illustrated[data-section-id]")
    ).forEach(function (section) {
      var sectionId = section.getAttribute("data-section-id");
      if (sectionId && sectionIds.indexOf(sectionId) === -1) {
        sectionIds.push(sectionId);
      }
    });
    sectionIds.forEach(rebalanceChapterTwoIllustration);
  }

  function rebalanceAtticIllustration() {
    var section = content.querySelector('[data-section-id="pg031_sec001"]');
    var illustratedPage = section && section.querySelector('.attic-illustrated-page');
    var copy = illustratedPage && illustratedPage.querySelector('.attic-illustrated-copy');
    var sourceParagraph = copy && copy.querySelector('.attic-illustrated-source');
    var overflow = section && section.querySelector('.attic-illustrated-overflow');
    var overflowParagraph = overflow && overflow.querySelector('.attic-overflow-source');
    var image = illustratedPage && illustratedPage.querySelector(':scope > img');
    if (!illustratedPage || !copy || !sourceParagraph || !overflow || !overflowParagraph || !image) {
      return;
    }

    var balanceKey = [
      state.fontSize,
      document.body.classList.contains("reflow-easy-read") ? "easy" : "standard",
      content.clientWidth,
      illustratedPage.clientHeight,
      Math.round(image.getBoundingClientRect().height),
      Math.round((primaryFragmentRect(copy) || copy.getBoundingClientRect()).width),
      sourceParagraph.textContent.length + overflowParagraph.textContent.length
    ].join(":");
    if (illustratedPage.dataset.reflowAtticBalanceKey === balanceKey) return;

    copy.style.removeProperty("height");
    sourceParagraph.style.removeProperty("height");
    sourceParagraph.classList.remove("attic-easy-height-balanced");
    sourceParagraph.style.removeProperty("--attic-balanced-line-height");

    /* Restore source order before measuring a new typography combination.
       The sentence-chain remains indivisible because it joins a sentence
       split only by the boundary of two imported source pages. */
    Array.prototype.slice.call(overflowParagraph.children).forEach(function (unit) {
      sourceParagraph.appendChild(unit);
    });

    var movable = Array.prototype.slice.call(sourceParagraph.children).filter(function (unit) {
      return unit.matches('[data-id], .sentence-chain');
    });
    var imageHeight = image.getBoundingClientRect().height;
    var availableHeight = Math.max(
      0,
      Math.min(illustratedPage.clientHeight - 24, imageHeight || illustratedPage.clientHeight)
    );
    availableHeight = illustratedTargetHeight(
      illustratedPage, image, copy, availableHeight
    );

    /* Rebuild the largest semantic prefix that fits naturally beside the
       image. This adds every available sentence without manufacturing space
       between Easy Read units. */
    var fittedUnits = [];
    if (document.body.classList.contains("reflow-easy-read")) {
      /* Measure the real Easy Read rows at their final width. Character-count
         estimates were only approximate: in some font modes they rejected a
         sentence that still fitted, while in Extra grande they admitted a
         stack that actually exceeded the image. */
      movable.forEach(function (unit) { overflowParagraph.appendChild(unit); });
      for (var fitIndex = 0; fitIndex < movable.length; fitIndex += 1) {
        var candidateUnit = movable[fitIndex];
        sourceParagraph.appendChild(candidateUnit);
        var sourceFragment = primaryFragmentRect(sourceParagraph);
        var renderedStackHeight = sourceFragment
          ? sourceFragment.height
          : sourceParagraph.getBoundingClientRect().height;
        if (fittedUnits.length && renderedStackHeight > availableHeight + 0.5) {
          overflowParagraph.appendChild(candidateUnit);
          break;
        }
        fittedUnits.push(candidateUnit);
      }
    } else {
      movable.forEach(function (unit) { sourceParagraph.appendChild(unit); });
      for (var trimIndex = movable.length - 1; trimIndex > 0; trimIndex -= 1) {
        if (Math.max(copy.scrollHeight, copy.getBoundingClientRect().height) <= availableHeight) break;
        overflowParagraph.insertBefore(movable[trimIndex], overflowParagraph.firstChild);
      }
      fittedUnits = movable.filter(function (unit) {
        return unit.parentElement === sourceParagraph;
      });
    }
    movable.forEach(function (unit) { overflowParagraph.appendChild(unit); });
    fittedUnits.forEach(function (unit) { sourceParagraph.appendChild(unit); });

    /* Typography is immutable: never stretch line-height to fill the image.
       The measured fitter above already keeps the largest prefix of complete
       semantic units that fits naturally; everything else continues below. */
    sourceParagraph.style.removeProperty("--attic-balanced-line-height");
    sourceParagraph.style.removeProperty("height");
    sourceParagraph.classList.remove("attic-easy-height-balanced");
    copy.style.height = availableHeight + "px";
    overflow.hidden = overflowParagraph.children.length === 0;
    illustratedPage.dataset.reflowAtticImageWidth = Math.round(
      image.getBoundingClientRect().width
    );
    illustratedPage.dataset.reflowAtticImageHeight = Math.round(imageHeight);
    illustratedPage.dataset.reflowAtticCopyWidth = Math.round(
      (primaryFragmentRect(copy) || copy.getBoundingClientRect()).width
    );
    illustratedPage.dataset.reflowAtticCopyHeight = Math.round(
      copy.getBoundingClientRect().height
    );
    illustratedPage.dataset.reflowAtticAvailableHeight = Math.round(availableHeight);
    illustratedPage.dataset.reflowAtticSideUnits = sourceParagraph.children.length;
    illustratedPage.dataset.reflowAtticOverflowUnits = overflowParagraph.children.length;
    illustratedPage.dataset.reflowAtticBalanceKey = balanceKey;
  }

  function normalizeLaterBookStructure() {
    /* Suppress the fixed-layout residue in the live DOM as well as in the
       locale catalogue. aria-hidden keeps it out of the TTS/search queues
       during the short interval before the translated empty value settles. */
    var strayConjunction = content.querySelector('[data-id="pg076_n0035"]');
    if (strayConjunction) {
      strayConjunction.textContent = "";
      strayConjunction.setAttribute("aria-hidden", "true");
      strayConjunction.classList.add("reflow-source-residue");
    }

    /* The Chapter 1 prototype reused one semantic id for three different
       WhatsApp windows. Make the DOM keys match the unique locale entries so
       TTS next/previous always stays in the chat currently on screen. */
    ["pg020", "pg021", "pg029"].forEach(function (page) {
      var section = content.querySelector('[data-section-id="' + page + '_sec001"]');
      var cue = section && section.querySelector(
        '[data-id="whatsapp_chat_intro_v33"]'
      );
      if (!cue) return;
      cue.dataset.id = "whatsapp_chat_intro_" + page;
      cue.textContent = "Ventana de chat de Uatsáp.";
    });

    /* Some source pages contain two complete responsive renderings with the
       same semantic ids. Keep one scalable rendering so TTS, glossary and
       navigation never encounter duplicated ids. */
    var chapterFourCover = content.querySelector(
      '[data-section-id="pg080081_sec001"]'
    );
    if (chapterFourCover && !chapterFourCover.dataset.reflowResponsiveNormalized) {
      var desktopImages = chapterFourCover.querySelector('.max-sm\\:hidden');
      var mobileImages = chapterFourCover.querySelector('.hidden.max-sm\\:flex');
      if (desktopImages && mobileImages) {
        desktopImages.classList.remove('max-sm:hidden');
        mobileImages.remove();
      }
      chapterFourCover.dataset.reflowResponsiveNormalized = "true";
    }

    var laterChat = content.querySelector('[data-section-id="pg117_sec001"]');
    if (laterChat && !laterChat.dataset.reflowResponsiveNormalized) {
      var fixedChat = laterChat.querySelector('.max-sm\\:hidden');
      var semanticChat = laterChat.querySelector('.hidden.max-sm\\:block');
      if (fixedChat && semanticChat) {
        fixedChat.remove();
        semanticChat.classList.remove('hidden', 'max-sm:block');
        semanticChat.classList.add('reflow-semantic-chat');
      }
      laterChat.dataset.reflowResponsiveNormalized = "true";
    }

    Array.prototype.slice.call(content.querySelectorAll(
      ':scope > section[data-section-type="separator"]'
    )).forEach(function (section) {
      section.classList.add("reflow-later-chapter-cover");
      Array.prototype.slice.call(section.querySelectorAll("h1, h2")).forEach(
        function (heading) {
          var lowered = heading.textContent.trim().toLocaleLowerCase("es-UY");
          var normalized = lowered.charAt(0).toLocaleUpperCase("es-UY") + lowered.slice(1);
          normalized = normalized.replace(/\bfede\b/gi, "Fede")
            .replace(/\bjosephine\b/gi, "Josephine");
          if (heading.textContent !== normalized) heading.textContent = normalized;
        }
      );
      if (!section.dataset.reflowCoverComposed) {
        var titleBox = document.createElement("div");
        titleBox.className = "reflow-later-cover-title";
        Array.prototype.slice.call(section.querySelectorAll("h1, h2")).forEach(
          function (heading) { titleBox.appendChild(heading); }
        );
        var artBox = document.createElement("div");
        artBox.className = "reflow-later-cover-art";
        var visibleImages = Array.prototype.slice.call(section.querySelectorAll("img")).filter(
          function (image) { return !image.classList.contains("hidden"); }
        );
        var coverCompositeMap = {
          pg058059_sec001: "pg058059_cover_integrated.jpg",
          pg080081_sec001: "pg080081_cover_integrated.jpg",
          pg104105_sec001: "pg104105_cover_integrated.jpg",
          pg122123_sec001: "pg122123_cover_integrated.jpg",
          pg144145_sec001: "pg144145_cover_integrated.jpg",
          pg176177_sec001: "pg176177_cover_integrated.jpg"
        };
        var compositeFilename = coverCompositeMap[section.dataset.sectionId];
        if (compositeFilename && visibleImages.length) {
          var compositeImage = document.createElement("img");
          compositeImage.className = "reflow-integrated-cover-image";
          compositeImage.src = "images/" + compositeFilename;
          compositeImage.alt = visibleImages.map(function (image) {
            return image.alt || "";
          }).filter(Boolean).join(" ");
          if (visibleImages[0].dataset.id) {
            compositeImage.dataset.id = visibleImages[0].dataset.id;
          }
          artBox.appendChild(compositeImage);
        } else {
          visibleImages.forEach(function (image) { artBox.appendChild(image); });
        }
        section.replaceChildren(titleBox, artBox);
        section.dataset.reflowCoverComposed = "true";
      }
    });

    ["pg216217_sec001", "pg219_sec001", "pg221_sec001", "pg223_sec001", "pg224_sec001"].forEach(
      function (sectionId) {
        var section = content.querySelector('[data-section-id="' + sectionId + '"]');
        if (section) section.classList.add("reflow-backmatter-page");
      }
    );

    var montage = content.querySelector('[data-section-id="pg216217_sec001"]');
    if (montage && !montage.dataset.reflowBackmatterNormalized) {
      var strayBadge = montage.querySelector('[data-id="pg216217_n0002"]');
      if (strayBadge) strayBadge.remove();
      montage.classList.add("reflow-full-image-page");
      montage.dataset.reflowBackmatterNormalized = "true";
    }
    if (montage) {
      var montageImage = montage.querySelector('[data-id="pg216217_im002"]');
      if (montageImage) {
        montageImage.src = "images/pg216217_spread_integrated_v4.png?v=47-montage-spread-4";
        montageImage.alt = "Montaje final a doble página: personajes de la historia y el transatlántico Conte Verde sobre el mar.";
      }
    }

    var originalToc = content.querySelector('[data-section-id="pg219_sec001"]');
    if (originalToc) originalToc.classList.add("reflow-original-contents-page");

    /* The biography already owns a forced column start in CSS. An additional
       zero-height breaker here produced an entirely blank page in every
       font-size geometry (the reported pages 267/342/436). Remove legacy
       breakers instead of stacking two independent forced breaks. */
    Array.prototype.slice.call(
      content.querySelectorAll(":scope > .reflow-author-page-break")
    ).forEach(function (breaker) { breaker.remove(); });

    /* Keep this short exchange together. Leaving only its final reply in the
       preceding column created the conspicuous two-line orphan near the end
       of chapter 5. The wrapper preserves every original semantic/TTS id. */
    var editorialKeepStart = content.querySelector('[data-id="pg131_n0034"]');
    var editorialKeepEnd = content.querySelector('[data-id="pg131_n0038"]');
    if (
      editorialKeepStart && editorialKeepEnd &&
      editorialKeepStart.parentNode === editorialKeepEnd.parentNode &&
      !editorialKeepStart.closest(".reflow-editorial-keep-block")
    ) {
      var editorialKeepBlock = document.createElement("div");
      editorialKeepBlock.className = "reflow-editorial-keep-block";
      editorialKeepStart.parentNode.insertBefore(editorialKeepBlock, editorialKeepStart);
      var editorialKeepCursor = editorialKeepStart;
      while (editorialKeepCursor) {
        var editorialKeepNext = editorialKeepCursor.nextSibling;
        editorialKeepBlock.appendChild(editorialKeepCursor);
        if (editorialKeepCursor === editorialKeepEnd) break;
        editorialKeepCursor = editorialKeepNext;
      }
    }

    var promotionalCover = content.querySelector('[data-section-id="pg223_sec001"]');
    if (promotionalCover && !promotionalCover.dataset.reflowBackmatterNormalized) {
      promotionalCover.classList.add("reflow-promotional-cover-page");
      var promotionalImage = promotionalCover.querySelector('[data-id="pg223_im002"]');
      var promotionalCaption = document.createElement("div");
      promotionalCaption.className = "reflow-promotional-cover-caption";
      ["pg223_n0005", "pg223_n0006"].forEach(function (id) {
        var sourceNode = promotionalCover.querySelector('[data-id="' + id + '"]');
        if (!sourceNode) return;
        var line = document.createElement("p");
        line.dataset.id = id;
        line.textContent = sourceNode.textContent || "";
        promotionalCaption.appendChild(line);
      });
      if (promotionalImage) {
        promotionalImage.alt =
          "Portada de la novela Misterio de Cabo Frío, con varios rostros juveniles superpuestos tras un efecto de grietas.";
        promotionalCover.replaceChildren(promotionalImage, promotionalCaption);
      }
      promotionalCover.dataset.reflowBackmatterNormalized = "true";
    }

    var backCover = content.querySelector('[data-section-id="pg224_sec001"]');
    if (backCover && !backCover.dataset.reflowBackCoverComposed) {
      var backCoverTexts = {};
      Array.prototype.slice.call(backCover.querySelectorAll("[data-id]")).forEach(
        function (node) {
          backCoverTexts[node.dataset.id] = String(node.textContent || "").trim();
        }
      );
      var backCoverText = function (id) {
        return backCoverTexts[id] || "";
      };
      var semanticSpan = function (id) {
        var span = document.createElement("span");
        span.dataset.id = id;
        span.textContent = backCoverText(id);
        return span;
      };
      var synopsisPage = document.createElement("div");
      synopsisPage.className = "reflow-back-cover-synopsis";
      var synopsisInner = document.createElement("div");
      synopsisInner.className = "reflow-back-cover-inner";
      var synopsisTitle = document.createElement("h1");
      synopsisTitle.dataset.id = "pg224_n0002";
      synopsisTitle.textContent = backCoverText("pg224_n0002");
      synopsisInner.appendChild(synopsisTitle);
      [
        ["pg224_n0004", "pg224_n0005"],
        ["pg224_n0007", "pg224_n0008", "pg224_n0009", "pg224_n0010", "pg224_n0011", "pg224_n0012"],
        ["pg224_n0014", "pg224_n0015"],
        ["pg224_n0017"],
        ["pg224_n0019"]
      ].forEach(function (ids) {
        var paragraph = document.createElement("p");
        ids.forEach(function (id, index) {
          if (index) paragraph.appendChild(document.createTextNode(" "));
          paragraph.appendChild(semanticSpan(id));
        });
        synopsisInner.appendChild(paragraph);
      });
      synopsisPage.appendChild(synopsisInner);
      backCover.replaceChildren(synopsisPage);
      backCover.classList.add("reflow-back-cover-page");
      backCover.dataset.reflowBackCoverComposed = "true";

      var collaboratorsPage = document.createElement("section");
      collaboratorsPage.className = "reflow-backmatter-page reflow-collaborators-page";
      collaboratorsPage.dataset.sectionId = "pg224_collaborators";
      collaboratorsPage.dataset.sectionType = "institutional_credits";
      collaboratorsPage.setAttribute("aria-labelledby", "reflow-collaborators-title");
      var collaboratorsTitle = document.createElement("h2");
      collaboratorsTitle.id = "reflow-collaborators-title";
      collaboratorsTitle.dataset.reflowAnchorId = "pg224_collaborators";
      collaboratorsTitle.textContent = "Instituciones colaboradoras";
      var collaboratorsImage = document.createElement("img");
      collaboratorsImage.src = "images/pg224_collaborators_black.png?v=47-back-cover-1";
      collaboratorsImage.alt =
        "Logos de ANEP, Ministerio de Educación y Cultura, UTEC, Secretaría Nacional del Deporte y Ceibal.";
      collaboratorsPage.appendChild(collaboratorsTitle);
      collaboratorsPage.appendChild(collaboratorsImage);
      /* The image alt already names every collaborating institution. Keeping
         a second, visually hidden copy of those labels inside the multicolumn
         reader made their inline boxes fragment across hundreds of phantom
         columns in Chromium. Besides duplicating the accessible announcement,
         that corrupted page counts and caused large navigation jumps. */
      backCover.insertAdjacentElement("afterend", collaboratorsPage);
    }
  }

  function normalizeInlineSemanticSpacing() {
    /* PDF text extraction often emits adjacent semantic spans without the
       whitespace that was only implied by their fixed x coordinates. Restore
       that missing separator before any blocks are moved or paginated. */
    Array.prototype.slice.call(content.querySelectorAll("p")).forEach(function (paragraph) {
      var semantic = Array.prototype.slice.call(paragraph.children).filter(function (node) {
        return node.matches("span[data-id]");
      });
      semantic.forEach(function (node, index) {
        if (!index) return;
        var previous = semantic[index - 1];
        var previousText = previous.textContent || "";
        var currentText = node.textContent || "";
        if (!previousText || !currentText || /\s$/.test(previousText) || /^\s/.test(currentText)) return;
        /* Closing punctuation remains attached to the previous token; opening
           Spanish punctuation starts a new sentence and therefore needs a gap. */
        if (/^[,.;:!?%»”)\]]/.test(currentText)) return;
        var between = previous.nextSibling;
        if (between && between !== node && /\s/.test(between.textContent || "")) return;
        paragraph.insertBefore(document.createTextNode(" "), node);
      });
    });
  }

  function normalizeSemanticChainSpacing() {
    /* Sentence chains are assembled after the first spacing pass. Insert a
       persistent separator between their semantic siblings so visual text,
       innerText and TTS all agree. A CSS margin alone fixes appearance but
       still produces joins such as “manojode” in narration and search. */
    Array.prototype.slice.call(content.querySelectorAll(
      ".sentence-chain, .illustrated-copy p, .illustrated-overflow p"
    )).forEach(function (container) {
      /* A composed paragraph may contain a nested sentence-chain followed by
         ordinary semantic spans. Work on the flattened DOM-order sequence so
         the boundary between both structures receives the same separator. */
      var children = Array.prototype.slice.call(
        container.querySelectorAll('span[data-id], .reading-sentence[data-id]')
      );
      children.forEach(function (node, index) {
        if (!index || !node.matches('[data-id], .reading-sentence')) return;
        var previous = children[index - 1];
        var previousText = previous.textContent || "";
        var currentText = node.textContent || "";
        var easyRead = document.body.classList.contains("reflow-easy-read");
        /* A non-breaking separator is useful in ordinary inline prose, but
           becomes a visible indentation when an Easy Read fragment is laid
           out as a block (for example a deliberate line-broken list). Use a
           collapsible ordinary space in Easy Read: it separates inline
           fragments and disappears naturally at the start of a block. */
        if (easyRead && node.dataset.reflowLeadingSpace === "true") {
          var existingLeading = node.firstChild;
          if (existingLeading && existingLeading.nodeType === Node.TEXT_NODE) {
            var strippedLeading = String(existingLeading.nodeValue || "")
              .replace(/^[\s\u00a0]+/, "");
            existingLeading.nodeValue = (previousText.trim() ? " " : "") + strippedLeading;
            if (!existingLeading.nodeValue) existingLeading.remove();
          }
          currentText = node.textContent || "";
        }
        /* An Easy Read translation may intentionally suppress a stale PDF
           fragment. If that empty fragment was formerly the first child,
           remove the persistent separator from the new first visible child;
           otherwise it looks like an unexplained paragraph indentation. */
        if (
          easyRead &&
          (!previousText.trim() || getComputedStyle(node).display === "block") &&
          node.dataset.reflowLeadingSpace === "true"
        ) {
          var leading = node.firstChild;
          if (leading && leading.nodeType === Node.TEXT_NODE) {
            leading.nodeValue = String(leading.nodeValue || "")
              .replace(/^[\s\u00a0]+/, "");
            if (!leading.nodeValue) leading.remove();
          }
          delete node.dataset.reflowLeadingSpace;
          currentText = node.textContent || "";
        }
        if (!previousText || !currentText || /\s$/.test(previousText) || /^\s/.test(currentText)) return;
        if (/^[,.;:!?%»”)\]]/.test(currentText)) return;
        /* Keep the separator inside the translated semantic node. React may
           discard or relocate anonymous siblings during locale reconciliation,
           while an internal leading text node survives until that node itself
           is translated; the mutation observer then restores it once. */
        var first = node.firstChild;
        if (first && first.nodeType === Node.TEXT_NODE && /^\s/.test(first.nodeValue || "")) return;
        node.insertBefore(document.createTextNode(easyRead ? " " : " "), first || null);
        node.dataset.reflowLeadingSpace = "true";
      });
    });
  }

  function completeIllustratedSentences() {
    /* A fixed-layout PDF may split one grammatical sentence at a source-page
       boundary. Pull the leading continuation back into the illustrated
       source section before its side column is composed. This keeps the
       complete sentence visible beside the image whenever space exists. */
    /* Resolve the known inline continuations first. Their source export wraps
       them in a span inside an unlabelled paragraph; relying only on the
       block list lets a later image composer discard that moved bare span. */
    [
      ["pg085_n0013", "pg086_n0002"],
      ["pg088_n0038", "pg089_n0002"],
      ["pg108_n0034", "pg109_n0002"],
      ["pg099_n0009", "pg100_n0002"],
      ["pg114_n0044", "pg115_n0002"],
      ["pg150_n0013", "pg151_n0002"],
      ["pg172_n0044", "pg173_n0002"],
      ["pg189_n0028", "pg190_n0002"],
      ["pg190_n0006", "pg191_n0002"],
      ["pg202_n0037", "pg203_n0002"]
    ].forEach(function (pair) {
      var opening = content.querySelector('[data-id="' + pair[0] + '"]');
      var continuation = content.querySelector('[data-id="' + pair[1] + '"]');
      if (!opening || !continuation || opening.contains(continuation)) return;
      var sourceParent = continuation.parentElement;
      if (!String(continuation.textContent || "").trim()) return;

      /* Preserve the continuation as its own semantic/TTS node. Copying its
         current text into the opening sentence looked correct initially, but
         the locale observer subsequently restored the opening translation and
         erased the copied words. Moving the real node keeps React/i18n, audio,
         highlighting and page anchoring in agreement. */
      var continuationBlock = continuation;
      if (continuation.tagName !== "P") {
        continuationBlock = document.createElement("p");
        Array.prototype.slice.call(continuation.attributes).forEach(function (attribute) {
          continuationBlock.setAttribute(attribute.name, attribute.value);
        });
        while (continuation.firstChild) continuationBlock.appendChild(continuation.firstChild);
        continuation.replaceWith(continuationBlock);
      }
      var openingBlock = opening.tagName === "P" ? opening :
        (opening.closest("p") || opening);
      openingBlock.parentElement.insertBefore(continuationBlock, openingBlock.nextSibling);
      opening.dataset.reflowCrossPageOpening = "true";
      openingBlock.classList.add("reflow-cross-page-opening");
      continuationBlock.classList.add("reflow-cross-page-continuation");
      opening.dataset.reflowSentenceCompleted = pair[1];
      if (sourceParent && sourceParent !== continuationBlock &&
          !(sourceParent.textContent || "").trim() &&
          !sourceParent.querySelector("[data-id], img")) sourceParent.remove();
    });

    /* A previous document-wide inference pass moved prose between unrelated
       sections whenever a PDF boundary merely looked like a split sentence.
       That broad inference remains retired.  The two explicit tables below
       are audited stable-ID corrections for illustrated pages only. */

    var specs = [
      ["pg078_sec001", "pg078_n0006"], ["pg092_sec001", "pg092_n0012"],
      ["pg099_sec001", "pg100_n0002"], ["pg110_sec001", "pg110_n0013"],
      ["pg113_sec001", "pg113_n0007"], ["pg132_sec001", "pg132_n0016"],
      ["pg142_sec001", "pg142_n0013"], ["pg150_sec001", "pg151_n0002"],
      ["pg173_sec001", "pg173_n0011"], ["pg190_sec001", "pg191_n0002"]
    ];
    var leadingSpecs = [
      ["pg092_sec001", "pg092_n0002"],
      ["pg110_sec001", "pg110_n0002"],
      ["pg113_sec001", "pg113_n0002"],
      ["pg173_sec001", "pg173_n0002"],
      ["pg190_sec001", "pg190_n0002"]
    ];
    var terminal = /[.!?…]["'»”)\]]*\s*$/;
    var prose = Array.prototype.slice.call(content.querySelectorAll(
      'section p[data-id], section span[data-id]'
    )).filter(function (node) {
      /* Continuations produced by the PDF export are not consistently tagged:
         some are paragraphs and others are top-level spans.  Keep both, but
         ignore nested semantic fragments so a sentence is never counted twice. */
      if (!(node.textContent || "").trim() || node.closest('.whatsapp-chat-window')) {
        return false;
      }
      return !node.parentElement || !node.parentElement.closest('[data-id]');
    });

    /* Some illustrated source pages start with the second half of a sentence
       whose first half remained on the previous PDF page. Move that trailing
       run into the illustrated section as one unit, too. */
    leadingSpecs.forEach(function (spec) {
      var section = content.querySelector('[data-section-id="' + spec[0] + '"]');
      var first = section && section.querySelector('[data-id="' + spec[1] + '"]');
      if (!section || !first) return;
      var index = prose.indexOf(first);
      if (index <= 0) return;
      var start = index - 1;
      var safety = 0;
      while (start > 0 && safety < 8 &&
             !terminal.test(prose[start - 1].textContent || "")) {
        start -= 1;
        safety += 1;
      }
      var anchor = section.firstChild;
      prose.slice(start, index).forEach(function (node) {
        if (!node || node.closest('.whatsapp-chat-window')) return;
        node.dataset.sourceSection = node.closest('section[data-section-id]')
          ? node.closest('section[data-section-id]').dataset.sectionId : "";
        section.insertBefore(node, anchor);
      });
    });

    specs.forEach(function (spec) {
      var section = content.querySelector('[data-section-id="' + spec[0] + '"]');
      var end = section && section.querySelector('[data-id="' + spec[1] + '"]');
      if (!section || !end || terminal.test(end.textContent || "")) return;
      var index = prose.indexOf(end);
      var safety = 0;
      while (index >= 0 && index + 1 < prose.length && safety < 8 &&
             !terminal.test(end.textContent || "")) {
        var next = prose[index + 1];
        if (!next || next.closest('.whatsapp-chat-window') ||
            next.closest('[data-section-type="separator"], [data-section-type="activity_quiz"]')) break;
        var sourceSection = next.closest('section[data-section-id]');
        var sourceParent = next.parentElement;
        next.dataset.sourceSection = sourceSection ? sourceSection.dataset.sectionId : "";
        if (next.tagName === "SPAN") {
          /* Inline continuations must remain inside a paragraph. Appending a
             bare span to the section made the later illustration composer
             discard it when it rebuilt the image/text row. */
          var targetParagraph = end.tagName === "P" ? end : end.closest("p");
          if (!targetParagraph) break;
          targetParagraph.appendChild(document.createTextNode(" "));
          targetParagraph.appendChild(next);
          if (sourceParent && !(sourceParent.textContent || "").trim() &&
              !sourceParent.querySelector("[data-id], img")) sourceParent.remove();
        } else {
          section.appendChild(next);
        }
        end = next;
        index += 1;
        safety += 1;
      }
    });
  }

  var sceneSeparatorIds = [
    "pg166_n0007",
    "pg166_n0020",
    "pg167_n0005",
    "pg168_n0012",
    "pg168_n0018",
    "pg168_n0031",
    "pg169_n0027",
    "pg203_n0040",
    "pg210_n0001"
  ];

  function isSceneSeparatorAudioId(audioId) {
    var canonicalId = String(audioId || "").replace(/_easy_read$/, "");
    return sceneSeparatorIds.indexOf(canonicalId) >= 0;
  }

  function reconcileSceneSeparatorTts() {
    var api = window.__adtReflowAudio;
    if (!api || !Array.isArray(api.items)) return;
    sceneSeparatorIds.forEach(function (id) {
      var node = content.querySelector('[data-id="' + id + '"]');
      if (!node) return;
      var existingIndex = api.items.findIndex(function (item) {
        return item && (item.el === node || isSceneSeparatorAudioId(item.id) &&
          String(item.id).replace(/_easy_read$/, "") === id);
      });
      if (existingIndex >= 0) {
        api.items[existingIndex].el = node;
        api.items[existingIndex].id = id;
        api.items[existingIndex].filename = "mientras_tanto.wav";
        api.items[existingIndex].useBlockWhenMissingTimecodes = true;
        return;
      }
      var insertionIndex = api.items.findIndex(function (item) {
        return item && item.el && item.el !== node &&
          Boolean(node.compareDocumentPosition(item.el) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      if (insertionIndex < 0) insertionIndex = api.items.length;
      api.items.splice(insertionIndex, 0, {
        el: node,
        id: id,
        filename: "mientras_tanto.wav",
        useBlockWhenMissingTimecodes: true
      });
    });
    if (window.__adtReflowCaptureTtsPages) {
      window.__adtReflowCaptureTtsPages(api.items, true);
    }
  }

  function normalizeSceneSeparators() {
    sceneSeparatorIds.forEach(function (id) {
      var node = content.querySelector('[data-id="' + id + '"]');
      if (!node) return;
      node.classList.add("reflow-scene-separator");
      node.setAttribute("aria-label", "Mientras tanto");
      /* Keep the spoken form in the DOM. CSS paints the three original
         asterisks, while TTS receives the intended discourse marker. */
      node.textContent = "Mientras tanto";
    });
    reconcileSceneSeparatorTts();
  }

  function composeChapterFiveChat() {
    var section = content.querySelector('[data-section-id="pg117_sec001"]');
    if (!section || section.dataset.reflowChatComposed) return;

    function take(id) {
      return section.querySelector('[data-id="' + id + '"]');
    }

    var chat = document.createElement("div");
    chat.className = "whatsapp-chat-window chapter5-chat-window reflow-chat-historical";
    chat.setAttribute("role", "group");

    var firstIntro = document.createElement("p");
    firstIntro.className = "sr-only whatsapp-chat-intro";
    firstIntro.dataset.id = "pg117_im002";
    firstIntro.textContent = "Ventana de chat de Uatsáp con estética antigua.";
    chat.appendChild(firstIntro);

    var date = take("pg117_n0005");
    if (date) {
      date.className = "chapter5-chat-date reflow-chat-notched";
      chat.appendChild(date);
    }

    [
      { side: "outgoing", ids: ["pg117_n0006", "pg117_n0007"] },
      { side: "incoming", ids: ["pg117_n0008", "pg117_n0009", "pg117_n0010", "pg117_n0011"] },
      { side: "outgoing", ids: ["pg117_n0012", "pg117_n0013"] },
      { side: "incoming", ids: ["pg117_n0014", "pg117_n0015", "pg117_n0016", "pg117_n0017"] },
      { side: "outgoing", ids: ["pg117_n0018", "pg117_n0019", "pg117_n0020"] }
    ].forEach(function (message) {
      var bubble = document.createElement("div");
      bubble.className = "chapter5-chat-bubble chapter5-chat-" + message.side + " reflow-chat-notched";
      message.ids.forEach(function (id, index) {
        var paragraph = take(id);
        if (!paragraph) return;
        paragraph.className = index === 0 && /^pg117_n00(?:06|08|12|14|18)$/.test(id)
          ? "chapter5-chat-sender"
          : "chapter5-chat-text";
        bubble.appendChild(paragraph);
      });
      if (bubble.children.length) chat.appendChild(bubble);
    });

    var continuationChat = document.createElement("div");
    continuationChat.className = "whatsapp-chat-window chapter5-chat-window reflow-chat-historical";
    continuationChat.setAttribute("role", "group");
    var continuationIntro = document.createElement("p");
    continuationIntro.className = "sr-only whatsapp-chat-intro";
    continuationIntro.dataset.id = "pg117_im002_continuation";
    continuationIntro.textContent = "Ventana de chat de Uatsáp con estética antigua.";
    continuationChat.appendChild(continuationIntro);
    Array.prototype.slice.call(chat.querySelectorAll(".chapter5-chat-bubble"), 2)
      .forEach(function (bubble) { continuationChat.appendChild(bubble); });

    var tail = document.createElement("div");
    tail.className = "reading-block chapter5-chat-tail";
    var tailParagraph = take("pg117_n0022");
    if (tailParagraph) tail.appendChild(tailParagraph);

    function makeDescription(id) {
      var image = document.createElement("img");
      image.className = "chapter5-chat-source-image";
      image.dataset.reflowSourceId = id;
      image.src = "images/pg117_im002.png";
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      return image;
    }

    var firstChatPage = document.createElement("div");
    firstChatPage.className = "chapter5-chat-page";
    var firstChatComposition = document.createElement("div");
    firstChatComposition.className = "chapter5-chat-composition";
    firstChatComposition.appendChild(makeDescription("pg117_im002"));
    firstChatComposition.appendChild(chat);
    firstChatPage.appendChild(firstChatComposition);

    var secondChatPage = document.createElement("div");
    secondChatPage.className = "chapter5-chat-page chapter5-chat-page-continuation";
    var secondChatComposition = document.createElement("div");
    secondChatComposition.className = "chapter5-chat-composition";
    secondChatComposition.appendChild(makeDescription("pg117_im002_continuation"));
    secondChatComposition.appendChild(continuationChat);
    if (tail.children.length) secondChatComposition.appendChild(tail);
    secondChatPage.appendChild(secondChatComposition);

    section.replaceChildren(firstChatPage, secondChatPage);
    section.dataset.reflowChatComposed = "true";
  }

  function synchronizeChatTypography() {
    if (!content) return;
    var buckets = Object.create(null);
    Array.prototype.slice.call(content.querySelectorAll(".reading-sentence[data-id]"))
      .forEach(function (node) {
      if (node.closest(".whatsapp-chat-window, .reflow-book-chat-window, .chapter5-chat-page, .quiz-card, h1, h2, h3, button")) return;
        var text = String(node.textContent || "").trim();
        if (!text) return;
        var style = getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden") return;
        var size = parseFloat(style.fontSize);
        var lineHeight = parseFloat(style.lineHeight);
        if (!Number.isFinite(size) || size <= 0) return;
        if (!Number.isFinite(lineHeight) || lineHeight <= 0) lineHeight = size * 1.55;
        var key = size.toFixed(2) + "|" + lineHeight.toFixed(2);
        var weight = Math.min(240, Math.max(1, text.length));
        if (!buckets[key]) buckets[key] = { size: size, lineHeight: lineHeight, weight: 0 };
        buckets[key].weight += weight;
      });
    var winner = Object.keys(buckets).map(function (key) { return buckets[key]; })
      .sort(function (a, b) { return b.weight - a.weight; })[0];
    if (!winner) return;
    content.style.setProperty("--reflow-chat-message-size", winner.size + "px");
    content.style.setProperty("--reflow-chat-message-line-height", winner.lineHeight + "px");
  }

  function fitChapterFiveChat() {
    if (!content) return;
    synchronizeChatTypography();
    requestAnimationFrame(synchronizeChatTypography);
    Array.prototype.slice.call(content.querySelectorAll(".chapter5-chat-page"))
      .forEach(function (page) {
        page.style.setProperty("--chapter5-chat-scale", "1");
        var composition = page.querySelector(".chapter5-chat-composition");
        if (!composition) return;
        var availableHeight = Math.max(1, page.clientHeight - 24);
        var naturalHeight = Math.max(
          composition.scrollHeight,
          composition.getBoundingClientRect().height
        );
        if (naturalHeight > availableHeight) {
          var scale = Math.max(.72, availableHeight / naturalHeight);
          page.style.setProperty("--chapter5-chat-scale", String(scale));
          var paintedHeight = composition.getBoundingClientRect().height;
          if (paintedHeight > availableHeight) {
            page.style.setProperty(
              "--chapter5-chat-scale",
              String(Math.max(.72, scale * availableHeight / paintedHeight))
            );
          }
        }
      });
  }

  function composeLaterWhatsAppChats() {
    var chatSpecs = [
  {
    section: "pg068_sec001", image: "pg068_im004", date: "pg068_n0007",
    historical: false,
        messages: [
          { side: "incoming", sender: true, ids: [
            "pg068_n0008", "pg068_n0009", "pg068_n0010", "pg068_n0011",
            "pg068_n0012", "pg068_im002"
          ] }
        ]
      },
  {
    section: "pg069_sec001", image: "pg069_im004", date: "pg069_n0004",
    historical: false,
        messages: [
          { side: "outgoing", sender: true, ids: [
            "pg069_n0005", "pg069_n0006", "pg069_n0007", "pg069_n0009"
          ] },
          { side: "incoming", sender: true, ids: ["pg069_n0010", "pg069_n0011"] },
          { side: "outgoing", sender: true, ids: [
            "pg069_n0012", "pg069_n0013", "pg069_n0014"
          ] }
        ]
      },
  {
    section: "pg069_sec001", image: "pg069_im005",
    historical: false,
        messages: [
          { side: "incoming", sender: true, ids: ["pg069_n0018", "pg069_n0019"] }
        ]
      },
  {
    section: "pg070_sec001", image: "pg070_im002", replaceImageOnly: true,
    introId: "whatsapp_chat_intro_pg070",
    historical: false,
        messages: [
          { side: "outgoing", sender: true, ids: [
            "pg070_n0007", "pg070_n0008", "pg070_im002"
          ] }
        ]
      },
  {
    section: "pg079_sec001", image: "pg079_im002", replaceImageOnly: true,
    date: "pg079_n0002",
    historical: false,
        messages: [
          { side: "incoming", sender: true, ids: ["pg079_n0003", "pg079_n0004"] }
        ]
      },
      {
        section: "pg083_sec001", image: "pg083_im002", date: "pg083_n0011",
        historical: true,
        messages: [
          { side: "incoming", sender: true, ids: ["pg083_n0012", "pg083_n0013"] }
        ]
      },
      {
        section: "pg084_sec001", image: "pg084_im002", date: "pg084_n0002",
        historical: true,
        messages: [
          { side: "outgoing", sender: true, ids: ["pg084_n0003", "pg084_n0004"] }
        ]
      },
      {
        section: "pg094_sec001", image: "pg094_im002", historical: true,
        splitAfterFirstMessage: true,
        messages: [
          { side: "incoming", sender: true, date: "pg094_n0002", ids: [
            "pg094_n0003", "pg094_n0004", "pg094_n0005", "pg094_n0006"
          ] },
          { side: "outgoing", sender: true, date: "pg094_n0007", ids: [
            "pg094_n0008", "pg094_n0009"
          ] }
        ]
      },
  {
    section: "pg094_sec001", image: "pg094_im003",
    historical: true,
        messages: [
          { side: "outgoing", sender: true, date: "pg094_n0018", ids: [
            "pg094_n0019", "pg094_n0020", "pg094_n0021", "pg094_n0022", "pg094_n0023"
          ] }
        ]
      },
      {
        section: "pg095_sec001", image: "pg095_im002", historical: true,
        splitAfterFirstMessage: true,
        messages: [
          { side: "incoming", sender: true, ids: [
            "pg095_n0004", "pg095_n0005", "pg095_n0006", "pg095_n0007", "pg095_n0008"
          ] },
          { side: "outgoing", sender: true, ids: [
            "pg095_n0009", "pg095_n0010", "pg095_n0011"
          ] }
        ]
      },
  {
    section: "pg127_sec001", image: "pg127_im002", date: "pg127_n0006",
    historical: false,
        messages: [
          { side: "outgoing", sender: true, ids: ["pg127_n0007", "pg127_n0008"] },
          { side: "incoming", sender: true, ids: ["pg127_n0009", "pg127_n0010"] }
        ]
      },
      {
        section: "pg183_sec001", image: "pg183_im002", date: "pg183_n0024",
        historical: true,
        messages: [
          { side: "outgoing", sender: true, ids: ["pg183_n0025", "pg183_n0026"] }
        ]
      },
      {
        section: "pg183_sec001", image: "pg183_im003",
        historical: true,
        messages: [
          { side: "incoming", sender: true, ids: ["pg183_n0030", "pg183_n0031"] }
        ]
      }
    ];

    chatSpecs.forEach(function (spec) {
      var section = content.querySelector('[data-section-id="' + spec.section + '"]');
      var existingIntroId = spec.introId || spec.image;
      /* Locale reconciliation can invoke this composer again after the
         source image has already become an aria-hidden child of the chat.
         In that state a query by data-id finds the spoken intro paragraph;
         treating it as the source image nested a second window inside the
         first one and duplicated both narration and pagination. */
      if (section && section.querySelector(
        '.whatsapp-chat-window [data-id="' + existingIntroId + '"]'
      )) return;
      var image = section && section.querySelector('[data-id="' + spec.image + '"]');
      if (!section || !image || image.dataset.reflowChatComposed) return;
      var target = spec.replaceImageOnly ? image : image.parentElement;
      if (!target || !target.parentElement) return;

      var semanticIds = [];
      if (spec.date) semanticIds.push(spec.date);
      spec.messages.forEach(function (message) {
        if (message.date) semanticIds.push(message.date);
        semanticIds.push.apply(semanticIds, message.ids);
      });
      var semanticNodes = Object.create(null);
      var origins = [];
      semanticIds.forEach(function (id) {
        var node = section.querySelector('[data-id="' + id + '"]');
        if (!node) return;
        semanticNodes[id] = node;
        if (node.parentElement) origins.push(node.parentElement);
      });

      var chatWindow = document.createElement("div");
          var historical = spec.historical === true;
      chatWindow.className = "whatsapp-chat-window reflow-book-chat-window " +
        (historical ? "reflow-chat-historical" : "reflow-chat-modern");
      var chatDescription = historical
        ? "Ventana de chat de Uatsáp con estética antigua."
        : "Ventana de chat de Uatsáp.";
      chatWindow.setAttribute("role", "group");
      chatWindow.setAttribute("aria-label", chatDescription);
      target.parentElement.insertBefore(chatWindow, target);

      /* Every visual window owns exactly one spoken boundary.  Keeping that
         boundary on a tiny in-flow node prevents the audio index from using
         an imported image canvas (whose fixed position can belong to a
         different column/page) and avoids narrating the same description
         twice before the date and messages. */
      var chatIntro = document.createElement("p");
      chatIntro.className = "sr-only whatsapp-chat-intro";
      chatIntro.dataset.id = spec.introId || spec.image;
      chatIntro.textContent = chatDescription;
      chatWindow.appendChild(chatIntro);

      var sourceIsMessage = spec.messages.some(function (message) {
        return message.ids.indexOf(spec.image) >= 0;
      });
      if (!sourceIsMessage) {
        image.className = "reflow-chat-source-image";
        image.dataset.reflowSourceId = spec.image;
        image.removeAttribute("data-id");
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        image.dataset.reflowChatComposed = "true";
        chatWindow.appendChild(image);
      }

      var firstGroup = document.createElement("div");
      firstGroup.className = "reflow-chat-head";
      if (spec.date && semanticNodes[spec.date]) {
        semanticNodes[spec.date].className = "reflow-chat-date" + (historical ? " reflow-chat-notched" : "");
        firstGroup.appendChild(semanticNodes[spec.date]);
      }

      spec.messages.forEach(function (message, messageIndex) {
        if (message.date && semanticNodes[message.date]) {
          semanticNodes[message.date].className = "reflow-chat-date" + (historical ? " reflow-chat-notched" : "");
          if (messageIndex === 0) firstGroup.appendChild(semanticNodes[message.date]);
          else chatWindow.appendChild(semanticNodes[message.date]);
        }
        var bubble = document.createElement("div");
        bubble.className = "reflow-chat-bubble reflow-chat-" + message.side + (historical ? " reflow-chat-notched" : "");
        message.ids.forEach(function (id, index) {
          var node = semanticNodes[id];
          if (!node) return;
          if (node.tagName === "IMG") {
            node.className = "reflow-chat-emoji reflow-tts-no-highlight";
            node.removeAttribute("aria-hidden");
            if (id === "pg068_im002") node.alt = "Emolli de cara sonriente con lentes de sol";
            if (id === "pg070_im002") node.alt = "Emolli de calavera";
          } else {
            node.className = index === 0 && message.sender
              ? "reflow-chat-sender"
              : "reflow-chat-text";
          }
          bubble.appendChild(node);
        });
        if (bubble.children.length) {
          if (messageIndex === 0) firstGroup.appendChild(bubble);
          else chatWindow.appendChild(bubble);
        }
      });
      if (firstGroup.children.length) {
        chatWindow.insertBefore(firstGroup, sourceIsMessage ? chatIntro.nextSibling : image.nextSibling);
      }
      if (spec.splitAfterFirstMessage) {
        var directBubbles = Array.prototype.slice.call(
          chatWindow.querySelectorAll(":scope > .reflow-chat-bubble")
        );
        if (directBubbles.length) {
          var continuationWindow = document.createElement("div");
          continuationWindow.className = chatWindow.className;
          continuationWindow.setAttribute("role", "group");
          continuationWindow.setAttribute("aria-label", chatDescription + " (continuación)");
          directBubbles.forEach(function (bubble) {
            continuationWindow.appendChild(bubble);
          });
          chatWindow.parentElement.insertBefore(continuationWindow, chatWindow.nextSibling);
        }
      }
      if (spec.messages.length <= 2) chatWindow.classList.add("reflow-chat-short");

      if (target !== image && target.isConnected) target.remove();
      origins.forEach(function (origin) {
        if (
          origin.isConnected && origin !== chatWindow &&
          !origin.querySelector("[data-id], img") && !origin.textContent.trim()
        ) origin.remove();
      });

      /* pg070 stored its single semantic message three wrappers deep inside
         the old fixed-width bubble. Once the message has been composed, move
         the responsive chat to the surrounding story flow and discard those
         empty fixed-layout wrappers so the window owns the full text box. */
      if (spec.section === "pg070_sec001") {
        var sourceCanvas = chatWindow.parentElement &&
          chatWindow.parentElement.parentElement &&
          chatWindow.parentElement.parentElement.parentElement;
        if (sourceCanvas && sourceCanvas.parentElement && section.contains(sourceCanvas)) {
          sourceCanvas.parentElement.insertBefore(chatWindow, sourceCanvas);
          sourceCanvas.remove();
        }
      }
      section.dataset.reflowHasSemanticChat = "true";
    });

    var unusedEmoji = content.querySelector('[data-section-id="pg069_sec001"] [data-id="pg069_im002"]');
    if (unusedEmoji) unusedEmoji.remove();

    /* An emoji embedded at the end of a sentence is a separate spoken unit.
       This prevents the message audio from consuming it silently and gives
       the emoji its own Valentina/Mateo clip without making it yellow. */
    function splitTextualEmoji(sourceId, symbol, emojiId, label) {
      var source = content.querySelector('[data-id="' + sourceId + '"]');
      if (!source || content.querySelector('[data-id="' + emojiId + '"]')) return;
      /* The locale catalogue deliberately keeps the spoken message free of
         the pictograph. The original fixed-layout HTML still contains it,
         so remove it when present but always create the independent emoji
         unit. This keeps the visual emoji, its audio and its timecode stable
         regardless of whether translation finished before composition. */
      if (source.textContent.includes(symbol)) {
        source.textContent = source.textContent.replace(symbol, "").trimEnd();
      }
      var emoji = document.createElement("span");
      emoji.className = "reflow-inline-emoji reflow-tts-no-highlight";
      emoji.dataset.id = emojiId;
      emoji.setAttribute("role", "img");
      emoji.setAttribute("aria-label", label);
      emoji.textContent = symbol;
      source.insertAdjacentElement("afterend", emoji);
    }
    splitTextualEmoji("pg029_n0018", "🐒", "pg029_n0018_emoji01", "Emolli de mono");
    splitTextualEmoji(
      "pg069_n0019", "😬", "pg069_n0019_emoji01",
      "Emolli de cara haciendo una mueca"
    );
    var standaloneEmoji = content.querySelector('[data-id="pg069_n0009"]');
    if (standaloneEmoji) {
      standaloneEmoji.classList.add("reflow-tts-no-highlight");
      standaloneEmoji.setAttribute("role", "img");
      standaloneEmoji.setAttribute("aria-label", "Emolli de cara gritando de miedo");
    }

    /* Array.from keeps a complete Unicode code point together; the old
       surrogate-range split could cut an emoji in half. */
    Array.prototype.slice.call(content.querySelectorAll(
      '.reflow-book-chat-window .reflow-chat-text, .reflow-book-chat-window .reflow-chat-sender'
    )).forEach(function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType !== Node.TEXT_NODE ||
            !Array.from(child.nodeValue).some(function (char) {
              return /\p{Extended_Pictographic}/u.test(char);
            })) return;
        var fragment = document.createDocumentFragment();
        var buffer = "";
        function flushBuffer() {
          if (buffer) fragment.appendChild(document.createTextNode(buffer));
          buffer = "";
        }
        Array.from(child.nodeValue).forEach(function (part) {
            if (!/\p{Extended_Pictographic}/u.test(part)) {
              buffer += part;
              return;
            }
            flushBuffer();
            var emoji = document.createElement("span");
            emoji.className = "reflow-inline-emoji reflow-tts-no-highlight";
            emoji.setAttribute("role", "img");
            var labels = {
              "😱": "Emolli de cara gritando de miedo",
              "😬": "Emolli de cara haciendo una mueca",
              "🐒": "Emolli de mono",
              "🙈": "Emolli de mono que se tapa los ojos",
              "💀": "Emolli de calavera"
            };
            emoji.setAttribute("aria-label", labels[part] || "Emoji");
            emoji.textContent = part;
            fragment.appendChild(emoji);
          });
        flushBuffer();
        child.replaceWith(fragment);
      });
    });
  }

  function composeVirtualRealityIllustration() {
    var section = content.querySelector('[data-section-id="pg068_sec001"]');
    var image = section && section.querySelector('[data-id="pg068_im003"]');
    var chat = section && section.querySelector(':scope .whatsapp-chat-window');
    if (!section || !image || section.dataset.reflowVrIllustrationComposed) return;

    /* Keep the complete prose units beside the artwork. The source's partial
       pg067_n0029 node is deliberately absent: page 68 owns the full
       “Lo reconoce de inmediato…” sentence. */
    var sideIds = [
      "pg067_n0028", "pg068_n0002", "pg068_n0003", "pg068_n0004"
    ];
    var sideParagraphs = sideIds.map(function (id) {
      return content.querySelector('[data-id="' + id + '"]');
    }).filter(Boolean);
    if (!sideParagraphs.length) return;

    image.alt = "Javier usa lentes de realidad aumentada y contempla distintas escenas";
    var illustratedPage = document.createElement("div");
    illustratedPage.className = "illustrated-page";
    var illustratedCopy = document.createElement("div");
    illustratedCopy.className = "illustrated-copy reading-block";
    sideParagraphs.forEach(function (paragraph) {
      paragraph.dataset.sourceSection = "pg068_sec001";
      illustratedCopy.appendChild(paragraph);
    });
    illustratedPage.appendChild(image);
    illustratedPage.appendChild(illustratedCopy);

    var overflow = document.createElement("div");
    overflow.className = "illustrated-overflow reading-block";
    section.replaceChildren(illustratedPage, overflow);
    if (chat) section.appendChild(chat);
    section.classList.add("reflow-later-illustrated");
    section.dataset.reflowVrIllustrationComposed = "true";
  }

  function restoreVirtualRealityIllustrationUnits() {
    var section = content.querySelector('[data-section-id="pg068_sec001"]');
    var illustratedPage = section && section.querySelector(":scope > .illustrated-page");
    var copy = illustratedPage && illustratedPage.querySelector(":scope > .illustrated-copy");
    var overflow = section && section.querySelector(":scope > .illustrated-overflow");
    if (!section || !illustratedPage || !copy || !overflow) return;

    /* Sentence-chain normalization runs after the illustration is composed.
       It can wrap the continuation from pages 67–68 and move that wrapper
       outside the copy column. Rebuild the four complete editorial units
       here, after all chains exist, so the measured balancer can place the
       largest fitting prefix beside the artwork without ever splitting a
       sentence or leaving a one-line page. */
    var ids = ["pg067_n0028", "pg068_n0003", "pg068_n0004"];
    var units = [];
    ids.forEach(function (id) {
      var node = content.querySelector('[data-id="' + id + '"]');
      if (!node) return;
      var unit = node.closest(".editorial-unit-group") ||
        node.closest(".sentence-chain") || node;
      if (units.indexOf(unit) === -1) units.push(unit);
    });

    units.forEach(function (unit, index) {
      unit.dataset.reflowChapterTwoSide = "true";
      unit.dataset.reflowChapterTwoOrder = String(index);
      Array.prototype.slice.call(unit.querySelectorAll("[data-id]")).forEach(function (node) {
        node.dataset.reflowChapterTwoSide = "true";
        node.dataset.reflowChapterTwoOrder = String(index);
      });
      overflow.appendChild(unit);
    });

    if (units[0]) copy.appendChild(units[0]);
    if (units[1]) copy.appendChild(units[1]);
  }

  function prepareReadingFlow() {
    /* Normalize source semantics before any sentence chains or illustrated
       layouts are built. Moving these nodes after pagination was the root
       cause of blank chats, duplicate overlays and orphan chat dates. */
    normalizeLaterBookStructure();
    normalizeInlineSemanticSpacing();
    completeIllustratedSentences();
    normalizeSceneSeparators();
    composeLaterWhatsAppChats();
    keepParagraphWithWhatsApp("pg095_sec001", "pg095_n0002", "pg095_im002");
    composeVirtualRealityIllustration();
    composeChapterFiveChat();
    prepareIllustratedSection("pg025_sec001", "pg025_n0009");
    composeAtticIllustration();
    moveParagraphsToIllustration(
      "pg024_sec001",
      "pg025_sec001",
      ["pg024_n0038", "pg024_n0040", "pg024_n0041"]
    );
    prepareIllustratedSection("pg047_sec001", "pg047_n0008");
    prepareIllustratedSection("pg052_sec001", "pg052_n0004");
    moveParagraphsToIllustration(
      "pg051_sec001",
      "pg052_sec001",
      ["pg051_n0020", "pg051_n0021", "pg051_n0022", "pg051_n0023", "pg051_n0024"]
    );
    composeChapterTwoFinalPassage();
    [
      ["pg078_sec001", "pg078_n0006"],
      ["pg092_sec001", "pg093_n0002"],
      ["pg099_sec001", "pg099_n0009"],
      ["pg110_sec001", "pg110_n0013"],
      ["pg113_sec001", "pg113_n0007"],
      ["pg132_sec001", "pg133_n0002"],
      ["pg142_sec001", "pg142_n0013"],
      ["pg150_sec001", "pg150_n0013"],
      ["pg173_sec001", "pg173_n0011"],
      ["pg190_sec001", "pg191_n0002"]
    ].forEach(function (entry) {
      prepareIllustratedSection(entry[0], entry[1]);
      var section = content.querySelector('[data-section-id="' + entry[0] + '"]');
      if (section) section.classList.add("reflow-later-illustrated");
    });

    moveParagraphsToIllustration(
      "pg109_sec001", "pg110_sec001", ["pg109_n0037"]
    );

    /* Keep these brief transitions with the illustrated action that they
       introduce. Moving the actual semantic nodes keeps visual pagination,
       Easy Read, TTS order and word highlighting in the same sequence. */
    moveParagraphsToIllustration(
      "pg091_sec001", "pg092_sec001", ["pg091_n0029"]
    );
    moveSemanticGroupToIllustration(
      "pg141_sec001", "pg142_sec001", ["pg141_n0036", "pg141_n0037"]
    );


    /* Keep the short question with the preceding exchange instead of
       leaving it alone immediately before the illustrated page. */
    var shortQuestion = content.querySelector('[data-id="pg024_n0036"]');
    var precedingExchange = content.querySelector('[data-id="pg024_n0034"]');
    if (shortQuestion && precedingExchange && precedingExchange.parentElement) {
      var oldParent = shortQuestion.parentElement;
      precedingExchange.parentElement.appendChild(shortQuestion);
      if (oldParent && !oldParent.textContent.trim()) oldParent.remove();
    }

    var storySections = Array.prototype.slice.call(content.querySelectorAll(
      'section[data-section-type="text_only"], ' +
      'section[data-section-type="boxed_text"], ' +
      'section[data-section-type="text_and_single_image"], ' +
      'section[data-reflow-has-semantic-chat="true"]'
    ));
    storySections.forEach(function (section) {
      var sectionId = section.dataset.sectionId;
      section.classList.add("reflow-story-section");
      Array.prototype.slice.call(section.querySelectorAll("p[data-id]")).forEach(function (paragraph) {
        if (paragraph.closest(".whatsapp-chat-window")) {
          paragraph.dataset.sourceSection = paragraph.dataset.sourceSection || sectionId;
          return;
        }
        paragraph.classList.add("reading-sentence");
        paragraph.dataset.sourceSection = paragraph.dataset.sourceSection || sectionId;
        if (paragraph.parentElement) paragraph.parentElement.classList.add("reading-block");
      });
      Array.prototype.slice.call(section.querySelectorAll("p > span[data-id]")).forEach(function (sentence) {
        if (sentence.closest(".whatsapp-chat-window")) {
          sentence.dataset.sourceSection = sentence.dataset.sourceSection || sectionId;
          return;
        }
        sentence.classList.add("reading-sentence");
        sentence.dataset.sourceSection = sentence.dataset.sourceSection || sectionId;
        if (sentence.parentElement) sentence.parentElement.classList.add("reading-block");
      });
    });

    function createSentenceChain(ids, extraClass) {
      var paragraphs = ids.map(function (id) {
        return content.querySelector('[data-id="' + id + '"]');
      }).filter(Boolean);
      if (paragraphs.length !== ids.length) return;
      /* Some Easy Read replacements deliberately absorb the preceding PDF
         fragment and leave its source node empty. Remove that residue before
         building the chain: an empty node can still become a column landmark
         and create a blank or nearly blank page even when CSS hides it. */
      paragraphs.forEach(function (paragraph) {
        if (!(paragraph.textContent || "").trim()) paragraph.remove();
      });
      paragraphs = paragraphs.filter(function (paragraph) {
        return paragraph.isConnected && (paragraph.textContent || "").trim();
      });
      if (!paragraphs.length) return;
      var firstSourceParent = paragraphs[0].parentElement;
      var lastSourceParent = paragraphs[paragraphs.length - 1].parentElement;
      var precedingParagraphUnits = [];
      if (
        extraClass === "later-book-sentence-chain" &&
        firstSourceParent && lastSourceParent && firstSourceParent !== lastSourceParent
      ) {
        var precedingUnit = paragraphs[0].previousElementSibling;
        while (precedingUnit && precedingUnit.matches("p[data-id], span[data-id]")) {
          precedingParagraphUnits.unshift(precedingUnit);
          if (precedingUnit.classList.contains("reflow-paragraph-start")) break;
          precedingUnit = precedingUnit.previousElementSibling;
        }
      }
      paragraphs = paragraphs.map(function (paragraph) {
        if (paragraph.tagName !== "P") return paragraph;
        var inlineSentence = document.createElement("span");
        Array.prototype.slice.call(paragraph.attributes).forEach(function (attribute) {
          inlineSentence.setAttribute(attribute.name, attribute.value);
        });
        while (paragraph.firstChild) inlineSentence.appendChild(paragraph.firstChild);
        paragraph.replaceWith(inlineSentence);
        return inlineSentence;
      });
      var destination = paragraphs[paragraphs.length - 1].parentElement;
      if (!destination) return;
      var chain = document.createElement("span");
      chain.className = "sentence-chain" + (extraClass ? " " + extraClass : "");
      destination.insertBefore(chain, paragraphs[paragraphs.length - 1]);
      precedingParagraphUnits.forEach(function (unit) {
        destination.insertBefore(unit, chain);
      });
      paragraphs.forEach(function (paragraph, index) {
        /* Keep a real text boundary between source sentences. CSS-generated
           spaces are only visual and may disappear after a reflow move; a
           text node also preserves correct copying and accessible reading. */
        if (index && !/^\s/.test(paragraph.textContent || "")) {
          /* Keep the separator inside the semantic node itself. Text nodes
             placed between siblings were lost when the chain was moved into
             an illustrated column, producing joins such as “manojode”. */
          paragraph.insertBefore(document.createTextNode(" "), paragraph.firstChild);
        }
        chain.appendChild(paragraph);
      });
      /* The following source paragraph may also flow inline. Retain an
         explicit terminal boundary across that group edge as well. */
      chain.appendChild(document.createTextNode(" "));
    }

    /* The chapter-2 source retains the original sentence fragments. Rejoin
       only consecutive fragments whose punctuation says they form one
       sentence, preserving the same paragraph logic used in the prepared
       standalone chapter rather than hard-coding visual page numbers. */
    var chapterTwoParagraphs = Array.prototype.slice.call(content.querySelectorAll(
      'section[data-section-id^="pg0"] p[data-id]'
    )).filter(function (paragraph) {
      var match = paragraph.dataset.id && paragraph.dataset.id.match(/^pg(\d{3})_/);
      var page = match ? Number(match[1]) : 0;
      return page >= 39 && page <= 57;
    });
    for (var chapterTwoIndex = 0; chapterTwoIndex < chapterTwoParagraphs.length - 1; chapterTwoIndex += 1) {
      if (hasTerminalPunctuation(chapterTwoParagraphs[chapterTwoIndex].textContent)) continue;
      var chapterTwoEnd = chapterTwoIndex + 1;
      while (
        chapterTwoEnd < chapterTwoParagraphs.length - 1 &&
        !hasTerminalPunctuation(chapterTwoParagraphs[chapterTwoEnd].textContent)
      ) {
        chapterTwoEnd += 1;
      }
      var chapterTwoIds = chapterTwoParagraphs.slice(chapterTwoIndex, chapterTwoEnd + 1).map(
        function (paragraph) { return paragraph.dataset.id; }
      );
      createSentenceChain(chapterTwoIds, "chapter-two-sentence-chain");
      chapterTwoIndex = chapterTwoEnd;
    }

    /* Chapters 3-8 mix several incompatible HTML export conventions. Their
       PDF first-line indents are the stable editorial evidence, so the map
       below records those starts independently of source wrappers and visual
       page breaks. It is generated from the original PDF text coordinates. */
    var laterBookPdfParagraphStarts = {"61":[3,5,7],"62":[4,5,6,27,28],"63":[20],"64":[2,13,15,17,20,24,25,26],"65":[2,5,9,10,12,14,15,17,18,19,20,23,24,28,29,31],"66":[2,5,13,14,17,26],"67":[2,6,12,17,24,28],"69":[2,16,21,24,5,6,12,13],"70":[5,7,8,10,18],"71":[5,11,19,21,23,25,29],"72":[3,6,7,8,10,11,13,14,15,17,26,27,30],"73":[5,10,14,17,19,21,23,25,27,31,34],"74":[2,5,8,16,24,31],"75":[7,9,13,20],"76":[4,7,14,17,18,21,29,30,32,36],"77":[3,11,25,33,40],"78":[2,6],"79":[3,4,6,20,24,28,30],"83":[12,13,15],"84":[3,4,6,9,13,18],"85":[3,13],"86":[12,15,18,25],"87":[2,3,7,8,10,13,20,23,34,38,39,40,41],"88":[2,5,10,12,20,21,22,25,26,34,37],"89":[11,13,15,22,24,26],"90":[2,6,8,10,12,17,19,22],"91":[2,3,5,6,10,14,16],"92":[11],"93":[6,21],"94":[3,4,5,8,9,11,19,20],"95":[2,4,5,8,9,10,11,13,14],"96":[6,8,10,15,25,32],"97":[7,9,14,18,20,24,26,28],"98":[7,13,16,17,18,20,24,25],"99":[2,5,6,7],"100":[6,21,23],"101":[3,10,12,25,28],"102":[15,20,28],"107":[5,6,10,15,17],"108":[2,8,11,13,15,20,24,26,28,30,32],"109":[5,7,9,12,14,18,20,23,26,27,29,30,34,35,36],"110":[6,10],"111":[9,14,24],"112":[2,3,4,10,11,12,14,17],"113":[5],"114":[2,7,9,14,16,22,24,33,40,43],"115":[11,17,19,21,24,27,29,32,35,37,41,43],"116":[7,11,20,21,22,26,29,30,32,34,35],"117":[6,7,13,18,19,12],"118":[2,8,19,21,23,25,29,31,35,39],"119":[2,5,13,19,21,23,27,31],"120":[5,7,20,25,26],"121":[2,3,12],"125":[4,5,7,12,13,18,20],"126":[2,3,5,10,16,21,24,30,32],"127":[7,8,12,17,20,21,22,23],"128":[2,8,14,16,24,26,29,34,36,41,44],"129":[2,24,26,36,38],"130":[10,15,19,24,27,29,33],"131":[2,6,20,24,28,31,34,38],"132":[2,4,6,9],"133":[8,12,14,20,22,26,28,33,35,41],"134":[2,3,4,5,8,9,12,13,18,19,20,21,25,27,28],"135":[5,6,9,10,11,12,18,19,21,22,25,30,36,39,45],"136":[2,6,8,11,13,20,26,29,34,42],"137":[7,8,13,14,17,21,25,27,28,31,33,34,35,36,40],"138":[2,9,12,14,21,26,28,32,35,40,43,47],"139":[2,7,10,12,15,18,23,26,29,32,44,47,52],"140":[2,3,6,7,10,13,17,22,31,33,35,37],"141":[2,13,28,29,31,36],"142":[2,3,8],"143":[2,3,20,21],"147":[3,7,10,14,17,21],"148":[7,8,16,19,20,23],"149":[2,12,15,17,19,24,30],"150":[2,3,11],"151":[11,13,16,20],"152":[7,8,9,10,12,16,17,18,19,22,23,27,29],"153":[2,6,9,13,20,25,27,30],"154":[2,7,9,23,28,29],"155":[2,4,7,11,18],"156":[10,13,18,21],"157":[2,3,9,11,12,22],"158":[2,3,4,5,11,14,19,22,27,28,33],"159":[6,10,16,19,25,29,35],"160":[2,9,12,19,22,25,31,33],"161":[2,3,4,5,8,16,18,21,23,27,29],"162":[2,4,5,7,10,14,18,20,21],"163":[6,9,12,22],"164":[4,5,6,8,17,23,30,31],"165":[2,3,5,6,7,8,11,14,17,18,19,21,22,24],"166":[2,3,4,9,14,17,22],"167":[7,12,14,17,20,22,25,27,29,31,35],"168":[3,7,8,14,15,20,27,33],"169":[9,12,16,17,19,22,26,29,32,35],"170":[2,4,5,14,17,23,24,26,27],"171":[2,3,5,10,15,16,20,21],"172":[2,5,7,11,14,19,24,27,29,31,35,37,40],"173":[5,6,9,10],"174":[2,5,7,9,15,17,19,21,23,25,27,30,32,34],"175":[6,9,12,17,21,22,25],"179":[7,13],"180":[4,5,8,9,11,12,13,14,15,16,18,24,27],"181":[2,4,6,12,14,17,19,22,24,26,28,30,31],"182":[2,8,13,16,18,20,25,33,37,40],"183":[2,6,9,11,12,14,19,20,22,25,26,28,30,31,33],"184":[2,4,6,7,8,9,12,15,17,20,22,24,30],"185":[6,9,11,14,20,23,28,32,34,38],"186":[4,5,8,9,10,12,18,21,24,29],"187":[4,11,14,21,27,32],"188":[2,6,10,12,16,24,27,28,30],"189":[2,9,15,20,22],"191":[5,6,8,10,15,20,23],"192":[6,9,15,21,25],"193":[2,4,6,7,13,16,25,28],"194":[7,15,21,24],"195":[2,4,10,13,15,18,22,24],"196":[2,6,7,9,12,14,18,21,22,25,26,30,36,38],"197":[2,3,5,12,16,18,23,25],"198":[2,4,5,11,18,21,23,26,29,31],"199":[2,3],"200":[2,4,6,9,20,22,26,28,30],"201":[2,6,8,10,13,22,24],"202":[8,10,12,14,18,22,24,27,33],"203":[5,10,16,19,25,28,31,39],"204":[2,11,13,17,23,28],"205":[9,26,30,32],"206":[9,12,28],"207":[6,20,23,26,30,35],"208":[2,3,6,13,14,18,20,21,26,28,31],"209":[2,6,14,16,18,20,22,31],"210":[3,11,14,18,22,26,29],"211":[2,4,7,12,15,16,18,22,24,28,29,31,36],"212":[2,5,12,16,28,32,34,38],"213":[2,5,8,11,16,18,19,22,24,28,33,35],"214":[2,9,12,14,16,18,20,22,25,30,35],"215":[4,5,8,9,10,11,13,14,17,23]};
    Object.keys(laterBookPdfParagraphStarts).forEach(function (page) {
      laterBookPdfParagraphStarts[page].forEach(function (nodeNumber) {
        var id = "pg" + String(page).padStart(3, "0") +
          "_n" + String(nodeNumber).padStart(4, "0");
        var sentence = content.querySelector('[data-id="' + id + '"]');
        if (sentence && !sentence.closest(".whatsapp-chat-window")) {
          sentence.classList.add("reflow-paragraph-start");
        }
      });
    });

    function laterFragmentsAreAdjacent(current, following) {
      var currentMatch = current.dataset.id && current.dataset.id.match(/^pg(\d{3})_n(\d{4})$/);
      var followingMatch = following.dataset.id && following.dataset.id.match(/^pg(\d{3})_n(\d{4})$/);
      if (!currentMatch || !followingMatch) return false;
      var currentPage = Number(currentMatch[1]);
      var followingPage = Number(followingMatch[1]);
      var currentNode = Number(currentMatch[2]);
      var followingNode = Number(followingMatch[2]);
      if (followingPage === currentPage) return followingNode - currentNode <= 2;
      return followingPage === currentPage + 1 && followingNode <= 4;
    }

    /* Rejoin incomplete source sentences across section and physical-page
       boundaries. The former per-section pass could not repair constructions
       such as “Que la” / “madre…”, leaving both a semantic split and a large
       pagination gap. PDF paragraph starts and source-ID adjacency prevent a
       chain from crossing a real paragraph, chat or illustration. */
    var laterBookParagraphs = [];
    storySections.forEach(function (laterBookSection) {
      laterBookParagraphs.push.apply(
        laterBookParagraphs,
        Array.prototype.slice.call(laterBookSection.querySelectorAll('p[data-id]')).filter(
          function (paragraph) {
            var match = paragraph.dataset.id && paragraph.dataset.id.match(/^pg(\d{3})_/);
            var page = match ? Number(match[1]) : 0;
            return page > 57 && page < 216 && !paragraph.closest('.whatsapp-chat-window');
          }
        )
      );
    });
    for (var laterBookIndex = 0; laterBookIndex < laterBookParagraphs.length - 1; laterBookIndex += 1) {
      var firstFragment = laterBookParagraphs[laterBookIndex];
      var nextFragment = laterBookParagraphs[laterBookIndex + 1];
      /* Page 126 ends a complete stadium image in the source without final
         punctuation, then starts a roster.  Treating the roster as the same
         sentence creates one column-avoidance chain taller than a page in
         Easy Read + Extra grande, leaving two nearly empty pages before it.
         Keep both semantic units intact, but let the roster paginate on its
         own. */
      if (firstFragment.dataset.id === "pg126_n0013") continue;
      if (hasTerminalPunctuation(firstFragment.textContent) ||
          /[:;]\s*$/.test(firstFragment.textContent) ||
          !laterFragmentsAreAdjacent(firstFragment, nextFragment) ||
          nextFragment.classList.contains("reflow-paragraph-start")) continue;
      var laterBookEnd = laterBookIndex + 1;
      while (laterBookEnd < laterBookParagraphs.length - 1) {
        var currentFragment = laterBookParagraphs[laterBookEnd];
        var followingFragment = laterBookParagraphs[laterBookEnd + 1];
        if (hasTerminalPunctuation(currentFragment.textContent) ||
            /[:;]\s*$/.test(currentFragment.textContent) ||
            !laterFragmentsAreAdjacent(currentFragment, followingFragment) ||
            followingFragment.classList.contains("reflow-paragraph-start")) break;
        laterBookEnd += 1;
      }
      var laterBookIds = laterBookParagraphs.slice(laterBookIndex, laterBookEnd + 1).map(
        function (paragraph) { return paragraph.dataset.id; }
      );
      createSentenceChain(laterBookIds, "later-book-sentence-chain");
      laterBookIndex = laterBookEnd;
    }

    /* A few Easy Read replacements deliberately divide one source sentence
       between two exported sections. The automatic full-text pass cannot
       infer those links because the simplified wording has different
       punctuation. Rejoin the semantic sentence before pagination so neither
       half can become a stray line or an almost-empty page. */
    [
      ["pg087_n0028", "pg087_n0029"],
      ["pg095_n0023", "pg096_n0002"],
      ["pg181_n0011", "pg181_n0012"]
    ].forEach(function (ids) {
      createSentenceChain(ids, "editorial-cross-section-chain");
    });

    function createEditorialUnitGroup(ids, extraClass) {
      var units = [];
      var foundCount = 0;
      ids.forEach(function (id) {
        var node = content.querySelector('[data-id="' + id + '"]');
        if (!node) return;
        foundCount += 1;
        var unit = node.closest(".sentence-chain") || node;
        if (units.indexOf(unit) < 0) units.push(unit);
      });
      /* Multiple requested ids can already belong to the same semantic
         sentence-chain. Count source nodes separately so that prior grouping
         does not make this complete editorial beat look incomplete. */
      if (!units.length || foundCount !== ids.length) return;
      var parent = units[0].parentElement;
      if (!parent || units.some(function (unit) { return unit.parentElement !== parent; })) return;
      var group = document.createElement("div");
      group.className = "editorial-unit-group" + (extraClass ? " " + extraClass : "");
      parent.insertBefore(group, units[0]);
      units.forEach(function (unit) { group.appendChild(unit); });
    }

    function createCrossWrapperEditorialUnitGroup(ids, extraClass) {
      var units = [];
      var foundCount = 0;
      ids.forEach(function (id) {
        var node = content.querySelector('[data-id="' + id + '"]');
        if (!node) return;
        foundCount += 1;
        var unit = node.closest(".sentence-chain") || node;
        if (units.indexOf(unit) < 0) units.push(unit);
      });
      /* Adjacent source ids can already share one sentence-chain.  Validate
         the requested source nodes, not the number of resulting wrapper
         units, so a complete cross-wrapper sentence can still be grouped
         with its short lead-in. */
      if (!units.length || foundCount !== ids.length) return;

      var existingGroup = units[0].closest(".editorial-unit-group");
      if (existingGroup && units.every(function (unit) {
        return unit.closest(".editorial-unit-group") === existingGroup;
      })) return;

      /* Illustrated pages split their lateral copy and their continuation
         into sibling wrappers.  Move the complete editorial beat into the
         continuation wrapper only after illustration rebalancing has ended,
         preserving paragraph boxes while preventing either half from being
         paginated alone. */
      var destinationParent = units[units.length - 1].parentElement;
      if (!destinationParent) return;
      var group = document.createElement("div");
      group.className = "editorial-unit-group" + (extraClass ? " " + extraClass : "");
      destinationParent.insertBefore(group, units[units.length - 1]);
      units.forEach(function (unit) { group.appendChild(unit); });
    }

    /* These two source nodes live under adjacent wrapper divs, so the normal
       grouping helper cannot contain them. A semantic chain is wrapper-safe
       and keeps the closing sentence with the preceding thanks. */
    createSentenceChain(
      ["pg175_n0023", "pg175_n0025"],
      "editorial-closing-chain"
    );

    /* Keep the final reflection and the stadium introduction as independent
       block paragraphs. Joining them in a sentence-chain made both source
       nodes share the same line box in Easy Read, so they overlapped instead
       of following the normal vertical reading order. */

    var continuationGroups = [
      ["pg009_n0020", "pg010_n0002"],
      ["pg010_n0010", "pg010_n0011"],
      ["pg013_n0017", "pg014_n0002"],
      ["pg014_n0016", "pg015_n0002"],
      ["pg020_n0034", "pg021_n0002"],
      ["pg022_n0027", "pg023_n0002"],
      ["pg024_n0038", "pg024_n0040"],
      ["pg025_n0019", "pg026_n0002"],
      ["pg028_n0041", "pg029_n0002"],
      ["pg030_n0032", "pg031_n0002"],
      ["pg031_n0008", "pg032_n0002"],
      ["pg032_n0042", "pg033_n0002"],
      ["pg033_n0032", "pg034_n0002"],
      ["pg034_n0020", "pg035_n0002"]
    ];
    continuationGroups.forEach(function (ids) {
      createSentenceChain(ids, "chapter-one-sentence-chain");
    });

    /* These are semantic units, not arbitrary page-number fixes. They stay
       together when the font or easy-read replacement changes pagination. */
    createSentenceChain(
      ["pg015_n0009", "pg015_n0010", "pg015_n0011"],
      "sentence-chain-closing-credit"
    );
    createSentenceChain(
      ["pg011_n0010", "pg011_n0011"],
      "sentence-chain-signature"
    );
    createSentenceChain(
      ["pg023_n0017", "pg023_n0018"],
      "sentence-chain-list-followup"
    );
    createSentenceChain(
      ["pg026_n0029", "pg026_n0030"],
      "sentence-chain-dialogue-attribution"
    );

    /* The source export often stores one sentence per <p>, even when the PDF
       shows a punto seguido inside one paragraph. Conversely, some imported
       wrappers contain several original paragraphs. These starts are derived
       from the visible first-line indents in the source PDF, so paragraph
       spacing never depends on the arbitrary HTML wrappers. */
    var chapterOneParagraphStarts = [
      "pg009_n0002", "pg009_n0003", "pg009_n0009", "pg009_n0015", "pg009_n0019",
      "pg010_n0005", "pg010_n0016", "pg011_n0005", "pg011_n0009", "pg011_n0011",
      "pg013_n0002", "pg013_n0009", "pg013_n0012", "pg013_n0016", "pg014_n0005",
      "pg014_n0011", "pg014_n0016", "pg015_n0008", "pg015_n0011", "pg017_n0003",
      "pg019_n0009", "pg019_n0013", "pg019_n0018", "pg020_n0002", "pg020_n0011",
      "pg020_n0018", "pg020_n0019", "pg020_n0021", "pg020_n0024", "pg020_n0028",
      "pg020_n0032", "pg021_n0014", "pg021_n0015", "pg021_n0016", "pg021_n0018",
      "pg022_n0011", "pg022_n0015", "pg022_n0018", "pg022_n0019", "pg022_n0020",
      "pg022_n0021", "pg022_n0022", "pg022_n0025", "pg023_n0006", "pg023_n0008",
      "pg023_n0015", "pg023_n0023", "pg023_n0028", "pg023_n0031", "pg023_n0035",
      "pg024_n0002", "pg024_n0010", "pg024_n0015", "pg024_n0021", "pg024_n0024",
      "pg024_n0027", "pg024_n0033", "pg024_n0036", "pg024_n0038", "pg024_n0040",
      "pg025_n0002", "pg025_n0011", "pg025_n0013", "pg025_n0018", "pg026_n0006",
      "pg026_n0007", "pg026_n0011", "pg026_n0014", "pg026_n0016", "pg026_n0018",
      "pg026_n0024", "pg026_n0029", "pg026_n0032", "pg026_n0034", "pg026_n0035",
      "pg027_n0002", "pg027_n0005", "pg027_n0007", "pg027_n0012", "pg027_n0014",
      "pg027_n0017", "pg027_n0019", "pg027_n0021", "pg027_n0024", "pg027_n0027",
      "pg028_n0002", "pg028_n0003", "pg028_n0005", "pg028_n0008", "pg028_n0014",
      "pg028_n0015", "pg028_n0016", "pg028_n0019", "pg028_n0021", "pg028_n0023",
      "pg028_n0025", "pg028_n0029", "pg028_n0033", "pg028_n0035", "pg029_n0012",
      "pg029_n0016", "pg029_n0020", "pg029_n0024",
      "pg030_n0002", "pg030_n0009", "pg030_n0013", "pg030_n0019", "pg030_n0026",
      "pg032_n0013", "pg032_n0021", "pg032_n0028", "pg032_n0030", "pg032_n0032",
      "pg032_n0033", "pg032_n0038", "pg032_n0039", "pg033_n0013", "pg033_n0014",
      "pg033_n0015", "pg033_n0016", "pg033_n0022", "pg033_n0026", "pg034_n0006",
      "pg034_n0010", "pg034_n0018", "pg035_n0008", "pg035_n0012", "pg035_n0023"
    ];
    var chapterTwoParagraphStarts = [
      "pg039_n0013", "pg039_n0024", "pg039_n0026",
      "pg040_n0002", "pg040_n0006", "pg040_n0008", "pg040_n0029", "pg040_n0033",
      "pg041_n0004", "pg041_n0006", "pg041_n0008", "pg041_n0015", "pg041_n0016",
      "pg041_n0018", "pg041_n0022", "pg041_n0025",
      "pg042_n0004", "pg042_n0005", "pg042_n0011", "pg042_n0013", "pg042_n0021",
      "pg042_n0025",
      "pg043_n0002", "pg043_n0004", "pg043_n0005", "pg043_n0011", "pg043_n0012",
      "pg043_n0018", "pg043_n0019", "pg043_n0022", "pg043_n0023",
      "pg044_n0007", "pg044_n0008", "pg044_n0010", "pg044_n0020",
      "pg045_n0008", "pg045_n0013", "pg045_n0014", "pg045_n0015", "pg045_n0018",
      "pg046_n0012", "pg046_n0017",
      "pg047_n0007", "pg047_n0010", "pg047_n0013",
      "pg048_n0011", "pg048_n0013", "pg048_n0014", "pg048_n0016", "pg048_n0018",
      "pg048_n0019", "pg048_n0021", "pg048_n0026",
      "pg049_n0002", "pg049_n0003", "pg049_n0004", "pg049_n0012", "pg049_n0013",
      "pg049_n0015", "pg049_n0017", "pg049_n0018", "pg049_n0019", "pg049_n0020",
      "pg050_n0004", "pg050_n0006", "pg050_n0011", "pg050_n0012", "pg050_n0014",
      "pg050_n0015", "pg050_n0018", "pg050_n0019", "pg050_n0021", "pg050_n0022",
      "pg051_n0002", "pg051_n0003", "pg051_n0004", "pg051_n0005", "pg051_n0007",
      "pg051_n0008", "pg051_n0010", "pg051_n0016",
      "pg052_n0004",
      "pg053_n0002", "pg053_n0004", "pg053_n0007", "pg053_n0008", "pg053_n0012",
      "pg053_n0022", "pg053_n0025",
      "pg054_n0007", "pg054_n0013", "pg054_n0015",
      "pg055_n0004", "pg055_n0005", "pg055_n0012",
      "pg056_n0012", "pg056_n0022",
      "pg057_n0009", "pg057_n0011", "pg057_n0014"
    ];
    chapterOneParagraphStarts.concat(chapterTwoParagraphStarts).forEach(function (id) {
      var sentence = content.querySelector('[data-id="' + id + '"]');
      if (!sentence || sentence.closest(".whatsapp-chat-window")) return;
      sentence.classList.add("reflow-paragraph-start");
    });

    flattenPlainProseSections();
    normalizeSemanticChainSpacing();
    restoreVirtualRealityIllustrationUnits();

    Array.prototype.slice.call(content.querySelectorAll(".reading-block")).forEach(function (block) {
      /* Illustrated copy is a structural grid column. A cross-page sentence
         may move all of its children into the overflow for a few operations;
         retaining this empty shell lets the measured balancer put the largest
         fitting prefix back beside the image in every font mode. */
      if (block.classList.contains("illustrated-copy") ||
          block.classList.contains("attic-illustrated-copy")) return;
      if (!block.querySelector("p, img") && !block.textContent.trim()) block.remove();
    });

    updateEasyReadClass();
    updateReadingBlockSizing();
    rebalanceIllustratedPage();
    rebalanceChapterTwoIllustrations();
    rebalanceAtticIllustration();
    repairParagraphMarkers();
    /* Some rebalancers move semantic siblings after the earlier pass. This
       final pass is intentionally last so no subsequent layout step can move
       a separator to the end of its chain. */
    normalizeSemanticChainSpacing();

    /* This pair is first assembled before prose flattening so its source
       order is known, then repaired here after every rebalancer has finished.
       The final wrapper is the pagination boundary used by CSS columns. */
    keepParagraphWithWhatsApp("pg095_sec001", "pg095_n0002", "pg095_im002");

    /* Editorial beats must be grouped after flattening and rebalancing. Those
       stages intentionally unwrap structural containers, so grouping them any
       earlier silently loses the keep-together boundary and recreates orphan
       pages at larger sizes. Link the final reflection to the following
       stadium image, but leave the preceding sentence free to fill the prior
       page; this avoids two underfilled pages without creating an oversized
       indivisible block in Extra grande. */
    createEditorialUnitGroup(
      ["pg137_n0021", "pg137_n0022", "pg137_n0023"],
      "editorial-clothing-beat"
    );
    /* Flattened Lectura Fácil prose normally remains splittable sentence by
       sentence. These two very short units are exceptions: when left as bare
       spans the column paginator can clone only their first token ("¿Y" or
       "La") before moving the complete sentence to the next page. A final
       zero-style wrapper preserves the sentence as one pagination unit while
       leaving font, line-height and spacing untouched. */
    createEditorialUnitGroup(
      ["pg097_n0002"],
      "editorial-easy-read-atomic"
    );
    createEditorialUnitGroup(
      ["pg102_n0002"],
      "editorial-easy-read-atomic"
    );
    /* These lines are deliberate interruptions in the source, not damaged
       sentences. Keep each one with the reply or action that completes the
       beat so it can never be mistaken for an accidental truncation. */
    createCrossWrapperEditorialUnitGroup(
      ["pg132_n0005", "pg132_n0006"],
      "editorial-interrupted-dialogue"
    );
    createEditorialUnitGroup(
      ["pg187_n0009", "pg187_n0011"],
      "editorial-interrupted-dialogue"
    );
    createEditorialUnitGroup(
      ["pg203_n0023", "pg203_n0025"],
      "editorial-interrupted-dialogue"
    );
    createEditorialUnitGroup(
      ["pg091_n0004", "pg091_n0005"],
      "editorial-interrupted-dialogue"
    );
    createEditorialUnitGroup(
      ["pg139_n0045", "pg139_n0046"],
      "editorial-interrupted-dialogue"
    );
    createEditorialUnitGroup(
      ["pg182_n0039", "pg182_n0040"],
      "editorial-interrupted-dialogue"
    );
    [
      ["pg074_n0003", "pg074_n0005"],
      ["pg075_n0011", "pg075_n0013"],
      ["pg125_n0006", "pg125_n0008"],
      ["pg140_n0020", "pg140_n0022"],
      ["pg198_n0026", "pg198_n0027"],
      ["pg212_n0032", "pg212_n0034"]
    ].forEach(function (ids) {
      createEditorialUnitGroup(ids, "editorial-interrupted-dialogue");
    });
    /* Keep the final thanks and sleep sentence together. A four-block group
       can be taller than a column in Easy Read and produce the very sparse
       page it was intended to avoid. */
    createEditorialUnitGroup(
      ["pg175_n0023", "pg175_n0025"],
      "editorial-closing-beat"
    );
    /* The last two sentences before the first two chapter quizzes form one
       closing beat. At Extra grande the paginator otherwise strands the final
       sentence at the top of a nearly empty page. Grouping the pair changes
       only the pagination boundary; typography and interline spacing remain
       inherited from the original sentences. */
    createEditorialUnitGroup(
      ["pg035_n0024", "pg035_n0025"],
      "editorial-pre-quiz-closing-beat"
    );
    createEditorialUnitGroup(
      ["pg057_n0014", "pg057_n0015"],
      "editorial-pre-quiz-closing-beat"
    );
    /* Short narrative beats that were still capable of landing alone after
       Easy Read reflow.  Each wrapper is deliberately small (two or three
       sentences) so the paginator can move the complete idea without
       changing font size, line-height, or paragraph spacing. */
    createEditorialUnitGroup(
      ["pg029_n0009", "pg029_n0010"],
      "editorial-short-closing-beat"
    );
    /* Keep only the condition and its immediate resolution together:
       "no si esos dos hombres están allí" / "Deben hacer que salgan".
       The former four-sentence wrapper was too tall at Extra grande, but
       leaving every sentence independent could strand n0019 by itself. */
    createEditorialUnitGroup(
      ["pg051_n0018", "pg051_n0019"],
      "editorial-semantic-pair"
    );
    createEditorialUnitGroup(
      ["pg098_n0025", "pg098_n0026", "pg098_n0027"],
      "editorial-warning-beat"
    );
    createEditorialUnitGroup(
      ["pg103_n0009", "pg103_n0010", "pg103_n0011", "pg103_n0012"],
      "editorial-question-answer-beat"
    );
    /* These two complete sentences are one compact recollection. At Grande
       the first sentence already forms an indivisible unit; keeping its
       immediate continuation in the same pagination group prevents the
       continuation from occupying a page by itself without changing either
       sentence's typography, spacing, or highlighting boundary. */
    createEditorialUnitGroup(
      ["pg112_n0024", "pg112_n0025"],
      "editorial-recollection-pair"
    );
    /* Keep Javier's short question, Federica's gesture and the mother's
       reaction as one compact conversational beat.  The source exporter
       places them in adjacent wrappers (and an earlier normalization moves
       the question beside the preceding exchange), so use the wrapper-safe
       grouping helper.  This prevents the question from becoming an
       almost-empty Extra grande page without changing line-height. */
    createEditorialUnitGroup(
      ["pg024_n0033", "pg024_n0034", "pg024_n0036"],
      "editorial-question-gesture-beat"
    );
    /* The function-reveal question and answer are one semantic exchange.
       Keeping the lead-in with the four short replies avoids isolating only
       the replies on an Extra grande page while preserving every sentence
       as an independent TTS/highlighting unit. */
    createEditorialUnitGroup(
      ["pg131_n0032", "pg131_n0034", "pg131_n0035", "pg131_n0036", "pg131_n0038"],
      "editorial-function-reveal-beat"
    );
    /* The direct question, its explanation and the emphatic closing line are
       one exchange.  Keeping the three semantic units together prevents the
       two-line answer from becoming a nearly empty page in Extra grande +
       Lectura Fácil, without changing typography or TTS boundaries. */
    createEditorialUnitGroup(
      ["pg116_n0034", "pg116_n0035", "pg116_n0036"],
      "editorial-question-answer-beat"
    );
    createEditorialUnitGroup(
      ["pg141_n0032", "pg141_n0033", "pg141_n0034"],
      "editorial-action-sequence"
    );
    createEditorialUnitGroup(
      ["pg143_n0025", "pg143_n0026", "pg143_n0027"],
      "editorial-reflection-beat"
    );
    /* The final reflective question and the two short closing sentences are
       one end-of-section beat. Keeping all three together prevents the last
       two lines from occupying an otherwise empty page at Grande, without
       altering their typography or spacing. */
    createEditorialUnitGroup(
      ["pg121_n0011", "pg121_n0012", "pg121_n0013"],
      "editorial-section-closing-beat"
    );
    /* Keep the short lead-in with the cross-wrapper sentence. Otherwise the
       large Easy Read layout can leave only the two sentence fragments on an
       almost empty page. The three source units still retain their own text
       and highlighting boundaries inside this pagination group. */
    createCrossWrapperEditorialUnitGroup(
      ["pg189_n0027", "pg189_n0028", "pg190_n0002"],
      "editorial-cross-page-sentence"
    );
    [
      ["pg062_n0032", "pg063_n0002"],
      ["pg074_n0033", "pg075_n0002"],
      ["pg097_n0029", "pg098_n0002"],
      ["pg119_n0035", "pg120_n0002"],
      ["pg129_n0046", "pg130_n0002"],
      ["pg204_n0035", "pg205_n0002"]
    ].forEach(function (ids) {
      createCrossWrapperEditorialUnitGroup(ids, "editorial-cross-page-sentence");
    });
  }

  function prepareQuizFeedbackAudio() {
    Array.prototype.slice.call(content.querySelectorAll(
      ".quiz-explanation-bank [data-id], .quiz-explanation-bank [data-feedback-audio-id]"
    )).forEach(function (explanation) {
      var audioId = explanation.dataset.feedbackAudioId || explanation.dataset.id;
      if (!audioId) return;
      explanation.dataset.feedbackAudioId = audioId;
      explanation.removeAttribute("data-id");
    });
  }

  function isTtsMarkupMutation(mutation) {
    var nodes = Array.prototype.slice.call(mutation.addedNodes || []).concat(
      Array.prototype.slice.call(mutation.removedNodes || [])
    );
    return nodes.some(function (node) {
      if (!node || node.nodeType !== 1) return false;
      return Boolean(
        (node.matches && node.matches(
          "[data-sentence-index], [data-word-index], .quiz-confetti, " +
          ".quiz-feedback-icon, .quiz-feedback-text, .quiz-result-mark"
        )) ||
        (node.querySelector && node.querySelector(
          "[data-sentence-index], [data-word-index], .quiz-confetti, " +
          ".quiz-feedback-icon, .quiz-feedback-text, .quiz-result-mark"
        ))
      );
    });
  }

  function activeTtsElement() {
    if (state.ttsActiveElement && state.ttsActiveElement.isConnected) {
      return state.ttsActiveElement;
    }
    var highlighted = content.querySelector(".bg-yellow-300, .tts-active-block");
    return highlighted && highlighted.closest ? highlighted.closest("[data-id]") : null;
  }

  function splitTtsSentenceUnits(element, fallbackText) {
    var renderedText = typeof element.innerText === "string" ? element.innerText : fallbackText;
    var lines = String(renderedText || "").split(/\n+/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
    if (!lines.length) return [];

    if (element.dataset.id === "pg009_n0002") {
      return [{ text: lines.join("\n"), separator: "" }];
    }

    var units = [];
    lines.forEach(function (line, lineIndex) {
      var sentences = [];
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        sentences = Array.from(
          new Intl.Segmenter("es", { granularity: "sentence" }).segment(line),
          function (part) { return part.segment.trim(); }
        ).filter(Boolean);
      }
      if (!sentences.length) {
        sentences = line.match(/[^.!?…]+(?:[.!?…]+["'”’»)]—]*)?/g) || [line];
        sentences = sentences.map(function (sentence) { return sentence.trim(); }).filter(Boolean);
      }
      sentences.forEach(function (sentence, sentenceIndex) {
        var isLastSentence = sentenceIndex === sentences.length - 1;
        var isLastLine = lineIndex === lines.length - 1;
        units.push({
          text: sentence,
          separator: isLastSentence ? (isLastLine ? "" : "\n") : " "
        });
      });
    });
    return units;
  }

  var ttsVisualTokenPattern =
    "[\\p{L}\\p{N}\\p{M}]+(?:[’'-][\\p{L}\\p{N}\\p{M}]+)*" +
    "|[🐒😬😱]" +
    "|¿\\?|[=/&]";

  function ttsVisualTokenMatcher() {
    return new RegExp(ttsVisualTokenPattern, "gu");
  }

  function countTtsWords(text) {
    var matches = String(text || "").match(ttsVisualTokenMatcher());
    return matches ? matches.length : 0;
  }

  function ttsTextNodes(element) {
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var current;
    while ((current = walker.nextNode())) nodes.push(current);
    return nodes;
  }

  function ensureTtsOriginalHtml(element) {
    if (!element.hasAttribute("data-tts-original-html")) {
      element.setAttribute("data-tts-original-html", element.innerHTML);
    }
  }

  /* Restoring the unwrapped text is a TTS-internal DOM mutation, not an
     editorial change. Mark the whole task so the pagination observer does
     not recalculate between two consecutive audio items. That mid-playback
     recalculation was what duplicated fragments and occasionally painted
     two column lines at the same vertical position. */
  function restoreTtsMarkup(element) {
    if (!element) return;
    markTtsChatTransitionForElement(element);
    state.ttsMarkupRestoring = true;
    window.clearTimeout(state.ttsMarkupRestoreTimer);
    element.querySelectorAll("[data-word-index].bg-yellow-300, [data-sentence-index].bg-yellow-300")
      .forEach(function (highlight) { highlight.classList.remove("bg-yellow-300"); });
    var originalHtml = element.getAttribute("data-tts-original-html");
    if (originalHtml !== null) {
      element.innerHTML = originalHtml;
      element.removeAttribute("data-tts-original-html");
    }
    state.ttsMarkupRestoreTimer = window.setTimeout(function () {
      state.ttsMarkupRestoring = false;
    }, 0);
  }

  function markTtsChatTransitionForElement(element) {
    if (!element || !element.closest || !element.closest(".whatsapp-chat-window")) return;
    state.ttsChatTransitionUntil = Math.max(
      state.ttsChatTransitionUntil,
      Date.now() + 650
    );
  }

  function beginTtsManualHandoff() {
    state.ttsManualHandoffGeneration += 1;
    state.ttsManualHandoffPending = true;
    window.clearTimeout(state.ttsManualHandoffTimer);
    var generation = state.ttsManualHandoffGeneration;
    /* A local MP3 opened from file:// can take noticeably longer to become
       ready than the same asset served over HTTP. Keep the previously painted
       sentence until the destination has produced its own visual state. This
       long timeout is only a recovery path for a missing/corrupt audio file;
       ordinary hand-offs finish synchronously in the prepare callback. */
    state.ttsManualHandoffTimer = window.setTimeout(function () {
      if (
        state.ttsManualHandoffPending &&
        state.ttsManualHandoffGeneration === generation
      ) {
        state.ttsManualHandoffPending = false;
        clearTtsRangeHighlight();
      }
    }, 10000);
  }

  function finishTtsManualHandoff() {
    if (!state.ttsManualHandoffPending) return;
    state.ttsManualHandoffPending = false;
    window.clearTimeout(state.ttsManualHandoffTimer);
    state.ttsManualHandoffTimer = 0;
  }

  function mutationBelongsToWhatsAppChat(mutation) {
    var target = mutation && mutation.target;
    var targetElement = target && (
      target.nodeType === 1 ? target : target.parentElement
    );
    if (targetElement && targetElement.closest && targetElement.closest(".whatsapp-chat-window")) {
      return true;
    }
    var nodes = Array.prototype.slice.call(mutation.addedNodes || []).concat(
      Array.prototype.slice.call(mutation.removedNodes || [])
    );
    return nodes.length > 0 && nodes.every(function (node) {
      var element = node && (node.nodeType === 1 ? node : node.parentElement);
      return Boolean(element && element.closest && element.closest(".whatsapp-chat-window"));
    });
  }

  function supportsTtsRangeHighlight() {
    return typeof CSS !== "undefined" && CSS.highlights && typeof Highlight === "function";
  }

  function clearTtsRangeHighlight() {
    window.clearTimeout(state.ttsRangeClearTimer);
    state.ttsRangeClearTimer = 0;
    window.clearTimeout(state.ttsManualHandoffTimer);
    state.ttsManualHandoffTimer = 0;
    state.ttsManualHandoffPending = false;
    if (typeof CSS !== "undefined" && CSS.highlights) {
      CSS.highlights.delete("adt-tts-active");
    }
    if (content) {
      content.querySelectorAll(".glossary-term.tts-glossary-covered").forEach(function (term) {
        term.classList.remove("tts-glossary-covered");
      });
    }
    clearTtsImageHighlight();
    state.ttsActiveElement = null;
  }

  /* Do not expose the short local-audio loading gap between two consecutive
     TTS items. The previous CSS Highlight remains painted until the next
     spoken range replaces it atomically. If playback really stops, the
     deferred cleanup still removes it after the hand-off window. */
  function scheduleTtsRangeHighlightCleanup(element) {
    restoreTtsMarkup(element);
    window.clearTimeout(state.ttsRangeClearTimer);
    /* React may prepare the destination before it runs the effect cleanup for
       the source item. That stale cleanup must never erase the destination's
       highlight. This ordering difference was the main cause of the visible
       flash when Previous/Next was pressed repeatedly. */
    if (
      element && state.ttsActiveElement &&
      element !== state.ttsActiveElement
    ) return;
    /* During an explicit semantic step, visual cleanup is completed by the
       destination prepare callback. Never introduce an empty frame while its
       local audio asset is loading. */
    if (state.ttsManualHandoffPending) return;
    state.ttsRangeClearTimer = window.setTimeout(function () {
      state.ttsRangeClearTimer = 0;
      clearTtsRangeHighlight();
    }, 1200);
  }

  function preserveTtsRangeForHandoff(element) {
    window.clearTimeout(state.ttsRangeClearTimer);
    state.ttsRangeClearTimer = 0;
    clearTtsImageHighlight();
    state.ttsActiveElement = element;
  }

  function ttsObjectPositionOffset(value, freeSpace) {
    var token = String(value || "50%").toLowerCase();
    if (token === "left" || token === "top") return 0;
    if (token === "right" || token === "bottom") return freeSpace;
    if (token === "center") return freeSpace / 2;
    if (token.endsWith("%")) return freeSpace * (parseFloat(token) || 0) / 100;
    if (token.endsWith("px")) return parseFloat(token) || 0;
    return freeSpace / 2;
  }

  function ttsRenderedImageRect(image) {
    var rect = image.getBoundingClientRect();
    var naturalWidth = image.naturalWidth || rect.width;
    var naturalHeight = image.naturalHeight || rect.height;
    var style = window.getComputedStyle(image);
    var objectFit = style.objectFit || "fill";
    var width = rect.width;
    var height = rect.height;
    if (
      naturalWidth > 0 && naturalHeight > 0 &&
      (objectFit === "contain" || objectFit === "scale-down")
    ) {
      var scale = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
      if (objectFit === "scale-down") scale = Math.min(1, scale);
      width = naturalWidth * scale;
      height = naturalHeight * scale;
    }
    var position = String(style.objectPosition || "50% 50%").trim().split(/\s+/);
    if (position.length === 1) position.push("50%");
    return {
      left: rect.left + ttsObjectPositionOffset(position[0], rect.width - width),
      top: rect.top + ttsObjectPositionOffset(position[1], rect.height - height),
      width: width,
      height: height,
      borderRadius: style.borderRadius || "0px"
    };
  }

  function updateTtsImageHighlight() {
    var image = state.ttsImageHighlightTarget;
    var overlay = state.ttsImageHighlightOverlay;
    if (!image || !image.isConnected || !overlay) return;
    var rect = ttsRenderedImageRect(image);
    overlay.style.left = rect.left + "px";
    overlay.style.top = rect.top + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    overlay.style.borderRadius = rect.borderRadius;
  }

  function clearTtsImageHighlight() {
    if (state.ttsImageHighlightOverlay) state.ttsImageHighlightOverlay.remove();
    if (state.ttsImageHighlightTarget) {
      state.ttsImageHighlightTarget.classList.remove("tts-active-block");
    }
    state.ttsImageHighlightOverlay = null;
    state.ttsImageHighlightTarget = null;
  }

  function paintTtsImageHighlight(image) {
    clearTtsImageHighlight();
    if (!image) return;
    var semanticImage = image;
    /* The main book cover is already a full-page visual composition. Its
       audio description should not add the yellow image outline requested
       for ordinary in-book illustrations. */
    if (semanticImage.dataset && semanticImage.dataset.id === "pg001_im001") {
      state.ttsActiveElement = semanticImage;
      return;
    }
    /* A chapter portadilla is narrated through its hidden source image but
       displayed through the reconstructed composite. Highlight the visible
       artwork while retaining the semantic source as the active TTS item. */
    var chapterCover = semanticImage.closest && semanticImage.closest(".chapter-cover");
    var visualImage = semanticImage.classList.contains("chapter-cover-source") && chapterCover
      ? chapterCover.querySelector(".chapter-cover-composite")
      : semanticImage;
    if (!visualImage) visualImage = semanticImage;
    visualImage.classList.add("tts-active-block");
    state.ttsActiveElement = image;
    state.ttsImageHighlightTarget = visualImage;
    var overlay = document.createElement("span");
    overlay.className = "tts-image-highlight-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    state.ttsImageHighlightOverlay = overlay;
    updateTtsImageHighlight();
    if (!state.ttsImageHighlightListenersBound) {
      window.addEventListener("resize", updateTtsImageHighlight);
      window.addEventListener("scroll", updateTtsImageHighlight, true);
      state.ttsImageHighlightListenersBound = true;
    }
  }

  function paintTtsRange(range) {
    if (!range || !supportsTtsRangeHighlight()) return;
    window.clearTimeout(state.ttsRangeClearTimer);
    state.ttsRangeClearTimer = 0;
    if (content) {
      content.querySelectorAll(".glossary-term.tts-glossary-covered").forEach(function (term) {
        term.classList.remove("tts-glossary-covered");
      });
      var glossaryScope = state.ttsActiveElement || range.commonAncestorContainer;
      var glossaryTerms = glossaryScope && glossaryScope.querySelectorAll
        ? Array.prototype.slice.call(glossaryScope.querySelectorAll(".glossary-term"))
        : [];
      if (glossaryScope && glossaryScope.matches && glossaryScope.matches(".glossary-term")) {
        glossaryTerms.unshift(glossaryScope);
      }
      glossaryTerms.forEach(function (term) {
        try {
          if (range.intersectsNode(term)) term.classList.add("tts-glossary-covered");
        } catch (_error) {
          // A detached glossary wrapper is harmless between consecutive ticks.
        }
      });
    }
    CSS.highlights.set("adt-tts-active", new Highlight(range));
    finishTtsManualHandoff();
  }

  function createTextRange(textNode, start, end) {
    var range = document.createRange();
    range.setStart(textNode, start);
    range.setEnd(textNode, end);
    return range;
  }

  /* Glossary terms are inline wrappers. Build sentence ranges against one
     logical text stream so a wrapper never splits a spoken sentence into
     three independent yellow fragments. */
  function ttsLogicalTextMap(element) {
    var cursor = 0;
    var entries = [];
    var text = "";
    ttsTextNodes(element).forEach(function (node) {
      var value = node.data || "";
      if (!value.length) return;
      entries.push({ node: node, start: cursor, end: cursor + value.length });
      text += value;
      cursor += value.length;
    });
    return { text: text, entries: entries };
  }

  function createMappedTextRange(map, start, end) {
    if (!map || !map.entries.length || end <= start) return null;
    var startEntry = map.entries.find(function (entry) {
      return start >= entry.start && start < entry.end;
    });
    var lastPosition = end - 1;
    var endEntry = map.entries.find(function (entry) {
      return lastPosition >= entry.start && lastPosition < entry.end;
    });
    if (!startEntry || !endEntry) return null;
    var range = document.createRange();
    range.setStart(startEntry.node, start - startEntry.start);
    range.setEnd(endEntry.node, end - endEntry.start);
    return range;
  }

  /* Wrap the existing text nodes instead of rebuilding a paragraph from
     textContent. This preserves every <br>, inline style and whitespace run,
     so enabling word tracking cannot change the paragraph's column height. */
  function prepareTtsWordHighlight(element, fallbackText, timestamps) {
    markTtsChatTransitionForElement(element);
    if (element && element.classList.contains("reflow-tts-no-highlight")) {
      clearTtsRangeHighlight();
      clearTtsImageHighlight();
      state.ttsActiveElement = element;
      return { el: element, mode: "none", timestamps: timestamps || [] };
    }
    if (document.body.dataset.reflowWordHighlightRestricted === "true") {
      return prepareTtsSentenceHighlight(element, fallbackText, timestamps);
    }
    if (!element || element.tagName.toLowerCase() === "img") {
      clearTtsRangeHighlight();
      if (element) paintTtsImageHighlight(element);
      return { el: element, mode: "block", timestamps: [] };
    }
    state.ttsActiveElement = element;
    if (supportsTtsRangeHighlight()) {
      preserveTtsRangeForHandoff(element);
      var highlightRanges = [];
      ttsTextNodes(element).forEach(function (textNode) {
        var matcher = ttsVisualTokenMatcher();
        var match;
        while ((match = matcher.exec(textNode.data))) {
          highlightRanges.push(createTextRange(
            textNode,
            match.index,
            match.index + match[0].length
          ));
        }
      });
      if (!highlightRanges.length) {
        clearTtsRangeHighlight();
        element.classList.add("tts-active-block");
        finishTtsManualHandoff();
        return { el: element, mode: "block", timestamps: [] };
      }
      /* Paint the first token before returning control to React. The old and
         new CSS Highlights are replaced in one task, so the browser cannot
         compose a blank intermediate frame even if audio.play() is delayed. */
      paintTtsRange(highlightRanges[0]);
      return {
        el: element,
        mode: "word",
        timestamps: timestamps || [],
        rangeHighlight: true,
        highlightRanges: highlightRanges
      };
    }
    ensureTtsOriginalHtml(element);
    var wordIndex = 0;
    ttsTextNodes(element).forEach(function (textNode) {
      var text = textNode.data;
      var matcher = ttsVisualTokenMatcher();
      var fragment = document.createDocumentFragment();
      var cursor = 0;
      var match;
      var nodeHasWords = false;
      while ((match = matcher.exec(text))) {
        nodeHasWords = true;
        if (match.index > cursor) {
          fragment.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        }
        var span = document.createElement("span");
        span.dataset.wordIndex = String(wordIndex);
        span.textContent = match[0];
        fragment.appendChild(span);
        wordIndex += 1;
        cursor = match.index + match[0].length;
      }
      /* Leaving whitespace-only nodes untouched is important: replacing one
         with another plain text node looks like an editorial mutation to the
         pagination observer and used to trigger a silent repagination. */
      if (!nodeHasWords) return;
      if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
      textNode.replaceWith(fragment);
    });
    if (!wordIndex) {
      element.classList.add("tts-active-block");
      return { el: element, mode: "block", timestamps: [] };
    }
    return { el: element, mode: "word", timestamps: timestamps || [] };
  }

  function segmentTtsTextNode(text) {
    if (!String(text || "").trim()) return [String(text || "")];
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      var segmented = Array.from(
        new Intl.Segmenter("es", { granularity: "sentence" }).segment(text),
        function (part) { return part.segment; }
      ).filter(function (part) { return part.length > 0; });
      if (segmented.length) return segmented;
    }
    return String(text).match(/[^.!?…]+(?:[.!?…]+["'”’»)]—]*)?\s*/g) || [String(text)];
  }

  function prepareTtsSentenceHighlight(element, fallbackText, timestamps) {
    markTtsChatTransitionForElement(element);
    if (element && element.classList.contains("reflow-tts-no-highlight")) {
      clearTtsRangeHighlight();
      clearTtsImageHighlight();
      state.ttsActiveElement = element;
      return { el: element, mode: "none", timestamps: timestamps || [] };
    }
    if (!element || element.tagName.toLowerCase() === "img") {
      clearTtsRangeHighlight();
      if (element) paintTtsImageHighlight(element);
      return { el: element, mode: "block", timestamps: [] };
    }
    state.ttsActiveElement = element;
    if (supportsTtsRangeHighlight()) {
      preserveTtsRangeForHandoff(element);
      var nativeRanges = [];
      var nativeSentenceRanges = [];
      var nativeTrackingRanges = [];
      var nativeWordCursor = 0;
      var logicalMap = ttsLogicalTextMap(element);
      var wordMatcher = ttsVisualTokenMatcher();
      var wordMatch;
      while ((wordMatch = wordMatcher.exec(logicalMap.text))) {
        var wordRange = createMappedTextRange(
          logicalMap,
          wordMatch.index,
          wordMatch.index + wordMatch[0].length
        );
        if (wordRange) nativeTrackingRanges.push(wordRange);
      }
      var logicalOffset = 0;
      segmentTtsTextNode(logicalMap.text).forEach(function (part) {
        var start = logicalOffset;
        var end = start + part.length;
        logicalOffset = end;
        var wordCount = countTtsWords(part);
        if (!wordCount) return;
        var sentenceRange = createMappedTextRange(logicalMap, start, end);
        if (!sentenceRange) return;
        nativeRanges.push(sentenceRange);
        nativeSentenceRanges.push({
          start: nativeWordCursor,
          end: nativeWordCursor + wordCount
        });
        nativeWordCursor += wordCount;
      });
      if (!nativeRanges.length) {
        clearTtsRangeHighlight();
        element.classList.add("tts-active-block");
        finishTtsManualHandoff();
        return { el: element, mode: "block", timestamps: [] };
      }
      paintTtsRange(nativeRanges[0]);
      return {
        el: element,
        mode: "sentence",
        timestamps: timestamps || [],
        sentenceRanges: nativeSentenceRanges,
        rangeHighlight: true,
        highlightRanges: nativeRanges,
        trackingRanges: nativeTrackingRanges
      };
    }
    ensureTtsOriginalHtml(element);
    var ranges = [];
    var wordCursor = 0;
    var sentenceIndex = 0;
    ttsTextNodes(element).forEach(function (textNode) {
      var parts = segmentTtsTextNode(textNode.data);
      var fragment = document.createDocumentFragment();
      var nodeHasWords = false;
      parts.forEach(function (part) {
        var wordCount = countTtsWords(part);
        if (!wordCount) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        nodeHasWords = true;
        var span = document.createElement("span");
        span.dataset.sentenceIndex = String(sentenceIndex);
        span.textContent = part;
        fragment.appendChild(span);
        ranges.push({ start: wordCursor, end: wordCursor + wordCount });
        wordCursor += wordCount;
        sentenceIndex += 1;
      });
      if (nodeHasWords) textNode.replaceWith(fragment);
    });
    if (!ranges.length) {
      element.classList.add("tts-active-block");
      return { el: element, mode: "block", timestamps: [] };
    }
    return {
      el: element,
      mode: "sentence",
      timestamps: timestamps || [],
      sentenceRanges: ranges
    };
  }

  function highlightTtsWordAtCurrentTime(audio, activeRef) {
    var active = activeRef && activeRef.current;
    if (!active || (active.mode !== "word" && active.mode !== "sentence") || !active.el) return;
    var timestamps = active.timestamps || [];
    if (!timestamps.length) return;

    var desiredIndex = -1;
    for (var index = 0; index < timestamps.length; index += 1) {
      if (audio.currentTime >= Number(timestamps[index].start || 0)) {
        desiredIndex = index;
      } else {
        break;
      }
    }
    if (desiredIndex < 0) return;

    if (active.mode === "sentence") {
      var ranges = active.sentenceRanges || [];
      var sentenceIndex = ranges.findIndex(function (range) {
        return desiredIndex >= range.start && desiredIndex < range.end;
      });
      if (sentenceIndex < 0 && ranges.length) sentenceIndex = ranges.length - 1;
      var trackingRange = active.trackingRanges && active.trackingRanges[desiredIndex];
      if (trackingRange) followTtsVisualTarget(trackingRange);
      if (sentenceIndex < 0 || sentenceIndex === active.__adtReflowLastSentenceIndex) return;
      if (active.rangeHighlight) {
        var sentenceRange = active.highlightRanges && active.highlightRanges[sentenceIndex];
        paintTtsRange(sentenceRange);
        if (!trackingRange) followTtsVisualTarget(sentenceRange);
        active.__adtReflowLastSentenceIndex = sentenceIndex;
        return;
      }
      var previousSentence = active.el.querySelector("[data-sentence-index].bg-yellow-300");
      if (previousSentence) previousSentence.classList.remove("bg-yellow-300");
      var nextSentence = active.el.querySelector('[data-sentence-index="' + sentenceIndex + '"]');
      if (nextSentence) {
        nextSentence.classList.add("bg-yellow-300");
        followTtsVisualTarget(nextSentence);
      }
      active.__adtReflowLastSentenceIndex = sentenceIndex;
      return;
    }

    if (active.rangeHighlight) {
      /* Follow the audio clock directly. Advancing only one token per paint
         frame made the yellow marker lag after a dropped frame or a layout
         update, even though the synthesizer boundaries were correct. */
      var visibleRangeIndex = desiredIndex;
      visibleRangeIndex = Math.max(
        0,
        Math.min((active.highlightRanges || []).length - 1, visibleRangeIndex)
      );
      var visibleRange = active.highlightRanges && active.highlightRanges[visibleRangeIndex];
      paintTtsRange(visibleRange);
      followTtsVisualTarget(visibleRange);
      active.__adtReflowLastWordIndex = visibleRangeIndex;
      return;
    }

    var spans = active.el.querySelectorAll("[data-word-index]");
    if (!spans.length) return;

    var visibleIndex = desiredIndex;
    visibleIndex = Math.max(0, Math.min(spans.length - 1, visibleIndex));
    var previous = active.el.querySelector("[data-word-index].bg-yellow-300");
    if (previous) previous.classList.remove("bg-yellow-300");
    spans[visibleIndex].classList.add("bg-yellow-300");
    followTtsVisualTarget(spans[visibleIndex]);
    active.__adtReflowLastWordIndex = visibleIndex;
  }

  function startTtsWordTicker(audio, activeRef) {
    if (!audio || !activeRef) return;
    var run = (ttsWordTickerRuns.get(audio) || 0) + 1;
    ttsWordTickerRuns.set(audio, run);
    function tick() {
      if (ttsWordTickerRuns.get(audio) !== run || audio.paused || audio.ended) return;
      highlightTtsWordAtCurrentTime(audio, activeRef);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function registerTtsWordTicker(audio, activeRef) {
    if (!audio || !activeRef) return;
    ttsWordTickerRefs.set(audio, activeRef);
  }

  function installTtsMediaBridge() {
    /* Keep the QA bridge available after reloads. The media prototype can
       survive a same-tab reload and already carry our marker, whereas these
       window properties never do. Install them before the idempotency guard. */
    window.__adtReflowGoToVisualPage = function (page) {
      var visualPage = Math.max(1, Number(page) || 1);
      goToPage(visualPage - 1, { instant: true, announce: false, explicit: true });
      return { current: state.current + 1, total: state.total };
    };
    window.__adtReflowQaState = function () {
      return {
        current: state.current + 1,
        total: state.total,
        fontScale: document.body.getAttribute("data-reflow-font-scale") || "normal",
        easyRead: document.body.classList.contains("reflow-easy-read")
      };
    };
    var mediaPrototype = window.HTMLMediaElement && window.HTMLMediaElement.prototype;
    if (!mediaPrototype || mediaPrototype.__adtReflowTtsBridge) return;
    var inheritedPlay = mediaPrototype.play;
    state.nativeMediaPlay = inheritedPlay;
    mediaPrototype.play = function () {
      var isTrackedTtsAudio = this === state.ttsAudio && Boolean(state.ttsCurrentAudioId);
      state.ttsAudio = this;
      /* The base reader may resume the same HTMLAudioElement through a native
         play() call that bypasses its item-start callback. Never let that
         call use the original catalogue source: restore the selected voice
         synchronously before native playback begins. This protects every TTS
         item, not only the sentence where the fault was reported. */
      if (isTrackedTtsAudio) {
        var selectedFilename = ttsVoiceFilename(state.ttsCurrentAudioId);
        if (selectedFilename) {
          var selectedBase = selectedFilename.indexOf("voices/") === 0
            ? "./content/i18n/es-UY/"
            : "./content/i18n/es-UY/audio/";
          var selectedUrl = new URL(
            selectedBase + selectedFilename,
            window.location.href
          ).href;
          if (this.src !== selectedUrl) {
            this.pause();
            this.removeAttribute("src");
            this.load();
            this.src = selectedUrl;
            this.load();
            document.body.dataset.reflowTtsSourceGuard = "replaced";
          } else {
            document.body.dataset.reflowTtsSourceGuard = "selected";
          }
        }
      }
      this.muted = Boolean(state.ttsSeeking);
      var audio = this;
      var playResult = inheritedPlay.apply(audio, arguments);
      if (playResult && typeof playResult.then === "function") {
        playResult.then(function () {
          var activeRef = ttsWordTickerRefs.get(audio);
          if (activeRef) startTtsWordTicker(audio, activeRef);
        }).catch(function () {});
      }
      return playResult;
    };
    mediaPrototype.__adtReflowTtsBridge = true;
    window.__adtReflowRegisterWordTicker = registerTtsWordTicker;
    window.__adtReflowWordTick = highlightTtsWordAtCurrentTime;
    window.__adtReflowPrepareWordHighlight = prepareTtsWordHighlight;
    window.__adtReflowRestoreTtsMarkup = restoreTtsMarkup;
    window.__adtReflowScheduleTtsCleanup = scheduleTtsRangeHighlightCleanup;
    window.__adtReflowPrepareSentenceHighlight = prepareTtsSentenceHighlight;
    window.__adtReflowClearRangeHighlight = clearTtsRangeHighlight;
    window.__adtReflowTimingsForItem = ttsTimingsForItem;
    window.__adtReflowHasTimingsForItem = ttsHasTimingsForItem;
    window.__adtReflowStopQuizFeedback = stopQuizFeedbackAudio;
    window.__adtReflowCaptureTtsPages = captureTtsPageMap;
    window.__adtReflowBeforeTtsItem = beforeTtsItemPlayback;
    window.__adtReflowResolveTtsStepIndex = resolveTtsStepIndex;
    window.__adtReflowAfterTtsStep = function () {
      if (!state.ttsStepShouldRemainPaused) return;
      /* Loading the destination MP3 is asynchronous. Pausing on the same
         tick can cancel the selection before React commits the new item,
         leaving Previous/Next visually stuck on the old sentence. The real
         pause is scheduled by beforeTtsItemPlayback once the destination is
         authoritative; this is only a network-error fallback. */
      window.setTimeout(function () {
        if (!state.ttsStepShouldRemainPaused) return;
        var api = window.__adtReflowAudio;
        if (api && api.pause) api.pause();
        state.ttsManuallyPaused = true;
        state.ttsStepShouldRemainPaused = false;
      }, 1800);
    };
    window.__adtReflowSyncChatContinuation = syncChapterOneChatContinuation;
    window.__adtReflowSyncSceneSeparators = reconcileSceneSeparatorTts;
    window.__adtReflowStartFromSettings = startTtsFromSettings;
    window.__adtReflowStartFromUserGesture = startTtsFromUserGesture;
    window.__adtReflowActivateFromSettings = activateTtsFromSettings;
    window.__adtReflowStopFromSettings = stopTtsFromSettings;
    window.__adtReflowShouldPauseAfterItem = function (item) {
      if (!item || !item.el || !item.el.closest) return false;
      var panel = item.el.closest(".quiz-panel");
      if (!panel || !item.el.classList.contains("quiz-option-text")) return false;
      var options = panel.querySelectorAll(".quiz-option-text[data-id]");
      return options.length > 0 && options[options.length - 1] === item.el;
    };
    window.__adtReflowReadQuizFeedback = function (audioId, feedbackElement) {
      if (!audioId || !feedbackElement) return;
      if (!readAloudSettingIsEnabled()) return;
      var api = window.__adtReflowAudio;
      if (api && api.pause) api.pause();
      stopQuizFeedbackAudio();
      var filename = ttsVoiceFilename(audioId);
      if (!filename) return;
      var base = filename.indexOf("voices/") === 0
        ? "./content/i18n/es-UY/"
        : "./content/i18n/es-UY/audio/";
      var audio = new Audio(base + filename);
      state.quizFeedbackAudio = audio;
      feedbackElement.classList.add("tts-active-block");
      function finish() {
        feedbackElement.classList.remove("tts-active-block");
        if (state.quizFeedbackAudio === audio) state.quizFeedbackAudio = null;
      }
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    };
    window.__adtReflowTargetIndex = function (items) {
      return ttsIndexForPage(items, visiblePageIndex());
    };
    window.__adtReflowResumeIndex = function (items, runtimeIndex) {
      if (!items || !items.length) return 0;
      var active = activeTtsElement();
      if (active && elementOccupiesPage(active, visiblePageIndex())) {
        var activeIndex = items.findIndex(function (item) {
          return item && item.el === active;
        });
        if (activeIndex >= 0) return activeIndex;
      }
      if (
        state.ttsCurrentItemIndex >= 0 &&
        state.ttsCurrentItemIndex < items.length &&
        items[state.ttsCurrentItemIndex] &&
        elementOccupiesPage(
          items[state.ttsCurrentItemIndex].el,
          visiblePageIndex()
        )
      ) {
        return state.ttsCurrentItemIndex;
      }
      var numericRuntimeIndex = Number(runtimeIndex);
      if (
        Number.isFinite(numericRuntimeIndex) &&
        numericRuntimeIndex >= 0 &&
        numericRuntimeIndex < items.length &&
        items[numericRuntimeIndex] &&
        elementOccupiesPage(items[numericRuntimeIndex].el, visiblePageIndex())
      ) {
        return numericRuntimeIndex;
      }
      return ttsIndexForPage(items, visiblePageIndex());
    };
  }

  function stopQuizFeedbackAudio() {
    if (state.quizFeedbackAudio) {
      state.quizFeedbackAudio.pause();
      state.quizFeedbackAudio.removeAttribute("src");
      state.quizFeedbackAudio.load();
      state.quizFeedbackAudio = null;
    }
    content.querySelectorAll(".quiz-feedback.tts-active-block").forEach(function (element) {
      element.classList.remove("tts-active-block");
    });
  }

  function ttsIndexForPage(items, targetPage) {
    if (!items || !items.length) return 0;
    captureTtsPageMap(items, false);

    /* A quiz can share a fragmented column with the final sentence of the
       preceding chapter. Starting TTS from that visual page must select the
       question that is visibly inside the quiz, not the prose fragment that
       happens to own the first client rect in the same column. */
    var quizOnPage = Array.prototype.slice.call(
      content.querySelectorAll(".quiz-panel")
    ).find(function (panel) {
      return elementOccupiesPage(panel, targetPage);
    });
    if (quizOnPage) {
      for (var quizIndex = 0; quizIndex < items.length; quizIndex += 1) {
        if (
          items[quizIndex] && items[quizIndex].el &&
          items[quizIndex].el.closest(".quiz-panel") === quizOnPage &&
          elementOccupiesPage(items[quizIndex].el, targetPage)
        ) {
          return quizIndex;
        }
      }
    }

    /* Use the live fragmented-column geometry first. A cached first-page
       value can become stale after changing font size or easy-read mode, and
       sentence chains may expose more than one client rect. In both cases,
       the correct item is the first one that actually occupies the visual
       page selected by the reader. */
    for (var exactIndex = 0; exactIndex < items.length; exactIndex += 1) {
      if (items[exactIndex] && elementOccupiesPage(items[exactIndex].el, targetPage)) {
        return exactIndex;
      }
    }

    var closestIndex = 0;
    var closestDistance = Infinity;
    for (var index = 0; index < items.length; index += 1) {
      var itemPage = pageForElement(items[index].el);
      if (itemPage === targetPage) return index;
      var distance = Math.abs(itemPage - targetPage);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }
    return closestIndex;
  }

  /* React can commit its currentIndex and remove the previous highlight one
     render after a rapid press. The item most recently sent to playback is
     therefore the authoritative semantic cursor; the painted highlight is a
     fallback only. Commit the result immediately as well, so two quick presses
     always advance twice instead of replaying a stale item and flashing an
     earlier page. */
  function resolveTtsStepIndex(items, currentIndex, direction) {
    if (!items || !items.length) return 0;
    /* Audio Previous/Next is an explicit semantic navigation command. A
       short visual-page lock from an earlier seek must not reject the new
       item or replay the same boundary forever. */
    window.clearTimeout(state.ttsTimer);
    window.clearTimeout(state.ttsNavigationUnlockTimer);
    state.ttsAligning = false;
    state.ttsDesiredPage = null;
    state.ttsSeeking = false;
    state.ttsNavigationLockPage = null;
    state.ttsNavigationLockUntil = 0;
    state.ttsManualStepUntil = Date.now() + 800;
    beginTtsManualHandoff();
    if (state.ttsAudio) {
      /* Stop the source clock before React selects the destination. Otherwise
         its onended callback can race the explicit button press and enqueue a
         second item, which is perceived as a flash or a one-sentence jump. */
      if (!state.ttsAudio.paused) state.ttsAudio.pause();
      state.ttsAudio.muted = false;
    }
    var baseIndex = -1;
    var visiblePage = visiblePageIndex();
    if (
      state.ttsCurrentItemIndex >= 0 &&
      state.ttsCurrentItemIndex < items.length &&
      items[state.ttsCurrentItemIndex]
    ) {
      /* The last item actually sent to playback is authoritative even during
         the render in which the visual page has not caught up yet. */
      baseIndex = state.ttsCurrentItemIndex;
    }
    var active = activeTtsElement();
    if (baseIndex < 0 && active && elementOccupiesPage(active, visiblePage)) {
      var activeIndex = items.findIndex(function (item) {
        return item && item.el === active;
      });
      if (activeIndex >= 0) baseIndex = activeIndex;
    }
    /* stop() resets React's internal index to zero. When the reader is paused
       or has not spoken anything on the visible page, that zero is not a real
       position. Use the first semantic item on the current visual page; then
       Previous reaches the final item of the preceding page and Next reaches
       the second item of the current page. */
    if (baseIndex < 0) baseIndex = ttsIndexForPage(items, visiblePage);
    var resultIndex = Math.max(
      0,
      Math.min(items.length - 1, baseIndex + (Number(direction) < 0 ? -1 : 1))
    );
    state.ttsCurrentItemIndex = resultIndex;
    document.body.dataset.reflowTtsStepDirection = Number(direction) < 0 ? "previous" : "next";
    document.body.dataset.reflowTtsStepBase = String(baseIndex);
    document.body.dataset.reflowTtsStepResult = String(resultIndex);
    document.body.dataset.reflowTtsStepRuntimeIndex = String(currentIndex);
    return resultIndex;
  }

  function finishTtsAlignment(api, targetPage) {
    if (state.ttsDesiredPage !== targetPage) return;
    state.ttsAligning = false;
    state.ttsDesiredPage = null;
    state.ttsSeeking = false;
    if (state.ttsAudio) state.ttsAudio.muted = false;
    if (!state.ttsResumeAfterSeek && api && api.pause) api.pause();
    followTtsHighlight();
  }

  function followTtsHighlight() {
    if (state.ttsAligning) return;
    if (!readAloudSettingIsEnabled()) return;
    var active = activeTtsElement();
    if (!active) return;
    var activePage = livePageForTtsElement(active);
    /* Automatic following is forward-only. Explicit reader navigation still
       seeks the audio in either direction through scheduleTtsAlignment(). */
    if (activePage > state.current) {
      goToPage(activePage, { announce: true, instant: true, fromTts: true });
    }
  }

  /* Range highlights do not mutate the DOM, so the class observer cannot
     detect when the spoken word crosses into the next CSS column. Following
     the actual painted Range keeps visual pagination synchronized even when
     one audio item spans a page boundary. */
  function followTtsVisualTarget(target) {
    if (!target || state.ttsAligning) return;
    if (!readAloudSettingIsEnabled()) return;
    var targetPages = pagesForElement(target);
    if (!targetPages.length) return;
    var targetPage = targetPages[0];
    var manualStep = Date.now() <= state.ttsManualStepUntil;
    var lockedPage = manualStep ? null : activeTtsNavigationLockPage();
    if (manualStep) {
      window.clearTimeout(state.ttsNavigationUnlockTimer);
      state.ttsNavigationLockPage = null;
      state.ttsNavigationLockUntil = 0;
    }
    if (lockedPage !== null && targetPage !== lockedPage) return;
    if (targetPage > state.current) {
      goToPage(targetPage, { announce: true, instant: true, fromTts: true });
    }
  }

  function beforeTtsItemPlayback(item, audio, itemIndex) {
    if (!item) return;
    var numericItemIndex = Number(itemIndex);
    markTtsChatTransitionForElement(item.el);
    if (Number.isFinite(numericItemIndex)) {
      state.ttsCurrentItemIndex = numericItemIndex;
    }
    if (audio) {
      /* Stop the old clock before selecting this item. In particular this
         prevents the tail of a stock resource from surviving into a voice
         change when the player advances automatically. */
      audio.pause();
      audio.currentTime = 0;
      bindTtsAudioForItem(item.id, audio);
    }
    if (state.ttsStepShouldRemainPaused) {
      /* Let playAtIndex commit this semantic item, then restore the paused
         transport without rewinding it. Previous/Next while paused therefore
         moves exactly one sentence and stays paused on that destination. */
      window.setTimeout(function () {
        var api = window.__adtReflowAudio;
        if (api && api.pause) api.pause();
        else if (audio && !audio.paused) audio.pause();
        state.ttsManuallyPaused = true;
        state.ttsStepShouldRemainPaused = false;
      }, 0);
    }
    document.body.dataset.reflowTtsBeforeId = item.id || "";
    document.body.dataset.reflowTtsBeforeCurrent = String(state.current);
    document.body.dataset.reflowTtsBeforeAligning = String(state.ttsAligning);
    document.body.dataset.reflowTtsBeforeConnected = String(Boolean(item.el && item.el.isConnected));
    if (state.ttsAligning || !item.el) return;
    var itemPage = livePageForTtsElement(item.el);
    document.body.dataset.reflowTtsBeforePage = String(itemPage);
    var manualStep = Date.now() <= state.ttsManualStepUntil;
    var lockedPage = manualStep ? null : activeTtsNavigationLockPage();
    if (manualStep) {
      window.clearTimeout(state.ttsNavigationUnlockTimer);
      state.ttsNavigationLockPage = null;
      state.ttsNavigationLockUntil = 0;
    }
    if (lockedPage !== null) {
      /* React can finish one stale playback callback after an explicit Next
         press. Never let that old item restore its former page. Once the
         correctly aligned item starts, keep a short grace period and then
         resume ordinary automatic following. */
      if (!elementOccupiesPage(item.el, lockedPage)) return;
      itemPage = lockedPage;
      releaseTtsNavigationLockSoon(lockedPage);
    }
    if (itemPage !== state.current) {
      /* This runs synchronously before audio.play(), so the destination page
         is already visible when the first sound of the new item begins. It
         deliberately applies in both directions for manual TTS stepping. */
      goToPage(itemPage, { announce: true, instant: true, fromTts: true });
      if (manualStep) {
        /* Closing the tiny play/pause state update can restore focus to the
           column that owned the control. Reassert the semantic destination
           after React commits, but only if that focus restoration displaced
           the requested sentence. */
        [40, 140, 280].forEach(function (delay) {
          window.setTimeout(function () {
            if (visiblePageIndex() !== itemPage) {
              goToPage(itemPage, {
                announce: false,
                instant: true,
                fromTts: true,
                preserveHash: true
              });
            }
          }, delay);
        });
      }
    }
  }

  function alignTtsToPage(targetPage, attempts) {
    if (!state.ttsAligning || state.ttsDesiredPage !== targetPage) return;
    var remaining = typeof attempts === "number" ? attempts : 80;
    var api = window.__adtReflowAudio;
    if (!api || !api.items || !api.playAtIndex) {
      if (remaining > 0 && readAloudSettingIsEnabled()) {
        state.ttsTimer = window.setTimeout(function () {
          alignTtsToPage(targetPage, remaining - 1);
        }, 50);
      } else {
        state.ttsAligning = false;
        state.ttsSeeking = false;
        state.ttsDesiredPage = null;
        if (state.ttsAudio) state.ttsAudio.muted = false;
      }
      return;
    }
    if (api.pause) api.pause();
    if (state.ttsAudio) state.ttsAudio.muted = true;
    captureTtsPageMap(api.items, true);
    api.playAtIndex(ttsIndexForPage(api.items, targetPage));
    state.ttsTimer = window.setTimeout(function () {
      finishTtsAlignment(window.__adtReflowAudio || api, targetPage);
    }, 90);
  }

  function scheduleTtsAlignment(targetPage, forceResume, immediate) {
    window.clearTimeout(state.ttsTimer);
    state.ttsAligning = true;
    state.ttsDesiredPage = targetPage;
    var api = window.__adtReflowAudio;
    state.ttsResumeAfterSeek = !state.ttsManuallyPaused && (
      forceResume === true || Boolean(
        (api && api.isPlaying) || document.querySelector('button[aria-label="Pausa"]')
      )
    );
    state.ttsSeeking = true;
    stopQuizFeedbackAudio();
    if (api && api.pause) api.pause();
    if (state.ttsAudio) state.ttsAudio.muted = true;
    if (immediate) {
      alignTtsToPage(targetPage);
    } else {
      state.ttsTimer = window.setTimeout(function () {
        alignTtsToPage(targetPage);
      }, 40);
    }
  }

  async function loadRuntime() {
    var response = await fetch("./assets/base.bundle.local.js");
    if (!response.ok) throw new Error("No se pudo iniciar el lector accesible.");
    var source = await response.text();
    var exposeMarker = 'M=(0,pt.useCallback)(()=>{R(),r(!1),s(0)},[R,r,s]);return(0,pt.useEffect)';
    var exposeReplacement = 'M=(0,pt.useCallback)(()=>{R(),r(!1),s(0)},[R,r,s]);' +
      'window.__adtReflowAudio={items:O,playAtIndex:A,pause:k,play:D,isPlaying:a,currentIndex:i,stop:M};' +
      'window.__adtReflowSyncChatContinuation&&window.__adtReflowSyncChatContinuation();' +
      'window.__adtReflowSyncSceneSeparators&&window.__adtReflowSyncSceneSeparators();' +
      'window.__adtReflowCaptureTtsPages&&window.__adtReflowCaptureTtsPages(O);' +
      'return(0,pt.useEffect)';
    var autoStartMarker = 'o.current||O.length!==0&&g&&P.current&&(o.current=!0,A(0))';
    /* Chrome forbids audible playback during initial document load. Preserve
       the enabled preference, but wait for the explicit Leer action before
       starting; autoplay continues to govern transitions after that click. */
    var autoStartReplacement = 'o.current||O.length!==0&&g&&P.current&&(o.current=!0)';
    var manualStartMarker = 'A(i||0)},[O.length,i,A,u,r,b])';
    var manualStartReplacement = 'A(window.__adtReflowResumeIndex?' +
      'window.__adtReflowResumeIndex(O,i):' +
      '(window.__adtReflowTargetIndex?window.__adtReflowTargetIndex(O):i||0))},' +
      '[O.length,i,A,u,r,b])';
    var speakerOpenMarker = 'd=()=>{a(!0),c("audio"),t!="audio"&&i()};';
    var speakerOpenReplacement = 'd=()=>{a(!0),c("audio")};';
    var settingsStartMarker = 'onChange:O("ReadAloud",f)';
    var settingsStartReplacement = 'onChange:w=>{O("ReadAloud",f)(w),' +
      'w?window.__adtReflowActivateFromSettings&&window.__adtReflowActivateFromSettings():' +
      'window.__adtReflowStopFromSettings&&window.__adtReflowStopFromSettings()}';
    var settingsVisibilityMarker = 'I=o.readAloud||!!o.easyRead,N=p;return';
    var settingsVisibilityReplacement = 'I=o.readAloud||!!o.easyRead,N=!0;return';
    var sharedReadAloudMarker = 'var Bu=L(Y(),1),qF=De();';
    var sharedReadAloudReplacement = sharedReadAloudMarker +
      'window.__adtReflowSetDockMenu=v=>qF.set(No,v);' +
      'window.__adtReflowGetDockMenu=()=>qF.get(No);' +
      'window.__adtReflowSetReadAloud=w=>{on("ReadAloud",w),qF.set(Bi,w)};' +
      'window.__adtReflowSetWordHighlight=w=>{on("WordHighlight",w),qF.set(Iy,w)};' +
      'window.__adtReflowGetWordHighlight=()=>qF.get(Iy);' +
      'window.__adtReflowSetAudioSpeed=w=>qF.set(Ay,w);' +
      'window.__adtReflowGetAudioSpeed=()=>qF.get(Ay);' +
      'window.__adtReflowGetAutoplay=()=>qF.get(Ey);';
    var wordTimingMarker = 'function hL(e,t,o,n){return n&&n.length>0?n:' +
      '!Number.isFinite(o)||o<=0?dL(t,NaN):dL(t,o)}';
    var wordTimingReplacement = 'function hL(e,t,o,n){let a=R2(u8(t)).length,' +
      'r=n&&n.length>0?n:null,i=r?r.reduce((s,l)=>Math.max(s,Number(l.end)||0),0):0,' +
      'c=r&&r.some(s=>!Number.isFinite(Number(s.start))||!Number.isFinite(Number(s.end))||' +
      'Number(s.end)-Number(s.start)<.005);return r&&r.length===a&&!c?r:' +
      'dL(t,Number.isFinite(o)&&o>0?o:i||NaN)}';
    var easyReadTimingGateMarker = 'w.useBlockWhenMissingTimecodes&&!V';
    var easyReadTimingGateReplacement = 'w.useBlockWhenMissingTimecodes&&' +
      '!(window.__adtReflowHasTimingsForItem?' +
      'window.__adtReflowHasTimingsForItem(w.id,V):V)';
    var metadataTimingFallbackMarker =
      'if(t.current&&t.current.mode==="word"&&!C[F.id])';
    var metadataTimingFallbackReplacement =
      'if(t.current&&t.current.mode==="word"&&' +
      '!(window.__adtReflowHasTimingsForItem?' +
      'window.__adtReflowHasTimingsForItem(F.id,C[F.id]):C[F.id]))';
    var wordTickerMarker = 'N(F,j),s(w),j.play().then';
    var wordTickerReplacement = 'window.__adtReflowBeforeTtsItem&&' +
      'window.__adtReflowBeforeTtsItem(F,j,w),N(F,j),s(w),' +
      'window.__adtReflowRegisterWordTicker&&window.__adtReflowRegisterWordTicker(j,t),' +
      'j.play().then';
    var nextAudioMarker = 'B=(0,pt.useCallback)(()=>{if(O.length===0)return;' +
      'let w=Math.min(i+1,O.length-1);A(w)},[i,O.length,A])';
    var nextAudioReplacement = 'B=(0,pt.useCallback)(()=>{if(O.length===0)return;' +
      'let w=window.__adtReflowResolveTtsStepIndex?' +
      'window.__adtReflowResolveTtsStepIndex(O,i,1):Math.min(i+1,O.length-1);' +
      'A(w),window.__adtReflowAfterTtsStep&&window.__adtReflowAfterTtsStep(w)' +
      '},[i,O.length,A])';
    var previousAudioMarker = '_=(0,pt.useCallback)(()=>{if(O.length===0)return;' +
      'let w=Math.max(i-1,0);A(w)},[i,O.length,A])';
    var previousAudioReplacement = '_=(0,pt.useCallback)(()=>{if(O.length===0)return;' +
      'let w=window.__adtReflowResolveTtsStepIndex?' +
      'window.__adtReflowResolveTtsStepIndex(O,i,-1):Math.max(i-1,0);' +
      'A(w),window.__adtReflowAfterTtsStep&&window.__adtReflowAfterTtsStep(w)' +
      '},[i,O.length,A])';
    var confettiMarker = 'var jL=GL.exports,fIe=GL.exports.create;';
    var confettiReplacement = confettiMarker + 'window.__adtReflowConfetti=jL;';
    var wordHighlightMarker = 'I2(w.el,F);let G=hL(w.id,F,z.duration,V);' +
      't.current={el:w.el,mode:"word",timestamps:G}';
    var wordHighlightReplacement = 'let G=hL(w.id,F,z.duration,' +
      'window.__adtReflowTimingsForItem?' +
      'window.__adtReflowTimingsForItem(w.id,V):V);' +
      'if(window.__adtReflowPrepareWordHighlight)' +
      't.current=window.__adtReflowPrepareWordHighlight(w.el,F,G);' +
      'else{I2(w.el,F);t.current={el:w.el,mode:"word",timestamps:G}}';
    var sentenceCleanupMarker = 'w.mode==="word"?(M2(w.el),T2(w.el)):O2(w.el)';
    var sentenceCleanupReplacement = '((w.mode==="word"||w.mode==="sentence")?' +
      '(window.__adtReflowScheduleTtsCleanup?' +
      'window.__adtReflowScheduleTtsCleanup(w.el):' +
      '(window.__adtReflowRestoreTtsMarkup?' +
      'window.__adtReflowRestoreTtsMarkup(w.el):(M2(w.el),T2(w.el)))):' +
      '(window.__adtReflowClearRangeHighlight&&window.__adtReflowClearRangeHighlight(),O2(w.el)))';
    var sentenceHighlightMarker = 'else k2(w.el),t.current={el:w.el,mode:"block",timestamps:[]}';
    var sentenceHighlightReplacement = 'else if(window.__adtReflowPrepareSentenceHighlight){' +
      'let G=hL(w.id,F,z.duration,window.__adtReflowTimingsForItem?' +
      'window.__adtReflowTimingsForItem(w.id,V):V);' +
      't.current=window.__adtReflowPrepareSentenceHighlight(w.el,F,G)}' +
      'else k2(w.el),t.current={el:w.el,mode:"block",timestamps:[]}';
    var sentenceMetadataMarker = 't.current&&t.current.mode==="word"&&!C[F.id]';
    var sentenceMetadataReplacement = 't.current&&(t.current.mode==="word"||' +
      't.current.mode==="sentence")&&!C[F.id]';
    var quizPauseMarker = 'j.onended=()=>{I();let G=w+1;G<O.length?A(G):(r(!1),s(0))}';
    var quizPauseReplacement = 'j.onended=()=>{I();if(window.__adtReflowShouldPauseAfterItem&&' +
      'window.__adtReflowShouldPauseAfterItem(F)){r(!1);return}let G=w+1;' +
      'G<O.length?A(G):(r(!1),s(0))}';
    var glossaryHighlightEffectMarker =
      '(0,MN.useEffect)(()=>{if(!t){If();return}if(Object.keys(e).length!==0' +
      ')return If(),Oy(e),()=>{If()}},[t,e])';
    var glossaryHighlightEffectReplacement =
      '(0,MN.useEffect)(()=>window.__adtReflowSetGlossaryHighlight?' +
      'window.__adtReflowSetGlossaryHighlight(t,e):' +
      '(()=>{if(!t){If();return}if(Object.keys(e).length!==0' +
      ')return If(),Oy(e),()=>{If()}})(),[t,e])';
    var glossaryCloseFocusMarker =
      'p=(0,ja.useCallback)(()=>{i(null),s.current=null},[])';
    var glossaryCloseFocusReplacement =
      'p=(0,ja.useCallback)(()=>{i(null),s.current=null,' +
      'setTimeout(()=>window.__adtReflowGlossaryDefinitionClosed&&' +
      'window.__adtReflowGlossaryDefinitionClosed(),900)},[])';
    var glossarySkipMarker =
      'A6="h1, h2, h3, h4, h5, h6, script, style, .glossary-term, .glossary-popup, ' +
      '.activity-text, [data-activity-item]"';
    var glossarySkipReplacement =
      'A6="h1, h2, h3, h4, h5, h6, script, style, .glossary-term, .glossary-popup, ' +
      '.activity-text, [data-activity-item], .quiz-panel"';
    /* JavaScript \\b treats accented letters as non-word characters. Thus
       “canjeó” failed its full-form match and the shorter “canje” variation
       wrapped only the unaccented root. Use Unicode letter/number/mark
       boundaries so the complete orthographic word is always selected. */
    var glossaryBoundaryMarker =
      'let p=new RegExp(`\\\\b${M6(d.text)}\\\\b`,"i"),f=!1,m=[];';
    var glossaryBoundaryReplacement =
      'let p=new RegExp(`(?<![\\\\p{L}\\\\p{N}\\\\p{M}_])${M6(d.text)}' +
      '(?![\\\\p{L}\\\\p{N}\\\\p{M}_])`,"iu"),f=!1,m=[];';
    var glossaryDedupeReadMarker = 'if(n.has(d.baseForm))continue;';
    var glossaryDedupeReadReplacement = 'if(n.has(d.termKey))continue;';
    var glossaryDedupeWriteMarker = 'f=!0,n.add(d.baseForm)';
    var glossaryDedupeWriteReplacement = 'f=!0,n.add(d.termKey)';
    var glossaryCurrentPageMarker =
      'c=(0,cx.useMemo)(()=>{if(typeof document>"u")return[];let p=document.getElementById("content");' +
      'if(!p)return[];let f=(p.textContent??"").toLowerCase();return f.trim()?' +
      'u.filter(m=>[m.word,...m.variations??[]].some(x=>f.includes(x.toLowerCase()))):[]},[u])';
    var glossaryCurrentPageReplacement =
      'c=(0,cx.useMemo)(()=>window.__adtReflowGlossaryEntriesForCurrentPage?' +
      'window.__adtReflowGlossaryEntriesForCurrentPage(u,i):[],[u,i])';
    var glossaryLocateMarker = 'function ux(e){if(typeof document>"u")return!1;';
    var glossaryLocateReplacement = 'function ux(e){if(window.__adtReflowLocateGlossaryTerm)' +
      'return window.__adtReflowLocateGlossaryTerm(e);if(typeof document>"u")return!1;';
    if (
      !source.includes(exposeMarker) ||
      !source.includes(autoStartMarker) ||
      !source.includes(manualStartMarker) ||
      !source.includes(speakerOpenMarker) ||
      !source.includes(settingsStartMarker) ||
      !source.includes(settingsVisibilityMarker) ||
      !source.includes(sharedReadAloudMarker) ||
      !source.includes(wordTimingMarker) ||
      !source.includes(easyReadTimingGateMarker) ||
      !source.includes(metadataTimingFallbackMarker) ||
      !source.includes(wordTickerMarker) ||
      !source.includes(nextAudioMarker) ||
      !source.includes(previousAudioMarker) ||
      !source.includes(confettiMarker) ||
      !source.includes(wordHighlightMarker) ||
      !source.includes(sentenceCleanupMarker) ||
      !source.includes(sentenceHighlightMarker) ||
      !source.includes(sentenceMetadataMarker) ||
      !source.includes(quizPauseMarker) ||
      !source.includes(glossaryHighlightEffectMarker) ||
      !source.includes(glossaryCloseFocusMarker) ||
      !source.includes(glossarySkipMarker) ||
      !source.includes(glossaryBoundaryMarker) ||
      !source.includes(glossaryDedupeReadMarker) ||
      !source.includes(glossaryDedupeWriteMarker) ||
      !source.includes(glossaryCurrentPageMarker) ||
      !source.includes(glossaryLocateMarker)
    ) {
      throw new Error("La versión del reproductor no admite la integración paginada.");
    }
    source = source.replace(exposeMarker, exposeReplacement)
      .replace(autoStartMarker, autoStartReplacement)
      .replace(manualStartMarker, manualStartReplacement)
      .replace(speakerOpenMarker, speakerOpenReplacement)
      .replace(settingsStartMarker, settingsStartReplacement)
      .replace(settingsVisibilityMarker, settingsVisibilityReplacement)
      .replace(sharedReadAloudMarker, sharedReadAloudReplacement)
      .replace(wordTimingMarker, wordTimingReplacement)
      .replace(easyReadTimingGateMarker, easyReadTimingGateReplacement)
      .replace(metadataTimingFallbackMarker, metadataTimingFallbackReplacement)
      .replace(wordTickerMarker, wordTickerReplacement)
      .replace(nextAudioMarker, nextAudioReplacement)
      .replace(previousAudioMarker, previousAudioReplacement)
      .replace(confettiMarker, confettiReplacement)
      .replace(wordHighlightMarker, wordHighlightReplacement)
      .replace(sentenceCleanupMarker, sentenceCleanupReplacement)
      .replace(sentenceHighlightMarker, sentenceHighlightReplacement)
      .replace(sentenceMetadataMarker, sentenceMetadataReplacement)
      .replace(quizPauseMarker, quizPauseReplacement)
      .replace(glossaryHighlightEffectMarker, glossaryHighlightEffectReplacement)
      .replace(glossaryCloseFocusMarker, glossaryCloseFocusReplacement)
      .replace(glossarySkipMarker, glossarySkipReplacement)
      .replace(glossaryBoundaryMarker, glossaryBoundaryReplacement)
      .replace(glossaryDedupeReadMarker, glossaryDedupeReadReplacement)
      .replace(glossaryDedupeWriteMarker, glossaryDedupeWriteReplacement)
      .replace(glossaryCurrentPageMarker, glossaryCurrentPageReplacement)
      .replace(glossaryLocateMarker, glossaryLocateReplacement);
    var script = document.createElement("script");
    script.textContent = source + "\n//# sourceURL=base.bundle.reflow.js";
    document.body.appendChild(script);
  }

  async function waitForLayout() {
    function settleWithin(promise, timeout) {
      return Promise.race([
        Promise.resolve(promise).catch(function () {}),
        new Promise(function (resolve) {
          window.setTimeout(resolve, timeout);
        })
      ]);
    }

    if (document.fonts && document.fonts.ready) {
      /* A failed local font request can leave Chromium's font set pending for
         an unbounded period. Fonts improve the final measurement, but must
         never prevent the reader controls from becoming available. */
      await settleWithin(document.fonts.ready, 2500);
    }
    var images = Array.prototype.slice.call(content.querySelectorAll("img"));
    var imageSettlements = Promise.all(images.map(function (image) {
      if (image.complete) return Promise.resolve();
      if (image.decode) return image.decode().catch(function () {});
      return new Promise(function (resolve) {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
    /* The book contains images for every page. A single stalled decode must
       not hold the complete interface hostage; late assets are handled by
       the existing layout observers after the first usable render. */
    await settleWithin(imageSettlements, 4000);
    await new Promise(function (resolve) {
      requestAnimationFrame(function () { requestAnimationFrame(resolve); });
    });
  }

  /* The browser automation API evaluates JavaScript in an isolated world,
     where page-owned window properties are intentionally invisible. Expose a
     tiny DOM command surface instead: DOM events cross that boundary, while
     all pagination work still runs here in the book's main world. The bridge
     is hidden, inert for readers and used only by local visual QA. */
  function installQaDomBridge() {
    var bridge = document.getElementById("adt-reflow-qa-bridge");
    var command = document.getElementById("adt-reflow-qa-command");
    if (!command) {
      command = document.createElement("input");
      command.type = "text";
      command.id = "adt-reflow-qa-command";
      command.tabIndex = -1;
      command.setAttribute("aria-hidden", "true");
      command.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;" +
        "padding:0;border:0;opacity:.001;pointer-events:none;z-index:-1;";
      document.body.appendChild(command);
    }
    if (!bridge) {
      bridge = document.createElement("button");
      bridge.type = "button";
      bridge.id = "adt-reflow-qa-bridge";
      bridge.tabIndex = -1;
      bridge.setAttribute("aria-hidden", "true");
      bridge.style.cssText = "position:fixed;left:1px;top:0;width:1px;height:1px;" +
        "padding:0;border:0;opacity:.001;z-index:-1;";
      document.body.appendChild(bridge);
    }
    function executeQaCommand() {
      var payload = {};
      try { payload = JSON.parse(command.value || "{}"); } catch (error) {}
      var action = payload.action || bridge.dataset.action || "state";
      if (action === "goto") {
        var visualPage = Math.max(1, Number(payload.page || bridge.dataset.page) || 1);
        goToPage(visualPage - 1, {
          instant: true,
          announce: false,
          explicit: true
        });
      } else if (action === "gotoId") {
        var requestedId = String(payload.id || bridge.dataset.id || "");
        var escapedId = requestedId.replace(/[\\"]/g, "\\$&");
        var requestedNode = requestedId ?
          content.querySelector('[data-id="' + escapedId + '"]') : null;
        if (requestedNode) {
          goToPage(pageForElement(requestedNode), {
            instant: true,
            announce: false,
            explicit: true
          });
        }
      } else if (action === "font") {
        applyFontSize(payload.font || bridge.dataset.font || "normal");
      } else if (action === "easy") {
        var requested = payload.enabled === true ||
          (payload.enabled == null && bridge.dataset.enabled === "true");
        var anchorId = visibleSemanticAnchorId() || state.currentAnchorId ||
          anchorIdForPage(state.current);
        try { window.localStorage.setItem("easyReadMode", String(requested)); } catch (error) {}
        document.body.classList.toggle("reflow-easy-read", requested);
        applyEasyReadTextDirectly(requested);
        normalizeSemanticChainSpacing();
        updateEasyReadClass.lastState = requested;
        syncEasyReadSwitchVisual();
        settleAllIllustratedPages();
        repairParagraphMarkers();
        updateReadingBlockSizing();
        recalculate({ anchorId: anchorId, preserveTts: true });
      } else if (action === "scanBlank") {
        var occupiedPages = Object.create(null);
        Array.prototype.slice.call(content.querySelectorAll(
          "[data-id], img:not([data-id]), svg:not([data-id]), " +
          "video:not([data-id]), canvas:not([data-id])"
        )).forEach(function (node) {
          var hasReadableText = String(node.textContent || "").trim().length > 0;
          var hasVisibleMedia = node.matches("img, svg, video, canvas") ||
            Boolean(node.querySelector("img, svg, video, canvas"));
          if (!hasReadableText && !hasVisibleMedia) return;
          pagesForElement(node).forEach(function (page) {
            occupiedPages[page] = true;
          });
        });
        var blankPages = [];
        for (var page = 0; page < state.total; page += 1) {
          if (!occupiedPages[page]) blankPages.push(page + 1);
        }
        bridge.dataset.blankPages = JSON.stringify(blankPages);
      } else if (action === "inspectPage") {
        var inspectedPage = Math.max(1,
          Number(payload.page || bridge.dataset.page) || (state.current + 1));
        var inspectedIndex = inspectedPage - 1;
        var inspection = [];
        Array.prototype.slice.call(content.querySelectorAll("[data-id]")).forEach(
          function (node) {
            if (node.getAttribute("aria-hidden") === "true") return;
            var readableText = String(node.textContent || "").replace(/\s+/g, " ").trim();
            var visibleMedia = node.matches("img, svg, video, canvas") ||
              Boolean(node.querySelector("img, svg, video, canvas"));
            if (!readableText && !visibleMedia) return;
            var nodePages = pagesForElement(node);
            if (nodePages.indexOf(inspectedIndex) === -1) return;
            var parentWithId = node.parentElement && node.parentElement.closest("[data-id]");
            if (parentWithId && parentWithId !== node &&
                pagesForElement(parentWithId).indexOf(inspectedIndex) !== -1) return;
            var rect = node.getBoundingClientRect();
            inspection.push({
              id: node.dataset.id || "",
              tag: node.tagName.toLowerCase(),
              className: String(node.className || ""),
              text: readableText.slice(0, 500),
              pages: nodePages.map(function (pageNumber) { return pageNumber + 1; }),
              top: Math.round(rect.top * 10) / 10,
              bottom: Math.round(rect.bottom * 10) / 10,
              left: Math.round(rect.left * 10) / 10,
              right: Math.round(rect.right * 10) / 10,
              width: Math.round(rect.width * 10) / 10,
              height: Math.round(rect.height * 10) / 10
            });
          }
        );
        bridge.dataset.pageInspection = JSON.stringify({
          page: inspectedPage,
          total: state.total,
          items: inspection
        });
      } else if (action === "scanSparse") {
        var sparsePages = [];
        var sparseLimit = Math.max(1, Number(payload.maxChars) || 90);
        for (var sparsePage = 0; sparsePage < state.total; sparsePage += 1) {
          var sparseIds = [];
          var sparseText = [];
          var sparseMedia = 0;
          Array.prototype.slice.call(content.querySelectorAll("[data-id]")).forEach(
            function (node) {
              if (node.getAttribute("aria-hidden") === "true") return;
              var parentWithSemanticId = node.parentElement &&
                node.parentElement.closest("[data-id]");
              if (parentWithSemanticId && parentWithSemanticId !== node) return;
              if (pagesForElement(node).indexOf(sparsePage) === -1) return;
              var sparseReadable = String(node.textContent || "").replace(/\s+/g, " ").trim();
              var sparseHasMedia = node.matches("img, svg, video, canvas") ||
                Boolean(node.querySelector("img, svg, video, canvas"));
              if (!sparseReadable && !sparseHasMedia) return;
              if (node.dataset.id) sparseIds.push(node.dataset.id);
              if (sparseReadable) sparseText.push(sparseReadable);
              if (sparseHasMedia) sparseMedia += 1;
            }
          );
          var sparseJoined = sparseText.join(" ").replace(/\s+/g, " ").trim();
          if (sparseJoined.length <= sparseLimit && sparseMedia === 0) {
            sparsePages.push({
              page: sparsePage + 1,
              chars: sparseJoined.length,
              text: sparseJoined.slice(0, 240),
              ids: sparseIds
            });
          }
        }
        bridge.dataset.sparsePages = JSON.stringify(sparsePages);
      } else if (action === "inspectEnd") {
        var contentRect = content.getBoundingClientRect();
        var endItems = [];
        Array.prototype.slice.call(content.children).slice(-16).forEach(
          function (node) {
            var rect = node.getBoundingClientRect();
            endItems.push({
              id: node.dataset && node.dataset.id || "",
              tag: node.tagName.toLowerCase(),
              className: String(node.className || ""),
              text: String(node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 240),
              pages: pagesForElement(node).map(function (pageNumber) {
                return pageNumber + 1;
              }),
              left: Math.round(rect.left * 10) / 10,
              right: Math.round(rect.right * 10) / 10,
              top: Math.round(rect.top * 10) / 10,
              bottom: Math.round(rect.bottom * 10) / 10,
              width: Math.round(rect.width * 10) / 10,
              height: Math.round(rect.height * 10) / 10
            });
          }
        );
        bridge.dataset.endInspection = JSON.stringify({
          total: state.total,
          current: state.current + 1,
          scrollWidth: content.scrollWidth,
          clientWidth: content.clientWidth,
          contentLeft: Math.round(contentRect.left * 10) / 10,
          contentRight: Math.round(contentRect.right * 10) / 10,
          contentWidth: Math.round(contentRect.width * 10) / 10,
          items: endItems
        });
      } else if (action === "measureIllustrated") {
        var measuredId = String(payload.id || bridge.dataset.id || "");
        var measuredEscapedId = measuredId.replace(/[\\"]/g, "\\$&");
        var measuredNode = measuredId ?
          content.querySelector('[data-id="' + measuredEscapedId + '"]') : null;
        var measuredPage = measuredNode ? measuredNode.closest(
          ".illustrated-page, .attic-illustrated-page"
        ) : null;
        var measuredImage = measuredPage ? measuredPage.querySelector(
          ".illustrated-media img, .attic-illustrated-media img, img"
        ) : null;
        var measuredCopy = measuredPage ? measuredPage.querySelector(
          ".illustrated-copy, .attic-illustrated-copy"
        ) : null;
        var measuredRow = measuredCopy ? firstVisibleTextRow(measuredCopy) : null;
        if (measuredPage && measuredImage && measuredRow) {
          var measuredElementRect = measuredImage.getBoundingClientRect();
          var measuredPaintedRect = ttsRenderedImageRect(measuredImage);
          bridge.dataset.measurement = JSON.stringify({
            id: measuredId,
            page: pageForElement(measuredNode) + 1,
            imageTop: measuredElementRect.top,
            paintedImageTop: measuredPaintedRect.top,
            firstTextTop: measuredRow.rect.top,
            deltaFromElement: measuredRow.rect.top - measuredElementRect.top,
            deltaFromPainted: measuredRow.rect.top - measuredPaintedRect.top,
            textId: measuredPage.dataset.reflowOpticalTextId || "",
            translation: measuredPage.dataset.reflowOpticalTranslation || "0"
          });
        } else {
          bridge.dataset.measurement = JSON.stringify({
            id: measuredId,
            error: "illustrated-page-not-measurable"
          });
        }
      } else if (action === "inspectTts") {
        var inspectedApi = window.__adtReflowAudio;
        var inspectedIndex = inspectedApi && Number.isFinite(Number(inspectedApi.currentIndex))
          ? Number(inspectedApi.currentIndex) : state.ttsCurrentItemIndex;
        var inspectedItem = inspectedApi && inspectedApi.items &&
          inspectedApi.items[inspectedIndex];
        bridge.dataset.ttsInspection = JSON.stringify({
          index: Number.isFinite(Number(inspectedIndex)) ? Number(inspectedIndex) : -1,
          id: inspectedItem && inspectedItem.id || "",
          audioId: document.body.dataset.reflowTtsAudioId || "",
          source: document.body.dataset.reflowTtsAudioSource || "",
          timingId: document.body.dataset.reflowTtsTimingId || "",
          timingCount: Number(document.body.dataset.reflowTtsTimingCount || 0),
          voice: state.ttsVoice || "",
          paused: state.ttsAudio ? state.ttsAudio.paused : true,
          currentTime: state.ttsAudio ? state.ttsAudio.currentTime : 0,
          page: state.current + 1
        });
      } else if (action === "playTtsId") {
        var requestedTtsId = String(payload.id || bridge.dataset.id || "");
        var requestedTtsBaseId = requestedTtsId.replace(/_easy_read$/, "");
        var requestedTtsDesiredId = document.body.classList.contains("reflow-easy-read") &&
          !/_easy_read$/.test(requestedTtsId)
          ? requestedTtsId + "_easy_read"
          : requestedTtsId;
        var requestedTtsApi = window.__adtReflowAudio;
        var requestedTtsItems = requestedTtsApi && requestedTtsApi.items || [];
        var requestedTtsIndex = requestedTtsItems.findIndex(function (item) {
          return item && String(item.id || "") === requestedTtsDesiredId;
        });
        if (requestedTtsIndex < 0 && requestedTtsDesiredId !== requestedTtsId) {
          requestedTtsIndex = requestedTtsItems.findIndex(function (item) {
            return item && String(item.id || "") === requestedTtsId;
          });
        }
        if (requestedTtsIndex < 0) {
          requestedTtsIndex = requestedTtsItems.findIndex(function (item) {
            return item && String(item.id || "").replace(/_easy_read$/, "") ===
              requestedTtsBaseId;
          });
        }
        if (requestedTtsIndex >= 0 && requestedTtsApi.playAtIndex) {
          requestedTtsApi.playAtIndex(requestedTtsIndex);
        }
        bridge.dataset.ttsRequested = JSON.stringify({
          id: requestedTtsId,
          index: requestedTtsIndex,
          matchedId: requestedTtsIndex >= 0 && requestedTtsApi.items[requestedTtsIndex]
            ? String(requestedTtsApi.items[requestedTtsIndex].id || "") : ""
        });
      } else if (action === "pauseTts") {
        var pausedTtsApi = window.__adtReflowAudio;
        if (pausedTtsApi && pausedTtsApi.pause) pausedTtsApi.pause();
      } else if (action === "startTts") {
        startTtsFromSettings();
      } else if (action === "voice") {
        applyTtsVoice(String(payload.voice || bridge.dataset.voice || "valentina"));
      }
      bridge.dataset.current = String(state.current + 1);
      bridge.dataset.total = String(state.total);
      bridge.dataset.fontSize = state.fontSize || "normal";
      bridge.dataset.easyRead = String(
        document.body.classList.contains("reflow-easy-read")
      );
      bridge.dataset.scrollLeft = String(content.scrollLeft);
      bridge.dataset.scrollWidth = String(content.scrollWidth);
      bridge.dataset.clientWidth = String(content.clientWidth);
      bridge.dataset.pageWidth = String(pageWidth());
      bridge.dataset.maxScrollLeft = String(
        Math.max(0, content.scrollWidth - content.clientWidth)
      );
      bridge.dataset.visiblePage = String(visiblePageIndex() + 1);
      bridge.dataset.explicitPageLock = state.explicitPageLockPage === null ?
        "" : String(state.explicitPageLockPage + 1);
    }
    bridge.onclick = executeQaCommand;
    /* locator.fill() dispatches an input event even from Playwright's
       isolated world. This makes local QA deterministic without requiring a
       synthetic click on an intentionally invisible control. */
    command.oninput = executeQaCommand;
  }

  async function boot() {
    document.body.classList.add("reflow-book");
    content = document.getElementById("content");
    installQaDomBridge();
    /* Direct-QA bridge: install it at the earliest point of every document
       load. Keeping this outside the media bridge avoids losing the hooks
       when the browser preserves an already-patched media prototype. */
    window.__adtReflowGoToVisualPage = function (page) {
      var visualPage = Math.max(1, Number(page) || 1);
      goToPage(visualPage - 1, { instant: true, announce: false, explicit: true });
      return { current: state.current + 1, total: state.total };
    };
    window.__adtReflowQaState = function () {
      return {
        current: state.current + 1,
        total: state.total,
        fontScale: document.body.getAttribute("data-reflow-font-scale") || "normal",
        easyRead: document.body.classList.contains("reflow-easy-read")
      };
    };
    migrateDefaultReaderState();
    loadFontPreference();
    retireTextCasePreference();
    loadTtsVoicePreference();
    installReflowDataAdapter();
    var voiceCatalogPromise = loadTtsVoiceCatalogs();
    var indexMetadataPromise = loadIndexMetadata();

    var loading = document.createElement("div");
    loading.id = "reflow-loading";
    loading.setAttribute("role", "status");
    loading.textContent = "Preparando el libro reflowable…";
    document.body.appendChild(loading);

    try {
      var loadedSections = await Promise.all(sections.slice(1).map(fetchSection));
      loadedSections.forEach(function (section) {
        content.appendChild(section);
      });
      composePreliminaryTitle();
      composeChapterCover();
      composeChapterTwoCover();
      removeDecorativeTextDuplicates();
      normalizeLaterBookStructure();
      normalizeSceneSeparators();
      composeLaterWhatsAppChats();
      composeChapterFiveChat();
      composeChapterOneChat();
      prepareReadingFlow();
      prepareChapterTwoQuiz();
      prepareQuizFeedbackAudio();
      installTtsMediaBridge();
      installReflowGlossaryBridge();

      var hashSection = decodeURIComponent(window.location.hash.slice(1));
      var hashIndex = sections.findIndex(function (entry) { return entry[0] === hashSection; });
      state.initialHashSectionId = hashIndex >= 0 ? hashSection : null;
      if (hashIndex >= 0) {
        document.querySelector('meta[name="title-id"]').content = hashSection;
        document.querySelector('meta[name="page-section-id"]').content = String(hashIndex + 1);
      }

      await voiceCatalogPromise;
      await indexMetadataPromise;
      await loadRuntime();
      installGlossaryDefinitionFocusManagement();
      normalizeLaterBookStructure();
      createPagination();
      createFontControls();
      installQuizCardHeightLock();
      installTtsSpeedHighlightRestriction();
      installCompactRuntimePanels();
      installRuntimeMenuAdapter();
      wireNavigation();
      await waitForLayout();

      /* Easy-read replacements are applied by the runtime. Rebalance only
         once their final line count is measurable, so the prose beside the
         illustration is centered and never starts above the viewport. */
      updateEasyReadClass();
      normalizeLaterBookStructure();
      fitChapterFiveChat();
      settleAllIllustratedPages();
      repairParagraphMarkers();
      updateReadingBlockSizing();
      await waitForLayout();
      balanceCoverMargins();

      recalculate({
        sectionId: hashIndex >= 0 ? hashSection : null,
        restore: hashIndex < 0
      });
      scheduleIllustratedSettlement();
      state.lastContentReflowAt = Date.now();
      hideOriginalPagination();
      installAutomaticLayoutObserver();

      var interfaceObserver = new MutationObserver(hideOriginalPagination);
      interfaceObserver.observe(document.getElementById("interface-container"), {
        childList: true,
        subtree: true
      });

      /* The toolbar is mounted independently from the book content. Recheck
         the cover whenever that real lower boundary appears or changes size,
         so later runtime/UI changes cannot reintroduce unequal margins. */
      var navLayoutNode = document.getElementById("nav-container");
      var scheduleCoverBalance = function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(balanceCoverMargins);
        });
      };
      if (navLayoutNode) {
        state.navLayoutMutationObserver = new MutationObserver(scheduleCoverBalance);
        state.navLayoutMutationObserver.observe(navLayoutNode, {
          childList: true,
          subtree: true,
          attributes: true
        });
        if (typeof ResizeObserver === "function") {
          state.navLayoutResizeObserver = new ResizeObserver(scheduleCoverBalance);
          state.navLayoutResizeObserver.observe(navLayoutNode);
        }
      }
      scheduleCoverBalance();

      var contentObserver = new MutationObserver(function (mutations) {
        if (state.ttsMarkupRestoring) return;
        if (Date.now() <= state.glossaryMarkupIgnoreUntil) return;
        if (state.settingsRepaginationActive) {
          scheduleSettingsRepaginationFinalize(280);
          return;
        }
        if (Date.now() <= state.settingsRepaginationIgnoreUntil) return;
        if (
          (state.ttsManualHandoffPending || Date.now() <= state.ttsChatTransitionUntil) &&
          mutations.length && mutations.every(mutationBelongsToWhatsAppChat)
        ) return;
        if (mutations.length && mutations.every(isTtsMarkupMutation)) return;
        if (mutations.length && mutations.every(isQuizRepaginationOverlayMutation)) return;
        window.clearTimeout(state.mutationTimer);
        state.mutationTimer = window.setTimeout(function () {
          if (state.settingsRepaginationActive) {
            scheduleSettingsRepaginationFinalize(280);
            return;
          }
          if (Date.now() <= state.settingsRepaginationIgnoreUntil) return;
          updateEasyReadClass();
          normalizeLaterBookStructure();
          fitChapterFiveChat();
          settleAllIllustratedPages();
          repairParagraphMarkers();
          /* Locale reconciliation may move an inserted whitespace node to
             the end of a semantic chain. Repair once React has finished its
             batch so visible text, innerText, search and TTS stay identical. */
          normalizeSemanticChainSpacing();
          updateReadingBlockSizing();
          scheduleIllustratedSettlement();
          balanceCoverMargins();
          var currentHash = decodeURIComponent(window.location.hash.slice(1));
          var keepAnchored = sections.some(function (entry) {
            return entry[0] === currentHash;
          });
          var active = activeTtsElement();
          var pendingAnchorId = livePendingSettingsAnchorId();
          var preserveActiveTts = Boolean(
            !state.initialHashSectionId &&
            (pendingAnchorId || active) &&
            readAloudSettingIsEnabled()
          );
          var guardedAnchorId = state.quizRepaginationAnchorId;
          recalculate({
            sectionId: state.initialHashSectionId ||
              (keepAnchored && !preserveActiveTts ? currentHash : null),
            anchorId: pendingAnchorId || (preserveActiveTts
              ? active.dataset.id
              : (guardedAnchorId || (keepAnchored ? null : state.currentAnchorId))),
            preserveTts: preserveActiveTts
          });
          if (pendingAnchorId) {
            var pendingElement = content.querySelector('[data-id="' + pendingAnchorId + '"]');
            if (pendingElement) {
              lockTtsToExplicitNavigation(livePageForTtsElement(pendingElement));
            }
          }
          state.lastContentReflowAt = Date.now();
          if (state.quizRepaginationOverlay) finishQuizRepaginationAfterPaint();
        }, 180);
      });
      contentObserver.observe(content, { childList: true, characterData: true, subtree: true });

      /* Any genuinely late locale replacement is now caught and coalesced by
         contentObserver. Do not schedule unconditional whole-book passes
         after the interface is already visible: they used to block the first
         settings or page command for several seconds. */
      window.setTimeout(function () {
        state.initialHashSectionId = null;
      }, 1800);

      var ttsObserver = new MutationObserver(function () {
        if (state.ttsFollowScheduled) return;
        state.ttsFollowScheduled = true;
        requestAnimationFrame(function () {
          state.ttsFollowScheduled = false;
          followTtsHighlight();
        });
      });
      ttsObserver.observe(content, { attributes: true, attributeFilter: ["class"], subtree: true });
    } catch (error) {
      console.error(error);
      content.classList.remove("opacity-0");
      content.classList.add("opacity-100");
      loading.textContent = "No fue posible preparar el libro reflowable.";
      loading.setAttribute("role", "alert");
      return;
    }

    loading.remove();
  }

  boot();
})();
