export type SurpriseLang = 'en' | 'ta' | 'hi' | 'es';

export const SURPRISE_LANGUAGES: { id: SurpriseLang; code: string; label: string }[] = [
  { id: 'en', code: 'EN', label: 'English' },
  { id: 'ta', code: 'TA', label: 'Tamil' },
  { id: 'hi', code: 'HI', label: 'Hindi' },
  { id: 'es', code: 'ES', label: 'Spanish' },
];

export interface SurpriseCopy {
  forPrefix: string;
  back: string;
  enterPasscode: string;
  passcodeSub: string;
  passcodeError: string;
  happyBirthday: string;
  excitedPrompt: string;
  noNudgePrompt: string;
  yes: string;
  no: string;
  popAllTitle: string;
  popAllSub: string;
  poppedLabel: string;
  continueBtn: string;
  blowCandle: string;
  blowIntoMic: string;
  listeningMic: string;
  tapToBlow: string;
  closeEyesWish: string;
  makeAWish: string;
  yourRoseBouquet: string;
  messageFromHeart: string;
  tapToOpen: string;
  dear: string;
  withLove: string;
  showFullLetter: string;
  oneLastSurprise: string;
  oneLastThing: string;
  tapTheGift: string;
  tapsRemaining: (n: number) => string;
  lotsOfLove: string;
  onceAgain: string;
  replay: string;
  groupWishes: string;
  writeThankYou: string;
  writeThankYouSub: string;
  postThankYou: string;
  thankYouPosted: string;
  createOwnCard: string;
}

export const SURPRISE_COPY: Record<SurpriseLang, SurpriseCopy> = {
  en: {
    forPrefix: 'For',
    back: 'Back',
    enterPasscode: 'Enter Passcode',
    passcodeSub: 'Something special is waiting for you',
    passcodeError: 'Incorrect code — try again',
    happyBirthday: 'Happy Birthday,',
    excitedPrompt: 'Are you excited for what’s next?',
    noNudgePrompt: 'Come on — tap Yes to unwrap your surprise!',
    yes: 'Yes',
    no: 'No',
    popAllTitle: 'Pop all 4 balloons',
    popAllSub: 'Tap each balloon to reveal your hidden message',
    poppedLabel: 'popped',
    continueBtn: 'Continue',
    blowCandle: 'Blow the candle,',
    blowIntoMic: 'Blow into the mic',
    listeningMic: 'Listening... Blow now!',
    tapToBlow: 'Tap to Blow Out',
    closeEyesWish: 'Close your eyes & make a wish',
    makeAWish: 'Make a wish...',
    yourRoseBouquet: 'Your Rose Bouquet',
    messageFromHeart: 'A Message From My Heart',
    tapToOpen: 'Tap to open',
    dear: 'Dear',
    withLove: 'With love and best wishes,',
    showFullLetter: 'Show Full Letter',
    oneLastSurprise: 'One last surprise',
    oneLastThing: 'One Last Thing...',
    tapTheGift: 'Tap the gift',
    tapsRemaining: (n: number) =>
      `Tap the gift ${n} more ${n === 1 ? 'time' : 'times'}`,
    lotsOfLove: 'Lots of love for you',
    onceAgain: 'Once again, Happy Birthday',
    replay: 'Replay',
    groupWishes: 'Group Wishes',
    writeThankYou: 'Write a Thank You Card',
    writeThankYouSub: 'Send a little love back with a heartfelt note',
    postThankYou: 'Post Thank You',
    thankYouPosted: 'Thank you note posted to the Group Wishes Wall!',
    createOwnCard: 'Create Your Own Birthday Card',
  },
  ta: {
    forPrefix: 'உங்களுக்காக',
    back: 'பின்',
    enterPasscode: 'பாஸ்கோட் உள்ளிடவும்',
    passcodeSub: 'உங்களுக்காக ஒரு சிறப்பு சர்ப்ரைஸ் காத்திருக்கிறது',
    passcodeError: 'தவறான கோட் — மீண்டும் முயற்சிக்கவும்',
    happyBirthday: 'பிறந்தநாள் வாழ்த்துகள்,',
    excitedPrompt: 'அடுத்த சர்ப்ரைஸுக்கு ரெடியா?',
    noNudgePrompt: 'அச்சச்சோ! Yes அழுத்தி சர்ப்ரைஸை பாருங்கள்!',
    yes: 'Yes',
    no: 'No',
    popAllTitle: '4 பலூன்களையும் உடைக்கவும்',
    popAllSub: 'மறைந்திருக்கும் வார்த்தையை பார்க்க தட்டவும்',
    poppedLabel: 'உடைத்தது',
    continueBtn: 'தொடரவும்',
    blowCandle: 'மெழுகுவர்த்தியை ஊதுங்கள்,',
    blowIntoMic: 'மைக்கில் ஊதவும்',
    listeningMic: 'கேட்கிறது... இப்போது ஊதுங்கள்!',
    tapToBlow: 'தட்டி அணைக்கவும்',
    closeEyesWish: 'கண்களை மூடி ஒரு ஆசை கேளுங்கள்',
    makeAWish: 'உங்கள் ஆசையை கேளுங்கள்...',
    yourRoseBouquet: 'உங்களுக்கான ரோஜா பூங்கொத்து',
    messageFromHeart: 'என் மனதிலிருந்து ஒரு கடிதம்',
    tapToOpen: 'திறக்க தட்டவும்',
    dear: 'அன்புள்ள',
    withLove: 'என்றும் அன்புடன்,',
    showFullLetter: 'முழு கடிதம் காட்டு',
    oneLastSurprise: 'இன்னும் ஒரு சர்ப்ரைஸ்',
    oneLastThing: 'கடைசி சர்ப்ரைஸ்...',
    tapTheGift: 'பரிசைத் தட்டவும்',
    tapsRemaining: (n: number) => `பரிசை இன்னும் ${n} முறை தட்டவும்`,
    lotsOfLove: 'நிறைய அன்புடன்',
    onceAgain: 'மீண்டும் இனிய பிறந்தநாள் வாழ்த்துகள்',
    replay: 'மீண்டும் பார்க்க',
    groupWishes: 'வாழ்த்து சுவர்',
    writeThankYou: 'நன்றி அட்டை எழுதுங்கள்',
    writeThankYouSub: 'உங்கள் அன்பான பதிலை இங்கே பகிருங்கள்',
    postThankYou: 'நன்றி அனுப்பு',
    thankYouPosted: 'உங்கள் நன்றி வாழ்த்து சுவரில் இணைக்கப்பட்டது!',
    createOwnCard: 'உங்கள் சொந்த பிறந்தநாள் அட்டை உருவாக்கவும்',
  },
  hi: {
    forPrefix: 'आपके लिए',
    back: 'पीछे',
    enterPasscode: 'पासकोड दर्ज करें',
    passcodeSub: 'आपके लिए कुछ खास इंतज़ार कर रहा है',
    passcodeError: 'गलत कोड — फिर से कोशिश करें',
    happyBirthday: 'जन्मदिन मुबारक,',
    excitedPrompt: 'क्या आप अगले सरप्राइज़ के लिए तैयार हैं?',
    noNudgePrompt: 'अरे नहीं! सरप्राइज़ देखने के लिए Yes दबाएं!',
    yes: 'Yes',
    no: 'No',
    popAllTitle: 'सभी 4 गुब्बारे फोड़ें',
    popAllSub: 'छिपा हुआ संदेश देखने के लिए हर गुब्बारे को टैप करें',
    poppedLabel: 'फूटे',
    continueBtn: 'आगे बढ़ें',
    blowCandle: 'मोमबत्ती बुझाएं,',
    blowIntoMic: 'माइक में फूंक मारें',
    listeningMic: 'सुन रहे हैं... अभी फूंकें!',
    tapToBlow: 'टैप करके बुझाएं',
    closeEyesWish: 'आंखें बंद करें और एक विश मांगें',
    makeAWish: 'एक प्यारी विश मांगें...',
    yourRoseBouquet: 'आपका गुलाबों का गुलदस्ता',
    messageFromHeart: 'मेरे दिल से एक संदेश',
    tapToOpen: 'खोलने के लिए टैप करें',
    dear: 'प्रिय',
    withLove: 'ढेर सारे प्यार और शुभकामनाओं के साथ,',
    showFullLetter: 'पूरा पत्र देखें',
    oneLastSurprise: 'एक आखिरी सरप्राइज़',
    oneLastThing: 'एक आखिरी चीज़...',
    tapTheGift: 'गिफ्ट को टैप करें',
    tapsRemaining: (n: number) => `गिफ्ट को ${n} बार और टैप करें`,
    lotsOfLove: 'आपके लिए ढेर सारा प्यार',
    onceAgain: 'एक बार फिर जन्मदिन मुबारक',
    replay: 'फिर से देखें',
    groupWishes: 'ग्रुप विशेज',
    writeThankYou: 'थैंक यू कार्ड लिखें',
    writeThankYouSub: 'प्यार भरे नोट के साथ धन्यवाद भेजें',
    postThankYou: 'धन्यवाद भेजें',
    thankYouPosted: 'आपका थैंक यू नोट विशेज वॉल पर जुड़ गया!',
    createOwnCard: 'अपना खुद का जन्मदिन कार्ड बनाएं',
  },
  es: {
    forPrefix: 'Para',
    back: 'Atrás',
    enterPasscode: 'Ingresa el código',
    passcodeSub: 'Algo especial te está esperando',
    passcodeError: 'Código incorrecto — intenta otra vez',
    happyBirthday: 'Feliz Cumpleaños,',
    excitedPrompt: '¿Emocionado por lo que sigue?',
    noNudgePrompt: '¡Vamos! Toca Sí para abrir tu sorpresa',
    yes: 'Sí',
    no: 'No',
    popAllTitle: 'Explota los 4 globos',
    popAllSub: 'Toca cada globo para revelar el mensaje secreto',
    poppedLabel: 'listos',
    continueBtn: 'Continuar',
    blowCandle: 'Sopla la vela,',
    blowIntoMic: 'Sopla al micrófono',
    listeningMic: 'Escuchando... ¡Sopla ahora!',
    tapToBlow: 'Toca para apagar',
    closeEyesWish: 'Cierra los ojos y pide un deseo',
    makeAWish: 'Pide un deseo...',
    yourRoseBouquet: 'Tu Ramo de Rosas',
    messageFromHeart: 'Un Mensaje De Mi Corazón',
    tapToOpen: 'Toca para abrir',
    dear: 'Querido/a',
    withLove: 'Con todo mi cariño,',
    showFullLetter: 'Ver carta completa',
    oneLastSurprise: 'Una última sorpresa',
    oneLastThing: 'Una Última Cosa...',
    tapTheGift: 'Toca el regalo',
    tapsRemaining: (n: number) =>
      `Toca el regalo ${n} ${n === 1 ? 'vez' : 'veces'} más`,
    lotsOfLove: 'Mucho amor para ti',
    onceAgain: 'Una vez más, ¡Feliz Cumpleaños',
    replay: 'Repetir',
    groupWishes: 'Muro de Deseos',
    writeThankYou: 'Escribe una nota de gracias',
    writeThankYouSub: 'Envía un poco de cariño de vuelta',
    postThankYou: 'Enviar gracias',
    thankYouPosted: '¡Tu nota de agradecimiento se publicó en el muro!',
    createOwnCard: 'Crea Tu Propia Tarjeta de Cumpleaños',
  },
};
