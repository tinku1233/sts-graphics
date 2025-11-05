import React, { useState, useMemo } from 'react';
import { PACKAGES, ADDONS, EXTRA_EVENT_PRICE, INCLUDED_EVENTS_COUNT } from './constants';
import type { Addon, Package } from './types';
import Section from './components/Section';
import Clock from './components/Clock';
import Switch from './components/Switch';
import ConfirmationModal from './components/ConfirmationModal';
import { MinusIcon, PlusIcon } from './components/Icons';


export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [selectedPackage, setSelectedPackage] = useState<string>(PACKAGES[0].id);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  
  // Event toggles
  const [tilak, setTilak] = useState(false);
  const [mehendi, setMehendi] = useState(false);
  const [haldi, setHaldi] = useState(false);
  const [dalDhoi, setDalDhoi] = useState(false);
  const [panKatai, setPanKatai] = useState(false);
  const [shaadi, setShaadi] = useState(false);
  const [reception, setReception] = useState(false);

  // Event date and time states
  const [tilakDate, setTilakDate] = useState('');
  const [mehendiDate, setMehendiDate] = useState('');
  const [haldiDate, setHaldiDate] = useState('');
  const [dalDhoiDate, setDalDhoiDate] = useState('');
  const [panKataiDate, setPanKataiDate] = useState('');
  const [shaadiDate, setShaadiDate] = useState('');
  const [receptionDate, setReceptionDate] = useState('');
  
  const [tilakTime, setTilakTime] = useState('10:00');
  const [mehendiTime, setMehendiTime] = useState('16:00');
  const [haldiTime, setHaldiTime] = useState('09:00');
  const [dalDhoiTime, setDalDhoiTime] = useState('10:00');
  const [panKataiTime, setPanKataiTime] = useState('11:00');
  const [shaadiTime, setShaadiTime] = useState('19:00');
  const [receptionTime, setReceptionTime] = useState('20:00');

  const [modalState, setModalState] = useState<{isOpen: boolean; title: string; content: React.ReactNode}>({
    isOpen: false,
    title: '',
    content: null,
  });


  const toggleAddon = (id: string) => {
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { total, extraEventsCount } = useMemo(() => {
    let currentTotal = 0;
    const packageObj = PACKAGES.find((p) => p.id === selectedPackage);
    if (packageObj) currentTotal += packageObj.price;
    
    ADDONS.forEach((a) => {
      if (addons[a.id]) currentTotal += a.price;
    });

    const selectedEvents = [tilak, mehendi, haldi, dalDhoi, panKatai, shaadi, reception];
    const selectedEventCount = selectedEvents.filter(Boolean).length;
    
    const extraEvents = Math.max(0, selectedEventCount - INCLUDED_EVENTS_COUNT);
    
    currentTotal += EXTRA_EVENT_PRICE * extraEvents;
    
    return { total: currentTotal, extraEventsCount: extraEvents };
  }, [selectedPackage, addons, tilak, mehendi, haldi, dalDhoi, panKatai, shaadi, reception]);

  const validateTime = (t: string) => {
    return /^([01]?\d|2[0-3]):[0-5]\d$/.test(t);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // To avoid timezone off-by-one day issues
    });
  }

  const onSubmit = () => {
    if (!name.trim()) {
      setModalState({isOpen: true, title: 'Validation Error', content: 'कृपया नाम भरें'});
      return;
    }
    if (!phone.trim()) {
        setModalState({isOpen: true, title: 'Validation Error', content: 'कृपया संपर्क नंबर भरें'});
      return;
    }
    
    // Date and Time Validations
    const eventValidations = [
      { enabled: tilak, date: tilakDate, time: tilakTime, name: 'Tilak' },
      { enabled: mehendi, date: mehendiDate, time: mehendiTime, name: 'Mehendi' },
      { enabled: haldi, date: haldiDate, time: haldiTime, name: 'Haldi' },
      { enabled: dalDhoi, date: dalDhoiDate, time: dalDhoiTime, name: 'Dal Dhoi' },
      { enabled: panKatai, date: panKataiDate, time: panKataiTime, name: 'Pan Katai' },
      { enabled: shaadi, date: shaadiDate, time: shaadiTime, name: 'Shaadi' },
      { enabled: reception, date: receptionDate, time: receptionTime, name: 'Reception' },
    ];

    for (const event of eventValidations) {
      if (event.enabled) {
        if (!event.date) {
          setModalState({isOpen: true, title: 'Validation Error', content: `Please select a date for ${event.name}.`});
          return;
        }
        if (!validateTime(event.time)) {
          setModalState({isOpen: true, title: 'Validation Error', content: `${event.name} का समय सही फॉर्मेट में डालें (HH:MM)`});
          return;
        }
      }
    }

    const packageObj = PACKAGES.find((p) => p.id === selectedPackage);
    const selectedAddons = ADDONS.filter((a) => addons[a.id]).map((a) => a.title).join(', ') || 'None';
    
    const events: string[] = [];
    if (tilak && tilakDate) events.push(`Tilak on ${formatDate(tilakDate)} at ${tilakTime}`);
    if (mehendi && mehendiDate) events.push(`Mehendi on ${formatDate(mehendiDate)} at ${mehendiTime}`);
    if (haldi && haldiDate) events.push(`Haldi on ${formatDate(haldiDate)} at ${haldiTime}`);
    if (dalDhoi && dalDhoiDate) events.push(`Dal Dhoi on ${formatDate(dalDhoiDate)} at ${dalDhoiTime}`);
    if (panKatai && panKataiDate) events.push(`Pan Katai on ${formatDate(panKataiDate)} at ${panKataiTime}`);
    if (shaadi && shaadiDate) events.push(`Shaadi on ${formatDate(shaadiDate)} at ${shaadiTime}`);
    if (reception && receptionDate) events.push(`Reception on ${formatDate(receptionDate)} at ${receptionTime}`);

    const payload = {
      clientName: name,
      phone,
      package: packageObj?.title,
      addons: selectedAddons,
      events: events.join('\n') || 'Not specified',
      extraEvents: extraEventsCount,
      total,
      bookingTime: new Date().toLocaleString(),
    };
    
    const confirmationMessage = `Name: ${payload.clientName}\nPhone: ${payload.phone}\nPackage: ${payload.package}\nAdd-ons: ${payload.addons}\n\nEvents:\n${payload.events}\n\nExtra events billed: ${payload.extraEvents} (${INCLUDED_EVENTS_COUNT} events included)\nTotal: ₹${payload.total.toLocaleString()}\nBooked at: ${payload.bookingTime}`;

    const ownerEmail = "tk9102009547@gmail.com";
    const emailSubject = `New STS Graphics Booking: ${payload.clientName}`;
    const emailBody = `A new booking has been made.\n\n--- Booking Details ---\n\n${confirmationMessage}`;
    const mailtoLink = `mailto:${ownerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const ownerWhatsAppNumber = "919102009547"; // India code + number
    const whatsappMessage = `*New STS Graphics Booking: ${payload.clientName}*\n\n--- Booking Details ---\n\n${confirmationMessage}`;
    const whatsappLink = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    setModalState({
        isOpen: true, 
        title: 'Booking Confirmed', 
        content: (
          <div>
            <pre className="text-sm text-left whitespace-pre-wrap font-sans">{confirmationMessage}</pre>
            <div className="mt-6 space-y-4">
              <div>
                <a
                    href={mailtoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    Send Booking Notification Email
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Clicking this will open your default email app.
                </p>
              </div>
              <div>
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    Send WhatsApp Reminder
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Clicking this will open WhatsApp to send the details.
                </p>
              </div>
            </div>
          </div>
        )
    });
  };

  const renderEventInput = (
    label: string, 
    enabled: boolean, 
    setEnabled: (val: boolean) => void, 
    date: string,
    setDate: (val: string) => void,
    time: string, 
    setTime: (val: string) => void
  ) => (
    <>
      <div className="flex justify-between items-center py-2">
        <label className="text-base text-slate-700 dark:text-slate-300">{label}</label>
        <Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
      </div>
      {enabled && (
        <div className="grid sm:grid-cols-2 gap-4 mt-2 pb-2">
           <div>
              <label htmlFor={`${label}-date`} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
              <input
                id={`${label}-date`}
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
           </div>
           <div>
              <label htmlFor={`${label}-time`} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Time</label>
              <input
                id={`${label}-time`}
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:MM"
              />
           </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-3xl mx-auto p-4 md:p-6 pb-32">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">STS Graphics — Booking</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Photography & Videography Services</p>
          <Clock />
        </header>

        <form onSubmit={(e) => e.preventDefault()}>
          <Section title="Client Details">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="पूरा नाम" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="मोबाइल नंबर" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </Section>

          <Section title="Choose Package">
            <div className="space-y-3">
              {PACKAGES.map((p: Package) => (
                <button
                  key={p.id}
                  type="button"
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${selectedPackage === p.id ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500 ring-2 ring-blue-500' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-blue-400'}`}
                  onClick={() => setSelectedPackage(p.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{p.title}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">₹{p.price.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Add-ons">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {ADDONS.map((a: Addon) => (
                    <div key={a.id} className="flex justify-between items-center py-3">
                        <label htmlFor={a.id} className="text-base text-slate-700 dark:text-slate-300">{a.title} — <span className="font-semibold">₹{a.price.toLocaleString()}</span></label>
                        <Switch id={a.id} checked={!!addons[a.id]} onChange={() => toggleAddon(a.id)} />
                    </div>
                ))}
            </div>
          </Section>

          <Section title="Events & Schedule">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Up to {INCLUDED_EVENTS_COUNT} events are included in the package. Each additional event will be billed at ₹{EXTRA_EVENT_PRICE.toLocaleString()} per event. Please specify the date and time for each selected event.</p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {renderEventInput('Tilak', tilak, setTilak, tilakDate, setTilakDate, tilakTime, setTilakTime)}
                {renderEventInput('Mehendi', mehendi, setMehendi, mehendiDate, setMehendiDate, mehendiTime, setMehendiTime)}
                {renderEventInput('Haldi', haldi, setHaldi, haldiDate, setHaldiDate, haldiTime, setHaldiTime)}
                {renderEventInput('Dal Dhoi', dalDhoi, setDalDhoi, dalDhoiDate, setDalDhoiDate, dalDhoiTime, setDalDhoiTime)}
                {renderEventInput('Pan Katai', panKatai, setPanKatai, panKataiDate, setPanKataiDate, panKataiTime, setPanKataiTime)}
                {renderEventInput('Shaadi', shaadi, setShaadi, shaadiDate, setShaadiDate, shaadiTime, setShaadiTime)}
                {renderEventInput('Reception', reception, setReception, receptionDate, setReceptionDate, receptionTime, setReceptionTime)}
            </div>
          </Section>
        </form>

        <footer className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
            <p className="font-semibold">Contact for queries / booking: 9102009547</p>
            <p>STS Graphics — गाँव डुमडुमा, सतगावां, कोडरमा, झारखण्ड</p>
            <p>Payment policy: Minimum 30% advance required. Remaining per agreement.</p>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 shadow-t-lg">
          <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
              <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total</span>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹{total.toLocaleString()}</p>
              </div>
              <button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105">
                  Confirm Booking
              </button>
          </div>
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      >
        {modalState.content}
      </ConfirmationModal>
    </div>
  );
}