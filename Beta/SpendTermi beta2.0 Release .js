// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: greater-than-equal;
// version beta 2.0 (102T1415c)
// New algorithm of T2
// - Change Calendar system
//
// Github https://github.com/spendtopic/SpendTermi-of-Scriptable
// SpendTopic https://t.me/Topicst

// '': PLEASE SET THESE VALUES
const DEVICE_NAME = '';
const PERSONAL_CALENDAR_NAME = '';
const WORK_CALENDAR_NAME = '';
const ALLWAYS_DISPLAY_CALENDAR = true;
const DISPLAY_COUNTDOWN = false; // true or false
const COUNTDOWN_UDAYS = ''; // This is the countdown date. Please use the ISO8601 format: yyyy-mm-dd. Like this [2023-10-13]
const COUNTDOWN_NAME = ''; 
const COUNTDOWN_DATE_CHANGE_COLOR = 3; // -1 to off
const COUNTDOWN_DATE = false; // true or false (COUNTDOWN_UDAYS required)

// --------------------------------------------------
//         Below is the main algorithm of T2
// 
// 
//                     --*T2*--
// 
//         Countdown,Calendar,DeviceStatus
// 
//    T2 code has the copyright, please indicate the 
//              source when reprinting
// --------------------------------------------------

// Font name
const BFONT_NAME = 'GillSans-Bold';
const FONT_NAME = 'GillSans-Light';

// Colors
const COLORS = {
  bg0: '#29323c',
  bg1: '#1c1c1c',
  personalCal: '#5BD2F0',
  workCal: '#9D90FF',
  countdown: '#FDFD97',
  countdownD: '#FF6663',
  deviceS: '#7AE7B9',
  deviceC: '#E5BB7B',
};

// Input info
var NAME = Device.name();
var VER = Device.systemVersion();
var Dbattery = Math.round(Device.batteryLevel() * 100);
var Dbrightness = Math.round(Device.screenBrightness() * 100);

// Boolean()
var BPCN = new Boolean(PERSONAL_CALENDAR_NAME);
var BWCN = new Boolean(WORK_CALENDAR_NAME);
var TESTB = new Boolean(1)
// Adaptive font size
if (BPCN == true || BWCN == true || ALLWAYS_DISPLAY_CALENDAR) {
  var FONT_SIZE = 11;
  var SFONT_SIZE = 9;
} else if (COUNTDOWN_DATE) {
  var FONT_SIZE = 14;
  var SFONT_SIZE = 12;
} else {
  var FONT_SIZE = 16;
  var SFONT_SIZE = 14;
}

const DEV_MODE = false;

if (DEV_MODE) {
    console.log(`\nTest \n - Boolean ${TESTB}\nRequesed \n - Allways_display_calendar is ${ALLWAYS_DISPLAY_CALENDAR}, \n - Display_countdown is ${DISPLAY_COUNTDOWN}, \n - Countdown_date is ${COUNTDOWN_DATE}, \n - Dev_mode is ${DEV_MODE}.\nFont \n - Font size is ${FONT_SIZE}, \n - Small font size is ${SFONT_SIZE}.\nCalendar \n - Personal_calendar_have is ${BPCN}, \n - Work_calendar_have is ${BWCN}.\n`);
};

// Calendar
const data = await fetchData();
async function fetchData() {
  // Get next work/personal calendar events
  if (BPCN == true) {
    var nextPersonalEvent = await fetchNextCalendarEvent(PERSONAL_CALENDAR_NAME);
  } else {
    var nextPersonalEvent = null;
  }

  if (BWCN == true) {
    var nextWorkEvent = await fetchNextCalendarEvent(WORK_CALENDAR_NAME);
  } else {
    var nextWorkEvent = null;
  }

  return {
     nextWorkEvent,
     nextPersonalEvent,
   };
}

async function fetchNextCalendarEvent(calendarName) {
  const calendar = await Calendar.forEventsByTitle(calendarName);
  const events = await CalendarEvent.today([calendar]);
  const tomorrow = await CalendarEvent.tomorrow([calendar]);

  if (DEV_MODE){
    console.log(`Got ${events.length} events for ${calendarName}`);
    console.log(`Got ${tomorrow.length} events for ${calendarName} tomorrow`);
  }

  const upcomingEvents = events.concat(tomorrow).filter(e => (new Date(e.endDate)).getTime() >= (new Date()).getTime());

  return upcomingEvents ? upcomingEvents[0] : null;
}

function getCalendarEventTitle(calendarEvent, isWorkEvent) {
  if (!calendarEvent) {
    if (!ALLWAYS_DISPLAY_CALENDAR) {
      var Hcal = 1;
      return Hcal;
     }
    return `No upcoming ${isWorkEvent ? 'work ' : ''}events until tomorrow`;
  }
  
  const timeFormatter = new DateFormatter();
  timeFormatter.locale = 'en';
  timeFormatter.dateFormat = "MMM dd,yy-Q'q' H:mm" ;

  const eventTime = new Date(calendarEvent.startDate);

  return `Next >> [${timeFormatter.string(eventTime)}] ${calendarEvent.title}`;
}
     

// create widget
const widget = createWidget()
function createWidget(){
  if (DEV_MODE){
    let NAME = Script.name()
    console.log(`Widget(${NAME}) created`);
  }

  const widget = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color(COLORS.bg0), new Color(COLORS.bg1)];
  bgColor.locations = [0.0, 1.0];
  widget.backgroundGradient = bgColor;
  widget.setPadding(3, 0, 10, 0);

  const stack = widget.addStack();
  stack.layoutVertically();
  stack.spacing = 2;
  stack.size = new Size(340, 0);


  // Line 0 - Last Login
  const timeFormatter = new DateFormatter();
  timeFormatter.locale = "en";
  timeFormatter.useNoDateStyle();
  timeFormatter.dateFormat = "MMM HH:mm" ;

  const lastLoginLine = stack.addText(`Update time: ${timeFormatter.string(new Date())}`);
  lastLoginLine.textColor = Color.white();
  lastLoginLine.textOpacity = 0.7;
  lastLoginLine.font = new Font(FONT_NAME, FONT_SIZE);

  // Line 1 - Input
  const inputLine = stack.addText(`Device: ${NAME} ${DEVICE_NAME} ${VER}`);
  inputLine.textColor = Color.white();
  inputLine.font = new Font(FONT_NAME, FONT_SIZE);

  // Line 2 - Next Personal Calendar Event
  if (!ALLWAYS_DISPLAY_CALENDAR) {
    if (BPCN == true) {
      if (getCalendarEventTitle(data.nextPersonalEvent, false) == 1) {
        console.log('Personal Calendar: off');
      } else {
        const nextPersonalCalendarEventLine = stack.addText(`P   🗓 | ${getCalendarEventTitle(data.nextPersonalEvent, false)}`);
        nextPersonalCalendarEventLine.textColor = new Color(COLORS.personalCal);
        nextPersonalCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
        console.log(`Personal Calendar: on`);
      }
    }
  } else {
    const nextPersonalCalendarEventLine = stack.addText(`P   🗓 | ${getCalendarEventTitle(data.nextPersonalEvent, false)}`);
    nextPersonalCalendarEventLine.textColor = new Color(COLORS.personalCal);
    nextPersonalCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
    if (DEV_MODE) {
      console.log(`Personal Calendar: displaying`)
    }
  }

  // Line 3 - Next Work Calendar Event
  if (!ALLWAYS_DISPLAY_CALENDAR) {
    if (BWCN == true) {
      if (getCalendarEventTitle(data.nextWorkEvent, true) == 1) {
        if (DEV_MODE) {
          console.log(`Work Calendar: off`);
        } 
      } else {
        const nextWorkCalendarEventLine = stack.addText(`W 🗓 | ${getCalendarEventTitle(data.nextWorkEvent, true)}`);
        nextWorkCalendarEventLine.textColor = new Color(COLORS.workCal);
        nextWorkCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
        if (DEV_MODE) {
          console.log(`Work Calendar: on`);
        }
      }
    }
  } else {
    const nextWorkCalendarEventLine = stack.addText(`W 🗓 | ${getCalendarEventTitle(data.nextWorkEvent, true)}`);
    nextWorkCalendarEventLine.textColor = new Color(COLORS.workCal);
    nextWorkCalendarEventLine.font = new Font(FONT_NAME, FONT_SIZE);
    if (DEV_MODE) {
      console.log(`Work Calendar: displaying`)
    }
  }

  // Line 4 - Countdowne
  if (DISPLAY_COUNTDOWN) {
    FCU = COUNTDOWN_UDAYS.toString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(FCU.trim()) === false) {
      const countdownLine = stack.addText(`C  ⌛️ | No countdown set`);
      countdownLine.textColor = new Color(COLORS.weather);
      countdownLine.font = new Font(FONT_NAME, FONT_SIZE);
    } else {
    CUE = FCU.trim()

    function getCUER() {
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

    if (CUER > 1) {
      const countdownLine = stack.addText(`C  ⏳ | ${CUER} days until the ${COUNTDOWN_NAME}`);
      countdownLine.textColor = new Color(COLORS.countdown);
      countdownLine.font = new Font(FONT_NAME, FONT_SIZE);

    } else if (CUER < 0) {
      const countdownLine = stack.addText(`C  ⌛️ | No countdown set`);
      countdownLine.textColor = new Color(COLORS.countdown);
      countdownLine.font = new Font(FONT_NAME, FONT_SIZE);

    } else if (CUER == 0) {
      const countdownLine = stack.addText(`C  ⏳ | Today is ${COUNTDOWN_NAME}`);
      countdownLine.textColor = new Color(COLORS.countdown);
      countdownLine.font = new Font(FONT_NAME, FONT_SIZE);        

    } else if (CUER == 1) {
              const countdownLine = stack.addText(`C  ⏳ | Tomorrow is ${COUNTDOWN_NAME}`);
      countdownLine.textColor = new Color(COLORS.countdown);
      countdownLine.font = new Font(FONT_NAME, FONT_SIZE);    
    }
  }
}

  // Line 5 - Countdown date
  if (DISPLAY_COUNTDOWN && COUNTDOWN_DATE){
    if (/^\d{4}-\d{2}-\d{2}$/.test(FCU.trim()) === true){
    let CUER = getCUER().days + 1;
      if (CUER > 0) {
        if (CUER > COUNTDOWN_DATE_CHANGE_COLOR) {
        const countdowndLine = stack.addDate(new Date(COUNTDOWN_UDAYS))
        countdowndLine.textColor = new Color(COLORS.countdown);
        countdowndLine.textOpacity = 0.7;
        countdowndLine.font = new Font(BFONT_NAME, SFONT_SIZE);
        } else {
        const countdowndLine = stack.addDate(new Date(COUNTDOWN_UDAYS))
        countdowndLine.textColor = new Color(COLORS.countdownD);
        countdowndLine.textOpacity = 0.7;
        countdowndLine.font = new Font(FONT_NAME, SFONT_SIZE);
        if (DEV_MODE) {
          console.log(`Countdown date Changed color`);
          }
        }
      }
    }
  }

  // Line 6/7 - Various Device Stats
    const deviceStatsLine = stack.addText(`D  📊 | 🔋 ${Dbattery}%, ☀️ ${Dbrightness}%`);
    deviceStatsLine.font = new Font(FONT_NAME, FONT_SIZE);
    if (Device.isDischarging() !== true){
      const CdeviceStatsLine = stack.addText(`Chargeing  Now`); // Line 7
      deviceStatsLine.textColor = new Color(COLORS.deviceS);
      CdeviceStatsLine.textColor = new Color(COLORS.deviceS);
      CdeviceStatsLine.textOpacity = 0.7;
      CdeviceStatsLine.font = new Font(FONT_NAME, SFONT_SIZE);
      if (DEV_MODE) {
        console.log(`Chargeing Now`)
      }
   } else {
      deviceStatsLine.textColor = new Color(COLORS.deviceC);
   }
    

 
 // Line -0(Last Line) - Version
  if (DEV_MODE){
    const versionfLine = stack.addSpacer(3)
    const versionLine = stack.addText(`--v beta2.0 of T2 DEV.OPEN (102T1415c)`);
    versionLine.textColor = Color.white();
    versionLine.textOpacity = 0.5;
    versionLine.font = new Font(FONT_NAME, 6.5);
    versionLine.rightAlignText();
  }
  return widget;
}

// refreshAfterDate:'';


Script.setWidget(widget);
Script.complete();
/////////////////->




// --------------------------------------------------
// ^^Set widget^^
// --------------------------------------------------
/*
Update log
*2.0*
102T1415c
(2023-11-04)Release for public channel

*1.1*
101T1400b
(2022-10-26)Release for public channel

*2.0*
102T1415a
Update T1 to T2
- Add adaptive font size
- Add Countdown date color change
- Add log system
- Fix some Countdown system bug 
- Rebuild Calendar system
  - Adaptive Calendar on/off
  - Allways display calendar
    
*1.2*
101T1409c -Give up
Change Calendar system

101T1409b -Give up
Adaptive Calendar on/off

101T1409a -Give up
Adaptive Calendar on/off

*1.0*
101T1303d
(2022-10-19)Release for public channel

*1.1*
101T1400b
(2022-10-17)Release for inv group

101T1400a
Adaptive day/days conversion

*1.0*
101T1303c
(2022-10-14)Release for inv group

101T1303b
Countdown can be turned off

101T1303a
New algorithm of T1
- Add Countdown,Calendar,DeviceStatus system
*/