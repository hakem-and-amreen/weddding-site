// Configuration
const CONFIG = {
    GOOGLE_SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzWJkgN3T9gfaf_XzoDkzh-mnKLbQF9HJ-VPMQN349qWFY0xiWdmsJvkfmb8me1b7-pMA/exec',
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

// ==================== VIDEO LANDING PAGE ====================

// ==================== VIDEO LANDING PAGE ====================
const video = document.getElementById('curtainVideo');
const landingPage = document.getElementById('landingPage');
const landingContent = document.getElementById('landingContent');
const mainSite = document.getElementById('mainSite');

let videoHasPlayed = false;
let currentSlide = 0;
let slideshowInterval = null;

function playFullVideo() {
    // Prevent multiple plays
    if (videoHasPlayed) return;
    videoHasPlayed = true;
    
    const whiteOverlay = document.querySelector('.white-overlay');
    
    // Check if elements exist
    if (!video || !whiteOverlay || !landingPage || !mainSite) {
        console.error('Required elements not found');
        return;
    }
    
    // Fade all content at once
    if (landingContent) {
        landingContent.style.opacity = '0';
    }
    
    // Play video from start
    video.currentTime = 0;
    video.play().catch(error => {
        console.log('Video play error:', error);
        startTransition();
    });
    
    // When video ends naturally, transition
    video.addEventListener('ended', startTransition, { once: true });
    
    // Backup timeout (15 seconds max)
    setTimeout(() => {
        if (!landingPage.classList.contains('hidden')) {
            console.log('Backup timeout triggered');
            startTransition();
        }
    }, 15000);
    
    // Transition function
    function startTransition() {
        // Remove any duplicate event listeners
        video.removeEventListener('ended', startTransition);
        
        // Start white fade
        whiteOverlay.classList.add('active');
        
        // After white covers screen (2 seconds)
        setTimeout(() => {
            landingPage.classList.add('hidden');
            mainSite.classList.add('visible');
            
            // Start slideshow
            setTimeout(initSlideshow, 100);
            
            // Fade out white overlay (after 800ms)
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
    
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    slideshowInterval = setInterval(nextSlide, 3000);
}

// Old transition function - can be removed now
function transitionToMainSite() {
    landingPage.classList.add('hidden');
    setTimeout(() => {
        mainSite.classList.add('visible');
        setTimeout(initSlideshow, 100);
    }, 500);
}










// const video = document.getElementById('curtainVideo');
// const landingPage = document.getElementById('landingPage');
// const landingContent = document.getElementById('landingContent');
// const mainSite = document.getElementById('mainSite');

// let videoHasPlayed = false;

// function playFullVideo() {
//     if (videoHasPlayed) return;
//     videoHasPlayed = true;
    
//     landingContent.classList.add('hidden');
    
//     video.currentTime = 0;
//     video.play().catch(error => {
//         console.log('Video play error:', error);
//         transitionToMainSite();
//     });
    
//     video.addEventListener('ended', transitionToMainSite, { once: true });
    
//     setTimeout(() => {
//         if (!landingPage.classList.contains('hidden')) {
//             transitionToMainSite();
//         }
//     }, 15000);
// }
// let currentSlide = 0;
// let slideshowInterval = null;

// function initSlideshow() {
//     const slides = document.querySelectorAll('.slide');
    
//     if (slides.length === 0) return;
    
//     function nextSlide() {
//         slides[currentSlide].classList.remove('active');
//         currentSlide = (currentSlide + 1) % slides.length;
//         slides[currentSlide].classList.add('active');
//     }
    
//     if (slideshowInterval) {
//         clearInterval(slideshowInterval);
//     }
//     slideshowInterval = setInterval(nextSlide, 3000);
// }

// function transitionToMainSite() {
//     landingPage.classList.add('hidden');
//     setTimeout(() => {
//         mainSite.classList.add('visible');
//         setTimeout(initSlideshow, 100);
//     }, 500);
// }

// ==================== INITIALIZATION ====================
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

    // Handle Edit RSVP Form Submission
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
                    shadiAttendance: formData.get('shadiAttendance') || 'N/A',
                    shadiGuestCount: formData.get('shadiGuestCount') || 0,
                    walimaAttendance: formData.get('walimaAttendance') || 'N/A',
                    walimaGuestCount: formData.get('walimaGuestCount') || 0
                };

                console.log('Updating RSVP with data:', data);

                await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                // Show success message
                document.getElementById('editRsvpFound').style.display = 'none';
                document.getElementById('editErrorMessage').style.display = 'none';
                document.getElementById('editSuccessMessage').style.display = 'block';

                // Reset after 3 seconds
                setTimeout(() => {
                    switchRsvpTab('new');
                }, 3000);

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
const inviteId = urlParams.get('id') || 'default';

// Get custom guest limits from URL, or use defaults
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
            <h3>Mehndi / Henna</h3>
            <p class="event-date">Wednesday, July 22, 2026</p>
            <p class="event-time">6:00 PM - 11:00 PM</p>
            <p class="event-description">Join us for an evening of henna, music, and celebration as we kick off the wedding festivities.</p>
        </div>`,
    nikkah: `
        <div class="event-card">
            <h3>Nikkah / Shadi</h3>
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
    if (inviteType === 'walima') {
        return buildWalimaOnlyBlock(rsvpData);
    }

    const eventConfig = {
        'mehndi': [['mehndi', 'Mehndi / Henna Night', maxGuestsPerEvent.mehndi]],
        'nikkah': [['shadi', 'Nikkah / Shadi', maxGuestsPerEvent.nikkah]],
        'mehndi-nikkah': [
            ['mehndi', 'Mehndi / Henna Night', maxGuestsPerEvent.mehndi],
            ['shadi', 'Nikkah / Shadi', maxGuestsPerEvent.nikkah]
        ],
        'mehndi-walima': [
            ['mehndi', 'Mehndi / Henna Night', maxGuestsPerEvent.mehndi],
            ['walima', 'Walima / Reception', maxGuestsPerEvent.walima]
        ],
        'nikkah-walima': [
            ['shadi', 'Nikkah / Shadi', maxGuestsPerEvent.nikkah],
            ['walima', 'Walima / Reception', maxGuestsPerEvent.walima]
        ],
        'all': [
            ['mehndi', 'Mehndi / Henna Night', maxGuestsPerEvent.mehndi],
            ['shadi', 'Nikkah / Shadi', maxGuestsPerEvent.nikkah],
            ['walima', 'Walima / Reception', maxGuestsPerEvent.walima]
        ]
    };

    const events = eventConfig[inviteType] || eventConfig['all'];
    return events.map(([key, label, max]) => buildEventBlock(key, label, max, rsvpData)).join('');
}

function buildWalimaOnlyBlock(rsvpData) {
    const selectedAttendance = rsvpData ? rsvpData.walimaAttendance : '';
    const guestCount = rsvpData ? (rsvpData.walimaGuestCount || 1) : 1;
    const additionalGuests = Math.max(0, parseInt(guestCount) - 1);

    let guestOptions = rsvpData
        ? generateGuestOptionsWithSelected(maxGuestsPerEvent.walima, additionalGuests)
        : generateGuestOptions(maxGuestsPerEvent.walima);

    return `
        <div class="form-group">
            <div class="guest-counter">
                <label>Number of Additional Guests</label>
                <select name="additionalGuests" id="additionalGuests">
                    ${guestOptions}
                </select>
            </div>
            <p class="guest-limit-info">Maximum guests allowed: ${maxGuestsPerEvent.walima}</p>
        </div>
        <div class="form-group">
            <label>Will you be attending? *</label>
            <select name="walimaAttendance" required>
                <option value="">Please select</option>
                <option value="Yes" ${selectedAttendance === 'Yes' ? 'selected' : ''}>Accept</option>
                <option value="No" ${selectedAttendance === 'No' ? 'selected' : ''}>Decline</option>
            </select>
        </div>
    `;
}

function buildEventBlock(eventKey, eventLabel, maxGuestsForEvent, rsvpData) {
    const attendanceName = eventKey === 'shadi' ? 'shadiAttendance' : `${eventKey}Attendance`;
    const guestCountName = eventKey === 'shadi' ? 'shadiGuestCount' : `${eventKey}GuestCount`;
    
    const attendanceValue = rsvpData ? (rsvpData[attendanceName] || '') : '';
    const guestCountValue = rsvpData ? (rsvpData[guestCountName] || 1) : 1;
    const showGuestCount = attendanceValue === 'Yes';

    let guestCountOptions = rsvpData
        ? generateGuestCountOptionsWithSelected(maxGuestsForEvent, guestCountValue)
        : generateGuestCountOptions(maxGuestsForEvent);

    return `
        <div style="background: #fff5f7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #d4a574;">
            <h4 style="color: #8b7355; margin-bottom: 15px; font-size: 18px;">${eventLabel}</h4>
            
            <div class="form-group">
                <label>Will you be attending ${eventLabel.split('/')[0].trim()}? *</label>
                <select name="${attendanceName}" id="${eventKey}Attendance" required onchange="toggleGuestCount('${eventKey}')">
                    <option value="">Please select</option>
                    <option value="Yes" ${attendanceValue === 'Yes' ? 'selected' : ''}>Accept</option>
                    <option value="No" ${attendanceValue === 'No' ? 'selected' : ''}>Decline</option>
                </select>
            </div>

            <div class="form-group" id="${eventKey}GuestCount" style="display: ${showGuestCount ? 'block' : 'none'};">
                <label>How many guests for ${eventLabel.split('/')[0].trim()}? (including yourself) *</label>
                <select name="${guestCountName}" id="${eventKey}GuestCountSelect">
                    ${guestCountOptions}
                </select>
                <p class="guest-limit-info">Maximum: ${maxGuestsForEvent} guests for this event</p>
            </div>
        </div>
    `;
}

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
        shadiAttendance: formData.get('shadiAttendance') || 'N/A',
        shadiGuestCount: formData.get('shadiGuestCount') || 0,
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
        console.log('Lookup response:', data);

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
    
    if (rsvpData.phone) {
        summaryHTML += `<p><strong>Phone:</strong> ${rsvpData.phone}</p>`;
    }
    
    const eventSummaries = [
        { key: 'mehndiAttendance', guestKey: 'mehndiGuestCount', label: 'Mehndi' },
        { key: 'shadiAttendance', guestKey: 'shadiGuestCount', label: 'Nikkah/Shadi' },
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
    
    if (rsvpData.message) {
        summaryHTML += `<p><strong>Message:</strong> ${rsvpData.message}</p>`;
    }
    
    summaryHTML += '</div>';
    summaryDiv.innerHTML = summaryHTML;
}

function populateEditForm(rsvpData) {
    const formContent = document.getElementById('editDynamicFormContent');
    formContent.innerHTML = buildCommonFields(rsvpData) + buildAttendanceFields(rsvpData) + buildAdditionalFields(rsvpData);
    
    // Trigger visibility for guest counts after a brief delay
    setTimeout(() => {
        ['mehndi', 'shadi', 'walima'].forEach(event => {
            const attendanceSelect = document.getElementById(`${event}Attendance`);
            if (attendanceSelect) {
                toggleGuestCount(event);
            }
        });
    }, 100);
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('Wedding Site Loaded');
console.log('Invite Type:', inviteType);
console.log('Max Guests Per Event:', maxGuestsPerEvent);
console.log('Invite ID:', inviteId);
