// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: info-circle;
// version beta 1.0 (101T1303c)
// Github https://github.com/spendtopic/SpendTermi-of-Scriptable
// SpendTopic https://t.me/Topicst
// Reprint and indicate the source

// TODO: PLEASE SET THESE VALUES
const DEVICE_NAME = 'TODO';
const WORK_CALENDAR_NAME = 'TODO';
const PERSONAL_CALENDAR_NAME = 'TODO';
const DISPLAY_COUNTDOWN = true; // true or false
const COUNTDOWN_UDAYS = ''; // This is the countdown date. Please use the ISO8601 format: yyyy-mm-dd. Like this 2022-10-13
const COUNTDOWN_NAME = 'TODO'; 
const COUNTDOWN_DATE = false; // true or false



// Do not change the below code
const FONT_NAME = 'Menlo';
const FONT_SIZE = 10;
var Dbrightness = Math.round(Device.screenBrightness() * 100);
var NAME = Device.name();
const COLORS = {
  bg0: '#29323c',
  bg1: '#1c1c1c',
  personalCal: '#5BD2F0',
  workCal: '#9D90FF',
  weather: '#FDFD97',
  location: '#FEB144',
  countdown: '#FF6663',
  deviceS: '#7AE7B9',
  deviceST: '#E5BB7B',
};
var VER = Device.systemVersion();
var Dbattery = Math.round(Device.batteryLevel() * 100);
const data = await fetchData();
async function fetchData() {
  const nextWorkEvent = await fetchNextCalendarEvent(WORK_CALENDAR_NAME);
  const nextPersonalEvent = await fetchNextCalendarEvent(PERSONAL_CALENDAR_NAME);
  return {
    nextWorkEvent,
    nextPersonalEvent,
  };
}
async function fetchNextCalendarEvent(calendarName) {
  const calendar = await Calendar.forEventsByTitle(calendarName);
  const events = await CalendarEvent.today([calendar]);
  const tomorrow = await CalendarEvent.tomorrow([calendar]);
  const DEV_MODE = false; //true or false
  if (DEV_MODE){
    console.log(`Got ${events.length} events for ${calendarName}`);
    console.log(`Got ${tomorrow.length} events for ${calendarName} tomorrow`);
  }
  const upcomingEvents = events.concat(tomorrow).filter(e => (new Date(e.endDate)).getTime() >= (new Date()).getTime());
  return upcomingEvents ? upcomingEvents[0] : null;
}
function getCalendarEventTitle(calendarEvent, isWorkEvent) {
  if (!calendarEvent) {
    return `No upcoming ${isWorkEvent ? 'work ' : ''}events until tomorrow`;
  }
  const timeFormatter = new DateFormatter();
  timeFormatter.locale = 'en';
  timeFormatter.dateFormat = "MMM dd,yy-Q'q' H:mm" ;
  const eventTime = new Date(calendarEvent.startDate);
  return `[${timeFormatter.string(eventTime)}] ${calendarEvent.title}`;
}
const widget = createWidget()
function createWidget(){
  const DEV_MODE = false; //true or false
  if (DEV_MODE){
    console.log(`Creating widget with data: ${JSON.stringify()}`);
  }
  const widget = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color(COLORS.bg0), new Color(COLORS.bg1)];
  const stack = widget.addStack();
  stack.layoutVertically();
  stack.spacing = 4;
  bgColor.locations = [0.0, 1.0];
  widget.backgroundGradient = bgColor;
  widget.setPadding(3, 0, 10, 0);
  stack.size = new Size(320, 0);
  const timeFormatter = new DateFormatter();
  timeFormatter.locale = "en";
  timeFormatter.useNoDateStyle();
  timeFormatter.dateFormat = "MMM HH:mm" ;
  const lastLoginLine = stack.addText(`Update time: ${timeFormatter.string(new Date())}`);
  lastLoginLine.textColor = Color.white();
  lastLoginLine.textOpacity = 0.7;
  lastLoginLine.font = new Font(FONT_NAME, FONT_SIZE);
  const inputLine = stack.addText(`Device: ${NAME} ${DEVICE_NAME} ${VER}`);
  inputLine.textColor = Color.white();
  inputLine.font = new Font(FONT_NAME, FONT_SIZE);
  const nextPersonalCalendarEventLine = stack.addText(`P 🗓 | ${getCalendarEventTitle(data.nextPersonalEvent, false)}`);
  const nextWorkCalendarEventLine = stack.addText(`W 🗓 | ${getCalendarEventTitle(data.nextWorkEvent, true)}`);
  nextPersonalCalendarEventLine.textColor = new Color(COLORS.personalCal);
  nextPersonalCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
  timeFormatter.locale = "en";
  timeFormatter.useNoDateStyle();
  timeFormatter.dateFormat = "MMM HH:mm" ;
  nextWorkCalendarEventLine.textColor = new Color(COLORS.workCal);
  nextWorkCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
if (DISPLAY_COUNTDOWN){
    FCU = COUNTDOWN_UDAYS.toString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(FCU.trim()) === false) {
      const countdownLine = stack.addText(`C ⌛️ | No countdown set`);
      countdownLine.textColor = new Color(COLORS.weather);
      countdownLine.font = new Font(FONT_NAME, FONT_SIZE);
    } else {
    CUE = FCU.trim()
    function getCUER(){
      const total = Date.parse(CUE) - Date.parse(new Date());
      const seconds = Math.floor( (total/1000) % 60 );
      const minutes = Math.floor( (total/1000/60) % 60 );
      const hours = Math.floor( (total/(1000*60*60)) % 24 );
      const days = Math.floor( total/(1000*60*60*24) );
      return {
        total,
        days,
        hours,
        minutes,
        seconds
      };
    }
    let CUER = getCUER().days + 1;
    const countdownLine = stack.addText(`C ⏳ | ${CUER} days until the ${COUNTDOWN_NAME}`);
    countdownLine.textColor = new Color(COLORS.weather);
    countdownLine.font = new Font(FONT_NAME, FONT_SIZE);
    }
  
}
  if (DISPLAY_COUNTDOWN && COUNTDOWN_DATE){
    const countdowndLine = stack.addDate(new Date(COUNTDOWN_UDAYS))
    countdowndLine.textColor = new Color(COLORS.weather);
    countdowndLine.textOpacity = 0.7;
    countdowndLine.font = new Font(FONT_NAME, 7);
  }
    const deviceStatsLine = stack.addText(`D 📊 | ⚡︎ ${Dbattery}%, ☀ ${Dbrightness}%`);
    deviceStatsLine.font = new Font(FONT_NAME, FONT_SIZE);
    if (Device.isDischarging() == false){
      const CdeviceStatsLine = stack.addText(`Chargeing  Now`);
     deviceStatsLine.textColor = new Color(COLORS.deviceS);
     CdeviceStatsLine.textColor = new Color(COLORS.deviceS);
     CdeviceStatsLine.textOpacity = 0.7;
     CdeviceStatsLine.font = new Font(FONT_NAME, 7);
   } else {
    deviceStatsLine.textColor = new Color(COLORS.deviceST);
   }
  if (DEV_MODE){
    const versionfLine = stack.addSpacer(1)
    const versionLine = stack.addText(`--v beta1.0 of T1 DEV.OPEN (101T1303b)`);
    versionLine.textColor = Color.white();
    versionLine.textOpacity = 0.5;
    versionLine.font = new Font(FONT_NAME, 8);
    versionLine.rightAlignText();
    nextPersonalCalendarEventLine.textColor = new Color(COLORS.personalCal);
  nextPersonalCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
  }
  return widget;
}

refreshAfterDate:'';


Script.setWidget(widget);
Script.complete();
/////////////////->



// --------------------------------------------------
// ^^Set widget^^
// --------------------------------------------------
/*
Update log

1.0
New algorithm of T1


*/
