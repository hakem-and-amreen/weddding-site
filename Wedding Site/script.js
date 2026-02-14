// Configuration
const CONFIG = {
    GOOGLE_SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbx2iyILRmRXyiQX6ayxMcPX8tPPX5nyWG_AGj-Y5NYcSPABzB63pV-pEIZREFJdtMcC/exec',
    MAX_GUESTS: {
        'all-events-default': 5,
        'mehndi-walima-default': 4,
        'nikkah-walima-default': 4,
        'walima-only-default': 3
    }
};

// Pop-up functions
function showPopup() {
    document.getElementById('thankYouPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('thankYouPopup').style.display = 'none';
}

// ==================== VIDEO LANDING PAGE ====================
const video = document.getElementById('curtainVideo');
const landingPage = document.getElementById('landingPage');
const landingContent = document.getElementById('landingContent');
const mainSite = document.getElementById('mainSite');

let videoHasPlayed = false;

function playFullVideo() {
    if (videoHasPlayed) return;
    videoHasPlayed = true;
    
    landingContent.classList.add('hidden');
    
    video.currentTime = 0;
    video.play().catch(error => {
        console.log('Video play error:', error);
        transitionToMainSite();
    });
    
    video.addEventListener('ended', transitionToMainSite, { once: true });
    
    setTimeout(() => {
        if (!landingPage.classList.contains('hidden')) {
            transitionToMainSite();
        }
    }, 15000);
}

let currentSlide = 0;
let slideshowInterval = null;

function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length === 0) return;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    slideshowInterval = setInterval(nextSlide, 3000);
}

function transitionToMainSite() {
    landingPage.classList.add('hidden');
    setTimeout(() => {
        mainSite.classList.add('visible');
        setTimeout(initSlideshow, 100);
    }, 500);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    video.load();
    
    // Close popup when clicking outside
    const popup = document.getElementById('thankYouPopup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
    
    // Initialize forms and schedule
    generateSchedule();
    generateForm();
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
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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

let defaultMaxKey = 'all-events-default';
if (inviteType === 'mehndi-walima') {
    defaultMaxKey = 'mehndi-walima-default';
} else if (inviteType === 'nikkah-walima') {
    defaultMaxKey = 'nikkah-walima-default';
} else if (inviteType === 'walima') {
    defaultMaxKey = 'walima-only-default';
}

const maxGuests = parseInt(urlParams.get('max')) || CONFIG.MAX_GUESTS[defaultMaxKey];
const inviteId = urlParams.get('id') || 'default';

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
function generateSchedule() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    
    if (inviteType === 'walima') {
        scheduleGrid.innerHTML = `
            <div class="event-card">
                <h3>Walima / Reception</h3>
                <p class="event-date">Sunday, June 22, 2026</p>
                <p class="event-time">5:00 PM - 11:00 PM</p>
                <p class="event-description">Join us for a grand celebration with dinner, dancing, and joy as we begin our journey together.</p>
            </div>
        `;
    } else if (inviteType === 'mehndi-walima') {
        scheduleGrid.innerHTML = `
            <div class="event-card">
                <h3>Mehndi / Henna</h3>
                <p class="event-date">Friday, June 20, 2026</p>
                <p class="event-time">6:00 PM - 10:00 PM</p>
                <p class="event-description">Join us for an evening of henna, music, and celebration as we kick off the wedding festivities.</p>
            </div>
            <div class="event-card">
                <h3>Walima / Reception</h3>
                <p class="event-date">Sunday, June 22, 2026</p>
                <p class="event-time">5:00 PM - 11:00 PM</p>
                <p class="event-description">The grand reception celebrating our union with dinner, dancing, and joy.</p>
            </div>
        `;
    } else if (inviteType === 'nikkah-walima') {
        scheduleGrid.innerHTML = `
            <div class="event-card">
                <h3>Nikkah / Shadi</h3>
                <p class="event-date">Saturday, June 21, 2026</p>
                <p class="event-time">4:00 PM - 8:00 PM</p>
                <p class="event-description">The wedding ceremony where two families become one. Traditional attire encouraged.</p>
            </div>
            <div class="event-card">
                <h3>Walima / Reception</h3>
                <p class="event-date">Sunday, June 22, 2026</p>
                <p class="event-time">5:00 PM - 11:00 PM</p>
                <p class="event-description">The grand reception celebrating our union with dinner, dancing, and joy.</p>
            </div>
        `;
    } else {
        scheduleGrid.innerHTML = `
            <div class="event-card">
                <h3>Mehndi / Henna</h3>
                <p class="event-date">Friday, June 20, 2026</p>
                <p class="event-time">6:00 PM - 10:00 PM</p>
                <p class="event-description">Join us for an evening of henna, music, and celebration as we kick off the wedding festivities.</p>
            </div>
            <div class="event-card">
                <h3>Nikkah / Shadi</h3>
                <p class="event-date">Saturday, June 21, 2026</p>
                <p class="event-time">4:00 PM - 8:00 PM</p>
                <p class="event-description">The wedding ceremony where two families become one. Traditional attire encouraged.</p>
            </div>
            <div class="event-card">
                <h3>Walima / Reception</h3>
                <p class="event-date">Sunday, June 22, 2026</p>
                <p class="event-time">5:00 PM - 11:00 PM</p>
                <p class="event-description">The grand reception celebrating our union with dinner, dancing, and joy.</p>
            </div>
        `;
    }
}

// ==================== FORM GENERATION ====================
function generateForm() {
    const formContent = document.getElementById('dynamicFormContent');
    
    const commonFields = `
        <div class="form-group">
            <label>Your Full Name *</label>
            <input type="text" name="name" required placeholder="Enter your name">
        </div>

        <div class="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" required placeholder="your@email.com">
        </div>

        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="(123) 456-7890">
        </div>
    `;

    let attendanceFields = '';

    if (inviteType === 'walima') {
        attendanceFields = `
            <div class="form-group">
                <div class="guest-counter">
                    <label>Number of Additional Guests</label>
                    <select name="additionalGuests" id="additionalGuests">
                        ${generateGuestOptions(maxGuests)}
                    </select>
                </div>
                <p class="guest-limit-info">Maximum guests allowed for your invitation: ${maxGuests}</p>
            </div>

            <div class="form-group">
                <label>Will you be attending? *</label>
                <select name="walimaAttendance" required>
                    <option value="">Please select</option>
                    <option value="Yes">Accept</option>
                    <option value="No">Decline</option>
                </select>
            </div>
        `;
    } else if (inviteType === 'mehndi-walima') {
        attendanceFields = buildEventBlock('mehndi', 'Mehndi / Henna Night') + 
                          buildEventBlock('walima', 'Walima / Reception') +
                          `<p class="guest-limit-info" style="text-align: center;">Maximum guests allowed for your invitation: ${maxGuests} per event</p>`;
    } else if (inviteType === 'nikkah-walima') {
        attendanceFields = buildEventBlock('shadi', 'Nikkah / Shadi') +
                          buildEventBlock('walima', 'Walima / Reception') +
                          `<p class="guest-limit-info" style="text-align: center;">Maximum guests allowed for your invitation: ${maxGuests} per event</p>`;
    } else {
        attendanceFields = buildEventBlock('mehndi', 'Mehndi / Henna Night') +
                          buildEventBlock('shadi', 'Nikkah / Shadi') +
                          buildEventBlock('walima', 'Walima / Reception') +
                          `<p class="guest-limit-info" style="text-align: center;">Maximum guests allowed for your invitation: ${maxGuests} per event</p>`;
    }

    const additionalFields = `
        <div class="form-group">
            <label>Special Message for the Couple</label>
            <textarea name="message" rows="3" placeholder="Share your well wishes..."></textarea>
        </div>
    `;

    formContent.innerHTML = commonFields + attendanceFields + additionalFields;
}

function buildEventBlock(eventKey, eventLabel) {
    const attendanceName = eventKey === 'shadi' ? 'shadiAttendance' : `${eventKey}Attendance`;
    const guestCountName = eventKey === 'shadi' ? 'shadiGuestCount' : `${eventKey}GuestCount`;
    
    return `
        <div style="background: #fff5f7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #d4a574;">
            <h4 style="color: #8b7355; margin-bottom: 15px; font-size: 18px;">${eventLabel}</h4>
            
            <div class="form-group">
                <label>Will you be attending ${eventLabel.split('/')[0].trim()}? *</label>
                <select name="${attendanceName}" id="${eventKey}Attendance" required onchange="toggleGuestCount('${eventKey}')">
                    <option value="">Please select</option>
                    <option value="Yes">Accept</option>
                    <option value="No">Decline</option>
                </select>
            </div>

            <div class="form-group" id="${eventKey}GuestCount" style="display: none;">
                <label>How many guests for ${eventLabel.split('/')[0].trim()}? (including yourself) *</label>
                <select name="${guestCountName}" id="${eventKey}GuestCountSelect">
                    ${generateGuestCountOptions(maxGuests)}
                </select>
            </div>
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

function toggleGuestCount(event) {
    const attendance = document.getElementById(`${event}Attendance`).value;
    const guestCountDiv = document.getElementById(`${event}GuestCount`);
    const guestCountSelect = document.getElementById(`${event}GuestCountSelect`);
    
    if (attendance === 'Yes') {
        guestCountDiv.style.display = 'block';
        guestCountSelect.required = true;
    } else {
        guestCountDiv.style.display = 'none';
        guestCountSelect.required = false;
        guestCountSelect.value = '';
    }
}

// ==================== FORM SUBMISSION ====================
const form = document.getElementById('rsvpForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'SUBMITTING...';

    try {
        const formData = new FormData(form);
        const data = {
            inviteId: inviteId,
            inviteType: inviteType,
            maxGuestsAllowed: maxGuests,
            timestamp: new Date().toISOString(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            mehndiAttendance: formData.get('mehndiAttendance') || 'N/A',
            mehndiGuestCount: formData.get('mehndiGuestCount') || 0,
            shadiAttendance: formData.get('shadiAttendance') || 'N/A',
            shadiGuestCount: formData.get('shadiGuestCount') || 0,
            walimaAttendance: formData.get('walimaAttendance') || 'N/A',
            walimaGuestCount: formData.get('walimaGuestCount') || 0
        };

        await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
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

console.log('Wedding Site Loaded');
console.log('Invite Type:', inviteType);
console.log('Max Guests:', maxGuests);
console.log('Invite ID:', inviteId);