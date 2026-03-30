



// Configuration
const CONFIG = {
    GOOGLE_SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzuqERmHwsYILDDRNPmIUzZAHV9jygurGMEr9jHeT0YPwKEGT_eVzAuhhADW751FdsZiw/exec',
    DEFAULT_MAX_GUESTS: {
        'mehndi': 2,
        'nikkah': 3,
        'walima': 5
    }
};

// Pop-up functions
function showPopup() {
    document.getElementById('thankYouPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('thankYouPopup').style.display = 'none';
}

// ==================== TRAVEL SECTION EVENT VISIBILITY ====================
document.addEventListener('DOMContentLoaded', function() {
    video.load();
    
    generateSchedule();
    generateForm();

    const travelSection = document.getElementById('travel');
    if (travelSection) {
        const invited = {
            mehndi: inviteType === 'all' || inviteType.includes('mehendi'),
            nikkah: inviteType === 'all' || inviteType.includes('nikkah'),
            walima: inviteType === 'all' || inviteType.includes('walima'),
        };

        const keywordMap = {
            'mehendi': 'mehndi',
            'mehndi':  'mehndi',
            'nikkah':  'nikkah',
            'walima':  'walima',
        };

        travelSection.querySelectorAll('h3.section-title').forEach(h3 => {
            const text = h3.textContent.trim().toLowerCase();
            const matchedKey = Object.keys(keywordMap).find(k => text.includes(k));
            if (!matchedKey) return;

            const eventKey = keywordMap[matchedKey];
            if (!invited[eventKey]) {
                const sectionDiv = h3.closest('.section');
                if (!sectionDiv) return;
                sectionDiv.style.display = 'none';

                const next = sectionDiv.nextElementSibling;
                if (next && next.classList.contains('floral-divider')) {
                    next.style.display = 'none';
                }
            }
        });
    }
});


// ==================== VIDEO LANDING PAGE ====================
const video = document.getElementById('curtainVideo');
const landingPage = document.getElementById('landingPage');
const landingContent = document.getElementById('landingContent');
const mainSite = document.getElementById('mainSite');

let videoHasPlayed = false;
let currentSlide = 0;
let slideshowInterval = null;

function playFullVideo() {
    if (videoHasPlayed) return;
    videoHasPlayed = true;
    
    const whiteOverlay = document.querySelector('.white-overlay');
    
    if (!video || !whiteOverlay || !landingPage || !mainSite) {
        console.error('Required elements not found');
        return;
    }
    
    if (landingContent) {
        landingContent.style.opacity = '0';
    }
    
    video.currentTime = 0;
    video.play().catch(error => {
        console.log('Video play error:', error);
        startTransition();
    });
    
    video.addEventListener('ended', startTransition, { once: true });
    
    setTimeout(() => {
        if (!landingPage.classList.contains('hidden')) {
            console.log('Backup timeout triggered');
            startTransition();
        }
    }, 15000);
    
    function startTransition() {
        video.removeEventListener('ended', startTransition);
        whiteOverlay.classList.add('active');
        
        setTimeout(() => {
            landingPage.classList.add('hidden');
            mainSite.classList.add('visible');
            setTimeout(initSlideshow, 100);
            setTimeout(() => {
                whiteOverlay.classList.remove('active');
            }, 300);
        }, 600);
    }
}

function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, 3000);
}

function transitionToMainSite() {
    landingPage.classList.add('hidden');
    setTimeout(() => {
        mainSite.classList.add('visible');
        setTimeout(initSlideshow, 100);
    }, 500);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    video.load();
    
    const popup = document.getElementById('thankYouPopup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) closePopup();
        });
    }
    
    generateSchedule();
    generateForm();

    const editForm = document.getElementById('editRsvpForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = editForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'UPDATING...';

            try {
                const formData = new FormData(editForm);
                const data = {
                    action: 'update',
                    isUpdate: true,
                    inviteId: inviteId,
                    inviteType: inviteType,
                    maxGuestsPerEvent: JSON.stringify(maxGuestsPerEvent),
                    timestamp: new Date().toISOString(),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message'),
                    mehndiAttendance: formData.get('mehndiAttendance') || 'N/A',
                    mehndiGuestCount: formData.get('mehndiGuestCount') || 0,
                    shaadiAttendance: formData.get('shaadiAttendance') || 'N/A',
                    shaadiGuestCount: formData.get('shaadiGuestCount') || 0,
                    walimaAttendance: formData.get('walimaAttendance') || 'N/A',
                    walimaGuestCount: formData.get('walimaGuestCount') || 0
                };

                await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                document.getElementById('editRsvpFound').style.display = 'none';
                document.getElementById('editErrorMessage').style.display = 'none';
                document.getElementById('editSuccessMessage').style.display = 'block';

                setTimeout(() => switchRsvpTab('new'), 3000);

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('editErrorMessage').textContent = 'There was an error updating your RSVP. Please try again.';
                document.getElementById('editErrorMessage').style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});

// ==================== HAMBURGER MENU ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== URL PARAMETERS ====================
const urlParams = new URLSearchParams(window.location.search);
const inviteType = urlParams.get('type') || 'all';
const inviteId = urlParams.get('id') || 'default';

const maxGuestsPerEvent = {
    mehndi: parseInt(urlParams.get('mehndi')) || CONFIG.DEFAULT_MAX_GUESTS.mehndi,
    nikkah: parseInt(urlParams.get('nikkah')) || CONFIG.DEFAULT_MAX_GUESTS.nikkah,
    walima: parseInt(urlParams.get('walima')) || CONFIG.DEFAULT_MAX_GUESTS.walima
};

// ==================== RSVP TAB SWITCHING ====================
function switchRsvpTab(tab) {
    document.querySelectorAll('.rsvp-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.rsvp-tab-content').forEach(content => content.classList.remove('active'));

    if (tab === 'new') {
        document.querySelector('.rsvp-tab-btn:first-child').classList.add('active');
        document.getElementById('newRsvpTab').classList.add('active');
    } else {
        document.querySelector('.rsvp-tab-btn:last-child').classList.add('active');
        document.getElementById('editRsvpTab').classList.add('active');
    }

    if (tab === 'edit') {
        document.getElementById('editRsvpFound').style.display = 'none';
        document.getElementById('noRsvpFound').style.display = 'none';
        document.getElementById('editSuccessMessage').style.display = 'none';
        document.getElementById('editErrorMessage').style.display = 'none';
        document.getElementById('editLookupSection').style.display = 'block';
        document.getElementById('lookupEmail').value = '';
    }
}

// ==================== SCHEDULE GENERATION ====================
const EVENT_TEMPLATES = {
    mehndi: `
        <div class="event-card">
            <h3>Mehendi / Henna</h3>
            <p class="event-date">Wednesday, July 22, 2026</p>
            <p class="event-time">6:00 PM - 11:00 PM</p>
            <p class="event-description">Join us for an evening of henna, music, and celebration as we kick off the wedding festivities.</p>
        </div>`,
    nikkah: `
        <div class="event-card">
            <h3>Nikkah / shaadi</h3>
            <p class="event-date">Friday, July 24, 2026</p>
            <p class="event-time">6:00 PM - 11:00 PM</p>
            <p class="event-description">The wedding ceremony where two families become one. Traditional attire encouraged.</p>
        </div>`,
    walima: `
        <div class="event-card">
            <h3>Walima / Reception</h3>
            <p class="event-date">Sunday, July 26, 2026</p>
            <p class="event-time">6:00 PM - 11:00 PM</p>
            <p class="event-description">Join us for a grand celebration with dinner, dancing, and joy as we begin our journey together.</p>
        </div>`
};

function getEventsForInviteType(type) {
    const eventMap = {
        'mehndi': ['mehndi'],
        'nikkah': ['nikkah'],
        'walima': ['walima'],
        'mehndi-nikkah': ['mehndi', 'nikkah'],
        'mehndi-walima': ['mehndi', 'walima'],
        'nikkah-walima': ['nikkah', 'walima'],
        'all': ['mehndi', 'nikkah', 'walima']
    };
    return eventMap[type] || eventMap['all'];
}

function generateSchedule() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const events = getEventsForInviteType(inviteType);
    scheduleGrid.innerHTML = events.map(e => EVENT_TEMPLATES[e]).join('');
}

// ==================== FORM GENERATION ====================
function generateForm() {
    const formContent = document.getElementById('dynamicFormContent');
    formContent.innerHTML = buildCommonFields() + buildAttendanceFields() + buildAdditionalFields();
}

function buildCommonFields(rsvpData) {
    const name = rsvpData ? escapeHtml(rsvpData.name || '') : '';
    const email = rsvpData ? escapeHtml(rsvpData.email || '') : '';
    const phone = rsvpData ? escapeHtml(rsvpData.phone || '') : '';
    const emailReadonly = rsvpData ? 'readonly style="background: #f5f5f5; cursor: not-allowed;"' : '';

    return `
        <div class="form-group">
            <label>Your Full Name *</label>
            <input type="text" name="name" value="${name}" required placeholder="Enter your name">
        </div>
        <div class="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value="${email}" ${emailReadonly} required placeholder="your@email.com">
        </div>
        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value="${phone}" placeholder="(123) 456-7890">
        </div>
    `;
}

function buildAttendanceFields(rsvpData) {
    // Single-event invite types all use the unified stepper block
    const singleEventMap = {
        'mehndi': ['mehndi', 'Mehendi / Henna Night', 'mehndi'],
        'nikkah': ['shaadi', 'Nikkah / shaadi', 'nikkah'],
        'walima': ['walima', 'Walima / Reception', 'walima'],
    };

    if (singleEventMap[inviteType]) {
        const [key, label, maxKey] = singleEventMap[inviteType];
        return buildEventBlock(key, label, maxGuestsPerEvent[maxKey], rsvpData);
    }

    const eventConfig = {
        'mehndi-nikkah': [
            ['mehndi', 'Mehendi / Henna Night', maxGuestsPerEvent.mehndi],
            ['shaadi', 'Nikkah / shaadi', maxGuestsPerEvent.nikkah]
        ],
        'mehndi-walima': [
            ['mehndi', 'Mehendi / Henna Night', maxGuestsPerEvent.mehndi],
            ['walima', 'Walima / Reception', maxGuestsPerEvent.walima]
        ],
        'nikkah-walima': [
            ['shaadi', 'Nikkah / shaadi', maxGuestsPerEvent.nikkah],
            ['walima', 'Walima / Reception', maxGuestsPerEvent.walima]
        ],
        'all': [
            ['mehndi', 'Mehendi / Henna Night', maxGuestsPerEvent.mehndi],
            ['shaadi', 'Nikkah / shaadi', maxGuestsPerEvent.nikkah],
            ['walima', 'Walima / Reception', maxGuestsPerEvent.walima]
        ]
    };

    const events = eventConfig[inviteType] || eventConfig['all'];
    return events.map(([key, label, max]) => buildEventBlock(key, label, max, rsvpData)).join('');
}

function buildEventBlock(eventKey, eventLabel, maxGuestsForEvent, rsvpData) {
    const attendanceName = eventKey === 'shaadi' ? 'shaadiAttendance' : `${eventKey}Attendance`;
    const guestCountName = eventKey === 'shaadi' ? 'shaadiGuestCount' : `${eventKey}GuestCount`;

    const attendanceValue = rsvpData ? (rsvpData[attendanceName] || '') : '';
    // If previously declined store 0; if accepted use saved count; if new form default to 1
    const guestCountValue = rsvpData
        ? (attendanceValue === 'No' ? 0 : Math.max(1, parseInt(rsvpData[guestCountName] || 1)))
        : 1;
    const showGuestCount = attendanceValue === 'Yes';

    return `
        <div style="background: #fff5f7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #d4a574;">
            <h4 style="color: #8b7355; margin-bottom: 15px; font-size: 18px;">${eventLabel}</h4>

            <div class="form-group">
                <label>Will you be attending ${eventLabel.split('/')[0].trim()}? *</label>
                <select name="${attendanceName}" required onchange="toggleGuestCount(this)" onclick="toggleGuestCount(this)">
                    <option value="">Please select</option>
                    <option value="Yes" ${attendanceValue === 'Yes' ? 'selected' : ''}>Accept</option>
                    <option value="No" ${attendanceValue === 'No' ? 'selected' : ''}>Decline</option>
                </select>
            </div>

            <div class="form-group event-guest-block" style="display: ${showGuestCount ? 'block' : 'none'};">
                <label>Number of guests attending (including yourself)</label>
                <p class="guest-limit-info" style="margin-bottom: 10px;">Maximum: ${maxGuestsForEvent} guests</p>
                <div class="stepper-container">
                    <button type="button" class="stepper-btn stepper-minus" data-max="${maxGuestsForEvent}">&#8722;</button>
                    <span class="stepper-value">${showGuestCount ? guestCountValue : 1}</span>
                    <button type="button" class="stepper-btn stepper-plus" data-max="${maxGuestsForEvent}">+</button>
                </div>
                <input type="hidden" name="${guestCountName}" value="${showGuestCount ? guestCountValue : 1}">
            </div>
        </div>
    `;
}

// ==================== STEPPER — iOS Safari safe event delegation ====================
// Uses touchstart + mousedown on document to catch taps on dynamically built buttons.
// onclick attributes are unreliable in iOS Safari inside forms.
function handleStepperTap(e) {
    // Accept both touch and mouse events
    const btn = e.target.closest('.stepper-btn');
    if (!btn) return;

    // Prevent mousedown firing after touchstart on iOS (double-fire)
    if (e.type === 'touchstart') {
        btn._touchFired = true;
    } else if (e.type === 'mousedown') {
        if (btn._touchFired) { btn._touchFired = false; return; }
    }

    e.preventDefault();

    const container  = btn.closest('.stepper-container');
    if (!container) return;

    const display    = container.querySelector('.stepper-value');
    const guestBlock = container.closest('.event-guest-block');
    const hiddenInput = guestBlock ? guestBlock.querySelector('input[type="hidden"]') : null;

    if (!display || !hiddenInput) return;

    const max     = parseInt(btn.dataset.max) || 10;
    const delta   = btn.classList.contains('stepper-plus') ? 1 : -1;
    const current = parseInt(display.textContent) || 1;
    const next    = Math.max(1, Math.min(max, current + delta));

    display.textContent = next;
    hiddenInput.value   = next;
}

document.addEventListener('touchstart', handleStepperTap, { passive: false });
document.addEventListener('mousedown',  handleStepperTap);

function buildAdditionalFields(rsvpData) {
    const message = rsvpData ? escapeHtml(rsvpData.message || '') : '';
    return `
        <div class="form-group">
            <label>Special Message for the Couple</label>
            <textarea name="message" rows="3" placeholder="Share your well wishes...">${message}</textarea>
        </div>
    `;
}

function generateGuestOptions(max) {
    let options = '<option value="0">Just me</option>';
    for (let i = 1; i < max; i++) {
        options += `<option value="${i}">+${i} guest${i > 1 ? 's' : ''}</option>`;
    }
    return options;
}

function generateGuestCountOptions(max) {
    let options = '';
    for (let i = 1; i <= max; i++) {
        options += `<option value="${i}">${i} ${i === 1 ? 'guest' : 'guests'}</option>`;
    }
    return options;
}

function generateGuestOptionsWithSelected(max, selectedValue) {
    let options = `<option value="0" ${selectedValue === 0 ? 'selected' : ''}>Just me</option>`;
    for (let i = 1; i < max; i++) {
        options += `<option value="${i}" ${selectedValue === i ? 'selected' : ''}>+${i} guest${i > 1 ? 's' : ''}</option>`;
    }
    return options;
}

function generateGuestCountOptionsWithSelected(max, selectedValue) {
    let options = '';
    for (let i = 1; i <= max; i++) {
        options += `<option value="${i}" ${parseInt(selectedValue) === i ? 'selected' : ''}>${i} ${i === 1 ? 'guest' : 'guests'}</option>`;
    }
    return options;
}

// toggleGuestCount — called with the <select> element directly (no ID lookup)
// Uses both onchange and onclick to handle iOS Safari's delayed onchange firing
function toggleGuestCount(selectEl) {
    // Small delay ensures iOS has committed the new value before we read it
    setTimeout(() => {
        const eventBlock  = selectEl.closest('div[style*="background: #fff5f7"]');
        if (!eventBlock) return;

        const guestBlock  = eventBlock.querySelector('.event-guest-block');
        const hiddenInput = eventBlock.querySelector('input[type="hidden"]');
        const display     = eventBlock.querySelector('.stepper-value');

        if (selectEl.value === 'Yes') {
            const currentVal = parseInt(hiddenInput ? hiddenInput.value : 0) || 1;
            const restored   = Math.max(1, currentVal);
            if (display)     display.textContent = restored;
            if (hiddenInput) hiddenInput.value   = restored;
            if (guestBlock)  guestBlock.style.display = 'block';
        } else if (selectEl.value === 'No') {
            if (display)     display.textContent = 0;
            if (hiddenInput) hiddenInput.value   = 0;
            if (guestBlock)  guestBlock.style.display = 'none';
        }
    }, 0);
}

// ==================== FORM SUBMISSION ====================
function collectFormData(formElement) {
    const formData = new FormData(formElement);
    return {
        inviteId: inviteId,
        inviteType: inviteType,
        maxGuestsPerEvent: JSON.stringify(maxGuestsPerEvent),
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        mehndiAttendance: formData.get('mehndiAttendance') || 'N/A',
        mehndiGuestCount: formData.get('mehndiGuestCount') || 0,
        shaadiAttendance: formData.get('shaadiAttendance') || 'N/A',
        shaadiGuestCount: formData.get('shaadiGuestCount') || 0,
        walimaAttendance: formData.get('walimaAttendance') || 'N/A',
        walimaGuestCount: formData.get('walimaGuestCount') || 0
    };
}

const form = document.getElementById('rsvpForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'SUBMITTING...';

    try {
        const data = collectFormData(form);

        await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showPopup();
        errorMessage.style.display = 'none';
        form.reset();
        generateForm();

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'SUBMIT RSVP';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'There was an error submitting your RSVP. Please try again or contact us directly.';
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'SUBMIT RSVP';
    }
});

// ==================== EDIT RSVP FUNCTIONALITY ====================
async function lookupRsvp() {
    const email = document.getElementById('lookupEmail').value.trim();
    const lookupBtn = document.getElementById('lookupBtn');
    const noRsvpFound = document.getElementById('noRsvpFound');
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    noRsvpFound.style.display = 'none';
    lookupBtn.disabled = true;
    lookupBtn.textContent = 'SEARCHING...';

    try {
        const response = await fetch(`${CONFIG.GOOGLE_SHEETS_WEB_APP_URL}?action=lookup&email=${encodeURIComponent(email)}`, {
            method: 'GET'
        });
        
        const data = await response.json();

        if (data.found && data.rsvp) {
            document.getElementById('editLookupSection').style.display = 'none';
            document.getElementById('noRsvpFound').style.display = 'none';
            document.getElementById('editRsvpFound').style.display = 'block';
            displayPreviousRsvpSummary(data.rsvp);
            populateEditForm(data.rsvp);
        } else {
            noRsvpFound.style.display = 'block';
        }
    } catch (error) {
        console.error('Lookup error:', error);
        alert('Error looking up RSVP. Please try again or submit a new RSVP.');
    } finally {
        lookupBtn.disabled = false;
        lookupBtn.textContent = 'Find RSVP';
    }
}

function displayPreviousRsvpSummary(rsvpData) {
    const summaryDiv = document.getElementById('previousRsvpSummary');
    let summaryHTML = '<h3>Your Current RSVP</h3><div class="rsvp-summary-grid">';
    summaryHTML += `<p><strong>Name:</strong> ${rsvpData.name}</p>`;
    summaryHTML += `<p><strong>Email:</strong> ${rsvpData.email}</p>`;
    if (rsvpData.phone) summaryHTML += `<p><strong>Phone:</strong> ${rsvpData.phone}</p>`;

    const eventSummaries = [
        { key: 'mehndiAttendance', guestKey: 'mehndiGuestCount', label: 'Mehndi' },
        { key: 'shaadiAttendance', guestKey: 'shaadiGuestCount', label: 'Nikkah/shaadi' },
        { key: 'walimaAttendance', guestKey: 'walimaGuestCount', label: 'Walima' }
    ];
    
    eventSummaries.forEach(({ key, guestKey, label }) => {
        if (rsvpData[key] && rsvpData[key] !== 'N/A') {
            summaryHTML += `<p><strong>${label}:</strong> ${rsvpData[key]}`;
            if (rsvpData[key] === 'Yes' && rsvpData[guestKey]) {
                summaryHTML += ` (${rsvpData[guestKey]} guests)`;
            }
            summaryHTML += `</p>`;
        }
    });
    
    if (rsvpData.message) summaryHTML += `<p><strong>Message:</strong> ${rsvpData.message}</p>`;
    summaryHTML += '</div>';
    summaryDiv.innerHTML = summaryHTML;
}

function populateEditForm(rsvpData) {
    const formContent = document.getElementById('editDynamicFormContent');
    formContent.innerHTML = buildCommonFields(rsvpData) + buildAttendanceFields(rsvpData) + buildAdditionalFields(rsvpData);
    
    // After DOM is built, trigger toggleGuestCount on each select so stepper
    // visibility matches the pre-filled acceptance values
    setTimeout(() => {
        formContent.querySelectorAll('select[name$="Attendance"]').forEach(sel => {
            toggleGuestCount(sel);
        });
    }, 50);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('Wedding Site Loaded');
console.log('Invite Type:', inviteType);
console.log('Max Guests Per Event:', maxGuestsPerEvent);
console.log('Invite ID:', inviteId);
