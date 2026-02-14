# Wedding RSVP Site - Multi-Sheet Google Sheets Setup Instructions

## 🎉 Congratulations on your wedding!

This guide will help you connect your RSVP site to Google Sheets. RSVPs will be organized into **3 separate sheets** - one for each event:
- **Mehndi/Henna Attendance**
- **Nikkah/Shadi Attendance**  
- **Walima/Reception Attendance**

---

## Part 1: Create Your Google Sheet with 3 Tabs

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create a new spreadsheet** and name it "Wedding RSVPs"

### Create 3 Sheets (Tabs):

#### Sheet 1: "Mehndi Attendance"
1. Rename "Sheet1" to **"Mehndi Attendance"**
2. Add these column headers in Row 1:

```
Timestamp	Name	Email	Phone	Total Guests	Invite Type	Invite ID	Attending	Dietary Restrictions	Message
```

#### Sheet 2: "Nikkah Attendance"
1. Click the **+** button at bottom left to add a new sheet
2. Name it **"Nikkah Attendance"**
3. Add the same column headers:

```
Timestamp	Name	Email	Phone	Total Guests	Invite Type	Invite ID	Attending	Dietary Restrictions	Message
```

#### Sheet 3: "Walima Attendance"
1. Click the **+** button to add another sheet
2. Name it **"Walima Attendance"**
3. Add the same column headers:

```
Timestamp	Name	Email	Phone	Total Guests	Invite Type	Invite ID	Attending	Dietary Restrictions	Message
```

---

## Part 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. **Delete** any code in the editor
3. **Copy and paste** this entire script:

```javascript
function doPost(e) {
  try {
    // Parse incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Prepare common data for all sheets
    var timestamp = data.timestamp || new Date();
    var name = data.name || '';
    var email = data.email || '';
    var phone = data.phone || '';
    var inviteType = data.inviteType || '';
    var inviteId = data.inviteId || '';
    var dietary = data.dietary || '';
    var message = data.message || '';
    
    // Get attendance responses and guest counts
    var mehndiAttendance = data.mehndiAttendance || '';
    var mehndiGuestCount = data.mehndiGuestCount || 0;
    var shadiAttendance = data.shadiAttendance || '';
    var shadiGuestCount = data.shadiGuestCount || 0;
    var walimaAttendance = data.walimaAttendance || '';
    var walimaGuestCount = data.walimaGuestCount || 0;
    
    // Add to Mehndi Attendance sheet if they were invited and responded
    if (mehndiAttendance && mehndiAttendance !== 'N/A') {
      var mehndiSheet = spreadsheet.getSheetByName('Mehndi Attendance');
      if (mehndiSheet) {
        mehndiSheet.appendRow([
          timestamp,
          name,
          email,
          phone,
          mehndiGuestCount,
          inviteType,
          inviteId,
          mehndiAttendance,
          dietary,
          message
        ]);
      }
    }
    
    // Add to Nikkah Attendance sheet if they were invited and responded
    if (shadiAttendance && shadiAttendance !== 'N/A') {
      var nikkahSheet = spreadsheet.getSheetByName('Nikkah Attendance');
      if (nikkahSheet) {
        nikkahSheet.appendRow([
          timestamp,
          name,
          email,
          phone,
          shadiGuestCount,
          inviteType,
          inviteId,
          shadiAttendance,
          dietary,
          message
        ]);
      }
    }
    
    // Add to Walima Attendance sheet if they were invited and responded
    if (walimaAttendance && walimaAttendance !== 'N/A') {
      var walimaSheet = spreadsheet.getSheetByName('Walima Attendance');
      if (walimaSheet) {
        walimaSheet.appendRow([
          timestamp,
          name,
          email,
          phone,
          walimaGuestCount,
          inviteType,
          inviteId,
          walimaAttendance,
          dietary,
          message
        ]);
      }
    }
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'RSVP recorded successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Wedding RSVP System is running!");
}
```

4. **Save** the script (click the disk icon or Ctrl+S)
5. **Name your project**: "Wedding RSVP Multi-Sheet Handler"

---

## Part 3: Deploy as Web App

1. Click the **Deploy** button (top right) → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type" → Choose **Web app**
3. Fill in the settings:
   - **Description**: "Wedding RSVP v1"
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Review permissions**: 
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" 
   - Click "Go to Wedding RSVP Multi-Sheet Handler (unsafe)"
   - Click "Allow"
6. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXX/exec
   ```
   **SAVE THIS URL - YOU'LL NEED IT!**

---

## Part 4: Connect to Your Website

1. **Open your `wedding-site-final.html` file** in a text editor
2. **Find this line** (around line 691):
   ```javascript
   GOOGLE_SHEETS_WEB_APP_URL: 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE',
   ```
3. **Replace** with your actual URL:
   ```javascript
   GOOGLE_SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/XXXXXXXXXXXX/exec',
   ```
4. **Save the file**

---

## Part 5: Update Venue Maps & Registry Links

### For Your Wedding Venue:
1. Go to **Google Maps**
2. Search for your **venue address**
3. Click **Share** → **Embed a map**
4. Copy the **iframe code**
5. In your HTML file, find the venue iframe (search for "Wedding Venue")
6. Replace the `src="..."` with your venue's embed URL

### For Nearby Hotels:
1. In Google Maps, search: **"hotels near [YOUR VENUE ADDRESS]"**
2. Click **Share** → **Embed a map**
3. Replace the hotels iframe `src="..."`

### Update Registry Links:
Find these lines in the HTML (search for "Target" and "Bloomingdale's"):
```html
<a href="https://www.target.com" target="_blank">View Registry</a>
<a href="https://www.bloomingdales.com" target="_blank">View Registry</a>
```
Replace with your actual registry URLs.

---

## Part 6: Customize Names

Find and replace in the HTML:
- **Landing page**: Search for `<h1>X & Y</h1>` (around line 253)
- **Navigation**: Search for `YAB & AM` (around line 269)
- **Hero section**: Search for `AM REEE` and `YAB OI` (around lines 287-289)

---

## Part 7: Create Unique Invite Links

### Link Format:
```
https://yourwebsite.com/wedding-site-final.html?type=TYPE&max=NUMBER&id=UNIQUE_ID
```

### Parameters:
- `type`: **all** (all 3 events), **mehndi-walima** (Mehndi + Walima only), or **walima** (Walima only)
- `max`: Maximum total guests allowed
- `id`: Unique identifier for tracking

### Example Links:

**All Events - Smith Family (up to 5 people):**
```
https://yoursite.com/wedding-site-final.html?type=all&max=5&id=smith-family
```

**Mehndi + Walima - Jones Family (up to 4 people):**
```
https://yoursite.com/wedding-site-final.html?type=mehndi-walima&max=4&id=jones-family
```

**Nikkah + Walima - Brown Family (up to 4 people):**
```
https://yoursite.com/wedding-site-final.html?type=nikkah-walima&max=4&id=brown-family
```

**Walima Only - John Doe (up to 2 people):**
```
https://yoursite.com/wedding-site-final.html?type=walima&max=2&id=john-doe
```

### Create a Links Management Spreadsheet:

| Guest Name | Email | Invite Type | Max Guests | Unique ID | Full URL |
|------------|-------|-------------|------------|-----------|----------|
| Smith Family | smith@email.com | all | 5 | smith-family | =CONCATENATE("https://yoursite.com/wedding-site-final.html?type=",C2,"&max=",D2,"&id=",E2) |
| Jones Family | jones@email.com | mehndi-walima | 4 | jones-family | =CONCATENATE("https://yoursite.com/wedding-site-final.html?type=",C3,"&max=",D3,"&id=",E3) |
| Brown Family | brown@email.com | nikkah-walima | 4 | brown-family | =CONCATENATE("https://yoursite.com/wedding-site-final.html?type=",C4,"&max=",D4,"&id=",E4) |
| John Doe | john@email.com | walima | 2 | john-doe | =CONCATENATE("https://yoursite.com/wedding-site-final.html?type=",C5,"&max=",D5,"&id=",E5) |

---

## Part 8: Host Your Website

### Option A: GitHub Pages (FREE & RECOMMENDED)
1. Create account: https://github.com
2. Create repository: "wedding-rsvp"
3. Upload your HTML file
4. Settings → Pages → Deploy
5. Your URL: `https://yourusername.github.io/wedding-rsvp/wedding-site-final.html`

### Option B: Netlify (FREE)
1. Go to https://www.netlify.com
2. Drag-drop your HTML file
3. Get instant live URL

---

## Part 9: Test Everything!

### Testing Checklist:
- [ ] Create test invite links for each type (all, mehndi-walima, walima)
- [ ] Submit test RSVPs for each invite type
- [ ] Verify data appears in correct sheets:
  - **All events**: Data in all 3 sheets
  - **Mehndi-walima**: Data in Mehndi & Walima sheets only
  - **Walima only**: Data in Walima sheet only
- [ ] Check "Attending" column shows "Yes" or "No"
- [ ] Test with different guest numbers
- [ ] Test on mobile and desktop
- [ ] Verify maps show correct locations
- [ ] Test registry links

---

## 📊 How the Multi-Sheet System Works

### Example Scenarios:

**Guest invited to ALL events submits RSVP:**
- Says "Yes" to Mehndi with 5 guests → Added to **Mehndi Attendance** sheet with 5 guests
- Says "No" to Nikkah → Added to **Nikkah Attendance** sheet (with "No" and 0 guests)
- Says "Yes" to Walima with 3 guests → Added to **Walima Attendance** sheet with 3 guests

**Guest invited to Mehndi + Walima submits RSVP:**
- Says "Yes" to Mehndi with 4 guests → Added to **Mehndi Attendance** sheet with 4 guests
- Nikkah: N/A (not added to Nikkah sheet)
- Says "Yes" to Walima with 2 guests → Added to **Walima Attendance** sheet with 2 guests

**Guest invited to Nikkah + Walima submits RSVP:**
- Mehndi: N/A (not added to Mehndi sheet)
- Says "Yes" to Nikkah with 4 guests → Added to **Nikkah Attendance** sheet with 4 guests
- Says "Yes" to Walima with 4 guests → Added to **Walima Attendance** sheet with 4 guests

**Guest invited to Walima only submits RSVP:**
- Mehndi: N/A (not added)
- Nikkah: N/A (not added)
- Says "Yes" to Walima with 3 guests (including themselves) → Added to **Walima Attendance** sheet with 3 guests

---

## 📈 Managing Your RSVPs

### Quick Headcount Formulas:

**In any empty cell on each sheet:**

**Total confirmed guests for Mehndi:**
```
=COUNTIF(H:H,"Yes")
```

**Total people coming to Mehndi (including +guests):**
```
=SUMIF(H:H,"Yes",E:E)
```

**Total declined for Nikkah:**
```
=COUNTIF(H:H,"No")
```

### Filter by Invite Type:
Click **Data** → **Create a filter** to easily sort by:
- Invite Type (all, mehndi-walima, walima)
- Attending (Yes/No)
- Total Guests

---

## 🆘 Troubleshooting

### RSVPs Not Appearing?
1. Check Web App URL is correct in HTML
2. Verify sheet names exactly match: "Mehndi Attendance", "Nikkah Attendance", "Walima Attendance"
3. Check Apps Script permissions are set to "Anyone"
4. Test the Web App URL directly in browser

### Data Going to Wrong Sheet?
1. Verify sheet names in Apps Script match your actual sheet names
2. Check console logs (F12 in browser) for errors
3. Make sure column headers are in Row 1

### Guest Limit Not Working?
1. Check URL has all parameters: `?type=X&max=Y&id=Z`
2. Verify `max` is a number, not text

---

## 💝 Final Checklist Before Going Live

- [ ] 3 sheets created with correct names and headers
- [ ] Apps Script deployed with correct permissions
- [ ] Website has Google Sheets URL configured
- [ ] Names updated throughout site
- [ ] Registry links updated
- [ ] Venue maps updated
- [ ] Test RSVPs submitted for all 3 invite types
- [ ] Data appearing in correct sheets
- [ ] Website hosted and accessible
- [ ] Invite links spreadsheet created
- [ ] Test on mobile devices

---

## 🎊 You're All Set!

Your multi-sheet RSVP system is ready! Each event will have its own organized list of attendees, making it easy to:
- Get accurate headcounts for each event
- Track dietary restrictions per event
- See who's attending what
- Export lists for vendors/caterers

**Wishing you a beautiful wedding celebration! 💕**
